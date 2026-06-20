from fastapi import APIRouter, Request
from services.ai_service import ai_service
from services.db_service import db_service

router = APIRouter()

@router.get("/coach")
async def get_coach_insights(request: Request):
    device_token = request.headers.get("X-Device-Token", "anonymous")
    history = await db_service.get_history(device_token)
    
    # We would pass history to Gemini here
    insights = await ai_service.generate_insights({"history": history})
    
    return {"status": "success", "recommendations": insights}
