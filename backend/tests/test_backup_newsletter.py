"""New iteration tests: Backup export/import + Newsletter subscribe/admin."""
import os
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"


def auth(t):
    return {"Authorization": f"Bearer {t}"}


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"username": "admin", "password": "admin123"})
    assert r.status_code == 200
    return r.json()["access_token"]


@pytest.fixture(scope="module")
def agent_token():
    r = requests.post(f"{API}/auth/login", json={"username": "agente", "password": "agente123"})
    assert r.status_code == 200
    return r.json()["access_token"]


# ---------- Backup ----------
class TestBackup:
    def test_export_admin(self, admin_token):
        r = requests.get(f"{API}/admin/backup/export", headers=auth(admin_token))
        assert r.status_code == 200
        data = r.json()
        assert "collections" in data
        colls = data["collections"]
        for name in ["properties", "neighborhoods", "poles", "stats", "ticker",
                     "services", "buyer_requests", "appointments", "leads",
                     "vip_links", "newsletter"]:
            assert name in colls, f"missing collection {name}"
        assert isinstance(colls["properties"], list)
        assert len(colls["properties"]) > 0

    def test_export_requires_admin(self, agent_token):
        r = requests.get(f"{API}/admin/backup/export", headers=auth(agent_token))
        assert r.status_code == 403

    def test_export_unauth(self):
        r = requests.get(f"{API}/admin/backup/export")
        assert r.status_code == 401

    def test_import_round_trip(self, admin_token):
        exp = requests.get(f"{API}/admin/backup/export", headers=auth(admin_token)).json()
        payload = {"collections": exp["collections"]}
        r = requests.post(f"{API}/admin/backup/import", json=payload, headers=auth(admin_token))
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["ok"] is True
        assert "restored" in d
        assert d["restored"]["properties"] == len(exp["collections"]["properties"])

    def test_import_requires_admin(self, agent_token):
        r = requests.post(f"{API}/admin/backup/import", json={"collections": {}}, headers=auth(agent_token))
        assert r.status_code == 403


# ---------- Newsletter ----------
class TestNewsletter:
    def test_subscribe_public(self):
        import uuid
        email = f"TEST_{uuid.uuid4().hex[:8]}@example.com"
        r = requests.post(f"{API}/newsletter", json={"email": email})
        assert r.status_code == 200
        assert r.json().get("ok") is True
        # Duplicate
        r2 = requests.post(f"{API}/newsletter", json={"email": email})
        assert r2.status_code == 200
        assert r2.json().get("already") is True

    def test_subscribe_invalid(self):
        r = requests.post(f"{API}/newsletter", json={"email": "notanemail"})
        assert r.status_code == 400

    def test_admin_list_and_delete(self, admin_token, agent_token):
        import uuid
        email = f"TEST_del_{uuid.uuid4().hex[:8]}@example.com".lower()
        requests.post(f"{API}/newsletter", json={"email": email})
        # Agent forbidden
        rf = requests.get(f"{API}/admin/newsletter", headers=auth(agent_token))
        assert rf.status_code == 403
        # Admin list
        r = requests.get(f"{API}/admin/newsletter", headers=auth(admin_token))
        assert r.status_code == 200
        subs = r.json()
        found = next((s for s in subs if s["email"] == email), None)
        assert found is not None
        # Delete
        rd = requests.delete(f"{API}/admin/newsletter/{found['id']}", headers=auth(admin_token))
        assert rd.status_code == 200
