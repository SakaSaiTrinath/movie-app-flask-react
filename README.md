# Movie Search App

This is a movie search app allows us to search movies based on the data scrapped from imdb.

## Technologies Used:

### Frontend
* React js

> #### Dependencies:
* react-router-dom
* axios
* semantic-ui-react for UI

### Backend
* Flask (Python)

> #### Dependencies
* Flask-PyMongo
* bson

### Database used
* MongoDB

### Web Scrap
* Code for imdb website present in app2.py and the scrapped data present in imdb_top_1000_movies.csv

## Steps to reproduce project
* Download the zip folder of project and extract.
* Import the data of imdb_top_1000_movies.json into mongodb database by running "mongoimport --db moviedata --collection movies  --jsonArray  imdb_top_1000_movies.json".
* Goto reactapp directory in cmd and run "yarn install", then "yarn start".
* Goto flask/env/Scripts directory, activate the virtual environment by running "activate" command.
* then Goto flask/movies directory, run "python mongo.py".
* Open "http://localhost:3000" on your browser. Project is setup.
