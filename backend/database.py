import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Get the MongoDB URL, default to local if not found
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

# Create the async MongoDB client
client = AsyncIOMotorClient(MONGO_URL)

# Create/Connect to our specific database named "intervai_db"
db = client.intervai_db

# Create references to the collections (tables) we will use
users_collection = db.get_collection("users")
interviews_collection = db.get_collection("interviews")