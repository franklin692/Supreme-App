"""Iteration 3 new endpoints: FAQ, Settings, Config (Integrazioni)."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://supreme-house.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"username": "admin", "password": "admin123"})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture(scope="module")
def agent_token(session):
    r = session.post(f"{API}/auth/login", json={"username": "agente", "password": "agente123"})
    assert r.status_code == 200
    return r.json()["access_token"]


def auth(t):
    return {"Authorization": f"Bearer {t}"}


# ---------- FAQ ----------
class TestFaq:
    def test_public_list_seeded(self, session):
        r = session.get(f"{API}/faq")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 6, f"expected >=6 seeded FAQs, got {len(data)}"
        assert "question" in data[0] and "answer" in data[0]

    def test_admin_crud(self, session, admin_token):
        q = f"TEST_Q_{uuid.uuid4().hex[:6]}"
        r = session.post(f"{API}/admin/faq", json={"question": q, "answer": "A1"},
                         headers=auth(admin_token))
        assert r.status_code == 200, r.text
        fid = r.json()["id"]
        # update
        r2 = session.put(f"{API}/admin/faq/{fid}", json={"answer": "A2"},
                         headers=auth(admin_token))
        assert r2.status_code == 200
        assert r2.json()["answer"] == "A2"
        # list admin
        r3 = session.get(f"{API}/admin/faq", headers=auth(admin_token))
        assert r3.status_code == 200
        assert any(f["id"] == fid for f in r3.json())
        # delete
        r4 = session.delete(f"{API}/admin/faq/{fid}", headers=auth(admin_token))
        assert r4.status_code == 200

    def test_agent_forbidden(self, session, agent_token):
        r = session.post(f"{API}/admin/faq", json={"question": "x", "answer": "y"},
                         headers=auth(agent_token))
        assert r.status_code == 403


# ---------- Settings ----------
class TestSettings:
    def test_public_get(self, session):
        r = session.get(f"{API}/content/settings")
        assert r.status_code == 200
        d = r.json()
        assert "brand_name" in d
        assert "hero_title" in d

    def test_admin_update_persists(self, session, admin_token):
        # get current
        original = session.get(f"{API}/content/settings").json()
        orig_hero = original.get("hero_title", "")
        new_val = f"TEST_HERO_{uuid.uuid4().hex[:4]}"
        r = session.put(f"{API}/admin/settings", json={"hero_title": new_val},
                        headers=auth(admin_token))
        assert r.status_code == 200
        assert r.json()["hero_title"] == new_val
        # GET verifies persistence
        r2 = session.get(f"{API}/content/settings")
        assert r2.json()["hero_title"] == new_val
        # restore
        session.put(f"{API}/admin/settings", json={"hero_title": orig_hero},
                    headers=auth(admin_token))

    def test_agent_forbidden(self, session, agent_token):
        r = session.put(f"{API}/admin/settings", json={"hero_title": "x"},
                        headers=auth(agent_token))
        assert r.status_code == 403


# ---------- Config / Integrazioni ----------
class TestConfig:
    def test_admin_crud(self, session, admin_token):
        payload = {"label": "TEST_Integration", "key": f"test_key_{uuid.uuid4().hex[:4]}", "value": "abc"}
        r = session.post(f"{API}/admin/config", json=payload, headers=auth(admin_token))
        assert r.status_code == 200, r.text
        cid = r.json()["id"]
        # list
        r2 = session.get(f"{API}/admin/config", headers=auth(admin_token))
        assert r2.status_code == 200
        assert any(c["id"] == cid for c in r2.json())
        # update
        r3 = session.put(f"{API}/admin/config/{cid}", json={"value": "xyz"},
                         headers=auth(admin_token))
        assert r3.status_code == 200
        assert r3.json()["value"] == "xyz"
        # delete
        r4 = session.delete(f"{API}/admin/config/{cid}", headers=auth(admin_token))
        assert r4.status_code == 200

    def test_agent_forbidden(self, session, agent_token):
        r = session.get(f"{API}/admin/config", headers=auth(agent_token))
        assert r.status_code == 403


# ---------- Register user-only ----------
class TestRegisterUserOnly:
    def test_register_defaults_to_user(self, session):
        uname = f"test_u_{uuid.uuid4().hex[:6]}"
        r = session.post(f"{API}/auth/register",
                         json={"username": uname, "password": "pw12345", "name": "UT"})
        assert r.status_code == 200
        assert r.json()["user"]["role"] == "user"

    def test_register_ignores_role_param(self, session):
        uname = f"test_u_{uuid.uuid4().hex[:6]}"
        r = session.post(f"{API}/auth/register",
                         json={"username": uname, "password": "pw12345", "name": "UT",
                               "role": "admin"})
        # should either reject role or force role=user
        assert r.status_code in (200, 400, 422)
        if r.status_code == 200:
            assert r.json()["user"]["role"] == "user", "register must not allow non-user role"
