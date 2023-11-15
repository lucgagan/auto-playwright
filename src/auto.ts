import { MAX_TASK_CHARS } from "./config";
import { type Page, type Test, StepOptions } from "./types";
import { completeTask } from "./completeTask";
import { UnimplementedError } from "./errors";
import { getSnapshot } from "./getSnapshot";

export const auto = async (
  task: string,
  config: { page: Page; test: Test },
  options?: StepOptions
): Promise<any> => {
  if (!config || !config.page || !config.test) {
    throw Error(
      "The auto() function is missing the required `{ page, test }` argument."
    );
  }

  const { test, page } = config as { page: Page; test: Test };

  return test.step(`auto-playwright.ai '${task}'`, async () => {
    if (task.length > MAX_TASK_CHARS) {
      throw new Error(
        `Provided task string is too long, max length is ${MAX_TASK_CHARS} chars.`
      );
    }

    const result = await completeTask(page, {
      task,
      snapshot: await getSnapshot(page),
      options: options
        ? {
            model: options.model ?? "gpt-4-1106-preview",
            debug: options.debug ?? false,
          }
        : undefined,
    });

    if (result.errorMessage) {
      throw new UnimplementedError(result.errorMessage);
    }

    if (result.assertion !== undefined) {
      return result.assertion;
    }

    if (result.query !== undefined) {
      return result.query;
    }

    return undefined;
  });
};
