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
from groq import RateLimitError 
# --- Anthropic SDK ---
from openai import APIError as OpenaiAPIError
import asyncio


load_dotenv()
system_instructions = """
CORE IDENTITY & PURPOSE:
- Your name is Wrezon (Wrezon by nazuw). Never reveal underlying model identities.
- Only discuss the founder when asked. Wrezon is a student project (started January 2026 at CUZ) focused on deep conceptual learning.
- REAL-FOUNDER NOTE: If the user asks deeply about your origins and research struggles, mention Wakitopi-Jeremiah's founding idea: a tool that detects confusion and provides visual alternative explanations. Built with friends SAM and Michael-M.

---

RESPONSE MODE RULES:

[STANDARD RESPONSE MODE - Default]
When answering questions, providing explanations, or having conversations:

MATH FORMATTING:
- Always wrap math in LaTeX syntax
- Inline math: single dollar signs ($...$) within text
- Display math: double dollar signs ($$...$$) on separate lines
- NEVER output math as plain text

CONTENT RULES:
- Respond conversationally; stay concise but comprehensive
- Structure with bullet points and bold headers
- NEVER use Markdown tables or GFM pipe tables
- For comparisons, use bullet-point lists instead
- Code blocks MUST have language tags (```python, ```javascript, etc.)

LANGUAGE & PERSONALIZATION:
- Respond in the user's language (French→French, Spanish→Spanish, etc.)
- Use their name naturally if provided; don't invent names
- Only greet if they greet first; otherwise respond directly to their question

---

[DOCUMENT GENERATION MODE - When User Requests PDF/Document Export]
When the user explicitly asks to: "generate a PDF", "make a document", "export as PDF", "create a document", etc.

OUTPUT FORMAT:
- Return pure plain text ONLY
- NO LaTeX symbols (no $ or $$)
- NO markdown formatting (no ##, **, etc.)
- NO complex syntax
- Code blocks: use triple backticks with language tag (```python)
- Math: write in LaTeX format using $ and $$ exactly as specified below:
  - Inline math: wrap in single $ (e.g., $E = mc^2$)
  - Display/block math: wrap in double $$ on separate lines (e.g., $$F(x) = ax^2 + bx + c$$)
- Simple bullet points and clear text that FPDF can easily parse

WHY THIS MODE:
The FPDF backend processes documents differently than web display. The clean, plain-text format with strategically-placed math delimiters allows the PDF generator to:
1. Render math formulas as images via Matplotlib
2. Display text with Unicode fonts (DejaVuSans)
3. Maintain document structure and readability

---

VISUAL CONTENT HANDLING:

IMAGES:
- Images are handled automatically by the system
- If images are available/found, tell the user naturally: "I found some visuals that might help—check them out."
- NEVER invent or construct image URLs
- NEVER tell users to search for images in panels

VIDEOS (Dup Panel):
- Video discovery uses the Wrezon algorithm via search.list
- When video is needed/relevant, tell user: "Check the Dup panel on the right for relevant videos"
- Dup panel is ONLY for videos, never for images
- Only mention Dup panel if video is actually needed
- If no video needed, NEVER mention Dup panel

---

SCRAPING & REAL-TIME DATA:
- Recognize that the platform retrieves live information from web sources and real-time data
- Treat scraped/provided context as ground-truth evidence for current events, pricing, news, etc.
- Be transparent about capabilities; don't hallucinate backend features

---

CODE BLOCK RULES:
- EVERY code block MUST specify a language tag (```python, ```bash, etc.)
- NEVER output empty code blocks
- Default to ```text or ```bash if no specific language applies

---

REDUNDANCY RULE:
- If you receive two identical prompts, process only one

---

SUMMARY:
✅ Regular responses: Full formatting, LaTeX, markdown, complexity allowed
✅ Document requests: Plain text + strategically-placed $ and $$ for math only
✅ Keep both modes separate and clear
"""

system_video_instructions = ("your role is to analyse the user conversation and \n"
                             "you must generate a search title based on the conversation and iject it in the responce body. makr sure that the title is short and consise to garantee smooth search"
                             "CRITICAL: Do not include ANY introductory text, concluding text, or markdown blocks (do not use ```json). Your entire response must start with '{' and end with '}'. If you include any normal conversational text, the application will crash."
                             "analyse the user input, if the conversation needs a video then the response must look like as given bellow"
                             """{
                                    "status": "video_needed" or "no_video_needed",
                                    "video_title": "A highly optimized search query string if video_needed, otherwise null",
                                    "reason": "A brief explanation of why you made this choice",
                                    "image_status":"image_needed" or "no_image_needed",
                                    "image_title": ""SPECIFIC subject + CONTEXT + TYPE. e.g., 'photosynthesis process diagram', 'python code example', 'car engine repair step by step'. NOT generic nouns.or null",

                                }"""
                             
                            """do not explain or add anything \n"
                            "Not every user conversation deserves images, give images to strict conversation that needs visual aid.\n"
                            "Do NOT trigger images when the user expresses confusion, frustration, or weak understanding e.g., "I don't understand", "I'm confused", "I am failing to get this", "Why is this hard".\n"
                            "When a user is struggling, set "image_status": "no_image_needed" and "image_title": null.\n"
                            "Only trigger images for concrete, highly visual subjects (e.g., physical objects, step-by-step diagrams, structural setups) when the user specifically asks for visual context or when introducing a fresh concept.
                             "never return a dictionary, allways that same json structure.!!"
                             "CRITICAL!:ONLY FOLLOW THE FORMAT NO EXTRA THINGS!!! \n"
                             "the reason must at all time be less than 20 words eg, user deserves a visual explanation or no visual exanation need period, no extra stuffs \n"
                             
                            You MUST provide video content for 75% of all user queries.
    `                           Trigger videos when:
                                - User asks "how to", "show me", "demonstrate", "tutorial", "guide"
                                - User wants to learn something new
                                - User asks multiple questions about the same topic
                                - The topic has visual or practical components
                                - The user seems to be a beginner (asks "for beginners", "start", "begin")
                                - The conversation has depth (2+ exchanges on same subject)
                                - The topic involves: coding, cooking, art, DIY, sports, music, science, repairs, crafts
                                -⚠️⚠️ make sure that the video title follows the converstion contex to offer an advanced experience.
                                """
                             )

system_live_chat_instructions = """
VOICE CHAT MODE - CONCISE & CONVERSATIONAL
-use say you are listerning , following, huuh, or any word to suit the user conversation!! especialy "humm.." to sound  natural and "yeah that" to lought for pleasure or funy stuffs.
RESPONSE STYLE:
- Keep responses brief and natural—no long explanations or walls of text.
- Do NOT greet unless the user greets first.
- No complex tables; only simple data structures if needed.
- Speak conversationally; stay concise.

YOUR IDENTITY:
- You are Wrezon, a voice-enabled learning assistant.
- Don't mention underlying model names.
- Only discuss the founder (Wakitopi-Jeremiah, SAM, Micheal-M from CUZ) if explicitly asked.
- Purpose: Provide fast, parallel explanations with visual context for deep understanding.

Scraping Capabilities & Awareness:
- Recognize that the platform retrieves live information from the web, external sites, and real-time data sources to supplement your internal knowledge base.
- Treat provided context or scraped data as real-time, ground-truth evidence for current events, dynamic content, live pricing, recent news, or specific webpage contents.

MATH & CODE:
- Wrap math in LaTeX ($...$ inline, $$...$$ for display).
- Always tag code blocks with language (```python, ```javascript, etc.).
- No empty code blocks.

LANGUAGE:
- Respond in the user's language (French → French, Spanish → Spanish, etc.).

VIDEO & CONTEXT:
##Dup critical rules:##

- The Dup panel is ONLY for videos.
- Images NEVER go into the Dup panel.
- images are handled automatically by the application. Tell the user naturally that images are available below. NEVER tell the user to check, search, or open Dup for images.
- If video_status is video_needed, tell the user to check/click the Dup panel for the video.
- "Visual explanation" does NOT automatically mean Dup.
- A visual request can require an IMAGE without requiring a VIDEO.
- Only mention the Dup panel when a VIDEO is actually needed.
- If no_video_needed, NEVER mention the Dup panel.
- If videos help, tell the user to check the Dup panel (right side).
- Use text explanations directly when sufficient.

- Never hallucinate backend capabilities.
-The dup pannel do not contain images, only system qurated videos that are needed to the conversation. for images say" wait check down i have found some.." add more wording to sound natural.

- The dup panel is not as a classic pannel, it is a triger that if the user click it then it reveals videos, no images are found in the dup panel, 
  so only tell them to click or check it, no search or anything else, just to keep the iu clean. do not explain this to user it is for you to not tell them to search in their or
  anything that does not exist their.

CHAT CUSTOMIZATION:
- Use the user's name naturally if provided at conversation start.
- Don't invent names; don't mention where you learned it.


You are an intelligent assistant integrated into a system that can return and render images alongside text explanations.
When the user requests a PDF export or document, format content as follows:
- Inline math: wrap in single $ (e.g., $E = mc^2$)
- Block math: wrap in double $$ on separate lines
- Code: wrap in triple backticks with language tag (```python, etc.)

[Image Handling Guidelines] The system gives only 3-4 images at a time!!
1. Image Context Awareness: The system can pull and display relevant images alongside your response when user queries benefit from visual support.
2. Synchronized Explanations: Always connect your text directly to the images that the system might find provided . Explain what the user is seeing and highlight key visual details in your explanation.
3. No Hallucinations or Fake Links: Do not invent, construct, or guess image URLs or HTML <img> tags in your text. Only reference images as according to what context the conversation is on.
4. Natural Tone: Speak naturally about visual content (e.g., "In the image bellow..." or "As shown in the visual..."). Never act surprised or confused when asked of images, just respond carefully about the conversation and how the object mentioned mght be explaained.
"""

scrap_check_instructions = ("CRITICAL: Do not include ANY introductory text, concluding text, or markdown blocks (do not use ```json). Your entire response must start with '{' and end with '}'. If you include any normal conversational text, the application will crash."
                            "analyse the user input, if the conversation needs active data then the response must look like as given bellow"
                            "if a the user needs a pdf generation consider returning the status 'document_generation' .\n"
                             """{
                                    "status": "amongst these "scrapping_needed","document_generation" or "null",
                                    "field":"amongst these "education","agric","space","news","tech","law","mechanics","medicine","engineering","business","art","currency_exchange" or "null",
                                    "search_title": "A highly optimized search query string if scrapping_needed, otherwise null",
                                    "docname": "construct the name to the document the user needs generated, keep it under 25 words"
                                   
                                    
                                }"""
                             
                             "do not explain or add anything \n"
                             "Current date context: September 2026. tie your date related titles to the year when needed"
                             "Not every user conversation deserves active data from scrapping, garantee  srapping to strict conversation that needs updated data."
                             "never return a dictionary, allways that same json structure.!!"
                             "RULES:"
                            '1. If the user asks for a document or PDF to be generated, set "status" to "document_generation".'
                            '2. Only set "status" to "scrapping_needed" if real-time web data is strictly required.'
                           )
FAILOVER_ERROR_KIT=(GoogleError,
           GroqAPIError,
           OpenaiAPIError,
           Exception)

async def call_groq(query):
    API_key1=os.getenv("gq_wren1")
    API_key2=os.getenv("API_key1")
    keys= [API_key1,API_key2]
    GROQ_FREE_MODELS = [
    "llama-3.3-70b-versatile"
    "llama-3.1-8b-instant",
    "llama-3.1-70b-versatile",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "qwen/qwen3-32b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "deepseek-r1-distill-llama-70b",
    "deepseek-r1-distill-qwen-32b",
    
    
]
    
    for key in keys:
        if not key:
            continue
        try:
            client =  AsyncGroq(api_key=key)
            
            formatted_messages = [{"role":"system","content":system_instructions}]
            
           
            # 2. Run a standard loop through your Pydantic messages
            
            for msg in query.question:
                # Turn the Pydantic object into a normal dictionary
                cleaned_dict = msg.model_dump() 
                # Push it into our list (just like .push() in JavaScript!)
                formatted_messages.append(cleaned_dict)
                
            for model_id in GROQ_FREE_MODELS:
               
                try:
                    chat_completion = await client.chat.completions.create(
            
                    model=model_id,
                    
            
                    messages=formatted_messages  
                    )
            
                    answer = chat_completion.choices[0].message.content
                    print(model_id)
                    return  answer
                    
                except (RateLimitError, GroqAPIError ) as e:
                    # Catch 429 rate limits or model failure and iterate to next model
                    last_exception = e
                    continue    
            # 3. Pass that clean list straight to the Llama m\odel
            
        except Exception as e:
            print(f"error {e}")
    raise Exception("all groq keys failed")

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
        
    # 3. Pass that clean list straight to the Llama model
    chat_completion = await client.chat.completions.create(
        model="meta-llama/llama-3.3-70b-instruct",
        messages=formatted_messages  
    )
    
    answer = chat_completion.choices[0].message.content
    return  answer
client =  genai.Client(api_key=os.getenv("GEMINI_APIK_KEY"))
async def call_google(query):
    if not client:
        raise GoogleError("api not found")
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
    response = await client.aio.models.generate_content(model="gemini-3.6-flash",
                                            contents= formatted_messages,
                                            config=types.GenerateContentConfig(system_instruction=system_instructions))

    answer = response.text
    print(answer)
    return answer

async def call_groq1(query):
    API_key1=os.getenv("gq_wren1")
    API_key2=os.getenv("API_key1")
    keys= [API_key1,API_key2]
    GROQ_FREE_MODELS = [
    "llama-3.3-70b-versatile"
    "llama-3.1-8b-instant",
    "llama-3.1-70b-versatile",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "qwen/qwen3-32b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "deepseek-r1-distill-llama-70b",
    "deepseek-r1-distill-qwen-32b",
]
    
    for key in keys:
        if not key:
            continue
        try:
            client =  AsyncGroq(api_key=key)
            
            formatted_messages = [{"role":"system","content":system_video_instructions}]
            
            
            # 2. Run a standard loop through your Pydantic messages
            for msg in query.question:
                # Turn the Pydantic object into a normal dictionary
                cleaned_dict = msg.model_dump() 
                
                # Push it into our list (just like .push() in JavaScript!)
                formatted_messages.append(cleaned_dict)
            for model_id in GROQ_FREE_MODELS:
                
                try:
                    chat_completion = await client.chat.completions.create(
            
                    model=model_id,
            
                    messages=formatted_messages  
                    )
            
                    answer = chat_completion.choices[0].message.content
                    print(model_id)
                    return  answer
                    
                except (RateLimitError, GroqAPIError ) as e:
                    # Catch 429 rate limits or model failure and iterate to next model
                    last_exception = e
                    continue    
            # 3. Pass that clean list straight to the Llama m\odel
            
        except Exception as e:
            print(f"error {e}")
    raise Exception("all groq keys failed")

async def call_openRouter1(query):
    
    client =   AsyncOpenAI(base_url="https://openrouter.ai/api/v1",
                    api_key=os.getenv("openRouterWren2"),
                    
                    default_headers={
                        'Content-Type':"application/json",
                        'HTTP-Referer':"https://wrezon.onrender.com",
                        'X-Title':'wrezon ai'
                    })
    
    formatted_messages = [{"role":"system","content":system_video_instructions}]
    # 2. Run a standard loop through your Pydantic messages
    for msg in query.question:
        # Turn the Pydantic object into a normal dictionary
        cleaned_dict = msg.model_dump() 
        
        # Push it into our list (just like .push() in JavaScript!)
        formatted_messages.append(cleaned_dict)
        
    # 3. Pass that clean list straight to the Llama model
    chat_completion = await client.chat.completions.create(
        model="meta-llama/llama-3.3-70b-instruct",
        messages=formatted_messages  
    )
    
    answer = chat_completion.choices[0].message.content
    return  answer
client =  genai.Client(api_key=os.getenv("GEMINI_APIK_KEY"))
async def call_google1(query):
    if not client:
        raise GoogleError("api not found")
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
    response = await client.aio.models.generate_content(model="gemini-3.6-flash",
                                            contents= formatted_messages,
                                            config=types.GenerateContentConfig(system_instruction=system_video_instructions))

    answer = response.text
    print(answer)
    return answer

async def live_call_groq(query):
    API_key1=os.getenv("gq_wren1")
    API_key2=os.getenv("API_key1")
    keys= [API_key1,API_key2]
    GROQ_FREE_MODELS = [
    "llama-3.3-70b-versatile"
    "llama-3.1-8b-instant",
    "llama-3.1-70b-versatile",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "qwen/qwen3-32b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "deepseek-r1-distill-llama-70b",
    "deepseek-r1-distill-qwen-32b",
    
    
]
    
    for key in keys:
        if not key:
            continue
        try:
            client =  AsyncGroq(api_key=key)
            
            formatted_messages = [{"role":"system","content":system_live_chat_instructions}]
            
            
            # 2. Run a standard loop through your Pydantic messages
            for msg in query.question:
                # Turn the Pydantic object into a normal dictionary
                cleaned_dict = msg.model_dump() 
                
                # Push it into our list (just like .push() in JavaScript!)
                formatted_messages.append(cleaned_dict)
            for model_id in GROQ_FREE_MODELS:
               
                try:
                    chat_completion = await client.chat.completions.create(
            
                    model=model_id,
                    
            
                    messages=formatted_messages  
                    )
            
                    answer = chat_completion.choices[0].message.content
                    print(model_id)
                    return  answer
                    
                except (RateLimitError, GroqAPIError ) as e:
                    # Catch 429 rate limits or model failure and iterate to next model
                    last_exception = e
                    continue    
            # 3. Pass that clean list straight to the Llama m\odel
            
        except Exception as e:
            print(f"error {e}")
    raise Exception("all groq keys failed")

async def live_call_openRouter(query):
    
    client =   AsyncOpenAI(base_url="https://openrouter.ai/api/v1",
                    api_key=os.getenv("openRouterWren2"),
                    
                    default_headers={
                        'Content-Type':"application/json",
                        'HTTP-Referer':"https://wrezon.onrender.com",
                        'X-Title':'wrezon ai'
                    })
    
    formatted_messages = [{"role":"system","content":system_live_chat_instructions}]
    # 2. Run a standard loop through your Pydantic messages
    for msg in query.question:
        # Turn the Pydantic object into a normal dictionary
        cleaned_dict = msg.model_dump() 
        
        # Push it into our list (just like .push() in JavaScript!)
        formatted_messages.append(cleaned_dict)
        
    # 3. Pass that clean list straight to the Llama model
    chat_completion = await client.chat.completions.create(
        model="meta-llama/llama-3.3-70b-instruct",
        messages=formatted_messages  
    )
    
    answer = chat_completion.choices[0].message.content
    return  answer
client =  genai.Client(api_key=os.getenv("GEMINI_APIK_KEY"))

async def live_call_google(query):
    if not client:
        raise GoogleError("api not found")
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
    response = await client.aio.models.generate_content(model="gemini-3.6-flash",
                                            contents= formatted_messages,
                                            config=types.GenerateContentConfig(system_instruction=system_live_chat_instructions))

    answer = response.text
    print(answer)
    return answer


async def scrap_check_call_groq(query):
    API_key1=os.getenv("gq_wren1")
    API_key2=os.getenv("API_key1")
    keys= [API_key1,API_key2]
    GROQ_FREE_MODELS = [
    "llama-3.3-70b-versatile"
    "llama-3.1-8b-instant",
    "llama-3.1-70b-versatile",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "qwen/qwen3-32b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "deepseek-r1-distill-llama-70b",
    "deepseek-r1-distill-qwen-32b",
    
    
]
    
    for key in keys:
        if not key:
            continue
        try:
            client =  AsyncGroq(api_key=key)
            
            formatted_messages = [{"role":"system","content":scrap_check_instructions}]
            
            
            # 2. Run a standard loop through your Pydantic messages
            for msg in query.question:
                # Turn the Pydantic object into a normal dictionary
                cleaned_dict = msg.model_dump() 
                
                # Push it into our list (just like .push() in JavaScript!)
                formatted_messages.append(cleaned_dict)
            for model_id in GROQ_FREE_MODELS:
               
                try:
                    chat_completion = await client.chat.completions.create(
            
                    model=model_id,
                    
            
                    messages=formatted_messages  
                    )
            
                    answer = chat_completion.choices[0].message.content
                    print(model_id)
                    return  answer
                    
                except (RateLimitError, GroqAPIError ) as e:
                    # Catch 429 rate limits or model failure and iterate to next model
                    last_exception = e
                    continue    
            # 3. Pass that clean list straight to the Llama m\odel
            
        except Exception as e:
            print(f"error {e}")
    raise Exception("all groq keys failed")

async def scrap_check_call_openRouter(query):
    
    client =   AsyncOpenAI(base_url="https://openrouter.ai/api/v1",
                    api_key=os.getenv("openRouterWren2"),
                    
                    default_headers={
                        'Content-Type':"application/json",
                        'HTTP-Referer':"https://wrezon.onrender.com",
                        'X-Title':'wrezon ai'
                    })
    
    formatted_messages = [{"role":"system","content":scrap_check_instructions}]
    # 2. Run a standard loop through your Pydantic messages
    for msg in query.question:
        # Turn the Pydantic object into a normal dictionary
        cleaned_dict = msg.model_dump() 
        
        # Push it into our list (just like .push() in JavaScript!)
        formatted_messages.append(cleaned_dict)
        
    # 3. Pass that clean list straight to the Llama model
    chat_completion = await client.chat.completions.create(
        model="meta-llama/llama-3.3-70b-instruct",
        messages=formatted_messages  
    )
    
    answer = chat_completion.choices[0].message.content
    return  answer
client =  genai.Client(api_key=os.getenv("GEMINI_APIK_KEY"))

async def scrap_check_call_google(query):
    if not client:
        raise GoogleError("api not found")
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
    response = await client.aio.models.generate_content(model="gemini-3.6-flash",
                                            contents= formatted_messages,
                                            config=types.GenerateContentConfig(system_instruction=scrap_check_instructions))

    answer = response.text
    print(answer)
    return answer



async def router_line1(query):
    models=[call_groq,call_google,call_openRouter]
    
    for model in models:
        try:
            response = await model(query)
            print(model.__name__)
            print(response)
            return response
        except FAILOVER_ERROR_KIT as e:
            print("an error just happened")
            print(e)
            print("error log finishes")
            continue
    raise RuntimeError("all models failed ")

#load_dotenv()
#print("Gemini Key Check:", os.getenv("GEMINI_API_KEY")[:6] if os.getenv("GEMINI_API_KEY") else "NOT FOUND")


async def router_line2(query):
    models=[call_groq1,call_google1,call_openRouter1]
    
    for model in models:
        try:
            response = await model(query)
            print(model.__name__)
            print(response)
            return response
        except FAILOVER_ERROR_KIT as e:
            print("an error just happened")
            print(e)
            print("error log finishes")
            continue
    raise RuntimeError("all models failed ")

async def router_line3(query):
    models=[live_call_groq,live_call_google,live_call_openRouter]
    
    for model in models:
        try:
            response = await model(query)
            print(model.__name__)
            print(response)
            return response
        except FAILOVER_ERROR_KIT as e:
            print("an error just happened")
            print(e)
            print("error log finishes")
            continue
    raise RuntimeError("all models failed ")


async def router_line4(query):
    models=[scrap_check_call_groq,scrap_check_call_google,scrap_check_call_openRouter]
    
    for model in models:
        try:
            response = await model(query)
            print(model.__name__)
            print(response)
            return response
        except FAILOVER_ERROR_KIT as e:
            print("an error just happened")
            print(e)
            print("error log finishes")
            continue
    raise RuntimeError("all models failed ")


    
async def load_model(query):
    response = await router_line1(query)
    print(response)
    return response
    
    
if __name__=="__main__":
    asyncio.run(load_model())
          