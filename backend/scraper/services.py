from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import time


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
                        price = item.find_element(By.CLASS_NAME, "price_color").text
                    except NoSuchElementException:
                        pass

                    rating_label = ""
                    try:
                        rating_element = item.find_element(By.CLASS_NAME, "star-rating")
                        rating_label = (
                            rating_element.get_attribute("class")
                            .replace("star-rating", "")
                            .strip()
                        )
                    except NoSuchElementException:
                        pass

                    books.append(
                        {
                            "title": title,
                            "author": "Unknown",
                            "rating": None,
                            "reviews_count": 0,
                            "description": f"Price: {price}, Rating label: {rating_label}",
                            "book_url": book_url,
                            "genre": "Unknown",
                            "summary": f"{title} is a scraped book entry from Books to Scrape.",
                            "sentiment": "Neutral",
                        }
                    )
                except Exception as e:
                    print(f"Skipping one book on page {page}: {e}")

    finally:
        driver.quit()

    return books