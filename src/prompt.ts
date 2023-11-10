import { TaskMessage } from "./types";

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
