import { getBrowserInstance } from "@libs/scrapper";
import { USER_AGENT_LIST, POPULAR_WEBSITES } from "@constants/webScraping";

const _getRandomArrayElement = (array: string[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export const scrapperNavigateTo = async ({ url }: { url: string }) => {
  const browser = await getBrowserInstance();
  const page = await browser.newPage();

  // Enabling dynamic User-Agent rotation
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "userAgent", {
      get() {
        return _getRandomArrayElement(USER_AGENT_LIST);
      }
    });
  });

  try {
    const randomUrl = _getRandomArrayElement(POPULAR_WEBSITES);
    await page.goto(randomUrl);
    await page.goto(url, { waitUntil: "networkidle2" });
  } catch (err) {
    console.error("Error while navigating to URL:", err);
    await page.waitForNavigation();
    await page.reload();
  }

  return page;
};
