// const { KnownDevices } = require("puppeteer")
const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
import { Browser } from "puppeteer";

puppeteer.use(stealthPlugin());

puppeteer
  .launch({ headless: false, stealth: true, ignoreHTTPSErrors: true })
  .then(async (browser: Browser) => {
    const page = await browser.newPage();

    // Enabling dynamic User-Agent rotation
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "userAgent", {
        get() {
          return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
        }
      });
    });

    // Emulating an iPhone X
    //   const iPhoneX = KnownDevices['iPhone 6']
    //   await page.emulate(iPhoneX);

    // Scraping logic here
    await page.goto("https://www.binance.com/en/copy-trading");
    const data = await page.evaluate(() => {
      return document.body.innerText;
    });
    // page.waitForNetworkIdle
    console.log("Scraped Data:", data);
    await browser.close();
  });
