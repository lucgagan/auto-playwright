import { OpenAI, AzureOpenAI } from "openai";
import { type Page, TaskMessage, TaskResult } from "./types";
import { prompt } from "./prompt";
import { createActions } from "./createActions";

const defaultDebug = process.env.AUTO_PLAYWRIGHT_DEBUG === "true";

export const completeTask = async (
  page: Page,
  task: TaskMessage
): Promise<TaskResult> => {

  const apiVersion = process.env.OPENAI_API_VERSION;
  const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL;
  const deployment = task.options?.model ?? "gpt-4o";

  const openai = azureApiKey 
    ? new AzureOpenAI({ deployment, apiVersion, apiKey: azureApiKey }) 
    : new OpenAI({ baseURL, apiKey: task.options?.openaiApiKey ?? openAiApiKey });

  let lastFunctionResult: null | { errorMessage: string } | { query: string } =
    null;

  const actions = createActions(page);

  const debug = task.options?.debug ?? defaultDebug;

  const runner = openai.beta.chat.completions
    .runTools({
      model: deployment,
      messages: [{ role: "user", content: prompt(task) }],
      tools: Object.values(actions),
    })
    .on("message", (message) => {
      if (debug) {
        console.log("> message", message);
      }

      if (
        message.role === "assistant" &&
        message.tool_calls?.some(tool => tool.function.name.startsWith("result"))
      ) {
        lastFunctionResult = JSON.parse(message.tool_calls?.filter(tool => tool.function.name.startsWith("result"))[0].function.arguments);
      }
    });

  const finalContent = await runner.finalContent();

  if (debug) {
    console.log("> finalContent", finalContent);
  }

  if (!lastFunctionResult) {
    throw new Error("Expected to have result");
  }

  if (debug) {
    console.log("> lastFunctionResult", lastFunctionResult);
  }

  return lastFunctionResult;
};
