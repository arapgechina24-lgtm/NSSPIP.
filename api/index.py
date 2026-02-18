from fastapi import FastAPI
from pydantic import BaseModel
import random
from typing import List, Optional
from datetime import datetime

# Define root_path for Vercel integration
app = FastAPI(title="NSSPIP AI Engine", version="1.0.0", root_path="/api/ai")

# --- Models ---
class RiskRequest(BaseModel):
    latitude: float
    longitude: float
    time_of_day: Optional[str] = None

class RiskResponse(BaseModel):
    risk_score: int
    risk_level: str
    contributing_factors: List[str]

class SurveillanceRequest(BaseModel):
    feed_id: str
    image_url: Optional[str] = None

class ObjectDetection(BaseModel):
    label: str
    confidence: float
    bbox: List[int] # [x, y, w, h]

class SurveillanceResponse(BaseModel):
    feed_id: str
    timestamp: str
    detected_objects: List[ObjectDetection]
    alert_triggered: bool

# --- Mock Logic ---

def calculate_risk(lat: float, lng: float) -> int:
    # MVP: Mock logic based on "Nairobi" coordinates
    # Higher risk in CBD approx coords
    base_score = random.randint(10, 30)
    
    # Simple proximity mock to "hotspots"
    # CBD: -1.282, 36.821
    if -1.29 < lat < -1.27 and 36.81 < lng < 36.83:
        base_score += random.randint(40, 60)
    
    return min(base_score, 100)

# --- Endpoints ---

@app.get("/")
def health_check():
    return {"status": "operational", "service": "NSSPIP AI Engine (Serverless)"}

@app.post("/predict/risk-score", response_model=RiskResponse)
def get_risk_score(request: RiskRequest):
    score = calculate_risk(request.latitude, request.longitude)
    
    level = "LOW"
    if score > 40: level = "MEDIUM"
    if score > 70: level = "HIGH"
    if score > 90: level = "CRITICAL"

    factors = []
    if level in ["HIGH", "CRITICAL"]:
        factors = ["Historical crime density high", "Poor lighting reported", "Proximity to high-value target"]
    elif level == "MEDIUM":
        factors = ["Recent minor incidents"]
    
    return {
        "risk_score": score,
        "risk_level": level,
        "contributing_factors": factors
    }

@app.post("/analyze/surveillance", response_model=SurveillanceResponse)
def analyze_surveillance(request: SurveillanceRequest):
    # MVP: Simulate object detection
    # In production, this would load a YOLOv8 model and process the image
    
    detections = []
    triggered = False
    
    # Randomly simulate finding a weapon or abandoned bag
    if random.random() < 0.2: # 20% chance of threat in simulation
        detections.append({
            "label": "abandoned_bag",
            "confidence": 0.89,
            "bbox": [100, 200, 50, 50]
        })
        triggered = True
        
    if random.random() < 0.05: # 5% chance of weapon
        detections.append({
            "label": "weapon",
            "confidence": 0.95,
            "bbox": [120, 220, 30, 10]
        })
        triggered = True

    return {
        "feed_id": request.feed_id,
        "timestamp": datetime.now().isoformat(),
        "detected_objects": detections,
        "alert_triggered": triggered
    }

@app.post("/analyze/sentiment")
def analyze_sentiment(text: str):
    # MVP: Simple keyword based sentiment
    # In production, use NLTK or HuggingFace transformers
    keywords_negative = ["riot", "protest", "violence", "fail", "danger", "scared"]
    keywords_positive = ["safe", "calm", "police helped", "secure"]
    
    text_lower = text.lower()
    score = 0
    for word in keywords_negative:
        if word in text_lower: score -= 1
    for word in keywords_positive:
        if word in text_lower: score += 1
        
    sentiment = "NEUTRAL"
    if score > 0: sentiment = "POSITIVE"
    if score < 0: sentiment = "NEGATIVE"
    
    return {
        "text_preview": text[:50],
        "sentiment": sentiment,
        "score": score
    }
