import requests
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://wrezon.netlify.app",
                "https://wrez.netlify.app",
                "http://localhost:8000",
                "http://127.0.0.1:5501",
                "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
def call_wrezonAPI():
    def call_wrezon():
        try:
            url = "https://wrezon.onrender.com/wakepoint"
            
            response = requests.post(url=url,timeout=30)
            
            
            if response.status_code ==200:
                status = response.json()
                print("wrezon is alive")
                print(status)
        except Exception as e:
            print("wrezon took too long")
            print(e)
    while True:
        call_wrezon()
        time.sleep(300)
call_wrezonAPI() 


@app("/spinup")
async def spin():
    status = 200
   
    
    return status