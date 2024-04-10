import { Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(stealthPlugin());

let instance: Browser;

// https://github.com/puppeteer/puppeteer/issues/2444#issuecomment-384698480
export const getBrowserInstance = async (): Promise<Browser> => {
  if (!instance) {
    instance = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true
    });
  }
  return instance;
};
