from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi import UploadFile, File
from fastapi.responses import Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime, timezone, timedelta
import uuid
import logging
import bcrypt
import jwt
import asyncio
import requests

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALG = "HS256"

app = FastAPI(title="Supreme House API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("supreme_house")


# ----------------------------- Helpers -----------------------------
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def new_id() -> str:
    return str(uuid.uuid4())


def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_token(user: dict) -> str:
    payload = {
        "sub": user["id"],
        "username": user["username"],
        "role": user["role"],
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def clean(doc: dict) -> dict:
    if doc and "_id" in doc:
        doc.pop("_id", None)
    return doc


def deep_fill(defaults, existing):
    """Return `existing` with any keys missing from `defaults` filled in (recursive for dicts).
    Lists and scalar values present in `existing` are kept as-is."""
    if existing is None:
        import copy as _copy
        return _copy.deepcopy(defaults)
    if isinstance(defaults, dict) and isinstance(existing, dict):
        out = dict(existing)
        for k, v in defaults.items():
            if k not in out:
                import copy as _copy
                out[k] = _copy.deepcopy(v)
            else:
                out[k] = deep_fill(v, out[k])
        return out
    return existing


async def get_current_user(request: Request) -> dict:
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Non autenticato")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sessione scaduta")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token non valido")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Utente non trovato")
    return user


async def require_staff(user: dict = Depends(get_current_user)) -> dict:
    if user["role"] not in ("admin", "agent"):
        raise HTTPException(status_code=403, detail="Accesso riservato allo staff")
    return user


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Accesso riservato al Super-Admin")
    return user


# ----------------------------- Models -----------------------------
class LoginReq(BaseModel):
    username: str
    password: str


class DemoReq(BaseModel):
    role: str


class RegisterReq(BaseModel):
    username: str
    password: str
    name: str
    role: str = "user"
    email: Optional[str] = None


class LeadReq(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    request_type: str
    property_ref: Optional[str] = None
    property_title: Optional[str] = None
    service: Optional[str] = None
    time_slot: Optional[str] = None
    notes: Optional[str] = None
    extra: Optional[Dict[str, Any]] = None


class BuyerRequestPublic(BaseModel):
    name: str
    phone: str
    profile: str
    searching: str
    zone: str
    budget: str


# ----------------------------- Auth -----------------------------
@api.post("/auth/login")
async def login(req: LoginReq):
    uname = req.username.strip().lower()
    user = await db.users.find_one({"username": uname})
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenziali non valide")
    user = clean(user)
    token = create_token(user)
    user.pop("password_hash", None)
    return {"access_token": token, "user": user}


@api.post("/auth/demo-login")
async def demo_login(req: DemoReq):
    mapping = {
        "user": "demo_user",
        "bnb_owner": "demo_bnb",
        "condomino": "demo_condo",
        "collaborator": "demo_collab",
        "agent": "agente",
        "admin": "admin",
    }
    uname = mapping.get(req.role)
    if not uname:
        raise HTTPException(status_code=400, detail="Ruolo non valido")
    user = await db.users.find_one({"username": uname})
    if not user:
        raise HTTPException(status_code=404, detail="Account demo non disponibile")
    user = clean(user)
    token = create_token(user)
    user.pop("password_hash", None)
    return {"access_token": token, "user": user}


@api.post("/auth/register")
async def register(req: RegisterReq):
    uname = req.username.strip().lower()
    if await db.users.find_one({"username": uname}):
        raise HTTPException(status_code=400, detail="Username già registrato")
    role = req.role if req.role in ("user", "bnb_owner", "condomino", "collaborator") else "user"
    doc = {
        "id": new_id(),
        "username": uname,
        "password_hash": hash_password(req.password),
        "name": req.name,
        "email": req.email,
        "role": role,
        "profile_data": {},
        "created_at": now_iso(),
    }
    await db.users.insert_one(doc)
    doc = clean(dict(doc))
    token = create_token(doc)
    doc.pop("password_hash", None)
    return {"access_token": token, "user": doc}


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


# ----------------------------- Public content -----------------------------
@api.get("/content/home")
async def home_content():
    ticker = clean(await db.ticker.find_one({}, {"_id": 0}) or {})
    stats = await db.stats.find({}, {"_id": 0}).sort("order", 1).to_list(20)
    neighborhoods = await db.neighborhoods.find({}, {"_id": 0}).sort("position", 1).to_list(20)
    poles = await db.poles.find({}, {"_id": 0}).sort("order", 1).to_list(20)
    buyer_requests = await db.buyer_requests.find({"approved": True}, {"_id": 0}).sort("created_at", -1).to_list(20)
    featured = await db.properties.find(
        {"type": {"$in": ["vendita", "affitto", "asta", "offmarket"]}}, {"_id": 0}
    ).sort("views", -1).to_list(50)
    concluded = await db.properties.find({"type": "conclusa"}, {"_id": 0}).sort("created_at", -1).to_list(20)
    return {
        "ticker": ticker,
        "stats": stats,
        "neighborhoods": neighborhoods,
        "poles": poles,
        "buyer_requests": buyer_requests,
        "featured": featured,
        "concluded": concluded,
    }


@api.get("/properties")
async def list_properties(type: Optional[str] = None, sale_type: Optional[str] = None, sort: Optional[str] = "views"):
    q: Dict[str, Any] = {}
    if type:
        q["type"] = type
    if sale_type:
        q["sale_type"] = sale_type
    sort_field = "views" if sort == "views" else "created_at"
    items = await db.properties.find(q, {"_id": 0}).sort(sort_field, -1).to_list(200)
    return items


@api.get("/properties/{pid}")
async def get_property(pid: str):
    item = await db.properties.find_one({"id": pid}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Immobile non trovato")
    await db.properties.update_one({"id": pid}, {"$inc": {"views": 1}})
    item["views"] = item.get("views", 0) + 1
    return item


@api.get("/services")
async def list_services():
    return await db.services.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(50)


@api.get("/services/{sid}")
async def get_service(sid: str):
    item = await db.services.find_one({"id": sid}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Servizio non trovato")
    return item


@api.get("/buyer-requests")
async def list_buyer_requests():
    return await db.buyer_requests.find({"approved": True}, {"_id": 0}).sort("created_at", -1).to_list(100)


@api.get("/vip/{token}")
async def get_vip_link(token: str):
    item = await db.vip_links.find_one({"token": token}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Dossier non trovato")
    return item


# ----------------------------- Lead capture (public) -----------------------------
@api.post("/leads")
async def create_lead(req: LeadReq):
    doc = req.model_dump()
    doc.update({
        "id": new_id(),
        "status": "nuovo",
        "stage": "inviata",
        "agent_notes": "",
        "created_at": now_iso(),
    })
    await db.leads.insert_one(dict(doc))
    # Mirror contact requests with a chosen time slot into the agenda
    if req.time_slot:
        await db.appointments.insert_one({
            "id": new_id(),
            "title": req.request_type,
            "client_name": req.name,
            "phone": req.phone,
            "type": req.request_type,
            "property_ref": req.property_ref,
            "property_title": req.property_title,
            "time_slot": req.time_slot,
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "status": "da_chiamare",
            "notes": req.notes or "",
            "created_at": now_iso(),
        })
    return {"ok": True, "id": doc["id"]}


@api.post("/buyer-requests/public")
async def submit_buyer_request(req: BuyerRequestPublic):
    count = await db.buyer_requests.count_documents({})
    doc = {
        "id": new_id(),
        "ref_code": f"SH-{130 + count}",
        "verified": False,
        "approved": False,
        "profile": req.profile,
        "searching": req.searching,
        "zone": req.zone,
        "budget": req.budget,
        "created_at": now_iso(),
    }
    await db.buyer_requests.insert_one(dict(doc))
    await db.leads.insert_one({
        "id": new_id(),
        "name": req.name,
        "phone": req.phone,
        "email": None,
        "request_type": "Nuova Richiesta di Ricerca Immobile",
        "property_ref": doc["ref_code"],
        "service": None,
        "time_slot": None,
        "notes": f"{req.searching} · {req.zone} · {req.budget}",
        "status": "nuovo",
        "stage": "inviata",
        "agent_notes": "",
        "created_at": now_iso(),
    })
    return {"ok": True}


# ----------------------------- Staff: Leads & Appointments -----------------------------
@api.get("/leads")
async def get_leads(user: dict = Depends(require_staff)):
    return await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api.put("/leads/{lid}")
async def update_lead(lid: str, body: Dict[str, Any], user: dict = Depends(require_staff)):
    allowed = {k: v for k, v in body.items() if k in ("status", "agent_notes", "stage")}
    await db.leads.update_one({"id": lid}, {"$set": allowed})
    return clean(await db.leads.find_one({"id": lid}, {"_id": 0}))


@api.get("/appointments")
async def get_appointments(user: dict = Depends(require_staff)):
    return await db.appointments.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api.post("/appointments")
async def create_appointment(body: Dict[str, Any], user: dict = Depends(require_staff)):
    doc = {
        "id": new_id(),
        "title": body.get("title", "Appuntamento"),
        "client_name": body.get("client_name", ""),
        "phone": body.get("phone", ""),
        "type": body.get("type", "Sopralluogo"),
        "property_ref": body.get("property_ref"),
        "property_title": body.get("property_title"),
        "time_slot": body.get("time_slot", "Domani Mattina"),
        "date": body.get("date", datetime.now(timezone.utc).strftime("%Y-%m-%d")),
        "status": body.get("status", "fissato"),
        "notes": body.get("notes", ""),
        "created_at": now_iso(),
    }
    await db.appointments.insert_one(dict(doc))
    return doc


@api.put("/appointments/{aid}")
async def update_appointment(aid: str, body: Dict[str, Any], user: dict = Depends(require_staff)):
    allowed = {k: v for k, v in body.items() if k in ("status", "notes", "time_slot", "date", "title", "client_name", "phone")}
    await db.appointments.update_one({"id": aid}, {"$set": allowed})
    return clean(await db.appointments.find_one({"id": aid}, {"_id": 0}))


# ----------------------------- Staff: Properties CRUD -----------------------------
@api.post("/properties")
async def create_property(body: Dict[str, Any], user: dict = Depends(require_staff)):
    count = await db.properties.count_documents({})
    body["id"] = new_id()
    body.setdefault("ref_code", f"SH-PZ-{500 + count}")
    body.setdefault("views", 0)
    body.setdefault("whatsapp_shares", 0)
    body.setdefault("observing_now", False)
    body.setdefault("observing_count", 3)
    body.setdefault("status_badges", [])
    body.setdefault("photos", [])
    body["created_at"] = now_iso()
    await db.properties.insert_one(dict(body))
    return clean(body)


@api.put("/properties/{pid}")
async def update_property(pid: str, body: Dict[str, Any], user: dict = Depends(require_staff)):
    body.pop("id", None)
    body.pop("_id", None)
    await db.properties.update_one({"id": pid}, {"$set": body})
    return clean(await db.properties.find_one({"id": pid}, {"_id": 0}))


@api.delete("/properties/{pid}")
async def delete_property(pid: str, user: dict = Depends(require_staff)):
    await db.properties.delete_one({"id": pid})
    return {"ok": True}


# ----------------------------- Admin: Hype Engine -----------------------------
@api.post("/admin/boost/{pid}")
async def boost_property(pid: str, body: Dict[str, Any], user: dict = Depends(require_admin)):
    inc = {}
    if body.get("views"):
        inc["views"] = int(body["views"])
    if body.get("shares"):
        inc["whatsapp_shares"] = int(body["shares"])
    sets = {}
    if "observing_now" in body:
        sets["observing_now"] = bool(body["observing_now"])
    if "observing_count" in body:
        sets["observing_count"] = int(body["observing_count"])
    if "status_badges" in body:
        sets["status_badges"] = body["status_badges"]
    update: Dict[str, Any] = {}
    if inc:
        update["$inc"] = inc
    if sets:
        update["$set"] = sets
    if update:
        await db.properties.update_one({"id": pid}, update)
    return clean(await db.properties.find_one({"id": pid}, {"_id": 0}))


@api.post("/admin/boost-global")
async def boost_global(user: dict = Depends(require_admin)):
    import random
    props = await db.properties.find({}, {"_id": 0, "id": 1}).to_list(500)
    for p in props:
        await db.properties.update_one(
            {"id": p["id"]},
            {"$inc": {"views": random.randint(80, 420), "whatsapp_shares": random.randint(2, 11)}},
        )
    return {"ok": True, "boosted": len(props)}


# ----------------------------- Admin: Site content -----------------------------
@api.put("/admin/ticker")
async def update_ticker(body: Dict[str, Any], user: dict = Depends(require_admin)):
    await db.ticker.update_one({}, {"$set": {"items": body.get("items", []), "updated_label": body.get("updated_label", "")}}, upsert=True)
    return clean(await db.ticker.find_one({}, {"_id": 0}))


@api.put("/admin/stats/{sid}")
async def update_stat(sid: str, body: Dict[str, Any], user: dict = Depends(require_admin)):
    await db.stats.update_one({"id": sid}, {"$set": {k: v for k, v in body.items() if k in ("value", "label", "prefix", "suffix")}})
    return clean(await db.stats.find_one({"id": sid}, {"_id": 0}))


@api.put("/admin/neighborhoods/{nid}")
async def update_neighborhood(nid: str, body: Dict[str, Any], user: dict = Depends(require_admin)):
    body.pop("id", None); body.pop("_id", None)
    await db.neighborhoods.update_one({"id": nid}, {"$set": body})
    return clean(await db.neighborhoods.find_one({"id": nid}, {"_id": 0}))


@api.put("/admin/poles/{pid}")
async def update_pole(pid: str, body: Dict[str, Any], user: dict = Depends(require_admin)):
    body.pop("id", None); body.pop("_id", None)
    await db.poles.update_one({"id": pid}, {"$set": body})
    return clean(await db.poles.find_one({"id": pid}, {"_id": 0}))


@api.post("/admin/services")
async def create_service(body: Dict[str, Any], user: dict = Depends(require_admin)):
    count = await db.services.count_documents({})
    body["id"] = new_id()
    body.setdefault("order", count + 1)
    body.setdefault("active", True)
    await db.services.insert_one(dict(body))
    return clean(body)


@api.put("/admin/services/{sid}")
async def update_service(sid: str, body: Dict[str, Any], user: dict = Depends(require_admin)):
    body.pop("id", None); body.pop("_id", None)
    await db.services.update_one({"id": sid}, {"$set": body})
    return clean(await db.services.find_one({"id": sid}, {"_id": 0}))


@api.delete("/admin/services/{sid}")
async def delete_service(sid: str, user: dict = Depends(require_admin)):
    await db.services.delete_one({"id": sid})
    return {"ok": True}


# ----------------------------- Admin: Buyer requests mgmt -----------------------------
@api.get("/admin/buyer-requests")
async def admin_buyer_requests(user: dict = Depends(require_admin)):
    return await db.buyer_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


@api.post("/admin/buyer-requests")
async def admin_create_buyer_request(body: Dict[str, Any], user: dict = Depends(require_admin)):
    count = await db.buyer_requests.count_documents({})
    body["id"] = new_id()
    body.setdefault("ref_code", f"SH-{130 + count}")
    body.setdefault("verified", True)
    body.setdefault("approved", True)
    body["created_at"] = now_iso()
    await db.buyer_requests.insert_one(dict(body))
    return clean(body)


@api.put("/admin/buyer-requests/{bid}")
async def admin_update_buyer_request(bid: str, body: Dict[str, Any], user: dict = Depends(require_admin)):
    body.pop("id", None); body.pop("_id", None)
    await db.buyer_requests.update_one({"id": bid}, {"$set": body})
    return clean(await db.buyer_requests.find_one({"id": bid}, {"_id": 0}))


@api.delete("/admin/buyer-requests/{bid}")
async def admin_delete_buyer_request(bid: str, user: dict = Depends(require_admin)):
    await db.buyer_requests.delete_one({"id": bid})
    return {"ok": True}


# ----------------------------- Admin: VIP links & Users -----------------------------
@api.get("/admin/vip-links")
async def admin_vip_links(user: dict = Depends(require_admin)):
    return await db.vip_links.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


@api.post("/admin/vip-links")
async def admin_create_vip(body: Dict[str, Any], user: dict = Depends(require_admin)):
    doc = {
        "id": new_id(),
        "token": uuid.uuid4().hex[:10],
        "owner_name": body.get("owner_name", "Proprietario"),
        "neighborhood": body.get("neighborhood", "Potenza"),
        "compatible_buyers": int(body.get("compatible_buyers", 5)),
        "created_at": now_iso(),
    }
    await db.vip_links.insert_one(dict(doc))
    return doc


@api.delete("/admin/vip-links/{vid}")
async def admin_delete_vip(vid: str, user: dict = Depends(require_admin)):
    await db.vip_links.delete_one({"id": vid})
    return {"ok": True}


@api.get("/admin/users")
async def admin_users(user: dict = Depends(require_admin)):
    return await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(500)


@api.put("/admin/users/{uid}")
async def admin_update_user(uid: str, body: Dict[str, Any], user: dict = Depends(require_admin)):
    allowed = {k: v for k, v in body.items() if k in ("name", "profile_data", "commission_status")}
    await db.users.update_one({"id": uid}, {"$set": allowed})
    return clean(await db.users.find_one({"id": uid}, {"_id": 0, "password_hash": 0}))


BACKUP_COLLECTIONS = ["properties", "neighborhoods", "poles", "stats", "ticker",
                      "services", "buyer_requests", "appointments", "leads", "vip_links",
                      "newsletter", "faq", "settings", "site_config"]


@api.get("/admin/backup/export")
async def backup_export(user: dict = Depends(require_admin)):
    data = {}
    for coll in BACKUP_COLLECTIONS:
        data[coll] = await db[coll].find({}, {"_id": 0}).to_list(5000)
    return {"exported_at": now_iso(), "collections": data}


@api.post("/admin/backup/import")
async def backup_import(body: Dict[str, Any], user: dict = Depends(require_admin)):
    payload = body.get("collections", body)
    restored = {}
    for coll in BACKUP_COLLECTIONS:
        if coll in payload and isinstance(payload[coll], list):
            await db[coll].delete_many({})
            if payload[coll]:
                await db[coll].insert_many([{k: v for k, v in d.items() if k != "_id"} for d in payload[coll]])
            restored[coll] = len(payload[coll])
    return {"ok": True, "restored": restored}


# ----------------------------- Newsletter -----------------------------
class NewsletterReq(BaseModel):
    email: str
    name: Optional[str] = None


@api.post("/newsletter")
async def newsletter_subscribe(req: NewsletterReq):
    email = req.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Email non valida")
    existing = await db.newsletter.find_one({"email": email})
    if existing:
        return {"ok": True, "already": True}
    await db.newsletter.insert_one({"id": new_id(), "email": email, "name": req.name, "created_at": now_iso()})
    return {"ok": True}


@api.get("/admin/newsletter")
async def newsletter_list(user: dict = Depends(require_admin)):
    return await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)


@api.delete("/admin/newsletter/{nid}")
async def newsletter_delete(nid: str, user: dict = Depends(require_admin)):
    await db.newsletter.delete_one({"id": nid})
    return {"ok": True}


# ----------------------------- FAQ -----------------------------
@api.get("/faq")
async def list_faq():
    return await db.faq.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(100)


@api.get("/admin/faq")
async def admin_faq(user: dict = Depends(require_admin)):
    return await db.faq.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@api.post("/admin/faq")
async def create_faq(body: Dict[str, Any], user: dict = Depends(require_admin)):
    count = await db.faq.count_documents({})
    body["id"] = new_id()
    body.setdefault("order", count + 1)
    body.setdefault("active", True)
    await db.faq.insert_one(dict(body))
    return clean(body)


@api.put("/admin/faq/{fid}")
async def update_faq(fid: str, body: Dict[str, Any], user: dict = Depends(require_admin)):
    body.pop("id", None); body.pop("_id", None)
    await db.faq.update_one({"id": fid}, {"$set": body})
    return clean(await db.faq.find_one({"id": fid}, {"_id": 0}))


@api.delete("/admin/faq/{fid}")
async def delete_faq(fid: str, user: dict = Depends(require_admin)):
    await db.faq.delete_one({"id": fid})
    return {"ok": True}


# ----------------------------- Site Settings (editable content) -----------------------------
@api.get("/content/settings")
async def get_settings():
    s = await db.settings.find_one({"id": "site"}, {"_id": 0})
    return s or {}


@api.put("/admin/settings")
async def update_settings(body: Dict[str, Any], user: dict = Depends(require_admin)):
    body.pop("_id", None)
    body["id"] = "site"
    await db.settings.update_one({"id": "site"}, {"$set": body}, upsert=True)
    return clean(await db.settings.find_one({"id": "site"}, {"_id": 0}))


# ----------------------------- Integrations / generic config (admin autonomy) -----------------------------
@api.get("/admin/config")
async def get_config(user: dict = Depends(require_admin)):
    return await db.site_config.find({}, {"_id": 0}).sort("created_at", 1).to_list(500)


@api.post("/admin/config")
async def create_config(body: Dict[str, Any], user: dict = Depends(require_admin)):
    doc = {"id": new_id(), "label": body.get("label", ""), "key": body.get("key", ""),
           "value": body.get("value", ""), "category": body.get("category", "Integrazione"),
           "enabled": bool(body.get("enabled", True)), "created_at": now_iso()}
    await db.site_config.insert_one(dict(doc))
    return doc


@api.put("/admin/config/{cid}")
async def update_config(cid: str, body: Dict[str, Any], user: dict = Depends(require_admin)):
    body.pop("id", None); body.pop("_id", None)
    await db.site_config.update_one({"id": cid}, {"$set": body})
    return clean(await db.site_config.find_one({"id": cid}, {"_id": 0}))


@api.delete("/admin/config/{cid}")
async def delete_config(cid: str, user: dict = Depends(require_admin)):
    await db.site_config.delete_one({"id": cid})
    return {"ok": True}


# ----------------------------- Admin: Overview dashboard -----------------------------
@api.get("/admin/overview")
async def admin_overview(user: dict = Depends(require_staff)):
    leads_total = await db.leads.count_documents({})
    leads_new = await db.leads.count_documents({"status": {"$in": ["new", "nuovo", "aperto", None]}})
    props_active = await db.properties.count_documents({"type": {"$ne": "conclusa"}})
    props_total = await db.properties.count_documents({})
    props_concluded = await db.properties.count_documents({"type": "conclusa"})
    newsletter = await db.newsletter.count_documents({})
    buyers = await db.buyer_requests.count_documents({})
    buyers_pending = await db.buyer_requests.count_documents({"approved": {"$ne": True}})
    recent = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(6)
    return {
        "leads_total": leads_total, "leads_new": leads_new,
        "properties_active": props_active, "properties_total": props_total, "properties_concluded": props_concluded,
        "newsletter": newsletter, "buyer_requests": buyers, "buyer_requests_pending": buyers_pending,
        "recent_leads": recent,
    }


# ----------------------------- Object Storage (media uploads) -----------------------------
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "supreme-house"
_storage_key = None

MIME_TYPES = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
              "gif": "image/gif", "webp": "image/webp", "svg": "image/svg+xml"}


def init_storage(force: bool = False):
    global _storage_key
    if _storage_key and not force:
        return _storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    _storage_key = resp.json()["storage_key"]
    return _storage_key


def _put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(f"{STORAGE_URL}/objects/{path}",
                        headers={"X-Storage-Key": key, "Content-Type": content_type},
                        data=data, timeout=120)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.put(f"{STORAGE_URL}/objects/{path}",
                            headers={"X-Storage-Key": key, "Content-Type": content_type},
                            data=data, timeout=120)
    resp.raise_for_status()
    return resp.json()


def _get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


@api.post("/admin/media")
async def upload_media(file: UploadFile = File(...), user: dict = Depends(require_staff)):
    ext = (file.filename.rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "bin")
    content_type = file.content_type or MIME_TYPES.get(ext, "application/octet-stream")
    data = await file.read()
    if len(data) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File troppo grande (max 15MB)")
    path = f"{APP_NAME}/media/{uuid.uuid4()}.{ext}"
    try:
        result = await asyncio.to_thread(_put_object, path, data, content_type)
    except Exception as e:
        logger.error(f"upload failed: {e}")
        raise HTTPException(status_code=502, detail="Upload non riuscito")
    mid = new_id()
    doc = {"id": mid, "storage_path": result["path"], "filename": file.filename,
           "content_type": content_type, "size": result.get("size", len(data)),
           "is_deleted": False, "created_at": now_iso()}
    await db.media.insert_one(dict(doc))
    return {"id": mid, "url": f"/api/media/{mid}", "filename": file.filename}


@api.get("/admin/media")
async def list_media(user: dict = Depends(require_staff)):
    items = await db.media.find({"is_deleted": {"$ne": True}}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for it in items:
        it["url"] = f"/api/media/{it['id']}"
    return items


@api.delete("/admin/media/{mid}")
async def delete_media(mid: str, user: dict = Depends(require_staff)):
    await db.media.update_one({"id": mid}, {"$set": {"is_deleted": True}})
    return {"ok": True}


@api.get("/media/{mid}")
async def serve_media(mid: str):
    record = await db.media.find_one({"id": mid, "is_deleted": {"$ne": True}}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Media non trovato")
    try:
        data, content_type = await asyncio.to_thread(_get_object, record["storage_path"])
    except Exception as e:
        logger.error(f"serve media failed: {e}")
        raise HTTPException(status_code=502, detail="Media non disponibile")
    return Response(content=data, media_type=record.get("content_type", content_type),
                    headers={"Cache-Control": "public, max-age=86400"})


# ----------------------------- Admin: Neighborhoods & Poles CRUD -----------------------------
@api.post("/admin/neighborhoods")
async def create_neighborhood(body: Dict[str, Any], user: dict = Depends(require_admin)):
    count = await db.neighborhoods.count_documents({})
    body["id"] = new_id()
    body.setdefault("position", count + 1)
    body.setdefault("name", "Nuovo Quartiere")
    body.setdefault("lat", 40.6418)
    body.setdefault("lng", 15.8086)
    await db.neighborhoods.insert_one(dict(body))
    return clean(body)


@api.delete("/admin/neighborhoods/{nid}")
async def delete_neighborhood(nid: str, user: dict = Depends(require_admin)):
    await db.neighborhoods.delete_one({"id": nid})
    return {"ok": True}


@api.post("/admin/poles")
async def create_pole(body: Dict[str, Any], user: dict = Depends(require_admin)):
    count = await db.poles.count_documents({})
    body["id"] = new_id()
    body.setdefault("order", count + 1)
    body.setdefault("name", "Nuovo Polo")
    body.setdefault("active", True)
    await db.poles.insert_one(dict(body))
    return clean(body)


@api.delete("/admin/poles/{pid}")
async def delete_pole(pid: str, user: dict = Depends(require_admin)):
    await db.poles.delete_one({"id": pid})
    return {"ok": True}


# ----------------------------- Seed -----------------------------
from seed_data import (
    SEED_PROPERTIES, SEED_NEIGHBORHOODS, SEED_POLES, SEED_STATS,
    SEED_TICKER, SEED_SERVICES, SEED_BUYER_REQUESTS, SEED_APPOINTMENTS,
    SEED_LEADS, build_demo_users,
)
from seed_extra import SEED_FAQ, SEED_SETTINGS
import uuid as _uuid


async def seed():
    # Users (idempotent upsert)
    users = build_demo_users(
        os.environ.get("ADMIN_USERNAME", "admin"),
        os.environ.get("ADMIN_PASSWORD", "admin123"),
        os.environ.get("AGENT_USERNAME", "agente"),
        os.environ.get("AGENT_PASSWORD", "agente123"),
        hash_password,
    )
    for u in users:
        existing = await db.users.find_one({"username": u["username"]})
        if existing is None:
            await db.users.insert_one(u)
        else:
            await db.users.update_one(
                {"username": u["username"]},
                {"$set": {"password_hash": u["password_hash"], "role": u["role"],
                          "name": u["name"], "profile_data": u.get("profile_data", {})}},
            )

    seeders = [
        ("properties", SEED_PROPERTIES),
        ("neighborhoods", SEED_NEIGHBORHOODS),
        ("poles", SEED_POLES),
        ("stats", SEED_STATS),
        ("services", SEED_SERVICES),
        ("buyer_requests", SEED_BUYER_REQUESTS),
        ("appointments", SEED_APPOINTMENTS),
        ("leads", SEED_LEADS),
    ]
    for coll, data in seeders:
        if await db[coll].count_documents({}) == 0 and data:
            await db[coll].insert_many([dict(d) for d in data])

    if await db.ticker.count_documents({}) == 0:
        await db.ticker.insert_one(dict(SEED_TICKER))

    if await db.faq.count_documents({}) == 0:
        await db.faq.insert_many([{**dict(f), "id": str(_uuid.uuid4())} for f in SEED_FAQ])

    existing_settings = await db.settings.find_one({"id": "site"}, {"_id": 0})
    if existing_settings is None:
        await db.settings.insert_one(dict(SEED_SETTINGS))
    else:
        # Non-destructive backfill: add missing default keys, deep-merge nested blocks.
        updates = {}
        for k, v in SEED_SETTINGS.items():
            if k in ("id", "theme", "navbar", "footer", "home", "pages", "seo"):
                continue
            if k not in existing_settings:
                updates[k] = v
        updates["theme"] = {**SEED_SETTINGS["theme"], **(existing_settings.get("theme") or {})}
        updates["navbar"] = deep_fill(SEED_SETTINGS["navbar"], existing_settings.get("navbar"))
        updates["footer"] = deep_fill(SEED_SETTINGS["footer"], existing_settings.get("footer"))
        updates["pages"] = deep_fill(SEED_SETTINGS["pages"], existing_settings.get("pages"))
        updates["seo"] = deep_fill(SEED_SETTINGS["seo"], existing_settings.get("seo"))
        if "home" in existing_settings:
            updates["home"] = deep_fill(SEED_SETTINGS["home"], existing_settings["home"])
        else:
            # First migration: seed home + carry over any previously edited top-level hero text.
            import copy as _copy
            home = _copy.deepcopy(SEED_SETTINGS["home"])
            for src, dst in [("hero_eyebrow", "eyebrow"), ("hero_title", "title"), ("hero_title_accent", "title_accent"),
                             ("hero_subtitle", "subtitle"), ("hero_card_top", "card_top"), ("hero_card_bottom", "card_bottom")]:
                if existing_settings.get(src):
                    home["sections"]["hero"][dst] = existing_settings[src]
            updates["home"] = home
        await db.settings.update_one({"id": "site"}, {"$set": updates})


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("username", unique=True)
    await seed()
    try:
        await asyncio.to_thread(init_storage)
        logger.info("Object storage initialized.")
    except Exception as e:
        logger.warning(f"storage init failed (uploads may be unavailable): {e}")
    logger.info("Supreme House API ready — data seeded.")

    # Write test credentials file for QA/fork agents
    try:
        creds = """# Test Credentials — Supreme House

## Super-Admin (Cabina di Regia)
- Username: admin
- Password: admin123
- Role: admin

## Agente (Gestionale CRM)
- Username: agente
- Password: agente123
- Role: agent

## Demo 1-click accounts (via /api/auth/demo-login)
- user -> demo_user / demo123
- bnb_owner -> demo_bnb / demo123
- condomino -> demo_condo / demo123
- collaborator -> demo_collab / demo123

## Auth endpoints
- POST /api/auth/login  {username, password}
- POST /api/auth/demo-login  {role}
- POST /api/auth/register
- GET  /api/auth/me  (Bearer token)
"""
        Path("/app/memory/test_credentials.md").write_text(creds)
    except Exception as e:
        logger.warning(f"could not write test_credentials: {e}")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


@api.get("/")
async def root():
    return {"message": "Supreme House API"}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
