from fastapi import Request
from fastapi.responses import JSONResponse

async def mock_auth_middleware(request: Request, call_next):
    # Skip auth for health and docs
    if request.url.path in ["/health", "/docs", "/openapi.json"]:
        return await call_next(request)

    # In development, we simulate an authenticated user
    # Later, this middleware will be replaced by Clerk validation
    mock_user = {
        "user_id": "mock_admin_123",
        "role": "Admin",
        "email": "admin@brahmos.app",
        "name": "Admin User"
    }
    
    # Attach user to request state
    request.state.user = mock_user
    
    response = await call_next(request)
    return response

def get_current_user(request: Request):
    return getattr(request.state, "user", None)
