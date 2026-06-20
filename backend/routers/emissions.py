from fastapi import APIRouter, Request, BackgroundTasks
from pydantic import BaseModel
from services.db_service import db_service
import asyncio

router = APIRouter()

class AssessmentData(BaseModel):
    vehicleType: str
    weeklyDistance: int
    flightsPerYear: int
    homeSize: str
    electricityUsage: int
    dietType: str
    workStyle: str

async def process_analytics_async(device_token: str, result: dict, data: dict):
    # This replaces Pub/Sub consumers. It runs in the background.
    
    # 1. Save history (Firestore replacement)
    await db_service.save_assessment(device_token, result)
    
    # 2. Save analytics event (BigQuery replacement)
    analytics_payload = {
        "total_emissions": result.get("total_emissions", 0),
        "top_category": "Transport" if data.get("vehicleType") == "gasoline" else "Energy",
        "diet_type": data.get("dietType", "Unknown")
    }
    await db_service.save_analytics_event(analytics_payload)


@router.post("/calculate")
async def calculate_emissions(request: Request, data: AssessmentData, background_tasks: BackgroundTasks):
    # Retrieve device token
    device_token = request.headers.get("X-Device-Token", "anonymous")
    
    # Mock calculation logic
    total_emissions = 3120 
    
    result = {
        "total_emissions": total_emissions,
        "carbon_score": 84,
        "percentile": 15
    }
    
    # Fire and forget instead of blocking the API or using Pub/Sub
    # Convert data model to dict for background processing
    background_tasks.add_task(process_analytics_async, device_token, result, data.model_dump())
    
    return {"status": "success", "data": result}
