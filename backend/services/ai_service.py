import json
import logging
from openai import AsyncOpenAI
from core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.client = AsyncOpenAI(
            base_url=settings.OPENROUTER_BASE_URL,
            api_key=settings.OPENROUTER_API_KEY,
        )
        self.model = "deepseek/deepseek-chat-v3"

    async def generate_insights(self, data: dict):
        # Fallback recommendations if API fails
        fallback_recommendations = [
            {
                "title": "Optimize Commute",
                "impact": "240 kg CO₂e / yr",
                "savings": "$350 / yr",
                "reasoning": "Switching some weekly car trips to public transit can significantly cut emissions and save on gas.",
                "tags": ["High Impact", "Transport"]
            },
            {
                "title": "Smart Heating",
                "impact": "180 kg CO₂e / yr",
                "savings": "$120 / yr",
                "reasoning": "Lowering your thermostat by 1°C while sleeping reduces energy consumption by 8%.",
                "tags": ["Energy", "Easy Win"]
            },
            {
                "title": "Plant-Based Day",
                "impact": "110 kg CO₂e / yr",
                "savings": "$150 / yr",
                "reasoning": "Incorporating just one meatless day per week reduces agricultural emissions.",
                "tags": ["Diet", "Health"]
            }
        ]

        if not settings.OPENROUTER_API_KEY:
            logger.warning("OPENROUTER_API_KEY is missing. Using fallback recommendations.")
            return fallback_recommendations

        try:
            prompt = f"""
            You are an expert AI sustainability coach for the Planet Pulse platform.
            Based on the following user data, provide exactly 3 actionable, personalized recommendations to reduce their carbon footprint.
            
            User Data: {json.dumps(data)}
            
            Output your response as a raw JSON array of objects. Do not include markdown code blocks. Each object must exactly match this schema:
            {{
                "title": "Short title",
                "impact": "Estimated CO2e reduction per year",
                "savings": "Estimated financial savings per year",
                "reasoning": "1-2 sentence personalized explanation",
                "tags": ["Category 1", "Category 2"]
            }}
            """

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful sustainability API. Always return valid JSON matching the exact schema requested."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800,
                timeout=15.0 # Add timeout handling
            )

            result = response.choices[0].message.content
            
            # Clean potential markdown formatting
            if result.startswith("```json"):
                result = result[7:]
            if result.endswith("```"):
                result = result[:-3]
                
            recommendations = json.loads(result.strip())
            
            # Basic validation
            if not isinstance(recommendations, list) or len(recommendations) == 0:
                raise ValueError("API did not return a valid list of recommendations.")
                
            return recommendations

        except Exception as e:
            logger.error(f"OpenRouter API failed: {str(e)}")
            # Preserve fallback rule engine
            return fallback_recommendations

ai_service = AIService()
