from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from core.config import settings
from routers import emissions, insights

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@limiter.limit("5/minute")
async def health_check(request: Request):
    return {"status": "healthy", "environment": settings.ENVIRONMENT}

# Include Routers
app.include_router(emissions.router, prefix=f"{settings.API_V1_STR}/assessments", tags=["Assessments"])
app.include_router(insights.router, prefix=f"{settings.API_V1_STR}/insights", tags=["Insights"])
