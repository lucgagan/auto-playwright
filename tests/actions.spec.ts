import { expect, test } from "@playwright/test";
import { createActions } from "../src/createActions";
import { ChatCompletionRunner } from "openai/lib/ChatCompletionRunner";

const runner = {} as ChatCompletionRunner;

test("finds element using a CSS locator and returns elementId", async ({
  page,
}) => {
  await page.goto("/");

  const actions = createActions(page);

  const result = await actions.locateElement.function(
    {
      cssSelector: "h1",
    },
    runner
  );

  expect(result).toStrictEqual({
    elementId: expect.any(String),
  });
});
