import { TaskMessage } from "./types";

/**
 * The prompt itself is very simple because the vast majority of the logic is derived from
 * the instructions contained in the parameter and function descriptions provided to `openai.beta.chat.completions`.
 * @see https://www.npmjs.com/package/openai#automated-function-calls
 * @see https://openai.com/blog/function-calling-and-other-api-updates
 */
export const prompt = (message: TaskMessage) => {
  return `This is your task:

"""
${message.task}
"""

* Must always use locateElement function to find the element and reference it by elementId.

Webpage snapshot:

\`\`\`
${message.snapshot.dom}
\`\`\`
`;
};
