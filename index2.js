const puppeteer = require('puppeteer');

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto('https://www.binance.com/en/copy-trading');

  // Evaluate JavaScript
  const three = await page.evaluate(() => {
    return 1 + 2;
  });

  console.log(three);

  // Close browser.
  await browser.close();
})();