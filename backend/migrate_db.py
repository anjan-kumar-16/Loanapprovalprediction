from sqlalchemy import create_engine
from sqlalchemy import text
from database import SQLALCHEMY_DATABASE_URL

def migrate():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE applications ADD COLUMN ai_recommendation VARCHAR(50);"))
            print("Successfully added ai_recommendation column.")
        except Exception as e:
            if "Duplicate column name" in str(e):
                print("Column already exists, skipping.")
            else:
                print(f"Error: {e}")

if __name__ == "__main__":
    migrate()
