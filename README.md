# AskDB: AI-Powered SQL Query Framework 🚀

### **Live Production URL: [https://ask-your-db-gen-ai.vercel.app/](https://ask-your-db-gen-ai.vercel.app/)**

AskDB is a premium, full-stack AI platform that allows anyone to talk to their database using plain English. It eliminates the need for complex SQL knowledge by translating natural language into optimized database queries in real-time.

---

## ✨ Features So Far

- **Natural Language to SQL**: Powered by Groq/LLama AI to generate accurate MySQL queries from English prompts.
- **Dynamic Table Visualization**: Instantly view results in a clean, modern data table with auto-formatted columns.
- **Bring Your Own Database (BYODB)**: Stateless connection architecture allowing users to connect any public MySQL database securely.
- **Premium Design System**: A sleek, dark-themed UI featuring Glassmorphism, tailored gradients, and high-end micro-animations.
- **Modern AI Loading State**: A custom "AI Thinking" pulse animation that scans schema while processing queries.
- **Security First**: 
  - JWT-based User Authentication.
  - End-to-End encrypted database session tokens (credentials never stored on the server).
  - Aiven SSL support for encrypted database transport.
- **Custom 404 Experience**: A beautiful, animated "Look like you're lost" experience using framed motion.

---

## 🛠️ Technology Stack

| Layer | Technology Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion |
| **Backend** | FastAPI (Python 3.10+), Uvicorn |
| **AI/LLM** | Groq API (LLama 3.1 70B) |
| **Database** | MySQL (Optimized for Aiven Cloud) |
| **ORM/Driver** | SQLAlchemy, PyMySQL |
| **Icons** | Lucide React |

---

## 🌊 User Journey & Flow

Whether you are a data analyst or a developer, getting started is easy:

### **1. Secure Sign-In**
- Reach the [Login Page](https://ask-your-db-gen-ai.vercel.app/login).
- Use your credentials (Default: `admin` / `admin`).
- Your session is secured with a time-limited JWT token.

### **2. Connect Your Source**
- On the **Connect Source** screen, provide your MySQL host details.
- **Note**: Ensure your database allows public access (0.0.0.0/0 whitelist requested for Render).
- Your credentials are encrypted locally and sent via headers; we never save your password to our repository.

### **3. Ask Questions**
- Type your query in plain English (e.g., *"Show me all users who signed up last week"*).
- Watch the **AI Scanner** animation as it analyzes your schema and writes the SQL for you.

### **4. Analyze Results**
- Review the **Generated SQL** in the terminal-style code block.
- Browse the data in the interactive results table.
- Copy the SQL with one click for use in other tools.

---

## 🚀 Local Setup

### **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app:app --reload
```

### **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Security Guarantee
AskDB uses a **Stateless Architecture**. Your database credentials are only alive while you are using the app. We do not store your passwords in any backend database. Everything is handled via an encrypted session token stored in your browser's session storage.

---

*Built with ❤️ for intelligent data exploration.*
