import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT_TEMPLATE = """You are a MySQL Expert.
Your task is to generate a SQL query to answer the user's question, given the following database schema.

SCHEMA:
{schema}

RULES:
1. ONLY generate a standard MySQL SELECT query.
2. DO NOT generate ANY explanation, markdown, or code blocks. Just the raw SQL.
3. Use the table names and column names EXACTLY as provided in the schema. Do not hallucinate.
4. If the question cannot be answered by the schema, or requires DROP/DELETE/INSERT/UPDATE, return strictly: INVALID_QUERY
5. ALWAYS LIMIT the result to 100 rows if not specified otherwise (but max 100).
6. Do NOT use wildcards like SELECT *. Select specific columns.

USER QUESTION: {question}

SQL:"""

def get_client():
    # Hot-reload env vars for easier local dev
    load_dotenv(override=True)
    api_key = os.getenv("GROQ_API_KEY")
    if api_key:
        api_key = api_key.strip()
        print(f"DEBUG: Loaded API Key: {api_key[:4]}...{api_key[-4:]}")
    else:
        print("DEBUG: No API Key found")

    if not api_key:
        return None
    return Groq(api_key=api_key)

def generate_sql(schema: str, question: str) -> str:
    client = get_client()
    if not client:
        # Return a safer error or raise one that can be caught
        raise ValueError("GROQ_API_KEY is not set. Please check your .env file.")

    prompt = SYSTEM_PROMPT_TEMPLATE.format(schema=schema, question=question)

    completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a specialized SQL generation assistant."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.1,
    )
    
    response = completion.choices[0].message.content.strip()
    
    # Clean up markdown if present (defense in depth)
    response = response.replace("```sql", "").replace("```", "").strip()
    
    return response
