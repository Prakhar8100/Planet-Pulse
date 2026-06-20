import logging
from supabase import create_client, Client
from core.config import settings

logger = logging.getLogger(__name__)

class DBService:
    def __init__(self):
        # We handle missing keys gracefully so the app still boots
        if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
            self.client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
            self.enabled = True
        else:
            self.enabled = False
            self.fallback_data = {}
            logger.warning("SUPABASE_URL or SUPABASE_ANON_KEY is missing. Falling back to in-memory store.")

    async def save_assessment(self, device_id: str, data: dict):
        if not self.enabled:
            # Fallback mock logic
            if device_id not in self.fallback_data:
                self.fallback_data[device_id] = []
            self.fallback_data[device_id].append(data)
            return True

        try:
            # Extract basic data, handling defaults if not provided by the API
            record = {
                "device_id": device_id,
                "total_emissions": data.get("total_emissions", 0),
                "carbon_score": data.get("carbon_score", 0),
                "transport_emissions": data.get("transport_emissions", 0),
                "energy_emissions": data.get("energy_emissions", 0),
                "food_emissions": data.get("food_emissions", 0),
                "consumption_emissions": data.get("consumption_emissions", 0),
            }
            
            response = self.client.table("history").insert(record).execute()
            return response.data
        except Exception as e:
            logger.error(f"Failed to save assessment to Supabase: {str(e)}")
            return False

    async def get_history(self, device_id: str):
        if not self.enabled:
            return self.fallback_data.get(device_id, [])

        try:
            response = self.client.table("history").select("*").eq("device_id", device_id).order("created_at", desc=True).limit(10).execute()
            return response.data
        except Exception as e:
            logger.error(f"Failed to fetch history from Supabase: {str(e)}")
            return []

    async def save_analytics_event(self, data: dict):
        """Replaces BigQuery inserts"""
        if not self.enabled:
            return True
            
        try:
            event = {
                "total_emissions": data.get("total_emissions", 0),
                "top_category": data.get("top_category", "Unknown"),
                "diet_type": data.get("diet_type", "Unknown")
            }
            self.client.table("analytics_events").insert(event).execute()
            return True
        except Exception as e:
            logger.error(f"Failed to save analytics event: {str(e)}")
            return False

db_service = DBService()
