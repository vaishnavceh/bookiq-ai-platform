from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from books.models import Book
from .services import scrape_books


class ScrapeBooksView(APIView):
    def post(self, request):
        max_pages = int(request.data.get("max_pages", 5))

        scraped_books = scrape_books(max_pages=max_pages)
        saved_books = []

        for item in scraped_books:
            book, created = Book.objects.get_or_create(
                book_url=item["book_url"],
                defaults=item
            )
            saved_books.append(
                {
                    "title": book.title,
                    "created": created
                }
            )

        return Response(
            {
                "message": "Scraping completed",
                "pages_scraped": max_pages,
                "total_scraped": len(scraped_books),
                "saved_books": saved_books
            },
            status=status.HTTP_200_OK
        )