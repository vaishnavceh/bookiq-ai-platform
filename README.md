# 📚 BookIQ – AI-Powered Book Intelligence Platform

BookIQ is a full-stack AI application that combines **web scraping, backend APIs, and semantic AI search** to create an intelligent system for exploring and querying books.

It allows users to **search, analyze, and ask questions about books** using embedding-based semantic retrieval instead of simple keyword matching.

---

## 🚀 Features

### 🔍 Data Collection
- Multi-page web scraping using Selenium  
- Extracts book details like title, author, rating, description, and genre  
- Scales to 100+ books  

### 🗄️ Backend System
- Built with Django & Django REST Framework  
- MySQL database for structured storage  
- REST APIs for books, scraping, indexing, and AI queries  

### 🧠 AI Capabilities
- Semantic search using Sentence Transformers  
- Vector storage using ChromaDB  
- Retrieval-Augmented Generation (RAG-style responses)  
- Context-aware question answering  

### 📊 Recommendation System
- Suggests similar books based on embedding similarity  
- Uses cosine similarity for ranking  

### 🎨 Frontend (Next.js)
- Modern UI built with Next.js + Tailwind CSS  
- Glassmorphism design  
- Search interface + AI Q&A page  
- Book detail and recommendation views  

---

## 🧠 How It Works

1. Books are scraped from websites using Selenium  
2. Data is stored in MySQL via Django models  
3. Book content is converted into embeddings  
4. Embeddings are stored in ChromaDB  
5. User queries are converted into embeddings  
6. Similar books are retrieved using vector similarity  
7. Results are returned with context-aware answers  

---

## 🛠️ Tech Stack

### Backend
- Django  
- Django REST Framework  
- MySQL  
- Selenium  

### AI / ML
- Sentence Transformers (`all-MiniLM-L6-v2`)  
- ChromaDB  
- Cosine similarity  

### Frontend
- Next.js (App Router)  
- Tailwind CSS  

---

## 📂 Project Structure

```bash
book-rag-platform/
│
├── backend/
│   ├── books/
│   ├── scraper/
│   ├── rag/
│   └── config/
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── public/
│
├── requirements.txt
├── README.md
└── .gitignore
