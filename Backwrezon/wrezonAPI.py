from fastapi import FastAPI,Response
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
import wrescrap
import pixaWrezon

from langdetect import detect
#mport audion





load_dotenv()

Base.metadata.create_all(bind=engine)
Base.metadata.create_all(bind=cloud_data_base_engine)

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

system_video_instructions = ("your role is to analyse the user conversation and \n"
                             "you must generate a search title based on the conversation and iject it in the responce body. makr sure that the title is short and consise to garantee smooth search"
                             "CRITICAL: Do not include ANY introductory text, concluding text, or markdown blocks (do not use ```json). Your entire response must start with '{' and end with '}'. If you include any normal conversational text, the application will crash."
                             "analyse the user input, if the conversation needs a video then the response must look like as given bellow"
                             """{
                                    "status": "video_needed" or "no_video_needed",
                                    "video_title": "A highly optimized search query string if video_needed, otherwise null",
                                    "reason": "A brief explanation of why you made this choice",
                                    "image_status":"image_needed" or "no_image_needed",
                                    "image_title": "A highly optimized single keyword if image_needed, otherwise null",

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

@app.post("/provider_router")
async def models(query:schemas.AIchat):
    
    user_message = query.question[-1].content  #["content"]✖️#
    try:
        detected_lang = detect(user_message)
    except:
        detected_lang = "en"
        
    lang_map = {
        "en": "en-US",
        "sw": "sw-TZ",
        "fr": "fr-FR",
        "es": "es-ES",
        "ar": "ar-SA"
        
    }
    tts_lang_code = lang_map.get(detected_lang, "en-US")
    
    
    analysis_answer = await AI_dependables.router_line4(query=query)
    #print(analysis_answer)
    
    formated_video_analysis_info = json.loads(analysis_answer)
    #print(formated_video_analysis_info)
    
    
    
   
    
    
    status = formated_video_analysis_info.get('status',{})
    field = formated_video_analysis_info.get('field',{})
    title = formated_video_analysis_info.get('search_title','')
    
   
    
    if status == "scrapping_needed":
        #print("running scrap")
        messages = query.question
        async def scrapMidiate(query, scrap):
            srcap_content = schemas.message(role="system",
                                        content=f"""
                                        Be aware of the following scraped information.
                                        Use it as additional context when answering the user's question.

                                        SCRAPED INFORMATION:
                                        {scrap}
                                    """)
            messages.append(srcap_content)
                
            query = schemas.AIchat(question=messages)
                
            response = await AI_dependables.router_line1(query=query)        
            
            return {"answer":response,
                    "lang":tts_lang_code}
        
        if field == "education":
            scrap = await wrescrap.education(query=title)
            return await scrapMidiate(query,scrap)
            
            
        elif field == "agric":
            scrap = await wrescrap.agric(query=title)
            #print("running agric")
            #query = query.question[-1].content+scrap
            return await scrapMidiate(query,scrap)
        elif field == "space":
            scrap = await wrescrap.space(query=title)
            #print("running space")
            #query = query.question[-1].content+scrap
            return await scrapMidiate(query,scrap)
            
        elif field == "tech":
            scrap = await wrescrap.tech(query=title)
            #print("running tech")
            #query = query.question[-1].content+scrap
            return await scrapMidiate(query,scrap)
        elif field == "news":
            scrap = await wrescrap.news(query=title)
            #print("running news")
            #query = query.question[-1].content+scrap
            return await scrapMidiate(query,scrap)
        elif field == "law":
            scrap = await wrescrap.law(query=title)
            #print("running news")
            #query = query.question[-1].content+scrap
            return await scrapMidiate(query,scrap)
        elif field == "mechanics":
            scrap = await wrescrap.mechanics(query=title)
            #print("running news")
            #query = query.question[-1].content+scrap
            return await scrapMidiate(query,scrap)
        elif field == "medicine":
            scrap = await wrescrap.medicine(query=title)
            #print("running news")
            #query = query.question[-1].content+scrap
            return await scrapMidiate(query,scrap)
        elif field == "engineering":
            scrap = await wrescrap.engineering(query=title)
            #print("running news")
            #query = query.question[-1].content+scrap
            return await scrapMidiate(query,scrap)
        
        elif field == "business":
            scrap = await wrescrap.business(query=title)
            #print("running news")
            #query = query.question[-1].content+scrap
            return await scrapMidiate(query,scrap)
        elif field == "art":
            scrap = await wrescrap.art(query=title)
            #print("running news")
            #query = query.question[-1].content+scrap
            return await scrapMidiate(query,scrap)
        elif field == "currency_exchange":
            scrap = await wrescrap.global_live_currencies()
            return await scrapMidiate(query,scrap)
        
        elif field == "document_generation":
            
            data_to_pdf = await scrapMidiate(query,scrap)
            pdf_bytes = await wrescrap.PDF_generator(data_to_pdf)
            # Return to client in new Response
            return Response(
                content=pdf_bytes,
                media_type="application/pdf",
                headers={"Content-Disposition": "attachment; filename=document.pdf"}
            )
                    
        
    else:
        response = await AI_dependables.router_line1(query=query) 
        #print("outing")       
                
        return {"answer":response,
                "lang":tts_lang_code}
        
@app.post("/live_chat_provider_router")
async def models(query:schemas.AIchat):
    
    user_message = query.question[-1].content  #["content"]✖️#
    try:
        detected_lang = detect(user_message)
    except:
        detected_lang = "en"
        
    lang_map = {
        "en": "en-US",
        "sw": "sw-TZ",
        "fr": "fr-FR",
        "es": "es-ES",
        "ar": "ar-SA"
        
    }
    tts_lang_code = lang_map.get(detected_lang, "en-US")
    response = await AI_dependables.router_line3(query=query)        
            
    return {"answer":response,
            "lang":tts_lang_code}


@app.post("/video_search")
async  def start_search_with_db(query:schemas.video_search,db=Depends(cloud_get_db)):
   
    
    analysis_answer = await AI_dependables.router_line2(query=query)
    #print(analysis_answer)
    
    formated_video_analysis_info = json.loads(analysis_answer)
    #print(formated_video_analysis_info)
    
    
    status = formated_video_analysis_info.get('status',{})
    generated_video_title = formated_video_analysis_info.get('video_title','')
    reason = formated_video_analysis_info.get('reason')
    image_status = formated_video_analysis_info.get("image_status",{})
    image_title = formated_video_analysis_info.get('image_title','')
    image_urls = []
    search_video_from_db = []
    add_and_retrieve_from_db = []
    #print(image_status)
    #print(status)
    if image_status == "image_needed":
        #print("imagetitle",image_title)
        image_urls = pixaWrezon.picImage(query=image_title)
        
    
    
    if status=='video_needed':
       # print("logic worked")
        #print(generated_video_title)
        search_video_from_db = crud.semantic_data_retriaval(data=generated_video_title,db=db)
        #print("db search initialized")
        if search_video_from_db:
            #print("some data found")
            #(search_video_from_db)
            return {"answer":search_video_from_db,
                    "image_urls": image_urls}
            
        search_video_online = video_pull.video_search_engine(query=generated_video_title)
        #print(search_video_online)
        
        add_and_retrieve_from_db = crud.add_and_retrieve(incoming_online_data= search_video_online,db=db)
        
        return {"answer":add_and_retrieve_from_db,
                "image_urls": image_urls}
        
        
    return {"answer":add_and_retrieve_from_db,
            "image_urls": image_urls}
    
    
        
                        
@app.post("/health")
def awake():
    status = "200 OK"
    return status
    


    
        
       
    


   
    