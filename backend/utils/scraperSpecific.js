import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const main = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.priceme.co.nz/search.aspx?q=iphone', { waitUntil: 'networkidle2' }); // Use your actual search URL

  // Extract data for each product in the broad search result
  const searchResults = await page.evaluate(() => {
    // Select all product containers
    const productItems = Array.from(document.querySelectorAll('div.product-item.pdp')); // Adjust selector based on actual class name

    const data = productItems.map(item => {
      const image = item.querySelector('img')?.getAttribute('src'); // Extract the image URL
      const name = item.querySelector('.name')?.innerText.trim(); // Extract the product name
      const price = item.querySelector('.price')?.innerText.trim(); // Extract the price
      const compareLink = item.querySelector('.compare a')?.getAttribute('href'); // Extract the link to compare prices

      // Only return non-empty results
      if (image && name && price && compareLink) {
        return {
          image,
          name,
          price,
          compareLink
        };
      }

      return null; // Return null for empty results
    }).filter(item => item !== null); // Filter out null values

    return data; // Return the scraped data
  });

  console.log(searchResults);

  await browser.close();
};

main();
