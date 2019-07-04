from urllib.request import urlopen as req
from bs4 import BeautifulSoup as bsoup


fd = open("imdb_top_1000_movies.csv", "w")
fd.write("imdb_id, movie_title, year, movie_img, certificate, runtime, genre, rating, metascore, description, director, stars, votes, gross\n")

for page in range(0,10):
    url = 'https://www.imdb.com/search/title/?groups=top_1000&sort=user_rating,desc&count=100&start='+str(page)+'01'

    # read html from website using url
    client = req(url)
    page_html = client.read()
    client.close()

    # parse html
    parsed_html = bsoup(page_html, "html.parser")

    lister_items = parsed_html.findAll("div", {"class":"lister-item mode-advanced"})

    for item in lister_items:
        
        hr = item.findAll("div", {"class":"lister-item-image float-left"})[0]
        movie_img = hr.a.img["src"]
        imdb_id = hr.a.img["data-tconst"]

        content = item.findAll("div", {"class": "lister-item-content"})[0]
    
        movie_title = content.h3.a.text.strip().replace(',',' ')
        year = content.h3.findAll("span")[1].text.strip()[1:-1]
        try:
            certificate = content.p.find("span", {"class": "certificate"}).text.strip()
        except:
            certificate = 'Not Rated'
        runtime = content.p.find("span", {"class": "runtime"}).text.strip()
        genre = content.p.find("span", {"class": "genre"}).text.strip().replace(',', '|')
        rating = content.div.div.text.strip()
        try:
            metascore = content.find("div", {"class": "inline-block ratings-metascore"}).span.text.strip()
        except:
            metascore = '-1'
        desc = content.findAll("p")[1].text.strip().replace(',', ' ')

        small_texts = content.findAll("p")

        director = small_texts[2].a.text.strip().replace(",", "|")
        stars = small_texts[2].text.split(':')[2].strip().replace(',', '|').replace('\n','')
        
        try:
            nums = small_texts[3].findAll("span", {"name":"nv"})
            try:
                votes = nums[0]["data-value"]
            except:
                votes = '-1'
            
            try:
                gross = nums[1]["data-value"].strip().replace(',','')
            except:
                gross = '-1'
        except:
            votes = '-1'
            gross = '-1'

        fd.write(imdb_id + "," +  movie_title + "," + year + "," + movie_img + "," + certificate + "," + runtime + "," + genre + "," + rating + "," + metascore + "," + desc + "," + director + "," + stars + "," + votes + "," + gross + "\n")
    
fd.close()