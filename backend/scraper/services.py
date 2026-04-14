from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import time


def rating_label_to_number(label):
    mapping = {
        "One": 1.0,
        "Two": 2.0,
        "Three": 3.0,
        "Four": 4.0,
        "Five": 5.0,
    }
    return mapping.get(label, None)


def get_text_or_default(driver, by, value, default=""):
    try:
        return driver.find_element(by, value).text.strip()
    except NoSuchElementException:
        return default


def scrape_book_detail(driver, book_url):
    driver.get(book_url)
    time.sleep(1)

    description = ""
    genre = "Unknown"
    reviews_count = 0
    rating_value = None

    # Genre from breadcrumb/category
    try:
        breadcrumb_items = driver.find_elements(By.CSS_SELECTOR, "ul.breadcrumb li a")
        if len(breadcrumb_items) >= 3:
            genre = breadcrumb_items[2].text.strip()
    except Exception:
        pass

    # Description
    try:
        description = driver.find_element(By.CSS_SELECTOR, "#product_description + p").text.strip()
    except NoSuchElementException:
        description = ""

    # Rating
    try:
        rating_element = driver.find_element(By.CSS_SELECTOR, "p.star-rating")
        classes = rating_element.get_attribute("class").split()
        rating_label = next((cls for cls in classes if cls in ["One", "Two", "Three", "Four", "Five"]), "")
        rating_value = rating_label_to_number(rating_label)
    except NoSuchElementException:
        pass

    # Reviews count from table
    try:
        rows = driver.find_elements(By.CSS_SELECTOR, "table.table.table-striped tr")
        for row in rows:
            header = row.find_element(By.TAG_NAME, "th").text.strip()
            value = row.find_element(By.TAG_NAME, "td").text.strip()
            if header == "Number of reviews":
                reviews_count = int(value)
                break
    except Exception:
        pass

    return {
        "description": description,
        "genre": genre,
        "reviews_count": reviews_count,
        "rating": rating_value,
    }


def scrape_books(max_pages=10):
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(options=options)
    books = []

    try:
        base_url = "https://books.toscrape.com/catalogue/page-{}.html"

        for page in range(1, max_pages + 1):
            url = base_url.format(page)
            driver.get(url)
            time.sleep(1.5)

            items = driver.find_elements(By.CLASS_NAME, "product_pod")

            if not items:
                break

            listing_books = []
            for item in items:
                try:
                    title = (
                        item.find_element(By.TAG_NAME, "h3")
                        .find_element(By.TAG_NAME, "a")
                        .get_attribute("title")
                    )

                    book_url = (
                        item.find_element(By.TAG_NAME, "h3")
                        .find_element(By.TAG_NAME, "a")
                        .get_attribute("href")
                    )

                    price = ""
                    try:
                        price = item.find_element(By.CLASS_NAME, "price_color").text.strip()
                    except NoSuchElementException:
                        pass

                    listing_books.append(
                        {
                            "title": title,
                            "book_url": book_url,
                            "price": price,
                        }
                    )
                except Exception as e:
                    print(f"Skipping one listing on page {page}: {e}")

            for listing_book in listing_books:
                try:
                    detail = scrape_book_detail(driver, listing_book["book_url"])

                    books.append(
                        {
                            "title": listing_book["title"],
                            "author": "Unknown",
                            "rating": detail["rating"],
                            "reviews_count": detail["reviews_count"],
                            "description": detail["description"] or f"Price: {listing_book['price']}",
                            "book_url": listing_book["book_url"],
                            "genre": detail["genre"],
                            "summary": f"{listing_book['title']} is a scraped book entry from Books to Scrape.",
                            "sentiment": "Neutral",
                        }
                    )
                except Exception as e:
                    print(f"Skipping detail scrape for {listing_book['title']}: {e}")

    finally:
        driver.quit()

    return books