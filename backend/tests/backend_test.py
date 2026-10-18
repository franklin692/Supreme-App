"""Supreme House - Backend API tests.

Covers: Auth (login/demo/register/me), Content, Properties, Leads, Buyer requests,
Admin Hype, Admin Site edit, VIP, Users, Role protection.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://supreme-house.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


# --------------- Fixtures ---------------
@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"username": "admin", "password": "admin123"})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def agent_token(session):
    r = session.post(f"{API}/auth/login", json={"username": "agente", "password": "agente123"})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


def auth(token):
    return {"Authorization": f"Bearer {token}"}


# --------------- Auth ---------------
class TestAuth:
    def test_login_admin(self, session):
        r = session.post(f"{API}/auth/login", json={"username": "admin", "password": "admin123"})
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data and isinstance(data["access_token"], str)
        assert data["user"]["role"] == "admin"

    def test_login_agent(self, session):
        r = session.post(f"{API}/auth/login", json={"username": "agente", "password": "agente123"})
        assert r.status_code == 200
        assert r.json()["user"]["role"] == "agent"

    def test_login_wrong(self, session):
        r = session.post(f"{API}/auth/login", json={"username": "admin", "password": "wrong"})
        assert r.status_code == 401

    @pytest.mark.parametrize("role", ["user", "bnb_owner", "condomino", "collaborator", "agent", "admin"])
    def test_demo_login(self, session, role):
        r = session.post(f"{API}/auth/demo-login", json={"role": role})
        assert r.status_code == 200, r.text
        data = r.json()
        assert "access_token" in data
        assert data["user"]["role"] == role

    def test_demo_bnb_profile(self, session):
        r = session.post(f"{API}/auth/demo-login", json={"role": "bnb_owner"})
        assert r.status_code == 200
        pd = r.json()["user"].get("profile_data") or {}
        # Expect occupancy/income_chart/transfers
        assert "occupancy" in pd, f"profile_data missing occupancy: {pd.keys()}"
        assert "income_chart" in pd
        assert "transfers" in pd

    def test_register_and_me(self, session):
        import uuid as _u
        uname = f"test_{_u.uuid4().hex[:8]}"
        r = session.post(f"{API}/auth/register", json={"username": uname, "password": "pw12345", "name": "Test"})
        assert r.status_code == 200, r.text
        token = r.json()["access_token"]
        r2 = session.get(f"{API}/auth/me", headers=auth(token))
        assert r2.status_code == 200
        assert r2.json()["username"] == uname


# --------------- Content ---------------
class TestContent:
    def test_home(self, session):
        r = session.get(f"{API}/content/home")
        assert r.status_code == 200
        d = r.json()
        assert d["ticker"].get("items"), "ticker.items missing"
        assert len(d["stats"]) == 6
        assert len(d["neighborhoods"]) == 6
        assert len(d["poles"]) == 6
        assert len(d["buyer_requests"]) >= 5
        assert len(d["featured"]) >= 6
        types = {p.get("type") for p in d["featured"]}
        assert "offmarket" in types, f"featured missing offmarket, got {types}"
        assert len(d["concluded"]) == 4


# --------------- Properties ---------------
class TestProperties:
    def test_list(self, session):
        r = session.get(f"{API}/properties")
        assert r.status_code == 200
        assert isinstance(r.json(), list) and len(r.json()) > 0

    def test_detail_increments_views(self, session):
        pid = session.get(f"{API}/properties").json()[0]["id"]
        r1 = session.get(f"{API}/properties/{pid}")
        v1 = r1.json()["views"]
        r2 = session.get(f"{API}/properties/{pid}")
        v2 = r2.json()["views"]
        assert v2 == v1 + 1


# --------------- Leads ---------------
class TestLeads:
    def test_create_lead_and_appointment(self, session, admin_token):
        r = session.post(f"{API}/leads", json={
            "name": "TEST Mario", "phone": "+393330000000",
            "request_type": "Sopralluogo", "time_slot": "Domani Mattina",
            "notes": "test"
        })
        assert r.status_code == 200
        lead_id = r.json()["id"]
        # Appointment created
        appts = session.get(f"{API}/appointments", headers=auth(admin_token))
        assert appts.status_code == 200
        matched = [a for a in appts.json() if a.get("client_name") == "TEST Mario"]
        assert matched, "no appointment created for lead with time_slot"
        # Lead exists
        leads = session.get(f"{API}/leads", headers=auth(admin_token)).json()
        assert any(l["id"] == lead_id for l in leads)

    def test_buyer_request_public(self, session, admin_token):
        r = session.post(f"{API}/buyer-requests/public", json={
            "name": "TEST Buyer", "phone": "+39333111",
            "profile": "Famiglia", "searching": "Trilocale", "zone": "Centro", "budget": "€150k"
        })
        assert r.status_code == 200
        admin_br = session.get(f"{API}/admin/buyer-requests", headers=auth(admin_token)).json()
        new_ones = [b for b in admin_br if b.get("profile") == "Famiglia" and not b.get("approved")]
        assert new_ones, "buyer-request not persisted with approved=false"

    def test_leads_requires_staff(self, session):
        r = session.get(f"{API}/leads")
        assert r.status_code == 401

    def test_appointments_requires_staff(self, session):
        r = session.get(f"{API}/appointments")
        assert r.status_code == 401


# --------------- Admin Hype ---------------
class TestHype:
    def test_boost_views(self, session, admin_token):
        pid = session.get(f"{API}/properties").json()[0]["id"]
        before = session.get(f"{API}/properties/{pid}").json()["views"]  # also +1
        r = session.post(f"{API}/admin/boost/{pid}", json={"views": 100}, headers=auth(admin_token))
        assert r.status_code == 200
        after = r.json()["views"]
        assert after >= before + 100

    def test_boost_shares_observe_badges(self, session, admin_token):
        pid = session.get(f"{API}/properties").json()[0]["id"]
        r = session.post(f"{API}/admin/boost/{pid}", json={"shares": 5, "observing_now": True, "status_badges": ["HOT"]},
                         headers=auth(admin_token))
        assert r.status_code == 200
        d = r.json()
        assert d["observing_now"] is True
        assert "HOT" in d["status_badges"]

    def test_boost_global(self, session, admin_token):
        r = session.post(f"{API}/admin/boost-global", headers=auth(admin_token))
        assert r.status_code == 200
        assert r.json()["ok"] is True

    def test_agent_forbidden(self, session, agent_token):
        pid = session.get(f"{API}/properties").json()[0]["id"]
        r = session.post(f"{API}/admin/boost/{pid}", json={"views": 10}, headers=auth(agent_token))
        assert r.status_code == 403


# --------------- Admin Site Edit ---------------
class TestSiteEdit:
    def test_update_ticker(self, session, admin_token):
        r = session.put(f"{API}/admin/ticker", json={"items": ["A", "B"], "updated_label": "ora"},
                        headers=auth(admin_token))
        assert r.status_code == 200
        assert r.json()["items"] == ["A", "B"]

    def test_update_stat(self, session, admin_token):
        home = session.get(f"{API}/content/home").json()
        sid = home["stats"][0]["id"]
        r = session.put(f"{API}/admin/stats/{sid}", json={"value": "99", "label": "Testing"},
                        headers=auth(admin_token))
        assert r.status_code == 200
        assert r.json()["value"] == "99"

    def test_update_neigh_pole(self, session, admin_token):
        home = session.get(f"{API}/content/home").json()
        nid = home["neighborhoods"][0]["id"]
        pid = home["poles"][0]["id"]
        r1 = session.put(f"{API}/admin/neighborhoods/{nid}", json={"ranking_label": "+10%"}, headers=auth(admin_token))
        assert r1.status_code == 200
        r2 = session.put(f"{API}/admin/poles/{pid}", json={"name": "Pole X"}, headers=auth(admin_token))
        assert r2.status_code == 200

    def test_services_crud(self, session, admin_token):
        r = session.post(f"{API}/admin/services", json={"name": "TEST Svc", "icon": "icon", "description": "d"},
                         headers=auth(admin_token))
        assert r.status_code == 200
        sid = r.json()["id"]
        r2 = session.put(f"{API}/admin/services/{sid}", json={"name": "TEST Svc 2"}, headers=auth(admin_token))
        assert r2.status_code == 200 and r2.json()["name"] == "TEST Svc 2"
        r3 = session.delete(f"{API}/admin/services/{sid}", headers=auth(admin_token))
        assert r3.status_code == 200

    def test_buyer_requests_admin(self, session, admin_token):
        r = session.post(f"{API}/admin/buyer-requests",
                         json={"profile": "TEST BR", "searching": "x", "zone": "y", "budget": "z"},
                         headers=auth(admin_token))
        assert r.status_code == 200
        bid = r.json()["id"]
        r2 = session.put(f"{API}/admin/buyer-requests/{bid}", json={"approved": False}, headers=auth(admin_token))
        assert r2.status_code == 200 and r2.json()["approved"] is False
        r3 = session.delete(f"{API}/admin/buyer-requests/{bid}", headers=auth(admin_token))
        assert r3.status_code == 200


# --------------- VIP ---------------
class TestVip:
    def test_vip_flow(self, session, admin_token):
        r = session.post(f"{API}/admin/vip-links",
                         json={"owner_name": "TEST Owner", "neighborhood": "Centro", "compatible_buyers": 7},
                         headers=auth(admin_token))
        assert r.status_code == 200
        token = r.json()["token"]
        vid = r.json()["id"]
        # Public fetch
        r2 = session.get(f"{API}/vip/{token}")
        assert r2.status_code == 200
        d = r2.json()
        assert d["owner_name"] == "TEST Owner" and d["neighborhood"] == "Centro" and d["compatible_buyers"] == 7
        # List
        r3 = session.get(f"{API}/admin/vip-links", headers=auth(admin_token))
        assert r3.status_code == 200
        # Delete
        r4 = session.delete(f"{API}/admin/vip-links/{vid}", headers=auth(admin_token))
        assert r4.status_code == 200


# --------------- Users ---------------
class TestUsers:
    def test_list_and_update(self, session, admin_token):
        r = session.get(f"{API}/admin/users", headers=auth(admin_token))
        assert r.status_code == 200
        users = r.json()
        assert len(users) > 0
        collab = next((u for u in users if u["role"] == "collaborator"), users[0])
        r2 = session.put(f"{API}/admin/users/{collab['id']}", json={"commission_status": "pagata"},
                         headers=auth(admin_token))
        assert r2.status_code == 200
        assert r2.json().get("commission_status") == "pagata"


# --------------- Role protection ---------------
class TestRoleProtection:
    @pytest.mark.parametrize("path,method,body", [
        ("/admin/boost-global", "post", None),
        ("/admin/ticker", "put", {"items": []}),
        ("/admin/users", "get", None),
        ("/admin/vip-links", "get", None),
    ])
    def test_agent_forbidden(self, session, agent_token, path, method, body):
        fn = getattr(session, method)
        kw = {"headers": auth(agent_token)}
        if body is not None:
            kw["json"] = body
        r = fn(f"{API}{path}", **kw)
        assert r.status_code == 403, f"{path} returned {r.status_code}"

    def test_unauth_leads_and_appts(self, session):
        assert session.get(f"{API}/leads").status_code == 401
        assert session.get(f"{API}/appointments").status_code == 401
