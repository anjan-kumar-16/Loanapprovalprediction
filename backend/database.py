from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import pymysql

import os
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:mysql@localhost/loan_db")

def create_db_if_not_exists():
    try:
        conn = pymysql.connect(host='localhost', user='root', password='mysql')
        cursor = conn.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS loan_db")
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error creating database: {e}")

create_db_if_not_exists()

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
