import sanitize from "sanitize-html";

export const sanitizeHtml = (subject: string) => {
  return sanitize(subject, {
    allowedTags: sanitize.defaults.allowedTags.concat([ 'form', 'input', 'button' ]),
    allowedAttributes: false
  });
};