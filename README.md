# Auto Playwright

Run Playwright tests using AI.

## Setup

1. Install `auto-playwright` dependency:

```bash
$ npm install auto-playwright -D
```

2. This package relies on talking with OpenAI (https://openai.com/). You must export the API token:

```bash
$ export export OPENAI_API_KEY='sk-..."
```

3. Import and use the `auto` function:

```ts
import { test, expect } from "@playwright/test";
import { auto } from "auto-playwright";

test("auto Playwright example", async ({ page }) => {
  await page.goto("/");

  // `auto` can be used to query data
  // In this case, the result is plain-text contents of the header
  const headerText = await auto("get the header text", { page, test });

  // `auto` can be used to perform actions
  // In this case, auto will find and fill in the search text input
  await auto(`Type "${headerText}" in the search box`, { page, test });

  // `auto` can assert the state of the website
  // In this case, the result is a boolean outcome
  const searchInputHasHeaderText = await auto(`Is the contents of the search box equal to "${headerText}"?` { page, test });

  expect(searchInputHasHeaderText).toBe(true);
});
```

## Usage

At minimum, the `auto` function requires a _plain text prompt_ and an _argument_ that contains your ` page`` and  `test`` objects.

```ts
auto("<your prompt>", { page, test });
```

## Supported Browsers

Every browser that Playwright supports.

## Additional Options

There are additional options you can pass as a third argument:

```ts
const options = {
  // If true, debugging information is returned from the auto() call.
  debug: boolean,
  // The OpenAI model (https://platform.openai.com/docs/models/overview)
  model: "gpt-4-1106-preview",
};

auto("<your prompt>", { page, test }, options);
```

## Supported Actions & Return Values

Depending on the `type` of action (specified above or inferred by the `auto` function), there are different behaviors and return types.

### Action

**Action**: An action (e.g. "click") is some simulated user interaction with the page, e.g. a click on a link. Actions will return `undefined`` if they were successful and will throw an error if they failed, e.g.

```ts
try {
  await auto("click the link", { page, test });
} catch (e) {
  console.error("failed to click the link");
}
```

### Query

**Query**: A query will return requested data from the page as a string, e.g.

```ts
const linkText = await auto("Get the text of the first link", { page, test });

console.log("The link text is", linkText);
```

### Assert

**Assert**: An assertion is a question that will return `true` or `false`, e.g.

```ts
const thereAreThreeLinks = await auto("Are there 3 links on the page?", {
  page,
  test,
});

console.log(`"There are 3 links" is a ${thereAreThreeLinks} statement`);
```

## Supported Playwright Actions

* `page.goto`
* `locator.getAttribute`
* `locator.innerHTML`
* `locator.innerText`
* `locator.fill`

Adding new actions is easy: just update the `functions` in [`src/completeTask.ts`](src/completeTask.ts).