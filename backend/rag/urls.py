from django.urls import path
from .views import AskBookQuestionView, IndexBooksView

urlpatterns = [
    path("ask/", AskBookQuestionView.as_view(), name="ask-book-question"),
    path("index/", IndexBooksView.as_view(), name="index-books"),
]