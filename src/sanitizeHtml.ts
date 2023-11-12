import sanitize from "sanitize-html";

/**
 * The reason for sanitization is because OpenAI does not need all of the HTML tags
 * to know how to interpret the website, e.g. it will not make a difference to AI if
 * we include or exclude <script> tags as they do not impact the already rendered DOM.
 * 
 * In my experience, reducing HTML only to basic tags produces faster and more reliable prompts.
 * 
 * Note that the output of this function is designed to interpret only the HTML tags.
 * For instructions that rely on visual cues (e.g. "click red button") we intend to
 * combine HTML with screenshots in the future versions of this library.
 */
export const sanitizeHtml = (subject: string) => {
  return sanitize(subject, {
    // The default allowedTags list already includes _a lot_ of commonly used tags.
    // https://www.npmjs.com/package/sanitize-html#default-options
    allowedTags: sanitize.defaults.allowedTags.concat([
      "button",
      "form",
      "img",
      "input",
      "select",
      "textarea",
    ]),
    // Setting allowedAttributes to false will allow all attributes.
    allowedAttributes: false,
  });
};
