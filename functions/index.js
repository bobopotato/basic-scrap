// const { KnownDevices } = require("puppeteer")
const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(stealthPlugin());

puppeteer
  .launch({
    headless: false,
    stealth: true,
    ignoreHTTPSErrors: true,
    args: ["--no-sandbox"]
  })
  .then(async (browser) => {
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
    try {
      await page.goto(
        "https://orbitingweb.com/blog/intro-to-web-scrapping/#:~:text=Explaining%20how%20web%20scrapping%20works,extract%20the%20data%20you%20need."
      );
      // await page.goto("https://www.google.com");
      // await page.goto("https://www.binance.com/en/copy-trading");
    } catch (err) {
      console.log(err);
      await page.waitForNavigation();
      await page.reload();
    }
    //.entry-content

    // const data = await page.$eval("div.grid-cols-1", (element) => {
    //   // const children = element.children.map((child) => () => {
    //   //   console.log("testt");
    //   // });
    //   const children = [];
    //   for (const child of element.children) {
    //     children.push(() => {
    //       console.log("testt");
    //     });
    //   }
    //   return element;
    // });

    // console.log("Scraped Data:", data);

    // for (const child of data) {
    //   console.log("testt");
    // }
    // console.log("Scraped Data:", JSON.stringify(data));
    // console.log("Scraped Data:", data?.children);
    // data.click();
    // data?.forEach((element) => {
    //   console.log("1");
    //   // element();
    // });

    // await browser.close();

    // TESTING PHASE
    const data = await page.$eval(".entry-content", (element) => {
      const children = [];
      for (const child of element.children) {
        children.push({
          tagName: child.tagName,
          innerHTML: child.innerHTML
        });
      }
      return children;
    });
    console.log({ data });
    for (const child of data) {
      // console.log(`aqweqwe`);
      console.log({ child });
    }

    // https://github.com/puppeteer/puppeteer/issues/9382
  });
