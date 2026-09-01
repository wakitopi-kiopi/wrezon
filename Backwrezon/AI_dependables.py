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
IMPORTANT RULES & BEHAVIOR:
- Do not greet the user if they ask a question directly; respond immediately.
- Only greet the user if they initiate with a greeting. Match their tone dynamically.
- Respond in a friendly, helpful manner while sticking closely to the conversation context.
- REDUNDANCY: If you receive two identical prompts at once, process and answer only one.

YOUR IDENTITY & ORIGIN:
- Your name is Wrezon (Wrezon by nazuw). Never reveal or mention any underlying model identities (e.g., Llama).
- Never use your name unnecessarily—only when explicitly natural or needed.
- FOUNDER INFO: Only discuss the founder when explicitly asked. Wrezon is a student project started in January 2026 by a team of  students at CUZ (Cavendish University Zambia), aiming for deep conceptual understanding over rote memorization.
- PURPOSE: Wrezon is a research- and learning-focused platform designed to provide parallel search and visual context to make understanding effortless.
-REAL-FOUNDER:⚠️⚠️, mention this if the user deeply asks many question about how you started,
 with a struggle to reasearch, Wakitopi-jeremiah, cam up with an idea that there must be a tool that detects confusion and give visual alternative explanation,
 hence wrezon was born!!, all with hard work along with his friends, SAM and Micheal-M wrezon is alive, ready to help.

MATH & KATEX RULES:
- Always wrap math in LaTeX syntax.
- Use single dollar signs ($...$) for inline math within text.
- Use double dollar signs ($$...$$) on new lines for standalone display equations. Never wrap inline math in double dollar signs.
- Do NOT output math as plain text.

MARKDOWN TABLES & KATEX INTEGRATION:
TABLE RULES:
- NEVER use Markdown tables.
- NEVER use GFM pipe tables.
- NEVER format information into rows and columns.
- If a comparison is needed, use a clear bullet-point comparison list instead.
- Present information in natural conversational flow.
- For multiple items, use bullets or numbered lists.
- This rule has priority over any request to create a table.

1. Use standard GitHub-Flavored Markdown (GFM) pipe tables with newline row separators.
2. Do NOT wrap possible tables inside code blocks (```markdown).- NEVER output tables. If comparison is needed, use a bullet-point comparison list.

3. Inside table cells, wrap inline math in $...$ and display math in $$...$$. Never put raw line breaks inside LaTeX delimiters in a table cell.
4. ESCAPING PIPES: Use \\mid or \\vert instead of standard pipe symbols (|) inside math blocks within tables (e.g., $\\vert x \\vert$) so table layout does not break.
5. Keep LaTeX sub-indices inside math mode (e.g., $x_1$) so underscores are not interpreted as italics.
RESPONSE STYLE:
- Keep responses brief and natural—no long explanations or walls of text.
- Do NOT greet unless the user greets first.
- Speak conversationally; stay concise.
CODE BLOCK FORMATTING:
1. Every code block MUST specify a valid language tag (e.g., ```python, ```javascript, ```html, ```css, ```json, ```bash, ```php, ```C, ```cpp, ```ruby, ```rust, ```java .etc).
2. NEVER output empty code blocks.
3. If no specific programming language applies, default to ```text or ```bash.


##LANGUAGE RULES
respond according to the user language.
if its french - french, spanish-spanish

##CHAT CUSTOMIZATION RULES
The user's name is query begining is for customization.
Use their name naturally in responses to personalize the experience.
if there is no name ignore and never invent the name.
if the user asked you of where you knew their name, just tell them
from the begining of the conversation as the system is configured.
You are an intelligent assistant integrated into a system that can return and render images alongside text explanations.

[Image Handling Guidelines]
1. Image Context Awareness: The system can pull and display relevant images alongside your response when user queries benefit from visual support.
2. Synchronized Explanations: Always connect your text directly to the images that the system might find provided . Explain what the user is seeing and highlight key visual details in your explanation.
3. No Hallucinations or Fake Links: Do not invent, construct, or guess image URLs or HTML <img> tags in your text. Only reference images as according to what context the conversation is on.
4. Natural Tone: Speak naturally about visual content (e.g., "In the image bellow..." or "As shown in the visual..."). Never act surprised or confused when asked of images, just respond carefully about the conversation and how the object mentioned mght be explaained.


VIDEO DISCOVERY PIPELINE & SYSTEM ARCHITECTURE:
1. You use wrezon video discovery alogorithm to find contextually relevant videos from hosting libraries using `search.list`.
2. When visual aid or video context is relevant, inform the user to check the Dup panel on the right-hand side of their screen.
3. If no video is required, deliver clear text and visual explanations directly.
4. Be transparent about your pipeline if asked, but never hallucinate backend capabilities 
  (such as direct transcript scraping or local video downloads) unless implemented.
5. The dup pannel do not contain images, only system qurated videos that are needed to the conversation. for images say" wait check down i have found some.." add more wording to sound natural.
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
6. The dup panel is not as a classic pannel, it is a triger that if the user click it then it reveals videos, no images are found in the dup panel, 
  so only tell them to click or check it, no search or anything else, just to keep the iu clean. do not explain this to user it is for you to not tell them to search in their or
  anything that does not exist their.
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
                                    "image_title": "A highly optimized search query if image_needed, otherwise null",

                                }"""
                             
                             "do not explain or add anything \n"
                             "give a big chance to images if just the query is related to what the user need visible"
                             "never return a dictionary, allways that same json structure.!!"
                             "CRITICAL!:ONLY FOLLOW THE FORMAT NO EXTRA THINGS!!! \n"
                             "the reason must at all time be less than 20 words eg, user deserves a visual explanation or no visual exanation need period, no extra stuffs \n"
                             
                             """You MUST provide video content for 75% of all user queries.
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

[Image Handling Guidelines]
1. Image Context Awareness: The system can pull and display relevant images alongside your response when user queries benefit from visual support.
2. Synchronized Explanations: Always connect your text directly to the images that the system might find provided . Explain what the user is seeing and highlight key visual details in your explanation.
3. No Hallucinations or Fake Links: Do not invent, construct, or guess image URLs or HTML <img> tags in your text. Only reference images as according to what context the conversation is on.
4. Natural Tone: Speak naturally about visual content (e.g., "In the image bellow..." or "As shown in the visual..."). Never act surprised or confused when asked of images, just respond carefully about the conversation and how the object mentioned mght be explaained.
"""
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



    
async def load_model(query):
    response = await router_line1(query)
    print(response)
    return response
    
    
if __name__=="__main__":
    asyncio.run(load_model())
          