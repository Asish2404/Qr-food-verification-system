from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["qr_database"]

collection = db["coupons"]

counter_collection = db["food_counter"]