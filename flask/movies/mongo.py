from flask import Flask, jsonify
# from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from bson.regex import Regex

app = Flask(__name__)

app.config["MONGO_URI"] = 'mongodb://localhost:27017/moviedata'

mongo = PyMongo(app)

# CORS(app)

@app.route("/")
def initial():
    return 'Working Route...'

@app.route("/get-five-movies", methods=['GET'])
def index():
    movies = mongo.db.movies

    res = []
    i = 0
    for field in movies.find():
        if i == 5:
            break
        res.append({ "id:": str(field["_id"]), "title": field["movie_title"] })
        i = i+1
    
    return jsonify(res)

@app.route("/movies/<movie_id>")
def fetch_movie(movie_id):
    movies = mongo.db.movies

    res = []

    for movie in movies.find({ "_id": ObjectId(movie_id) }):
        res.append({ "name": movie["movie_title"], "rating": movie["rating"], "cast": movie["stars"] })

    return jsonify(res)

@app.route("/autocomplete/<prefix>")
def autocomplete(prefix):
    movies = mongo.db.movies
    docs = []
    
    for movie in movies.find({ "$or": [ {"movie_title":{"$regex": "^"+prefix[0].upper()+prefix[1:]}}, {"movie_title":{"$regex": "^"+prefix.lower()}}, {"movie_title":{"$regex": "^"+prefix.upper()}}, {"movie_title":{"$regex": "^"+prefix}} ] }).sort([( "rating", -1 )]).limit(5):
    # for movie in movies.find({"movie_title": { "$regex": "^"+prefix } }):
        docs.append({ "id": str(movie["_id"]), "name": movie["movie_title"], "rating": str(movie["rating"]), "cast": movie["stars"] })

    return jsonify(docs)

if __name__ == "__main__":
    app.run(debug=True)



