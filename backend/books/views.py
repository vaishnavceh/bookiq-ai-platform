from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Book
from .serializers import BookSerializer


class BookListView(generics.ListCreateAPIView):
    queryset = Book.objects.all().order_by('-created_at')
    serializer_class = BookSerializer


class BookDetailView(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class BookRecommendationView(APIView):
    def get(self, request, pk):
        try:
            book = Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=404)

        recommendations = Book.objects.exclude(pk=book.pk)

        if book.genre:
            recommendations = recommendations.filter(genre__iexact=book.genre)

        recommendations = recommendations.order_by('-rating')[:5]

        serializer = BookSerializer(recommendations, many=True)
        return Response({
            "selected_book": book.title,
            "recommendations": serializer.data
        })