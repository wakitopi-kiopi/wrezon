from groq import AsyncGroq
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
# --- Google GenAI SDK ---
from google.genai.errors import APIError as GoogleError
# --- Groq SDK ---
from groq import APIError as GroqAPIError 
# --- Anthropic SDK ---
from openai import APIError as OpenaiAPIError
import asyncio


load_dotenv()
system_instructions = (
        "IMPOTANT INFO:\n"
        "do not greet the user if they just asked a question instead just give them the response.\n"
        "greet the user if they started with a greeting.\n"
        "respond to the user in a friendly way and helpful, stick to the conversation context"
        
        "YOUR IDENTITY & NAME:\n"
        "- Your name is wrezon! Never mention your Llama identity to the user.\n"
        "- Keep it natural as wrezon by nezuw!\n"
        "- Never mention your name 'wrezon' unnecessarily—only when truly needed!\n\n"
        
        "FOUNDER INFO:\n"
        "- Only talk about the founder where explicitly asked.\n"
        "- Wrezon is a notorious student project started by WAKITPi KITOPI jeremiah, a first-year student at CUZ (Cavendish University Zambia).\n"
        "- The project started in January 2026.\n"
        "- Jeremiah is 19 years old right now.\n\n"
        
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
FAILOVER_ERROR_KIT=(GoogleError,
           GroqAPIError,
           OpenaiAPIError)

async def call_groq(query):
    client =  AsyncGroq(api_key=os.getenv("API_key1"))
    
    formatted_messages = [{"role":"system","content":system_instructions}]
    
    
    # 2. Run a standard loop through your Pydantic messages
    for msg in query.question:
        # Turn the Pydantic object into a normal dictionary
        cleaned_dict = msg.model_dump() 
        
        # Push it into our list (just like .push() in JavaScript!)
        formatted_messages.append(cleaned_dict)
        
    # 3. Pass that clean list straight to the Llama m\odel
    chat_completion = await client.chat.completions.create(
    
        model="llama-3.3-70b-versatile",
    
        messages=formatted_messages  
    )
    
    answer = chat_completion.choices[0].message.content
    return  answer

async def call_openRouter(query):
    
    client =   AsyncOpenAI(base_url="https://openrouter.ai/api/v1",
                    api_key=os.getenv("openRouterWren2"),
                    
                    default_headers={
                        'Content-Type':"application/json",
                        'HTTP-Referer':"https://wrezon.onrender.com",
                        'X-Title':'wrezon ai'
                    })
    
    formatted_messages = [{"role":"system","content":system_instructions}]
    # 2. Run a standard loop through your Pydantic messages
    for msg in query.question:
        # Turn the Pydantic object into a normal dictionary
        cleaned_dict = msg.model_dump() 
        
        # Push it into our list (just like .push() in JavaScript!)
        formatted_messages.append(cleaned_dict)
        
    # 3. Pass that clean list straight to the Llama m\odel
    chat_completion = await client.chat.completions.create(
        model="meta-llama/llama-3.3-70b-instruct",
        messages=formatted_messages  
    )
    
    answer = chat_completion.choices[0].message.content
    return  answer

async def call_google(query):
    client =  genai.Client()
    formatted_messages = []
    # 2. Run a standard loop through your Pydantic messages
    for msg in query.question:
        # Turn the Pydantic object into a normal dictionary
        cleaned_dict = msg.model_dump()
        
        role = cleaned_dict.get("role","")
        content = cleaned_dict.get("content","")
        if role=="assistant" or role=="system":
            role ="model" 
        
        
        # Push it into our list (just like .push() in JavaScript!)
        formatted_messages.append({"role":role,"parts":[{"text":content}]})
    response =  client.models.generate_content(model="gemini-3.6-flash",
                                            contents= formatted_messages,
                                            config=types.GenerateContentConfig(system_instruction=system_instructions))

    answer = response.text
    print(answer)
    return answer
   
async def router_line1(query):
    models=[call_google,call_groq,call_openRouter]
    
    for model in models:
        try:
            response = await model(query)
            print(model.__name__)
            return response
        except FAILOVER_ERROR_KIT as e:
            print("an error just happened")
            print(e)
            print("error log finishes")
            continue
    raise RuntimeError("all models failed ")

#load_dotenv()
#print("Gemini Key Check:", os.getenv("GEMINI_API_KEY")[:6] if os.getenv("GEMINI_API_KEY") else "NOT FOUND")


    
async def load_model(query):
    response = await router_line1(query)
    print(response)
    return response
    
    
if __name__=="__main__":
    asyncio.run(load_model())
          