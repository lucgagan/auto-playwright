import sanitize from "sanitize-html";

/**
 * The reason for sanitization is because we do not need all HTML tags to be present in the prompt.
 * For example, we do not need <style> or <script> tags to be present in the prompt.
 * In my experience, reducing HTML only to basic tags produces faster and more reliable prompts.
 */
export const sanitizeHtml = (subject: string) => {
  return sanitize(subject, {
    allowedTags: sanitize.defaults.allowedTags.concat([
      "button",
      "form",
      "img",
      "input",
      "select",
      "textarea",
    ]),
    allowedAttributes: false,
  });
};
