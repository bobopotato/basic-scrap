import { getBrowserInstance } from "@libs/scrapper";

export const scrapperNavigateTo = async ({ url }: { url: string }) => {
  const browser = await getBrowserInstance();
  const page = await browser.newPage();

  // Enabling dynamic User-Agent rotation
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "userAgent", {
      get() {
        return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
      }
    });
  });

  // Scraping logic here
  await page.goto(url, { waitUntil: "networkidle2" });
  return page;
  // const data = await page.evaluate(() => {
  //   return document.body.innerText;
  // });

  // console.log("Scraped Data:", data);

  // await browser.close();
  // return data;
};
