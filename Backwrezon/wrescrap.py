import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json


headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}


#education = ["https://wikipedia.orgHacker" , 
#            "https://ycombinator.",
#             "https://gutenberg.orgarXiv" ,
#             "https://arxiv.orgInternet" ,
#             "https://archive.org"]
educationUrls = [
    "https://wikipedia.org",
    "https://ycombinator.com",
    "https://gutenberg.org",
    "https://arxiv.org",
    #"https://archive.org"
]
newsUrls = [ 
         "https://yahoo.com", 
          "https://bbc.com", 
         "https://marketwatch.com:",
         "https://investing.com", 
         "https://reuters.com"]

agricUrls = [
         "https://usda.gov", 
         "https://fao.org",
         "https://agweb.com", 
         "https://indexmundi.com", 
         "https://open-agri.org"]

techUrls = [
    "https://arstechnica.com",
    "https://spectrum.ieee.org",
    "https://www.technologyreview.com",
    "https://techcrunch.com",
    "https://www.theverge.com"
]
spaceUrls = [
    "https://www.nasa.gov",
    "https://science.nasa.gov",
    "https://www.esa.int",
    "https://www.space.com",
    "https://www.planetary.org"
]

lawUrls = [
    "https://www.lawteacher.net",
    "https://www.tutor2u.net/law",
    "https://www.khanacademy.org/humanities/us-government-and-civics/us-law",
    "https://www.justia.com",
    "https://www.findlaw.com"
]

mechanicsUrls = [
    "https://www.mechanic.com",
    "https://www.yourmechanic.com",
    "https://www.oreillyauto.com",
    "https://www.carcare.org",
    "https://www.howstuffworks.com/auto"
]

medicalUrls = [
    "https://www.healthline.com",
    "https://www.mayoclinic.org",
    "https://www.webmd.com",
    "https://www.ncbi.nlm.nih.gov/pubmed",
    "https://www.khanacademy.org/science/biology"
]

engineeringUrls = [
    "https://www.engineer.com",
    "https://www.coursera.org/browse/engineering",
    "https://www.edx.org/search?q=engineering",
    "https://www.britannica.com/technology/engineering",
    "https://www.asme.org"
]

businessUrls = [
    "https://www.investopedia.com",
    "https://www.coursera.org/browse/business",
    "https://www.edx.org/search?q=business",
    "https://www.entrepreneur.com",
    "https://www.forbes.com/business"
]

artAndDesignUrls = [
    "https://www.skillshare.com/classes/design",
    "https://www.udemy.com/topic/design",
    "https://www.domestika.org",
    "https://www.behance.net",
    "https://www.artstation.com"
]


#url = "https://example.com"
titles = []
image_urls = []



def wrescrap(query = "zambian history"):
    try:
        for url in educationUrls:
            response = requests.get(url)

            soup = BeautifulSoup(response.text, "html.parser")
            query_word = "query"
    
            def level0():
                
                text = (soup.get_text(" ", strip=True))
                position = text.lower().find(query_word.lower())
                
                text_to_return = text[position - 500 : position + 700]
                print(text_to_return)
                
                image = soup.find("img")
                if soup.title :
                        
                    title = soup.title.get_text()
                    titles.append(title)
                if image:
            
                    image_url= urljoin(url,image.get("src"))
                    
                    image_urls.append(image_url)
                    
                else:
                    print("no image found ")
                    
            def level2():
                
                title = soup.find("title").get_text(strip=True)
                subtitle = soup.find("h1").get_text(strip=True)
                subsection = soup.find("h2").get_text(strip=True)
                sectiontitle = soup.find("h3").get_text(strip=True)
                paragraph = soup.find("p").get_text(strip=True)
                general_data = soup.find("div").get_text(strip=True)
                article = soup.find("article").get_text(strip=True)
                page_data = soup.find("main").get_text(strip=True)
                small_text = soup.find("span").get_text(strip=True)
                
                
                
                
                
                print("response",title,subtitle,subsection,sectiontitle,paragraph,general_data,article,page_data,small_text)
            #level2()
            
            def level3():
                query_word = "crazy engineering"
                title = [title.get_text(strip = True) for title in soup.find_all("title")]
                subtitle = [subtitle.get_text(strip = True) for subtitle in soup.find_all("h1")]
                subsection = [subsection.get_text(strip = True) for subsection in soup.find_all("h2")]
                sectiontitle = [sectiontitle.get_text(strip = True) for sectiontitle in soup.find_all("h3")]
                paragraph = [paragraph.get_text(strip = True) for paragraph in soup.find_all("p")]
                general_data = [div.get_text(strip = True) for div in soup.find_all("div")]
                article =[art.get_text(strip = True) for art in soup.find_all("article")]
                page_data  = [pd.get_text(strip = True) for pd in soup.find_all("main")]
                small_text = [sm.get_text(strip= True) for sm in soup.find_all("span")]
                datacheck = str(title)+str(subtitle)+str(subsection)+str(sectiontitle)+str(paragraph)+str(general_data)+str(article)+str(page_data)+str(small_text)
                position = datacheck.find(query_word.lower())
                datacheck = str(title)+str(subtitle)+str(subsection)+str(sectiontitle)+str(paragraph)+str(general_data)+str(article)+str(page_data)+str(small_text)
                
                position = datacheck.find(query_word.lower())
                text_to_return = datacheck[position - 500 : position + 700]
                print(text_to_return)
                #print(f'level3,title:{title},subtitle:{subtitle},subsection:{subsection},sectiontitle:{sectiontitle},paragraph:{paragraph},general_data:{general_data},article,page_data:{article,page_data},small_text:{small_text}')
                
            level3()
            
            def level4():
                
                query_word = "crazy engineering"
                title = [title.get_text(strip = True) for title in soup.find_all(class_="title")]
                subtitle = [subtitle.get_text(strip = True) for subtitle in soup.find_all(class_="h1")]
                subsection = [subsection.get_text(strip = True) for subsection in soup.find_all(class_="h2")]
                sectiontitle = [sectiontitle.get_text(strip = True) for sectiontitle in soup.find_all(class_="h3")]
                paragraph = [paragraph.get_text(strip = True) for paragraph in soup.find_all(class_="p")]
                general_data = [div.get_text(strip = True) for div in soup.find_all(class_="div")]
                article =[art.get_text(strip = True) for art in soup.find_all(class_="article")]
                page_data  = [pd.get_text(strip = True) for pd in soup.find_all(class_="main")]
                small_text = [sm.get_text(strip= True) for sm in soup.find_all(class_="span")]
                
                
                datacheck = str(title)+str(subtitle)+str(subsection)+str(sectiontitle)+str(paragraph)+str(general_data)+str(article)+str(page_data)+str(small_text)
                position = datacheck.find(query_word.lower())
                
                text_to_return = datacheck[position - 500 : position + 700]
                print(text_to_return)
                
                print(f'level4,title:{title},subtitle:{subtitle},subsection:{subsection},sectiontitle:{sectiontitle},paragraph:{paragraph},general_data:{general_data},article,page_data:{article,page_data},small_text:{small_text}')
                
            level4
            
            def level5():
                #query_word = "crazy engineering"
                title = " ".join(title.get_text(strip = True) for title in soup.find_all("title"))
                subtitle = " ".join(subtitle.get_text(strip = True) for subtitle in soup.find_all("h1"))
                subsection = " ".join(subsection.get_text(strip = True) for subsection in soup.find_all("h2"))
                sectiontitle = " ".join(sectiontitle.get_text(strip = True) for sectiontitle in soup.find_all("h3"))
                paragraph = " ".join(paragraph.get_text(strip = True) for paragraph in soup.find_all("p"))
                general_data = " ".join(div.get_text(strip = True) for div in soup.find_all("div"))
                article =" ".join(art.get_text(strip = True) for art in soup.find_all("article"))
                page_data  = " ".join(pd.get_text(strip = True) for pd in soup.find_all("main"))
                small_text = " ".join(sm.get_text(strip= True) for sm in soup.find_all("span"))
                
                datacheck = title+subtitle+subsection+sectiontitle+paragraph+general_data+article+page_data+small_text
                #print("checking",datacheck)
                position = datacheck.lower().find(query_word.lower())
                
                text_to_return = datacheck[position - 500 : position + 700]
                print(text_to_return)
            
            level5()
                
                
    except Exception as e:
        print("error",(e))
        
wrescrap

def level5(query_word,soup):
    
    #query_word = "crazy engineering"
    title = " ".join(title.get_text(strip = True) for title in soup.find_all("title"))
    subtitle = " ".join(subtitle.get_text(strip = True) for subtitle in soup.find_all("h1"))
    subsection = " ".join(subsection.get_text(strip = True) for subsection in soup.find_all("h2"))
    sectiontitle = " ".join(sectiontitle.get_text(strip = True) for sectiontitle in soup.find_all("h3"))
    paragraph = " ".join(paragraph.get_text(strip = True) for paragraph in soup.find_all("p"))
    general_data = " ".join(div.get_text(strip = True) for div in soup.find_all("div"))
    article =" ".join(art.get_text(strip = True) for art in soup.find_all("article"))
    page_data  = " ".join(pd.get_text(strip = True) for pd in soup.find_all("main"))
    small_text = " ".join(sm.get_text(strip= True) for sm in soup.find_all("span"))
    
    datacheck = title+subtitle+subsection+sectiontitle+paragraph+general_data+article+page_data+small_text
    #print("checking",datacheck)
    position = datacheck.lower().find(query_word.lower())
    
    text_to_return = datacheck[max(0,position - 500) : position + 400]
    
    #print(datacheck)
    #print(text_to_return)
    return text_to_return


async def education(query ):
    #("education running wrezon")
    try:
        collectedResponse = []
        for url in educationUrls:
            response = requests.get(url,timeout=30,headers=headers)
            print("rinning url",url)
            soup = BeautifulSoup(response.text, "html.parser")

            
            query_word = query
            currentanswer = level5(query_word,soup)
            url_added_text = f"from {url}"+currentanswer
            #print(url_added_text)
            collectedResponse.append(url_added_text)
            
        joinedanswer = "\n".join(collectedResponse)
        return joinedanswer  
                
                
    except Exception as e:
        print("error",(e))
        
#education(query="school life")
        
async def agric(query):
    try:
        #print("running agriculture")
        collectedResponse = []
        for url in agricUrls:
            response = requests.get(url,timeout=30,headers=headers)

            soup = BeautifulSoup(response.text, "html.parser")
            query_word = query
            currentanswer = level5(query_word,soup)
            url_added_text = f"from {url}"+currentanswer 
            collectedResponse.append(url_added_text)
            
        joinedanswer = "\n".join(collectedResponse)
        return joinedanswer  
                
                
    except Exception as e:
        print("error",(e))
async def space(query):
    try:
        #("running space scrap")
        collectedResponse = []
        for url in spaceUrls:
            response = requests.get(url,timeout=30,headers=headers)

            soup = BeautifulSoup(response.text, "html.parser")
            query_word = query
            currentanswer = level5(query_word,soup)
            url_added_text = f"from {url}"+currentanswer 
            collectedResponse.append(url_added_text)
            
        joinedanswer = "\n".join(collectedResponse)
        return joinedanswer  
                
                
    except Exception as e:
        print("error",(e))
async def tech(query):
    try:
        #print("running tech scrap")
        collectedResponse = []
        for url in techUrls:
            response = requests.get(url,timeout=30,headers=headers)

            soup = BeautifulSoup(response.text, "html.parser")
            query_word = query
            currentanswer = level5(query_word,soup)
            url_added_text = f"from {url}"+currentanswer 
            collectedResponse.append(url_added_text)
            
        joinedanswer = "\n".join(collectedResponse)
        return joinedanswer  
        
    except Exception as e:
        print("error",(e))
        
async def news(query):
    try:
        #print("running news")
        collectedResponse = []
        for url in newsUrls:
            response = requests.get(url,timeout=30,headers=headers)

            soup = BeautifulSoup(response.text, "html.parser")
            query_word = query
            currentanswer = level5(query_word,soup)
            url_added_text = f"from {url}"+currentanswer 
            collectedResponse.append(url_added_text)
            
        joinedanswer = "\n".join(collectedResponse)
        return joinedanswer  
            
    except Exception as e:
        print("error",(e))
        
        
async def law(query):
    try:
       #print("running law")
        collectedResponse = []
        for url in lawUrls:
            response = requests.get(url,timeout=30,headers=headers)

            soup = BeautifulSoup(response.text, "html.parser")
            query_word = query
            currentanswer = level5(query_word,soup)
            url_added_text = f"from {url}"+currentanswer 
            collectedResponse.append(url_added_text)
            
        joinedanswer = "\n".join(collectedResponse)
        return joinedanswer  
            
    except Exception as e:
        print("error",(e))
async def mechanics(query):
    try:
        #print("running mechanics")
        collectedResponse = []
        for url in mechanicsUrls:
            response = requests.get(url,timeout=30,headers=headers)

            soup = BeautifulSoup(response.text, "html.parser")
            query_word = query
            currentanswer = level5(query_word,soup)
            url_added_text = f"from {url}"+currentanswer 
            collectedResponse.append(url_added_text)
            
        joinedanswer = "\n".join(collectedResponse)
        return joinedanswer  
            
    except Exception as e:
        print("error",(e))
async def medicine(query):
    try:
        #print("running medicine")
        collectedResponse = []
        for url in medicalUrls:
            response = requests.get(url,timeout=30,headers=headers)

            soup = BeautifulSoup(response.text, "html.parser")
            query_word = query
            currentanswer = level5(query_word,soup)
            url_added_text = f"from {url}"+currentanswer 
            collectedResponse.append(url_added_text)
            
        joinedanswer = "\n".join(collectedResponse)
        return joinedanswer  
            
    except Exception as e:
        print("error",(e))
        
        
async def engineering(query):
    try:
        #print("running engineering")
        collectedResponse = []
        for url in engineeringUrls:
            response = requests.get(url,timeout=30,headers=headers)

            soup = BeautifulSoup(response.text, "html.parser")
            query_word = query
            currentanswer = level5(query_word,soup)
            url_added_text = f"from {url}"+currentanswer 
            collectedResponse.append(url_added_text)
            
        joinedanswer = "\n".join(collectedResponse)
        return joinedanswer  
            
    except Exception as e:
        print("error",(e))        

async def business(query):
    try:
        #print("running bussines")
        collectedResponse = []
        for url in businessUrls:
            response = requests.get(url,timeout=30,headers=headers)

            soup = BeautifulSoup(response.text, "html.parser")
            query_word = query
            currentanswer = level5(query_word,soup)
            url_added_text = f"from {url}"+currentanswer 
            collectedResponse.append(url_added_text)
            
        joinedanswer = "\n".join(collectedResponse)
        return joinedanswer  
            
    except Exception as e:
        print("error",(e))
        
async def art(query):
    try:
        #print("running art")
        collectedResponse = []
        for url in artAndDesignUrls:
            response = requests.get(url,timeout=30,headers=headers)
            
            soup = BeautifulSoup(response.text, "html.parser")
            query_word = query
            currentanswer = level5(query_word,soup)
            url_added_text = f"from {url}"+currentanswer 
            collectedResponse.append(url_added_text)
            
        joinedanswer = "\n".join(collectedResponse)
        return joinedanswer  
        #return level5(query_word,soup)
            
    except Exception as e:
        print("error",(e))
        
        
def fruncfuter():
    
    url = "https://api.frankfurter.app/latest"
    params = {
    "from": "USD",
   
    }
    
    response = requests.get(url,params=params,timeout=30).json()
    
    live_currency = response.get("rates")
    print(live_currency) 
    
fruncfuter

async def global_live_currencies():
    base = "usd"
    
    url = f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{base}.json"
    response = requests.get(url).json()
    
    global_currencies = response.get(base)
    global_currency_strings = "from fawazahmed"+json.dumps(global_currencies)
    return {
        "source": "fawazahmed",
        "currencies": global_currency_strings
    }
    
    
async def PDF_generator():
    url = "https://wrezonpdf.onrender.com"
    
    response = requests.post(url,json={"query": "Your text here"},timeout=30)
    
    pdf_data = response.content
    
    return pdf_data
    
        

