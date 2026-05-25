from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.redeem import router

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
async def root():

    return {
        "message": "FastAPI QR Backend Running"
    }