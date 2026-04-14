from django.urls import path
from .views import BookListView, BookDetailView, BookRecommendationView

urlpatterns = [
    path('books/', BookListView.as_view(), name='book-list'),
    path('books/<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    path('books/<int:pk>/recommendations/', BookRecommendationView.as_view(), name='book-recommendations'),
]   