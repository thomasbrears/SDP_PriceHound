import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const searchProduct = async (searchTerm) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('Navigating to homepage...');
    await page.goto('https://www.priceme.co.nz', { waitUntil: 'networkidle2' });

    // Use the website's main search box
    const searchInputSelector = '#searchTextBox'; // Adjust based on the actual search box selector
    const searchButtonSelector = 'button[type="submit"]'; // Adjust based on the actual search button selector

    console.log('Entering search term:', searchTerm);
    await page.type(searchInputSelector, searchTerm);
    await page.click(searchButtonSelector);

    // Wait for navigation to complete
    console.log('Waiting for search results to load...');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Run the specific search scraper first
    console.log('Running specific search scraper...');
    let searchResults = await page.evaluate(() => {
      console.log('Scraping main product images...');
      const imageContainer = document.querySelector('.container.product');
      let productImages = [];
      if (imageContainer) {
        productImages = Array.from(imageContainer.querySelectorAll('img')).map(img => img.src);
        console.log('Product images found:', productImages.length);
      } else {
        console.log('No product images found.');
      }

      console.log('Scraping product items...');
      const productItems = Array.from(document.querySelectorAll('.c-product')); // Adjust selector based on actual class name
      console.log('Product items found:', productItems.length);

      const data = productItems.map(item => {
        const shopLogo = item.querySelector('img')?.src;
        const noDelivery = item.querySelector('.notdelivery');
        const shippingAvailable = noDelivery ? 'No delivery available' : 'Delivery available';
        const title = item.querySelector('.title')?.innerText.trim();
        const price = item.querySelector('.total-price')?.innerText.trim();
        const productLink = item.querySelector('.title a')?.href;
        const trackLink = item.querySelector('a[rel="nofollow"]')?.href;

        if (shopLogo || shippingAvailable || title || price || productLink || trackLink) {
          console.log('Scraped data for a product:', {
            shopLogo,
            shippingAvailable,
            title,
            price,
            productLink,
            trackLink,
          });
          return {
            productImages,
            shopLogo,
            shippingAvailable,
            title,
            price,
            productLink,
            trackLink,
          };
        }

        console.log('No valid data found for this item.');
        return null;
      }).filter(item => item !== null);

      return data;
    });

    // If the specific search fails or returns an empty array, run the broad search scraper
    if (!searchResults || searchResults.length === 0) {
      console.log("Specific search returned no results, running broad search...");

      searchResults = await page.evaluate(() => {
        console.log('Running broad search scraper...');
        const productItems = Array.from(document.querySelectorAll('div.product-item.pdp')); // Adjust selector based on actual class name
        console.log('Broad search product items found:', productItems.length);

        const data = productItems.map(item => {
          const image = item.querySelector('img')?.getAttribute('src'); // Extract the image URL
          const name = item.querySelector('.name')?.innerText.trim();
          const price = item.querySelector('.price')?.innerText.trim();
          const compareLink = item.querySelector('.compare a')?.getAttribute('href');

          if (image && name && price && compareLink) {
            console.log('Scraped data for a broad search product:', {
              image,
              name,
              price,
              compareLink
            });
            return {
              image,
              name,
              price,
              compareLink
            };
          }

          console.log('No valid data found for this item in broad search.');
          return null;
        }).filter(item => item !== null);

        return data;
      });
    }

    console.log('Final search results:', searchResults);
    await browser.close();
  } catch (error) {
    console.error('Error occurred during scraping:', error);
    await browser.close();
  }
};

// Example usage
const searchTerm = 'dynamic_search_term_here'; // Replace with dynamic input from your website
searchProduct(searchTerm);
