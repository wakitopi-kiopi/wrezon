from fastapi import FastAPI,Response
from fastapi.responses import JSONResponse
import schemas
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import json
import requests
from urllib.parse import quote
import audion
load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://wrezon.netlify.app",
                "https://wrezon.com",
                "https://wrez.netlify.app",
                "https://www.wrezon.com",
                "http://localhost:8000",
                "http://127.0.0.1:5501",
                "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post('/livechat')
def livechat(query: schemas.liveaudio):
    livetranscribe = audion.process_text_to_wav(text=query.text_to_transcribe, pitch_factor=query.pitch)
    #print("livechat",livetranscribe)
    return Response(
        content=livetranscribe, 
        media_type="audio/wav"
    )
    
                       
@app.post("/health")
def awake():
    status = "200 OK"
    return status
    