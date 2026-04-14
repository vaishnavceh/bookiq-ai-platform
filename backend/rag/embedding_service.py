from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from books.models import Book

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
COLLECTION_NAME = "books_embeddings"

# Load once
model = SentenceTransformer(MODEL_NAME)

# Persistent local Chroma database folder
chroma_client = chromadb.PersistentClient(path="./chroma_db")

embedding_function = SentenceTransformerEmbeddingFunction(
    model_name=MODEL_NAME
)

collection = chroma_client.get_or_create_collection(
    name=COLLECTION_NAME,
    embedding_function=embedding_function
)


def build_book_text(book):
    parts = [
        f"Title: {book.title}",
        f"Author: {book.author or 'Unknown'}",
        f"Genre: {book.genre or 'Unknown'}",
        f"Description: {book.description or ''}",
        f"Summary: {book.summary or ''}",
        f"Sentiment: {book.sentiment or ''}",
    ]
    return "\n".join(parts)


def index_books():
    books = Book.objects.all()

    ids = []
    documents = []
    metadatas = []

    for book in books:
        ids.append(str(book.id))
        documents.append(build_book_text(book))
        metadatas.append(
            {
                "book_id": book.id,
                "title": book.title,
                "author": book.author or "",
                "book_url": book.book_url,
                "genre": book.genre or "",
            }
        )

    if ids:
        # Safe reset for demo development
        existing = collection.get()
        existing_ids = existing.get("ids", [])
        if existing_ids:
            collection.delete(ids=existing_ids)

        collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
        )

    return len(ids)


def semantic_search(question, n_results=3):
    results = collection.query(
        query_texts=[question],
        n_results=n_results,
    )
    return results