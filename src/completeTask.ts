import OpenAI from "openai";
import { type Page, TaskMessage, TaskResult } from "./types";
import { prompt } from "./prompt";
import { createActions } from "./createActions";

const defaultDebug = process.env.AUTO_PLAYWRIGHT_DEBUG === "true";

type Snapshot = {
  steps: { name: string; arguments: string }[];
};

export const completeTask = async (
  page: Page,
  task: TaskMessage
): Promise<TaskResult> => {
  const openai = new OpenAI();

  let lastFunctionResult: null | { errorMessage: string } | { query: string } =
    null;

  const actions = createActions(page);

  const debug = task.options?.debug ?? defaultDebug;

  const snapshot: Snapshot = {
    steps: [],
  };

  const runner = openai.beta.chat.completions
    .runFunctions({
      model: task.options?.model ?? "gpt-4-1106-preview",
      messages: [{ role: "user", content: prompt(task) }],
      functions: actions,
    })
    .on("message", (message) => {
      if (debug) {
        console.log("> message", message);
      }

      if (message.role === "assistant" && message.function_call) {
        snapshot.steps.push(message.function_call);
      }

      if (
        message.role === "assistant" &&
        message.function_call?.name.startsWith("result")
      ) {
        lastFunctionResult = JSON.parse(message.function_call.arguments);
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

  console.log(snapshot);

  return lastFunctionResult;
};
