import { expect, test } from "@playwright/test";
import { auto } from "../src/auto";

test("executes query", async ({ page }) => {
  await page.goto("/");

  const headerText = await auto("get the header text", { page, test });

  expect(headerText).toBe("Hello, Rayrun!");
});

test("executes query using locator_evaluate", async ({ page }) => {
  await page.goto("/");

  const headerText = await auto("get the first letter of the header text", {
    page,
    test,
  });

  // TODO assert that we are using locator_evaluate to get the first letter
  expect(headerText).toBe("H");
});

test("executes action", async ({ page }) => {
  await page.goto("/");

  await auto(`Type "foo" in the search box`, { page, test });

  await page.pause();

  await expect(page.getByTestId("search-input")).toHaveValue("foo");
});

test("executes click", async ({ page }) => {
  await page.goto("/");

  await auto("Click the button until the counter value is equal to 2", {
    page,
    test,
  });

  await expect(page.getByTestId("current-count")).toHaveText("2");
});

test("asserts (toBe)", async ({ page }) => {
  await page.goto("/");

  const searchInputHasHeaderText = await auto(
    `Is the contents of the header equal to "Hello, Rayrun!"?`,
    { page, test }
  );

  expect(searchInputHasHeaderText).toBe(true);
});

test("asserts (not.toBe)", async ({ page }) => {
  await page.goto("/");

  const searchInputHasHeaderText = await auto(
    `Is the contents of the header equal to "Flying Donkeys"?`,
    { page, test }
  );

  expect(searchInputHasHeaderText).toBe(false);
});

test("executes query, action and assertion", async ({ page }) => {
  await page.goto("/");

  const headerText = await auto("get the header text", { page, test });

  await auto(`type "${headerText}" in the search box`, { page, test });

  const searchInputHasHeaderText = await auto(
    `is the contents of the search box equal to "${headerText}"?`,
    { page, test }
  );

  expect(searchInputHasHeaderText).toBe(true);
});

test("runs without test parameter", async ({ page }) => {
  await page.goto("/");

  const headerText = await auto("get the header text", { page });

  expect(headerText.query).toBe("Hello, Rayrun!");
});
