import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';

// Use Stealth and Adblocker plugins to cover tracks
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const main = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.priceme.co.nz/Logitech-G512/p-901158410.aspx', { waitUntil: 'networkidle2' });

  // Extract search data
  const searchData = await page.evaluate(() => {
    // Select only the visible product elements 
    const productItems = Array.from(document.querySelectorAll('.c-product')); 
    const data = productItems.map(item => {
      const shopLogo = item.querySelector('img')?.src;
      const noDelivery = item.querySelector('.notdelivery'); 
      const shippingAvailable = noDelivery ? 'No delivery available' : 'Delivery available'; 
      const title = item.querySelector('.title')?.innerText.trim(); 
      const price = item.querySelector('.total-price')?.innerText.trim(); 
      const productLink = item.querySelector('.title a')?.href; 
      const trackLink = item.querySelector('a[rel="nofollow"]')?.href; 

      // Only return non-empty results
      if (shopLogo || shippingAvailable || title || price || productLink || trackLink) {
        return {
          shopLogo,
          shippingAvailable,
          title,
          price,
          productLink,
          trackLink,
        };
      }

      return null; // Return null for empty results
    }).filter(item => item !== null); // Filter out null values

    return data; // Return the cleaned data
  });

  console.log(searchData);

  await browser.close();
};

main();
