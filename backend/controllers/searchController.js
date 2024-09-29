import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';

// Use Puppeteer plugins
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

// Function to perform scraping
export const performScraping = async (searchTerm, sortOrder, priceRange) => {
  let browser; // Declare browser in the outer scope to ensure proper closure in error handling
  
  try {
    // Launch Puppeteer browser
    console.log('Launching Puppeteer browser...');
    browser = await puppeteer.launch({
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
    console.log('Puppeteer browser launched successfully.');

    // **********************
    // Specific Search Scrape
    // **********************
    console.log('Navigating to homepage...');
    await page.goto('https://www.priceme.co.nz', { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Enter search term
    console.log('Entering search term:', searchTerm);
    await page.type('#searchTextBox', searchTerm);

    // Simulate search button by pressing "Enter"
    console.log('Pressing "Enter" to search...');
    await page.keyboard.press('Enter');

    console.log('Waiting for search results to load...');
    await page.waitForSelector('.c-product, div.product-item.pdp', { timeout: 60000 });

    console.log('Running specific search scraper...');

    // **********************
    // Get Product Image
    // **********************
    const mainImage = await page.evaluate(async () => {
      const imgSelector = 'amp-carousel amp-img > img.i-amphtml-fill-content.i-amphtml-replaced-content';
      const TIMEOUT_MS = 5000; // Timeout of 5 seconds
      const waitForImage = () => new Promise((resolve) => {
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

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: Image not found within the specified time')), TIMEOUT_MS);
      });

      try {
        const imgElement = await Promise.race([waitForImage(), timeoutPromise]);
        return imgElement ? imgElement.src : null;
      } catch (error) {
        console.error('Error fetching image:', error);
        return null;
      }
    });

    // ****************************************************
    // Get Search Results (image, title, price, link, etc.)
    // ****************************************************
    let searchResults = await page.evaluate(() => {
      const productItems = Array.from(document.querySelectorAll('.c-product'));

      return productItems.map((item) => {
        const shopLogo = item.querySelector('amp-img')?.getAttribute('src') || item.querySelector('img')?.src;
        const title = item.querySelector('.title')?.innerText.trim();
        const price = item.querySelector('.total-price')?.innerText.trim();
        const productLink = item.querySelector('.title a')?.href;
        const shippingStockAvailable = item.querySelector('.notdelivery') ? 'No delivery stock' : 'Delivery stock available';

        return shopLogo || title || price || productLink
          ? {
              shopLogo,
              title,
              price,
              productLink,
              shippingAvailable: shippingStockAvailable,
            }
          : null;
      }).filter((item) => item !== null);
    });

    // Append main image to the first product
    if (searchResults.length > 0) {
      searchResults[0].mainImage = mainImage;
    }

    if (!searchResults || searchResults.length === 0) {
      console.log('Specific search returned no results, running broad search...');

      let broadSearchUrl = `https://www.priceme.co.nz/search.aspx?q=${encodeURIComponent(searchTerm)}`;
      if (sortOrder) {
        broadSearchUrl += `&sb=${encodeURIComponent(sortOrder)}`;
      }
      if (priceRange) {
        broadSearchUrl += `&${priceRange}`;
      }
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
    return { searchResults };
  } catch (error) {
    console.error('Error occurred during scraping:', error);
    if (browser) {
      await browser.close(); // Ensure browser is closed on error
    }
    throw error; // Rethrow the error after logging and cleanup
  }
};
