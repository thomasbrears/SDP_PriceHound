import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';

// Initialize Express app
const app = express();
const PORT = 5000;

app.use(cors());

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const performScraping = async (searchTerm) => {
  const browser = await puppeteer.launch({
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

  const page = await browser.newPage();

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
        // Main product scraping logic
        const shopLogo = item.querySelector('amp-img')?.getAttribute('src') || item.querySelector('img')?.src;
        const title = item.querySelector('.title')?.innerText.trim();
        const price = item.querySelector('.total-price')?.innerText.trim();
        const productLink = item.querySelector('.title a')?.href;
        const shippingAvailable = item.querySelector('.notdelivery') ? 'No delivery available' : 'Delivery available';

        return shopLogo || title || price || productLink ? { shopLogo, title, price, productLink, shippingAvailable } : null;
      }).filter((item) => item !== null);
    });

    if (!searchResults || searchResults.length === 0) {
      console.log('Specific search returned no results, running broad search...');

      const broadSearchUrl = `https://www.priceme.co.nz/search.aspx?q=${encodeURIComponent(searchTerm)}`;
      console.log('Navigating to broad search URL:', broadSearchUrl);
      await page.goto(broadSearchUrl, { waitUntil: 'networkidle2' });

      console.log('Running broad search scraper...');
      searchResults = await page.evaluate(() => {
        const productItems = Array.from(document.querySelectorAll('div.product-item.pdp'));

        return productItems.map((item) => {
          // Broad search product scraping logic
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
};

// Sample express route to use scraping
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
