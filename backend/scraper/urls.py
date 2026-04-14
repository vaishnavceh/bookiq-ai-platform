from django.urls import path
from .views import ScrapeBooksView

urlpatterns = [
    path('scrape/', ScrapeBooksView.as_view(), name='scrape-books'),
]