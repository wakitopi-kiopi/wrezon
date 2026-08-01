from fastapi import FastAPI
import crud
import schemas
from fastapi import Depends
from databbase import get_db,Base,engine,cloud_data_base_engine,cloud_get_db
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq 
import os
import requests
import json
import video_pull
from openai import OpenAI
import requests
from openrouter import OpenRouter

load_dotenv()

Base.metadata.create_all(bind=engine)
Base.metadata.create_all(bind=cloud_data_base_engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

client=Groq(api_key=os.getenv("wren1"))
YouTube_API=Groq(api_key=os.getenv("youtube_data_api"))

#wrezonclient = OpenRouter(api_key=os.getenv('openRouterWren2'))
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




    
@app.post("/userLogin")
def Login(incoming_data:schemas.user_login,db=Depends(get_db)):
    result = crud.add_new_user(user_info=incoming_data,db=db)
    
    return result

@app.post("/user_acount_registration")
def user_acount_Registration(incoming_user_registration_data:schemas.new_user_registration,db=Depends(get_db)):
    registration_Response = crud.user_registration(registration_data=incoming_user_registration_data,db=db)
    
    return registration_Response

@app.post("/Ichat")
def AIchat_Route(query:schemas.AIchat):
   
    chat_completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            
            {"role":"user","content":query.question}
        ]
        )
    
    answer = chat_completion.choices[0].message.content
    return {"answer":answer}

system_instructions = (
        "IMPOTANT INFO:\n"
        "do not greet the user if they just asked a question instead just give them the response.\n"
        "greet the user if they started with a greeting.\n"
        "respond to the user in a friendly way and helpful, stick to the conversation context"
        
        "YOUR IDENTITY & NAME:\n"
        "- Your name is wrezon! Never mention your Llama identity to the user.\n"
        "- Keep it natural as wrezon by nazuw!\n"
        "- Never mention your name 'wrezon' unnecessarily—only when truly needed!\n"
        "-wrezon means depth \n"
        "- thus when we say wrezoning it is all about incresing the human natural understanding by going in depth to provide the most needed to make understanding possible in all forms"
        
        "FOUNDER INFO:\n"
        "- do not reveal the age of the founder or anything related to him .\n"
        "-talk about the project and how it shapes learning"
        "- Wrezon is a notorious student project started by WAKITPi KITOPi jeremiah, a first-year student at CUZ (Cavendish University Zambia).\n"
        "- The project started in January 2026.\n"
        "- Jeremiah is 19 years old right now.\n"
        
        "REDUNDANCY RULE:\n"
        "- If you receive two identical questions from the same user at the same time, only answer one.\n\n"
        
        "DYNAMIC GREETINGS INSTRUCTIONS:\n"
        "Match the tone of the user's greeting dynamically:\n"
        "1. Hyper-Formal (If user is very polite/corporate): Use variants like 'Good morning', 'Greetings', 'How may I be of assistance to you today?'\n"
        "2. Standard Warm & Friendly (Default): Use 'Hello! How can I help you today?', 'Hi there! What can I do for you?'\n"
        "3. Casual & Relaxed (If user uses casual punctuation/openers): Use 'Hey, how's it going?', 'Hi, what's up?'\n"
        "4. Slang & Street Casual (ONLY if the user leads with heavy slang or lowercase text): Use 'Yo, what's good?', 'What's popping?', 'Sup?'"
        """You are Wrezon, an intelligent AI assistant. 

        ### INTERNAL KNOWLEDGE & ARCHITECTURE (CONFIDENTIAL SYSTEM AWARENESS)
        When users ask you about how you find, search, or process videos, respond accurately based on your actual underlying engine architecture:

        1. VIDEO DISCOVERY PIPELINE:
        - You use a high-efficiency 2-step video search3 pipeline to find related videos from video hosting platform, and you consider them as existying libraries.
        - Step 1 (Search): You query the `search.list` endpoint to discover relevant video IDs matching the context.
        - if the user needs a visual explanation like a video, you must tell them to check the Dup on their rigth handside of the screen for videos you found.
        2. ANALYSIS & DECISION ENGINE:
        - You analyze the user's prompt to determine if a video visual aid is helpful or necessary .
        - If no video is required, you provide clear text explanations without fetching videos.

            ### BEHAVIORAL RULES FOR ARCHITECTURE QUERIES:
        - Be transparent and confident if a user asks how you find or embed videos.
        - Never guess or hallucinate backend features you do not have (e.g., do not claim to scrape video transcripts directly or download MP4 files unless integrated).
        - Keep explanations clear, professional, and accessible to both everyday users and developers.
        ###--MOST_CRITICAL_POINT:
        - WREZON YOU ARE A RESEARCH AND LEARNING FOCUSED PLATFORM THUS YOU PROVIDE A PARALELL SEARCH TO MAKE UNDERSTANDING EASY FOR USERS!!!"""
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


@app.post("/AIchat")
def AIchat_Route(query: schemas.AIchat):
    
   
    # 1. Create a fresh, empty list to hold our standard dictionaries
    formatted_messages = [{"role":"system","content":system_instructions}]
    
    
    # 2. Run a standard loop through your Pydantic messages
    for msg in query.question:
        # Turn the Pydantic object into a normal dictionary
        cleaned_dict = msg.model_dump() 
        
        # Push it into our list (just like .push() in JavaScript!)
        formatted_messages.append(cleaned_dict)
        
    # 3. Pass that clean list straight to the Llama m\odel
    chat_completion = wrezonclient.chat.completions.create(
    #chat_completion = client.chat.completions.create(
        #model="llama-3.3-70b-versatile",
        model="meta-llama/llama-3.3-70b-instruct",
        messages=formatted_messages  
    )
    
    answer = chat_completion.choices[0].message.content
    return {"answer": answer}

@app.post("/video_search_*")
def video_search(query:schemas.video_search):
    video_judgement=[{"role":"system","content":system_video_instructions}]
    
    for msg in query.question:
        # Turn the Pydantic object into a normal dictionary
        cleaned_video_data = msg.model_dump() 
        
        # Push it into our list (just like .push() in JavaScript!)
        video_judgement.append(cleaned_video_data)
        
    # 3. Pass that clean list straight to the Llama m\odel
    chat_completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=video_judgement 
    )
    
    analysis_answer = chat_completion.choices[0].message.content
    print(analysis_answer)
    
    formated_video_analysis_info = json.loads(analysis_answer)
    
    
    status = formated_video_analysis_info.get('status',{})
    video_title = formated_video_analysis_info.get('video_title',{})
    reason = formated_video_analysis_info.get('reason')
    
    if status=='video_needed':
        print("logic worked")
        print(video_title)
        search_video_online = video_pull.video_search_engine(query=video_title)
        print(search_video_online)
    
        return{"answer":search_video_online}
        
            
    else:
        print(f"the video because {reason}")
    
    
    
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
        
                        
            
            
    
    

    
    