from fastapi import FastAPI
import crud
import schemas
from fastapi import Depends
from databbase import get_db,Base,engine,cloud_data_base_engine,cloud_get_db
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq 
import os
import json
import video_pull
from openai import OpenAI
import requests
from openrouter import OpenRouter
import AI_dependables
import time


load_dotenv()

Base.metadata.create_all(bind=engine)
Base.metadata.create_all(bind=cloud_data_base_engine)

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

system_video_instructions = ("your role is to analyse the user conversation and \n"
                             "you must generate a search title based on the conversation and iject it in the responce body. makr sure that the title is short and consise to garantee smooth search"
                             "CRITICAL: Do not include ANY introductory text, concluding text, or markdown blocks (do not use ```json). Your entire response must start with '{' and end with '}'. If you include any normal conversational text, the application will crash."
                             "analyse the user input, if the conversation needs a video then the response must look like as given bellow"
                             """{
                                    "status": "video_needed" or "no_video_needed",
                                    "video_title": "A highly optimized search query string if video_needed, otherwise null",
                                    "reason": "A brief explanation of why you made this choice"
                                }"""
                             
                             "do not explain or add anything \n"
                             "CRITICAL!:ONLY FOLLOW THE FORMAT NO EXTRA THINGS!!! \n"
                             "the reason must at all time be less than 20 words eg, user deserves a visual explanation or no visual exanation need period, no extra stuffs \n"
                             "videos must only be garanteed when the converstion explicitly needs a video either the user is asking multiple questions on the same topic or there is nee for them to see the thing in action"
                             )
client=Groq(api_key=os.getenv("wren1"))
YouTube_API=Groq(api_key=os.getenv("youtube_data_api"))

wrezonclient = OpenRouter(api_key=os.getenv('openRouterWren2'))
wrezonclient= OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("openRouterWren2"),
    #Optional headers for OpenRouter analytics/rankings:
    default_headers={
    # HERE IS WHERE BEARER GOES:
        
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5501", # Your app URL
        "X-Title": "Wrezon AI"
    }
)


@app.post("/video_search")
def start_search_with_db(query:schemas.video_search,db=Depends(cloud_get_db)):
    video_judgement=[{"role":"system","content":system_video_instructions}]
    
    for msg in query.question:
        # Turn the Pydantic object into a normal dictionary
        cleaned_video_data = msg.model_dump() 
        
        # Push it into our list (just like .push() in JavaScript!)
        video_judgement.append(cleaned_video_data)
        
    # 3. Pass that clean list straight to the Llama m\odel
    #chat_completion = wrezonclient.chat.completions.create(
    chat_completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        #model="meta-llama/llama-3.3-70b-instruct",
        messages=video_judgement 
    )
    
    analysis_answer = chat_completion.choices[0].message.content
    print(analysis_answer)
    
    formated_video_analysis_info = json.loads(analysis_answer)
    
    
    status = formated_video_analysis_info.get('status',{})
    generated_video_title = formated_video_analysis_info.get('video_title','')
    reason = formated_video_analysis_info.get('reason')
    
    if status=='video_needed':
        print("logic worked")
        print(generated_video_title)
        search_video_from_db = crud.tutorial_cache_check_up(data=generated_video_title,db=db)
        print("db search initialized")
        if search_video_from_db:
            print("some data found")
            print(search_video_from_db)
            return {"answer":search_video_from_db}
            
        search_video_online = video_pull.video_search_engine(query=generated_video_title)
        print(search_video_online)
        
        add_and_retrieve_from_db = crud.add_and_retrieve(incoming_online_data= search_video_online,db=db)
        
        return {"answer":add_and_retrieve_from_db}
        
                        
@app.post("/provider_router")
async def models(query:schemas.AIchat):
    response = await AI_dependables.router_line1(query=query)        
            
    return {"answer":response}
    
    
@app.post("/wakepoint")
def awake():
    
    time.sleep(2)
    def call_wrezon():
        try:
            url = "https://wrezon-pinger.onrender.com/spinup"
            
            response = requests.post(url=url,timeout=30)
            
            
            if response.status_code ==200:
                status = response.json()
                pinger_status = "alive"
                print("wrezon is alive")
                print(status)
                return {'status':pinger_status}
        except Exception as e:
            print("wrezon took too long")
            print(e)
    
    call_wrezon()
    
    
        
       
    


   
    