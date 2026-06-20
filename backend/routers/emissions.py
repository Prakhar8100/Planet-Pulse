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
    device_token = request.headers.get("X-Device-Token", "anonymous")
    
    # 1. Transport
    veh_factor = {"gasoline": 0.25, "hybrid": 0.15, "ev": 0.05, "public": 0.08, "bicycle": 0.0, "walk": 0.0}
    transport_emissions = int(data.weeklyDistance * 52 * veh_factor.get(data.vehicleType, 0.2))
    transport_emissions += int(data.flightsPerYear * 500)
    
    # 2. Food
    diet_factor = {"meat-heavy": 2500, "mixed": 1800, "vegetarian": 1000, "vegan": 700}
    food_emissions = diet_factor.get(data.dietType, 1800)
    
    # 3. Energy
    home_factor = {"large": 1200, "medium": 800, "small": 400, "apartment": 300}
    energy_emissions = int(data.electricityUsage * 12 * 0.4) + home_factor.get(data.homeSize, 800)
    
    # 4. Consumption / Work Style
    work_factor = {"office": 1000, "hybrid": 700, "remote": 400}
    consumption_emissions = work_factor.get(data.workStyle, 700)
    
    total_emissions = transport_emissions + food_emissions + energy_emissions + consumption_emissions
    
    # Very basic percentile logic relative to an arbitrary 5000 avg
    carbon_score = max(0, min(100, int(100 - (total_emissions / 10000) * 100)))
    percentile = max(1, min(99, int((total_emissions / 5000) * 50)))
    
    result = {
        "total_emissions": total_emissions,
        "transport_emissions": transport_emissions,
        "food_emissions": food_emissions,
        "energy_emissions": energy_emissions,
        "consumption_emissions": consumption_emissions,
        "carbon_score": carbon_score,
        "percentile": percentile
    }
    
    background_tasks.add_task(process_analytics_async, device_token, result, data.model_dump())
    
    return {"status": "success", "data": result}

@router.get("/history")
async def get_history(request: Request):
    device_token = request.headers.get("X-Device-Token", "anonymous")
    history = await db_service.get_history(device_token)
    return {"status": "success", "history": history}
