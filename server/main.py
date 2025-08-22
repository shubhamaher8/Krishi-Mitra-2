from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import joblib
import pandas as pd
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
from torchvision import models
import io
import time
import json 
from datetime import datetime
import os
import pandas as pd
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
import numpy as np
from datetime import datetime, timezone
import os
import pandas as pd
import numpy as np
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import re
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

load_dotenv()  # load .env file

FORECAST_DIR = os.getenv("FORECAST_DIR", "enhanced_forecasts03")

PLOT_DIR = os.getenv("PLOT_DIR", "enhanced_plots03")

PORT = int(os.getenv("PORT", 8000))

# ==========================
# Load Crop Recommendation Model
# ==========================
crop_model = joblib.load("models/crop_recommendation_model.joblib")
scaler = joblib.load("models/scaler.joblib")
metadata = joblib.load("models/metadata.joblib")

# ==========================
# Load Plant Disease Model (EfficientNet)
# ==========================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

disease_classes = [
    "Pepper_bell_Bacteria_spot",
    "Pepper_bell_healthy",
    "Potato_Early_blight",
    "Potato_healthy",
    "Potato_Late_blight",
    "Tomato_Target_Spot",
    "Tomato_Tomato_mosaic_virus",
    "Tomato_Tomato_YellowLeaf_Curl_Virus",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_healthy",
    "Tomato_Late_Blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
]

# Load EfficientNet-B0 and adjust classifier
disease_model = models.efficientnet_b0(pretrained=False)
num_features = disease_model.classifier[1].in_features
disease_model.classifier[1] = nn.Linear(num_features, len(disease_classes))

# Load weights
disease_model.load_state_dict(torch.load("models/plant_disease_model_final01.pth", map_location=device))
disease_model.to(device)
disease_model.eval()

# Image preprocessing
disease_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ==========================
# Disease Information Dictionary
# ==========================
disease_info = {
    "Pepper_bell_Bacteria_spot": {
        "description": "Bacterial spot causes small, dark, water-soaked lesions on leaves and fruit, leading to defoliation and poor fruit quality.",
        "treatments": {
            "Organic Control": [
                "Use disease-free seeds or transplants.",
                "Apply copper-based bactericides (OMRI approved).",
                "Practice crop rotation and avoid overhead irrigation."
            ],
            "Chemical Control": [
                "Use copper hydroxide sprays.",
                "Streptomycin sulfate may be applied early in outbreaks.",
                "Apply bactericides preventatively during humid conditions."
            ]
        }
    },
    "Pepper_bell_healthy": {
        "description": "The plant is healthy. No disease symptoms detected.",
        "treatments": {
            "Organic Control": ["Maintain proper watering and fertilization."],
            "Chemical Control": ["No treatment required."]
        }
    },
    "Potato_Early_blight": {
        "description": "Early blight causes concentric brown rings on leaves and stems, reducing photosynthesis and tuber yield.",
        "treatments": {
            "Organic Control": [
                "Use disease-free seed potatoes.",
                "Apply neem oil or compost teas.",
                "Rotate crops with non-solanaceous plants."
            ],
            "Chemical Control": [
                "Apply fungicides like chlorothalonil or mancozeb.",
                "Use azoxystrobin in early stages.",
                "Maintain protective fungicide spray schedule."
            ]
        }
    },
    "Potato_Late_blight": {
        "description": "Late blight causes water-soaked lesions on leaves and tubers, leading to rapid crop destruction.",
        "treatments": {
            "Organic Control": [
                "Remove infected plants immediately.",
                "Apply copper-based fungicides weekly.",
                "Ensure proper spacing for airflow."
            ],
            "Chemical Control": [
                "Use fungicides such as metalaxyl, mandipropamid, or cyazofamid.",
                "Protect tubers with systemic fungicides.",
                "Apply sprays at first sign of infection."
            ]
        }
    },
    "Potato_healthy": {
        "description": "The potato plant is healthy. No disease symptoms detected.",
        "treatments": {
            "Organic Control": ["Maintain good soil fertility and watering schedule."],
            "Chemical Control": ["No treatment required."]
        }
    },
    "Tomato_Bacterial_spot": {
        "description": "Bacterial spot causes small dark spots on leaves, stems, and fruit, reducing marketability.",
        "treatments": {
            "Organic Control": [
                "Use resistant varieties when possible.",
                "Apply copper sprays weekly.",
                "Avoid working in fields when plants are wet."
            ],
            "Chemical Control": [
                "Copper-based bactericides with mancozeb.",
                "Streptomycin sprays early in season.",
                "Spray preventatively during humid weather."
            ]
        }
    },
    "Tomato_Early_blight": {
        "description": "Early blight causes concentric brown spots on leaves and stems, leading to yield reduction.",
        "treatments": {
            "Organic Control": [
                "Mulch soil to prevent spore splash.",
                "Apply neem oil or bio-fungicides.",
                "Prune lower infected leaves."
            ],
            "Chemical Control": [
                "Apply fungicides such as mancozeb or chlorothalonil.",
                "Rotate fungicides to avoid resistance.",
                "Start spraying at first symptoms."
            ]
        }
    },
    "Tomato_Late_Blight": {
        "description": "Late blight is highly destructive, causing water-soaked lesions and spreading rapidly under cool, moist conditions.",
        "treatments": {
            "Organic Control": [
                "Remove infected leaves immediately.",
                "Use copper-based fungicides.",
                "Provide good air circulation between plants."
            ],
            "Chemical Control": [
                "Apply fungicides like cymoxanil, metalaxyl, or fluopicolide.",
                "Spray preventatively in late summer.",
                "Ensure thorough coverage of leaves and stems."
            ]
        }
    },
    "Tomato_Leaf_Mold": {
        "description": "Leaf mold produces yellow spots on the upper surface of leaves and olive-green mold on undersides.",
        "treatments": {
            "Organic Control": [
                "Improve ventilation in greenhouses.",
                "Water plants at the base, not overhead.",
                "Apply sulfur-based fungicides."
            ],
            "Chemical Control": [
                "Spray chlorothalonil or mancozeb.",
                "Apply fungicides early in disease development.",
                "Use systemic fungicides in severe outbreaks."
            ]
        }
    },
    "Tomato_Septoria_leaf_spot": {
        "description": "Septoria leaf spot causes numerous small, circular brown spots leading to defoliation.",
        "treatments": {
            "Organic Control": [
                "Remove infected leaves.",
                "Use crop rotation for at least 2 years.",
                "Apply compost teas or neem oil."
            ],
            "Chemical Control": [
                "Use fungicides like mancozeb, chlorothalonil, or copper sprays.",
                "Spray every 7–10 days during outbreaks.",
                "Destroy plant debris after harvest."
            ]
        }
    },
    "Tomato_Spider_mites_Two_spotted_spider_mite": {
        "description": "Spider mites cause stippling, yellowing, and webbing on tomato leaves, reducing photosynthesis.",
        "treatments": {
            "Organic Control": [
                "Introduce predatory mites (Phytoseiulus persimilis).",
                "Spray with neem oil or insecticidal soap.",
                "Maintain high humidity to suppress mites."
            ],
            "Chemical Control": [
                "Use miticides such as abamectin or spiromesifen.",
                "Rotate miticides to prevent resistance.",
                "Apply thoroughly to leaf undersides."
            ]
        }
    },
    "Tomato_Target_Spot": {
        "description": "Target spot causes concentric rings on leaves, stems, and fruit, similar to early blight.",
        "treatments": {
            "Organic Control": [
                "Use disease-free seeds.",
                "Apply copper sprays weekly.",
                "Improve field sanitation."
            ],
            "Chemical Control": [
                "Spray with mancozeb or chlorothalonil.",
                "Use systemic fungicides if severe.",
                "Rotate chemical sprays to prevent resistance."
            ]
        }
    },
    "Tomato_Tomato_mosaic_virus": {
        "description": "Tomato mosaic virus causes mottling, leaf distortion, and reduced yield.",
        "treatments": {
            "Organic Control": [
                "Remove and destroy infected plants.",
                "Disinfect tools regularly.",
                "Use resistant varieties when available."
            ],
            "Chemical Control": [
                "No direct chemical control available.",
                "Spray mineral oil to reduce virus spread.",
                "Control insect vectors (aphids, thrips)."
            ]
        }
    },
    "Tomato_Tomato_YellowLeaf_Curl_Virus": {
        "description": "This virus causes upward leaf curling, stunted growth, and reduced fruit production.",
        "treatments": {
            "Organic Control": [
                "Use yellow sticky traps to catch whiteflies.",
                "Apply neem oil for vector control.",
                "Plant resistant varieties when possible."
            ],
            "Chemical Control": [
                "Use imidacloprid or thiamethoxam against whiteflies.",
                "Spray systemic insecticides early.",
                "Rotate chemicals to avoid resistance."
            ]
        }
    },
    "Tomato_healthy": {
        "description": "The tomato plant is healthy. No disease symptoms detected.",
        "treatments": {
            "Organic Control": ["Maintain good farming practices."],
            "Chemical Control": ["No treatment required."]
        }
    },
    "PlantVillage": {
        "description": "Placeholder class used in PlantVillage dataset; not an actual disease.",
        "treatments": {
            "Organic Control": ["No treatment required."],
            "Chemical Control": ["No treatment required."]
        }
    }
}

# ==========================
# FastAPI App
# ==========================
app = FastAPI() 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# WebSocket for Recent Activity
# ==========================
clients = []


async def broadcast_activity(activity: dict):
    """Send activity to all connected clients"""
    for client in clients.copy():
        try:
            await client.send_text(json.dumps(activity))
        except:
            clients.remove(client)


@app.websocket("/ws/activities")
async def websocket_activities(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            # Keep connection alive; ignore messages from client
            try:
                await websocket.receive_text()
            except WebSocketDisconnect:
                break
    finally:
        # Safely remove websocket if it exists
        if websocket in clients:
            clients.remove(websocket)  


# ========================== 
# Crop Recommendation
# ==========================
class CropRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


@app.post("/predict-crop")
async def predict_crop(data: CropRequest):
    feature_names = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    features = pd.DataFrame([[data.N, data.P, data.K, data.temperature,
                             data.humidity, data.ph, data.rainfall]],
                            columns=feature_names)
    scaled = scaler.transform(features)
    probs = crop_model.predict_proba(scaled)[0]
    classes = metadata["classes"]
    paired = sorted(zip(classes, probs), key=lambda x: x[1], reverse=True)
    top3 = [{"name": name, "probability": round(prob * 100, 2)} for name, prob in paired[:3]]

    # Broadcast activity
    activity = {
        "id": int(time.time()),
        "type": "recommendation",
        "title": "New crop recommendations available",
        "description": f"Top crops: {', '.join([c['name'] for c in top3])}",
        "icon": "Brain",
        "time": datetime.now().isoformat(),
    } 
    await broadcast_activity(activity)

    return {"success": True, "predictions": top3}


# ==========================
# Plant Disease Detection
# ==========================
@app.post("/predict-disease")
async def predict_disease(file: UploadFile=File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        img_t = disease_transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = disease_model(img_t)
            probs = torch.nn.functional.softmax(outputs, dim=1)

        top_prob, top_idx = torch.max(probs, 1)
        confidence = float(top_prob.cpu().numpy())
        pred_class = disease_classes[top_idx.item()]

        threshold = 0.6 
        if confidence < threshold:
            pred_result = {
                "class": "No leaf/disease detected",
                "confidence": round(confidence * 100, 2),
                "description": "The model is not confident this image contains a diseased leaf.",
                "treatments": {"Organic Control": [], "Chemical Control": []}
            }
        else:
            info = disease_info.get(pred_class, {"description":"No description available.",
                                                 "treatments":{"Organic Control": [], "Chemical Control": []}})
            pred_result = {
                "class": pred_class,
                "confidence": round(confidence * 100, 2),
                "description": info["description"],
                "treatments": info["treatments"]
            }

        # Broadcast activity
        activity = {
            "id": int(time.time()),
            "type": "disease",
            "title": f"Disease scan completed: {pred_result['class']}",
            "description": f"Confidence: {pred_result['confidence']}%",
            "icon": "Shield",
            "time": datetime.now().isoformat()
        }
        await broadcast_activity(activity)

        return {"success": True, "prediction": pred_result}

    except Exception as e:
        return {"success": False, "error": str(e)}

 
# ----------------------
# Normalization helper
# ----------------------
def normalize_name(name: str) -> str:
    """
    Convert crop/state/district names to proper file names:
    - Keep first letter uppercase, rest lowercase
    - Replace spaces or non-alphanumeric with underscore
    """
    if not name:
        return ""
    # Split words by space, capitalize first letter of each word
    words = re.split(r'\s+', name.strip())
    words = [w[0].upper() + w[1:].lower() if len(w) > 1 else w.upper() for w in words]
    # Join with underscore
    file_name_part = "_".join(words)
    # Replace any remaining non-alphanumeric/underscore with underscore
    file_name_part = re.sub(r'[^A-Za-z0-9_]', '_', file_name_part)
    return file_name_part
 

# ---------------- DAILY FORECAST ----------------
@app.post("/forecast/daily")
async def get_daily_forecast(req: Request):
    data = await req.json()
    crop = normalize_name(data.get("crop"))
    state = normalize_name(data.get("state"))
    district = normalize_name(data.get("district"))
    selected_date = data.get("date")

    file_name = f"{crop}_{state}_{district}_daily_forecast.csv"
    file_path = os.path.join(FORECAST_DIR, file_name)

    if not os.path.exists(file_path):
        return JSONResponse({"success": False, "error": f"No DAILY forecast CSV found for {crop}, {state}, {district}"})

    df = pd.read_csv(file_path)
    df = df.replace([np.nan, np.inf, -np.inf], None)
    df['ds'] = pd.to_datetime(df['ds']).dt.strftime('%Y-%m-%d')

    if selected_date:
        df_date = df[df['ds'] == selected_date]
        if df_date.empty:
            return JSONResponse({"success": False, "error": "No data found for selected date"})
        row = df_date.iloc[0]
    else:
        row = df.iloc[-1]  # Latest row

    # Round values
    predicted = round(row['yhat'], 2)
    lower = round(row['yhat_lower'], 2)
    upper = round(row['yhat_upper'], 2)

    # Create activity for recent activity
    activity = {
        "id": int(time.time()),
        "type": "price",
        "title": f"Daily price prediction: {crop}",
        "description": f"Predicted: ₹{predicted}, Low: ₹{lower}, High: ₹{upper}",
        "icon": "TrendingUp",
        "time": datetime.now().isoformat()
    }
    await broadcast_activity(activity)

    # Return rounded values in API response
    return {
        "success": True,
        "date": row['ds'],
        "predicted": predicted,
        "lower_bound": lower,
        "upper_bound": upper
    }


@app.post("/forecast/weekly")
async def get_weekly_forecast(req: Request):
    data = await req.json()
    crop = normalize_name(data.get("crop"))
    state = normalize_name(data.get("state"))
    district = normalize_name(data.get("district"))
    selected_date = data.get("date")

    file_name = f"{crop}_{state}_{district}_weekly_forecast.csv"
    file_path = os.path.join(FORECAST_DIR, file_name)

    if not os.path.exists(file_path):
        return JSONResponse({"success": False, "error": f"No WEEKLY forecast CSV found for {crop}, {state}, {district}"})

    df = pd.read_csv(file_path)
    df = df.replace([np.nan, np.inf, -np.inf], None)
    df['ds'] = pd.to_datetime(df['ds']).dt.strftime('%Y-%m-%d')

    if selected_date:
        df_date = df[df['ds'] == selected_date]
        if df_date.empty:
            return JSONResponse({"success": False, "error": "No data found for selected date"})
        row = df_date.iloc[0]
    else:
        row = df.iloc[-1]  # Latest row

    # Round values
    predicted = round(row['yhat'], 2)
    lower = round(row['yhat_lower'], 2)
    upper = round(row['yhat_upper'], 2)

    # Create activity for recent activity
    activity = {
        "id": int(time.time()),
        "type": "price",
        "title": f"Weekly price prediction: {crop}",
        "description": f"Predicted: ₹{predicted}, Low: ₹{lower}, High: ₹{upper}",
        "icon": "TrendingUp",
        "time": datetime.now().isoformat()
    }
    await broadcast_activity(activity)

    # Return rounded values in API response too
    return {
        "success": True,
        "date": row['ds'],
        "predicted": predicted,
        "lower_bound": lower,
        "upper_bound": upper
    }


# ---------------- INTERACTIVE PLOT ----------------
app.mount("/plots", StaticFiles(directory=PLOT_DIR), name="plots")


@app.post("/plot")
async def get_plot(req: Request):
    data = await req.json()
    crop = data.get("crop")
    state = data.get("state")
    district = data.get("district")

    file_name = f"{crop}_{state}_{district}.html".replace(" ", "_")
    file_path = os.path.join(PLOT_DIR, file_name)

    if not os.path.exists(file_path):
        return JSONResponse({"success": False, "error": f"No plot found for {crop}, {state}, {district}"})

    # Return both HTML content (for embedding) and URL (for new tab)
    with open(file_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    plot_url = f"http://127.0.0.1:8000/plots/{file_name}"

    return {
        "success": True,
        "html": html_content,
        "url": plot_url
    }


@app.get("/plots/{file_name}")
async def serve_plot(file_name: str):
    file_path = os.path.join(PLOT_DIR, file_name)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="text/html")
    return JSONResponse({"success": False, "error": "Plot not found"})
