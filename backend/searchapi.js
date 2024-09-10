import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";

// Initialize Express app & packages etc.
const app = express();
const PORT = 5001;
app.use(cors());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

// Function to perform scraping
const performScraping = async (searchTerm, sortOrder, priceRange) => {
  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
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

  const page = await browser.newPage();

  // Helper function to scrape data
  const scrapeData = async (selector) => {
    return await page.evaluate((selector) => {
      const productItems = Array.from(document.querySelectorAll(selector)).map((item) => {
        const image = item.querySelector('amp-img')?.getAttribute('src') || item.querySelector('img')?.getAttribute('src');
        const name = item.querySelector('.name')?.innerText.trim();
        const price = item.querySelector('.price')?.innerText.trim();
        const compareLink = item.querySelector('.compare a')?.getAttribute('href');

        return image && name && price && compareLink ? { image, name, price, compareLink } : null;
      }).filter((item) => item !== null);

      return productItems;
    }, selector);
  };

  // Navigation
  try {
    console.log("Navigating to homepage...");
    await page.goto("https://www.priceme.co.nz", { waitUntil: "networkidle2" });

    console.log("Entering search term:", searchTerm);
    await page.type("#searchTextBox", searchTerm);

    console.log('Pressing "Enter" to search...');
    await page.keyboard.press("Enter");

    console.log('Waiting for search results to load...');
    await page.waitForSelector('.c-product, div.product-item.pdp', { timeout: 60000 });

    console.log('Running specific search scraper...');
    let searchResults = await scrapeData('.c-product');

    if (!searchResults || searchResults.length === 0) {
      console.log('Specific search returned no results, running broad search...');

      // If no results, run a broad search scrape
      let broadSearchUrl = `https://www.priceme.co.nz/search.aspx?q=${encodeURIComponent(searchTerm)}`;
      if (sortOrder) {
        broadSearchUrl += `&sb=${encodeURIComponent(sortOrder)}`;
      }
      if(priceRange){
        broadSearchUrl += `&${priceRange}`;
      }
      console.log("Navigating to broad search URL:", broadSearchUrl);
      await page.goto(broadSearchUrl, { waitUntil: "networkidle2" });

      console.log('Running broad search scraper...');
      searchResults = await scrapeData('div.product-item.pdp');

      // Extract price ranges from broad search page
      const priceRanges = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.default-radio p')).map((element) => element.innerText.trim());
      });

      console.log('Price ranges:', priceRanges); // Print price ranges to check

      console.log('Final search results:', searchResults);
      await browser.close();
      return { searchResults, priceRanges };
    }

    console.log("Final search results:", searchResults);
    await browser.close();
    return { searchResults };  // Only return searchResults if specific search succeeds

  } catch (error) {
    console.error("Error occurred during scraping:", error);
    await browser.close();
    throw error;
  }
};

// Express route to use scraping
app.get("/api/search", async (req, res) => {
  console.log("Incoming Request:", req.query); // 打印查询参数
  let searchTerm = req.query.query;
  let sortOrder = req.query.sort;
  let priceRange = req.query.priceRange;

  if (!searchTerm) {
    return res.status(400).json({ error: "No search term provided" });
  }

  try {
    const { searchResults, priceRanges } = await performScraping(searchTerm, sortOrder, priceRange);
    res.json({ searchResults, priceRanges });
  } catch (error) {
    res.status(500).json({ error: "Error performing search" });
  }
});

// Server responding?
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));