# 🧠 ask-your-db

**Full-Stack AI SQL Query Framework**

ask-your-db is a **production-ready, security-first AI web application** that allows users to query their **own MySQL databases using natural language**.  
It safely converts English questions into **validated, read-only SQL queries** and executes them with strict guardrails.

> Built for real systems. Not demos. Not unsafe AI shortcuts.

---

## ✨ Overview

ask-your-db enables users to explore databases without writing SQL manually.  
It combines a **schema-aware LLM**, **strict SQL validation**, and a **modern React UI** to deliver safe and predictable AI-powered database querying.

This project is designed with **enterprise-grade architecture principles**, making it suitable for production environments.

---

## 🧱 Stack

- 🤖 **AI Guardrails** – Schema-restricted LLM SQL generation  
- 🔐 **Security** – JWT authentication, SQL validation, rate limiting  
- 🗄️ **Database** – MySQL (read-only) via SQLAlchemy  
- ⚙️ **Backend** – FastAPI (modular, production-ready)  
- 🎨 **Frontend** – React + Tailwind (modern, Apple-style UI)  

---

## 🧩 Core Components

- **AI SQL Generator**  
  Converts natural language into SQL using real database schema only

- **Schema Inspector**  
  Reads actual tables and columns using `SHOW TABLES` and `DESCRIBE`

- **SQL Validator**  
  Enforces SELECT-only queries and blocks unsafe keywords

- **Explain-Before-Execute Engine**  
  Runs `EXPLAIN` before executing SQL

- **Authentication Layer**  
  JWT-based secure access

- **Rate Limiter**  
  Prevents abuse and excessive querying

---

## 🏗️ Architecture Overview
Frontend (React + Tailwind)
|
| Natural Language Prompt + JWT Token
|
Backend (FastAPI)
├─ Authentication Layer (JWT)
├─ Rate Limiter
├─ LLM Guardrails
├─ SQL Validator
├─ Query Builder
├─ Explain-Before-Execute
├─ Logger
|
└─ Read-Only MySQL Connection


---

## 🚀 What Do You Want to Build?

### 🤖 Ask Your Database
Create a secure AI assistant that allows users to query databases using plain English.

- Ask questions instead of writing SQL
- Preview generated SQL before execution
- Execute safely with guardrails
- View structured results in a modern UI

---

## ⚡ Quick Start

### Backend (FastAPI)

```bash
pip install -r requirements.txt
uvicorn app:app --reload
Frontend (React)
bash
Copy code
npm install
npm run dev
🔐 Security Guarantees
✅ Only SELECT queries allowed

❌ No DROP, DELETE, UPDATE, INSERT, ALTER, TRUNCATE

❌ No multiple SQL statements

❌ No SELECT *

✅ Mandatory LIMIT enforcement

✅ Read-only database users only

✅ EXPLAIN executed before query runs

This ensures zero risk of data corruption or data loss.

📁 Project Structure
Backend
Copy code
backend/
├── app.py
├── auth.py
├── db.py
├── llm.py
├── sql_guard.py
├── explain_guard.py
├── rate_limit.py
├── logger.py
├── requirements.txt
└── .env.example
Frontend
arduino
Copy code
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
└── vite.config.js

🎯 Use Cases
AI-powered internal analytics tools

Developer-friendly database exploration

Secure data access for non-technical teams

SaaS foundations for AI analytics platforms

🧠 Design Philosophy
AI should assist, not control, your data.

ask-your-db treats AI as a restricted SQL generator, not a privileged database user.
Every guardrail exists to ensure predictability, safety, and correctness in production systems.


