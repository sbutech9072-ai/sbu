from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    auth,
    client,
    contact,
    quotes,
    admin,
    cms,
    ai,
)

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(client.router)
api_router.include_router(contact.router)
api_router.include_router(quotes.router)
api_router.include_router(admin.router)
api_router.include_router(cms.router)
api_router.include_router(ai.router)

