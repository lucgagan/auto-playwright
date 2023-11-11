import { sanitizeHtml } from "./sanitizeHtml";
import { Page } from "./types";

export const getSnapshot = async (page: Page) => {
  return {
    dom: sanitizeHtml(await page.content()),
  };
};
