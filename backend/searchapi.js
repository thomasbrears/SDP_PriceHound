import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';

// Initialize Express app & packages etc.
const app = express();
const PORT = 5001;
app.use(cors());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

// Function to perform scraping
const performScraping = async (searchTerm) => {
  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
    // Hidden browser settings w/ custom settings to hide footprints
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    ],
    defaultViewport: { width: 1920, height: 1080 },
  });

  // Open new page
  const page = await browser.newPage();

  // **********************
  // Specific Search Scrape 
  // **********************

  try {
    console.log('Navigating to homepage...');
    await page.goto('https://www.priceme.co.nz', { waitUntil: 'networkidle2' });

    console.log('Entering search term:', searchTerm);
    await page.type('#searchTextBox', searchTerm);

    console.log('Pressing "Enter" to search...');
    await page.keyboard.press('Enter');

    console.log('Waiting for search results to load...');
    await page.waitForSelector('.c-product, div.product-item.pdp', { timeout: 60000 });

    console.log('Running specific search scraper...');
    let searchResults = await page.evaluate(() => {
      const productItems = Array.from(document.querySelectorAll('.c-product'));

      return productItems.map((item) => {
        const shopLogo = item.querySelector('amp-img')?.getAttribute('src') || item.querySelector('img')?.src;
        const title = item.querySelector('.title')?.innerText.trim();
        const price = item.querySelector('.total-price')?.innerText.trim();
        const productLink = item.querySelector('.title a')?.href;
        const shippingStockAvailable = item.querySelector('.notdelivery') ? 'No delivery stock' : 'Delivery stock available';

        // Attempt to get the direct shop link using multiple selectors
        let shopLink = item.querySelector('#compare-price > div > div.content > div:nth-child(4) > div:nth-child(3) > div.d-flex.justify-content-between.align-items-md-center.main > div.d-flex.flex-column.flex-md-row.align-items-md-center.price-shipping > a')?.href;
        // If the first selector doesn't work, try other possible selectors
        if (!shopLink) {
          shopLink = item.querySelector('#compare-price > div > div.content > div:nth-child(4) > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(2) > a')?.href;
        }
        if (!shopLink) {
          shopLink = item.querySelector('.d-flex.justify-content-between.align-items-md-center.main a')?.href;
        }
        if (!shopLink) {
          shopLink = item.querySelector('.d-flex.flex-column.flex-md-row.align-items-md-center.price-shipping a')?.href;
        }

        const deliveryInfo = item.querySelector('.dropdown .delivery')?.innerText.trim();

        return shopLogo || title || price || productLink ? { shopLogo, title, price, productLink, shippingAvailable: shippingStockAvailable, shopLink, deliveryInfo } : null;
      }).filter((item) => item !== null);
    });

    if (!searchResults || searchResults.length === 0) {
      console.log('Specific search returned no results, running broad search...');
      
    // ****************************************  
    // If no results, run a broad search scrape
    // ****************************************

      const broadSearchUrl = `https://www.priceme.co.nz/search.aspx?q=${encodeURIComponent(searchTerm)}`;
      console.log('Navigating to broad search URL:', broadSearchUrl);
      await page.goto(broadSearchUrl, { waitUntil: 'networkidle2' });

      console.log('Running broad search scraper...');
      searchResults = await page.evaluate(() => {
        const productItems = Array.from(document.querySelectorAll('div.product-item.pdp'));

        return productItems.map((item) => {
          const image = item.querySelector('amp-img')?.getAttribute('src') || item.querySelector('img')?.getAttribute('src');
          const name = item.querySelector('.name')?.innerText.trim();
          const price = item.querySelector('.price')?.innerText.trim();
          const compareLink = item.querySelector('.compare a')?.getAttribute('href');

          return image && name && price && compareLink ? { image, name, price, compareLink } : null;
        }).filter((item) => item !== null);
      });
    }

    console.log('Final search results:', searchResults);
    await browser.close();
    return searchResults;
  } catch (error) {
    console.error('Error occurred during scraping:', error);
    await browser.close();
    throw error;
  }
}; // END OF SCRAPING FUNCTION

// Express route to use scraping
app.get('/api/search', async (req, res) => {
  const searchTerm = req.query.query;
  if (!searchTerm) {
    return res.status(400).json({ error: 'No search term provided' });
  }

  try {
    const results = await performScraping(searchTerm);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error performing search' });
  }
});

// Server responding?
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
