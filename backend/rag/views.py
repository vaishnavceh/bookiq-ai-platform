from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .embedding_service import index_books, semantic_search


class IndexBooksView(APIView):
    def post(self, request):
        count = index_books()
        return Response(
            {
                "message": "Books indexed successfully",
                "indexed_books": count,
            },
            status=status.HTTP_200_OK,
        )


class AskBookQuestionView(APIView):
    def post(self, request):
        question = request.data.get("question", "").strip()

        if not question:
            return Response(
                {"error": "Question is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        results = semantic_search(question, n_results=3)

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        if not documents:
            return Response(
                {"error": "No relevant books found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        best_meta = metadatas[0]
        best_doc = documents[0]

        return Response(
            {
                "question": question,
                "answer": f"The most relevant book is '{best_meta['title']}' by {best_meta.get('author', 'Unknown')}. It matches your query semantically based on its title, genre, description, and summary.",                "sources": [
                    {
                        "book_id": meta["book_id"],
                        "title": meta["title"],
                        "book_url": meta["book_url"],
                        "genre": meta.get("genre", ""),
                        "score_hint": None if i >= len(distances) else distances[i],
                    }
                    for i, meta in enumerate(metadatas)
                ],
            },
            status=status.HTTP_200_OK,
        )