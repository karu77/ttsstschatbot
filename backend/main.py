from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyClxF-mDE_liUvEBrkc7hAUDrK_xR5h2ew")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_text = data.get("text")
    response = requests.post(
        GEMINI_API_URL,
        params={"key": GEMINI_API_KEY},
        json={"contents": [{"parts": [{"text": user_text}]}]}
    )
    print(response.status_code, response.text)
    try:
        gemini_reply = response.json()["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        gemini_reply = "Sorry, I couldn't get a response from Gemini."
    return {"reply": gemini_reply} 