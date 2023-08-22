from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import boto3
import os
from dotenv import load_dotenv
from fastapi import File,UploadFile

load_dotenv()

session = boto3.Session(
    aws_access_key_id= os.getenv('REACT_APP_ACCESSKEYID'),
    aws_secret_access_key=os.getenv('REACT_APP_SECRETACCESSKEY'),
)
s3_client = boto3.client('s3')

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to postex api."}

@app.post("/uploadFile")
async def upload_file(file_data: UploadFile = File(...)):
    s3_client.upload_fileobj(file_data.file, os.getenv('REACT_APP_BUCKETNAME'), file_data.filename)
    return {"message": "File uploaded successfully"}