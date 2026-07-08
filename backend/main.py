from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import connect_db, disconnect_db
from controllers import router as api_router
from core.security import mock_auth_middleware

app = FastAPI(
    title="BrahmOS API",
    description="API for BrahmOS Regulatory Change Management Platform",
    version="1.0.0",
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Auth Middleware (To be replaced by Clerk later)
app.middleware("http")(mock_auth_middleware)

@app.on_event("startup")
async def startup_event():
    await connect_db()

@app.on_event("shutdown")
async def shutdown_event():
    await disconnect_db()

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok"}
