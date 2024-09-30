import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";

// Initialise Express app & packages etc.
const app = express();
const PORT = 5001;
app.use(cors());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

// Function to perform scraping
const performScraping = async (searchTerm, sortOrder, priceRange) => {
  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
    // Hidden browser settings w/ custom settings to hide footprints
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920x1080",
      "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    ],
    defaultViewport: { width: 1920, height: 1080 },
  });

  // Open new page
  const page = await browser.newPage();

  // **********************
  // Specific Search Scrape
  // **********************

  // Navigation
  try {
    console.log("Navigating to homepage...");
    await page.goto("https://www.priceme.co.nz", { waitUntil: "networkidle2" });

    // Enter search term
    console.log("Entering search term:", searchTerm);
    await page.type("#searchTextBox", searchTerm);

    // simulate search button my pressing "enter"
    console.log('Pressing "Enter" to search...');
    await page.keyboard.press("Enter");

    // Console log for debugging
    console.log("Waiting for search results to load...");
    await page.waitForSelector(".c-product, div.product-item.pdp", {
      timeout: 60000,
    });

    // Console log for debugging
    console.log("Running specific search scraper...");

    // **********************
    // Get Product Image
    // **********************

    // Get the main image of the first product, make it an async function as it can take time for image to load.
    const mainImage = await page.evaluate(async () => {
      const imgSelector =
        "amp-carousel amp-img > img.i-amphtml-fill-content.i-amphtml-replaced-content";
      const TIMEOUT_MS = 5000; // Timeout of 5 seconds
      const waitForImage = () =>
        new Promise((resolve) => {
          const checkImgLoaded = () => {
            const img = document.querySelector(imgSelector);
            if (img) {
              resolve(img);
            } else {
              requestAnimationFrame(checkImgLoaded);
            }
          };
          checkImgLoaded();
        });

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () =>
            reject(
              new Error("Timeout: Image not found within the specified time")
            ),
          TIMEOUT_MS
        );
      });

      // Use Promise.race() to race between the image loading promise and the timeout promise
      try {
        const imgElement = await Promise.race([waitForImage(), timeoutPromise]);
        return imgElement ? imgElement.src : null; // Return the image src or null if not found
      } catch (error) {
        console.error(error);
        return null;
      }
    });

    // ****************************************************
    // Get Search Results (image, title, price, link, etc.)
    // ****************************************************

    let searchResults = await page.evaluate(() => {
      const productItems = Array.from(document.querySelectorAll(".c-product"));

      return productItems
        .map((item) => {
          const shopLogo =
            item.querySelector("amp-img")?.getAttribute("src") ||
            item.querySelector("img")?.src;
          const title = item.querySelector(".title")?.innerText.trim();
          const price = item.querySelector(".total-price")?.innerText.trim();
          const productLink = item.querySelector(".title a")?.href;
          const shippingStockAvailable = item.querySelector(".notdelivery")
            ? "No delivery stock"
            : "Delivery stock available";

          // Attempt to get the direct shop link using multiple selectors
          let shopLink = item.querySelector(
            "#compare-price > div > div.content > div:nth-child(4) > div:nth-child(3) > div.d-flex.justify-content-between.align-items-md-center.main > div.d-flex.flex-column.flex-md-row.align-items-md-center.price-shipping > a"
          )?.href;
          if (!shopLink) {
            shopLink = item.querySelector(
              "#compare-price > div > div.content > div:nth-child(4) > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(2) > a"
            )?.href;
          }
          if (!shopLink) {
            shopLink = item.querySelector(
              ".d-flex.justify-content-between.align-items-md-center.main a"
            )?.href;
          }
          if (!shopLink) {
            shopLink = item.querySelector(
              ".d-flex.flex-column.flex-md-row.align-items-md-center.price-shipping a"
            )?.href;
          }

          const deliveryInfo = item
            .querySelector(".dropdown .delivery")
            ?.innerText.trim();

          return shopLogo || title || price || productLink
            ? {
                shopLogo,
                title,
                price,
                productLink,
                shippingAvailable: shippingStockAvailable,
                shopLink,
                deliveryInfo,
              }
            : null;
        })
        .filter((item) => item !== null);
    });

    // Append main image to the first product
    if (searchResults.length > 0) {
      searchResults[0].mainImage = mainImage;
    }

    if (!searchResults || searchResults.length === 0) {
      console.log(
        "Specific search returned no results, running broad search..."
      );

      // ****************************************
      // If no results, run a broad search scrape
      // ****************************************

      let broadSearchUrl = `https://www.priceme.co.nz/search.aspx?q=${encodeURIComponent(
        searchTerm
      )}`;
      if (sortOrder) {
        broadSearchUrl += `&sb=${encodeURIComponent(sortOrder)}`;
      }
      if (priceRange) {
        broadSearchUrl += `&${priceRange}`;
      }
      console.log("Navigating to broad search URL:", broadSearchUrl);
      await page.goto(broadSearchUrl, { waitUntil: "networkidle2" });

      console.log("Running broad search scraper...");
      searchResults = await page.evaluate(() => {
        const productItems = Array.from(
          document.querySelectorAll("div.product-item.pdp")
        );

        return productItems
          .map((item) => {
            const image =
              item.querySelector("amp-img")?.getAttribute("src") ||
              item.querySelector("img")?.getAttribute("src");
            const name = item.querySelector(".name")?.innerText.trim();
            const price = item.querySelector(".price")?.innerText.trim();
            const compareLink = item
              .querySelector(".compare a")
              ?.getAttribute("href");

            return image && name && price && compareLink
              ? { image, name, price, compareLink }
              : null;
          })
          .filter((item) => item !== null);
      });
    }

    // const priceRanges = await page.evaluate(() => {
    //   return Array.from(document.querySelectorAll('.default-radio p')).map((element) => element.innerText.trim());
    // });

    const priceRanges = await page.evaluate(() => {
      // creat one object to store all the price ranges
      const ranges = {};

      // address all the hidden inputs
      const inputs = document.querySelectorAll('input[type="hidden"]');

      inputs.forEach((input) => {
        const name = input.name;
        const value = parseFloat(input.value);

        // check if the input is a price range
        const match = name.match(/^pri-(\d+)-(min|max)$/);
        if (match) {
          const index = match[1];
          const type = match[2];

          if (!ranges[index]) {
            ranges[index] = {};
          }

          ranges[index][type] = value;
        }
      });

      // format the ranges
      const formattedRanges = Object.keys(ranges).map((index) => {
        const range = ranges[index];
        if (range.min != null && range.max != null) {
          return `$${range.min} — $${range.max}`;
        }
        return "";
      });

      return formattedRanges;
    });

    console.log("Final search results:", searchResults, priceRanges);
    await browser.close();
    return { searchResults, priceRanges };
  } catch (error) {
    console.error("Error occurred during scraping:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  };
};

// ************************
// END OF SCRAPING FUNCTION
// ************************

// Express route to use scraping
app.get("https://pricehound.tech/api/search", async (req, res) => {
  console.log("Incoming Request:", req.query); // print the incoming request query
  let searchTerm = req.query.query;
  let sortOrder = req.query.sort;
  let priceRange = req.query.priceRange;

  if (!searchTerm) {
    return res.status(400).json({ error: "No search term provided" });
  }

  try {
    const results = await performScraping(searchTerm, sortOrder, priceRange);
    res.json(results);
  } catch (error) {
    console.error("Search scraping failed:", error);
    res.status(500).json({ error: "Error performing search" });
  }
});

// Server responding?
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
