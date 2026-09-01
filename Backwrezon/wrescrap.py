import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin



#education = ["https://wikipedia.orgHacker" , 
#            "https://ycombinator.",
#             "https://gutenberg.orgarXiv" ,
#             "https://arxiv.orgInternet" ,
#             "https://archive.org"]
education = [
    "https://wikipedia.org",
    "https://ycombinator.com",
    "https://gutenberg.org",
    "https://arxiv.org",
    "https://archive.org"
]
news = [ 
         "https://yahoo.comBBC", 
          "https://bbc.comMarketWatch", 
         "https://marketwatch.comInvesting.com:",
         "https://investing.comReuters", 
         "https://reuters.com"]

agric = [
         "https://usda.govFAOSTAT", 
         "https://fao.orgAgWeb",
         "https://agweb.comIndexMundi", 
         "https://indexmundi.comOpen-Agri", 
         "https://open-agri.org"]




#url = "https://example.com"
titles = []
image_urls = []
for url in education:
    try:
                
        response = requests.get(url)

        soup = BeautifulSoup(response.text, "html.parser")

        text = (soup.get_text(" ", strip=True))
        
        query_word = "physics"
        
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
            
            
            
        
        
        
        #print("title",soup.title)

        #image = soup.find("img")

        #if image:
            #print(image.get("src"))
            
    except Exception as e:
        print("error",(e))
        
        continue
print("titles",titles)
print("image urls:",image_url)