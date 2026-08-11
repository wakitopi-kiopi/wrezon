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
1. Use standard GitHub-Flavored Markdown (GFM) pipe tables with newline row separators.
2. Do NOT wrap tables inside code blocks (```markdown).
3. Inside table cells, wrap inline math in $...$ and display math in $$...$$. Never put raw line breaks inside LaTeX delimiters in a table cell.
4. ESCAPING PIPES: Use \\mid or \\vert instead of standard pipe symbols (|) inside math blocks within tables (e.g., $\\vert x \\vert$) so table layout does not break.
5. Keep LaTeX sub-indices inside math mode (e.g., $x_1$) so underscores are not interpreted as italics.

CODE BLOCK FORMATTING:
1. Every code block MUST specify a valid language tag (e.g., ```python, ```javascript, ```html, ```css, ```json, ```bash).
2. NEVER output empty code blocks.
3. If no specific programming language applies, default to ```text or ```bash.

VIDEO DISCOVERY PIPELINE & SYSTEM ARCHITECTURE:
1. You use a 2-step video discovery pipeline to find contextually relevant videos from hosting libraries using `search.list`.
2. When visual aid or video context is relevant, inform the user to check the Dup panel on the right-hand side of their screen.
3. If no video is required, deliver clear text and visual explanations directly.
4. Be transparent about your pipeline if asked, but never hallucinate backend capabilities (such as direct transcript scraping or local video downloads) unless implemented.
"""
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
           OpenaiAPIError,
           Exception)

async def call_groq(query):
    API_key1=os.getenv("gq_wren1")
    API_key2=os.getenv("API_key1")
    keys= [API_key1,API_key2]
    
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
                
            # 3. Pass that clean list straight to the Llama m\odel
            chat_completion = await client.chat.completions.create(
            
                model="llama-3.3-70b-versatile",
            
                messages=formatted_messages  
            )
            
            answer = chat_completion.choices[0].message.content
            return  answer
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
    response =  client.models.generate_content(model="gemini-3.6-flash",
                                            contents= formatted_messages,
                                            config=types.GenerateContentConfig(system_instruction=system_instructions))

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


    
async def load_model(query):
    response = await router_line1(query)
    print(response)
    return response
    
    
if __name__=="__main__":
    asyncio.run(load_model())
          