// const { KnownDevices } = require("puppeteer")
const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
const { setTimeout } = require("node:timers/promises");

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

    page.on("console", (msg) => {
      // console.log(`console msg =>`, msg);
      console.log(`${msg.type().substr(0, 3).toUpperCase()} ${msg.text()}`);
    });

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
    await secureNavigateTo(page, "https://www.binance.com/en/copy-trading");
    // await page.goto(
    //   "https://orbitingweb.com/blog/intro-to-web-scrapping/#:~:text=Explaining%20how%20web%20scrapping%20works,extract%20the%20data%20you%20need."
    // );
    // await page.goto("https://www.google.com");

    console.log(`running here await`);
    const data = await page.$eval(".grid-cols-1", async (element) => {
      // const children = element.children.map((child) => () => {
      //   console.log("testt");
      // });
      const children = [];
      // const innerPage = await element.children[0].click();
      // console.log(`here inner page`);
      // console.log({ innerPage });
      // const isHidden = await innerPage.$eval(
      //   ".lead-hide-position",
      //   (element) => {
      //     return element;
      //   }
      // );

      // console.log({ isHidden });
      for (const child of element.children) {
        child.click();
        //   // children.push(child.click);
        //   // children.push({
        //   //   tagName: child.tagName,
        //   //   innerHTML: child.innerHTML
        //   // });
      }
      return children;
      // for (const child of element.children) {
      //   children.push(() => {
      //     console.log("testt");
      //   });
      // }
      // return element;
    });
    console.log(`finished running`);
    console.log({ data });
    await setTimeout(15000);

    const result = [];
    // await page.waitForTimeout(10000);
    const allPages = await browser.pages();
    for (const innerPage of allPages) {
      await innerPage.waitForNetworkIdle();
      try {
        const data = await innerPage.$eval("div.PositionsTable", (element) => {
          const isHidden = element.innerHTML?.includes("lead-hide-position");
          console.log({ isHidden });
          // result.push(isHidden);
          return isHidden;
        });
        if (data) {
          innerPage.close();
        }
        console.log({ data });
        result.push(data);
      } catch (err) {
        console.log(`NOT FOUND Error: ${err}`);
      }
      // try {
      //   const isHidden = await innerPage.$eval(
      //     "div.lead-hide-position",
      //     (element) => {
      //       console.log(`wtf?`);
      //       return element;
      //     }
      //   );
      //   console.log({ isHidden });
      // }
    }
    console.log({ result });
    // for (const child of data) {
    //   console.log("testt");
    //   child();
    // }

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
    // const data = await page.$eval(".entry-content", (element) => {
    //   const children = [];
    //   for (const child of element.children) {
    //     children.push({
    //       tagName: child.tagName,
    //       innerHTML: child.innerHTML
    //     });
    //   }
    //   return children;
    // });
    // console.log({ data });
    // for (const child of data) {
    //   // console.log(`aqweqwe`);
    //   console.log({ child });
    // }

    // https://github.com/puppeteer/puppeteer/issues/9382
  });

const secureNavigateTo = async (page, url) => {
  try {
    await page.goto(url);
  } catch (err) {
    console.log(err);
    await page.waitForNavigation();
    await page.reload();
  }
};
