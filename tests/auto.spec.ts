import { expect, test } from "@playwright/test";
import { auto } from "../src/auto";

test.only("produces error if it cannot execute the instructions", async ({
  page,
}) => {
  await page.goto("/");

  const headerText = await auto("your job is to replace humans", {
    page,
    test,
  });

  console.log("headerText", headerText);
});

test("executes query", async ({ page }) => {
  await page.goto("/");

  const headerText = await auto("get the header text", { page, test });

  expect(headerText).toBe("Hello, Rayrun!");
});

test("executes action", async ({ page }) => {
  await page.goto("/");

  await auto(`Type "foo" in the search box`, { page, test });

  await page.pause();

  await expect(page.getByTestId("search-input")).toHaveValue("foo");
});

test("asserts (positive)", async ({ page }) => {
  await page.goto("/");

  const searchInputHasHeaderText = await auto(
    `Is the contents of the header equal to "Hello, Rayrun!"?`,
    { page, test }
  );

  expect(searchInputHasHeaderText).toBe(true);
});

test("asserts (negative)", async ({ page }) => {
  await page.goto("/");

  const searchInputHasHeaderText = await auto(
    `Is the contents of the header equal to "Flying Donkeys"?`,
    { page, test }
  );

  expect(searchInputHasHeaderText).toBe(false);
});

// test("executes query, action and assertion", async ({ page }) => {
//   await page.goto("/");

//   // `auto` can be used to query data
//   // In this case, the result is plain-text contents of the header
//   const headerText = await auto("get the header text", { page, test });

//   // `auto` can be used to perform actions
//   // In this case, auto will find and fill in the search text input
//

//   // `auto` can assert the state of the website
//   // In this case, the result is a boolean outcome
//   const searchInputHasHeaderText = await auto(
//     `Is the contents of the search box equal to "${headerText}"?`,
//     { page, test }
//   );

//   expect(searchInputHasHeaderText).toBe(true);
// });
