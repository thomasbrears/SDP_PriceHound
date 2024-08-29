import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';

// Initialize Express app
const app = express();
const PORT = 5000;

// Use CORS to allow cross-origin requests
app.use(cors());

// Use Puppeteer plugins
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

// Function to perform the scraping
const performScraping = async (searchTerm) => {
  // Launch Puppeteer browser with additional anti-detection options
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
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
      return productItems.map(item => {
        // Use amp-img src or fallback to normal img src
        const shopLogo = item.querySelector('amp-img')?.getAttribute('src') || 
                         item.querySelector('img')?.src;
        const title = item.querySelector('.title')?.innerText.trim();
        const price = item.querySelector('.total-price')?.innerText.trim();
        const productLink = item.querySelector('.title a')?.href;
        const shippingAvailable = item.querySelector('.notdelivery') ? 'No delivery available' : 'Delivery available';

        return shopLogo || title || price || productLink ? { shopLogo, title, price, productLink, shippingAvailable } : null;
      }).filter(item => item !== null);
    });

    // If no specific results, run a broad search
    if (!searchResults || searchResults.length === 0) {
      console.log('Specific search returned no results, running broad search...');

      const broadSearchUrl = `https://www.priceme.co.nz/search.aspx?q=${encodeURIComponent(searchTerm)}`;
      console.log('Navigating to broad search URL:', broadSearchUrl);
      await page.goto(broadSearchUrl, { waitUntil: 'networkidle2' });

      console.log('Running broad search scraper...');
      searchResults = await page.evaluate(() => {
        const productItems = Array.from(document.querySelectorAll('div.product-item.pdp'));
        return productItems.map(item => {
          // Handle amp-img and normal img elements
          const image = item.querySelector('amp-img')?.getAttribute('src') || 
                        item.querySelector('img')?.getAttribute('src');
          const name = item.querySelector('.name')?.innerText.trim();
          const price = item.querySelector('.price')?.innerText.trim();
          const compareLink = item.querySelector('.compare a')?.getAttribute('href');

          return image && name && price && compareLink ? { image, name, price, compareLink } : null;
        }).filter(item => item !== null);
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

// Define a route to handle search requests
app.get('/api/search', async (req, res) => {
  const searchTerm = req.query.query; // Assuming the query parameter is 'query'
  console.log('Received search query:', searchTerm);

  try {
    const searchResults = await performScraping(searchTerm);
    res.json(searchResults); // Send the search results as JSON response
  } catch (error) {
    res.status(500).json({ error: 'Scraping failed.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
