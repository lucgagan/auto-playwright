# Auto Playwright

Run Playwright tests using AI.

## Setup

1. Install `auto-playwright` dependency:

```bash
npm install auto-playwright -D
```

2. This package relies on talking with OpenAI (https://openai.com/). You must export the API token as an enviroment variable or add it to your `.env` file:

```bash
export OPENAI_API_KEY='sk-..."
```

3. Import and use the `auto` function:

```ts
import { test, expect } from "@playwright/test";
import { auto } from "auto-playwright";

test("auto Playwright example", async ({ page }) => {
  await page.goto("/");

  // `auto` can query data
  // In this case, the result is plain-text contents of the header
  const headerText = await auto("get the header text", { page, test });

  // `auto` can perform actions
  // In this case, auto will find and fill in the search text input
  await auto(`Type "${headerText}" in the search box`, { page, test });

  // `auto` can assert the state of the website
  // In this case, the result is a boolean outcome
  const searchInputHasHeaderText = await auto(`Is the contents of the search box equal to "${headerText}"?`, { page, test });

  expect(searchInputHasHeaderText).toBe(true);
});
```

## Usage

At minimum, the `auto` function requires a _plain text prompt_ and an _argument_ that contains your `page` and `test` (optional) objects.

```ts
auto("<your prompt>", { page, test });
```

### Browser automation

Running without the `test` parameter:

```ts
import { chromium } from "playwright";
import { auto } from "auto-playwright";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  // Navigate to a website
  await page.goto("https://www.example.com");

  // `auto` can query data
  // In this case, the result is plain-text contents of the header
  const res = await auto("get the header text", { page });

  // use res.query to get a query result.
  console.log(res);
  await page.close();
})();
```

### Debug

You may pass a `debug` attribute as the third parameter to the `auto` function. This will print the prompt and the commands executed by OpenAI.

```ts
await auto("get the header text", { page, test }, { debug: true });
```

You may also set environment variable `AUTO_PLAYWRIGHT_DEBUG=true`, which will enable debugging for all `auto` calls.

```bash
export AUTO_PLAYWRIGHT_DEBUG=true
```

## Supported Browsers

Every browser that Playwright supports.

## Additional Options

There are additional options you can pass as a third argument:

```ts
const options = {
  // If true, debugging information is printed in the console.
  debug: boolean,
  // The OpenAI model (https://platform.openai.com/docs/models/overview)
  model: "gpt-4-1106-preview",
  // The OpenAI API key
  openaiApiKey: 'sk-...',
};

auto("<your prompt>", { page, test }, options);
```

## Supported Actions & Return Values

Depending on the `type` of action (inferred by the `auto` function), there are different behaviors and return types.

### Action

An action (e.g. "click") is some simulated user interaction with the page, e.g. a click on a link. Actions will return `undefined`` if they were successful and will throw an error if they failed, e.g.

```ts
try {
  await auto("click the link", { page, test });
} catch (e) {
  console.error("failed to click the link");
}
```

### Query

A query will return requested data from the page as a string, e.g.

```ts
const linkText = await auto("Get the text of the first link", { page, test });

console.log("The link text is", linkText);
```

### Assert

An assertion is a question that will return `true` or `false`, e.g.

```ts
const thereAreThreeLinks = await auto("Are there 3 links on the page?", {
  page,
  test,
});

console.log(`"There are 3 links" is a ${thereAreThreeLinks} statement`);
```

## Why use Auto Playwright?

| Aspect                         | Conventional Approach                                                               | Testing with Auto Playwright                                                                                                 |
| ------------------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Coupling with Markup**       | Strongly linked to the application's markup.                                        | Eliminates the use of selectors; actions are determined by the AI assistant at runtime.                                      |
| **Speed of Implementation**    | Slower implementation due to the need for precise code translation for each action. | Rapid test creation using simple, plain text instructions for actions and assertions.                                        |
| **Handling Complex Scenarios** | Automating complex scenarios is challenging and prone to frequent failures.         | Facilitates testing of complex scenarios by focusing on the intended test outcomes.                                          |
| **Test Writing Timing**        | Can only write tests after the complete development of the functionality.           | Enables a Test-Driven Development (TDD) approach, allowing test writing concurrent with or before functionality development. |

## Supported Playwright Actions

- `locator.blur`
- `locator.boundingBox`
- `locator.check`
- `locator.clear`
- `locator.click`
- `locator.count`
- `locator.fill`
- `locator.getAttribute`
- `locator.innerHTML`
- `locator.innerText`
- `locator.inputValue`
- `locator.isChecked`
- `locator.isEditable`
- `locator.isEnabled`
- `locator.isVisible`
- `locator.textContent`
- `locator.uncheck`
- `page.goto`

Adding new actions is easy: just update the `functions` in [`src/completeTask.ts`](src/completeTask.ts).

## Pricing

This library is free. However, there are costs associated with using OpenAI. You can find more information about pricing here: https://openai.com/pricing/.

<details>
  <summary>Example</summary>

Using https://ray.run/ as an example, the cost of running a test step is approximately $0.01 using GPT-4 Turbo (and $0.001 using GPT-3.5 Turbo).

The low cost is in part because `auto-playwright` uses HTML sanitization to reduce the payload size, e.g. What follows is the payload that would be submitted for https://ray.run/.

Naturally, the price will vary dramatically depending on the payload.

```html
<div class="cYdhWw dKnOgO geGbZz bGoBgk jkEels">
  <div class="kSmiQp fPSBzf bnYmbW dXscgu xJzwH jTWvec gzBMzy">
    <h1 class="fwYeZS fwlORb pdjVK bccLBY fsAQjR fyszFl WNJim fzozfU">
      Learn Playwright
    </h1>
    <h2 class="cakMWc ptfck bBmAxp hSiiri xJzwS gnfYng jTWvec fzozfU">
      Resources for learning end-to-end testing using Playwright automation
      framework
    </h2>
    <div
      class="bLTbYS gvHvKe cHEBuD ddgODW jsxhGC kdTEUJ ilCTXp iQHbtH yuxBn ilIXfy gPeiPq ivcdqp isDTsq jyZWmS ivdkBK cERSkX hdAwi ezvbLT jNrAaV jsxhGJ fzozCb"
    ></div>
  </div>
  <div class="cYdhWw dpjphg cqUdSC fasMpP">
    <a
      class="gacSWM dCgFix conipm knkqUc bddCnd dTKJOB leOtqz hEzNkW fNBBKe jTWvec fIMbrO fzozfU group"
      href="/blog"
      ><div class="plfYl bccLBY hSiiri fNBpvX">Blog</div>
      <div class="jqqjPD fWDXZB pKTba bBmAxp hSiiri evbPEu">
        <p>Learn in depth subjects about end-to-end testing.</p>
      </div></a
    ><a
      class="gacSWM dCgFix conipm knkqUc bddCnd dTKJOB leOtqz hEzNkW fNBBKe jTWvec fIMbrO fzozfU group"
      href="/ask"
      ><div class="plfYl bccLBY hSiiri fNBpvX">Ask AI</div>
      <div class="jqqjPD fWDXZB pKTba bBmAxp hSiiri evbPEu">
        <p>Ask ChatGPT Playwright questions.</p>
      </div></a
    ><a
      class="gacSWM dCgFix conipm knkqUc bddCnd dTKJOB leOtqz hEzNkW fNBBKe jTWvec fIMbrO fzozfU group"
      href="/tools"
      ><div class="plfYl bccLBY hSiiri fNBpvX">Dev Tools</div>
      <div class="jqqjPD fWDXZB pKTba bBmAxp hSiiri evbPEu">
        <p>All-in-one toolbox for QA engineers.</p>
      </div></a
    ><a
      class="gacSWM dCgFix conipm knkqUc bddCnd dTKJOB leOtqz hEzNkW fNBBKe jTWvec fIMbrO fzozfU group"
      href="/jobs"
      ><div class="plfYl bccLBY hSiiri fNBpvX">QA Jobs</div>
      <div class="jqqjPD fWDXZB pKTba bBmAxp hSiiri evbPEu">
        <p>Handpicked QA and Automation opportunities.</p>
      </div></a
    ><a
      class="gacSWM dCgFix conipm knkqUc bddCnd dTKJOB leOtqz hEzNkW fNBBKe jTWvec fIMbrO fzozfU group"
      href="/questions"
      ><div class="plfYl bccLBY hSiiri fNBpvX">Questions</div>
      <div class="jqqjPD fWDXZB pKTba bBmAxp hSiiri evbPEu">
        <p>Ask AI answered questions about Playwright.</p>
      </div></a
    ><a
      class="gacSWM dCgFix conipm knkqUc bddCnd dTKJOB leOtqz hEzNkW fNBBKe jTWvec fIMbrO fzozfU group"
      href="/discord-forum"
      ><div class="plfYl bccLBY hSiiri fNBpvX">Discord Forum</div>
      <div class="jqqjPD fWDXZB pKTba bBmAxp hSiiri evbPEu">
        <p>Archive of Discord Forum posts about Playwright.</p>
      </div></a
    ><a
      class="gacSWM dCgFix conipm knkqUc bddCnd dTKJOB leOtqz hEzNkW fNBBKe jTWvec fIMbrO fzozfU group"
      href="/videos"
      ><div class="plfYl bccLBY hSiiri fNBpvX">Videos</div>
      <div class="jqqjPD fWDXZB pKTba bBmAxp hSiiri evbPEu">
        <p>Tutorials, conference talks, and release videos.</p>
      </div></a
    ><a
      class="gacSWM dCgFix conipm knkqUc bddCnd dTKJOB leOtqz hEzNkW fNBBKe jTWvec fIMbrO fzozfU group"
      href="/browser-extension"
      ><div class="plfYl bccLBY hSiiri fNBpvX">Browser Extension</div>
      <div class="jqqjPD fWDXZB pKTba bBmAxp hSiiri evbPEu">
        <p>GUI for generating Playwright locators.</p>
      </div></a
    ><a
      class="gacSWM dCgFix conipm knkqUc bddCnd dTKJOB leOtqz hEzNkW fNBBKe jTWvec fIMbrO fzozfU group"
      href="/wiki"
      ><div class="plfYl bccLBY hSiiri fNBpvX">QA Wiki</div>
      <div class="jqqjPD fWDXZB pKTba bBmAxp hSiiri evbPEu">
        <p>Definitions of common end-to-end testing terms.</p>
      </div></a
    >
  </div>
  <div
    class="kSmiQp fPSBzf pKTba eTDpsp legDhJ hSiiri hdaZLM jTWvec gzBMzy bGySga fzoybr"
  >
    <p class="dXhlDK leOtqz glpWRZ fNCcFz">
      Use <kbd class="bWhrAL XAzZz cakMWc bUyOMB bmOrOm fyszFl dTmriP">⌘</kbd> +
      <kbd>k</kbd> + "Tools" to quickly access all tools.
    </p>
  </div>
</div>
```

</details>

## Implementation

### HTML Sanitization

The `auto` function uses [sanitize-html](https://www.npmjs.com/package/sanitize-html) to sanitize the HTML of the page before sending it to OpenAI. This is done to reduce cost and improve the quality of the generated text.

## ZeroStep

This project draws its inspiration from [ZeroStep](https://zerostep.com/). ZeroStep offers a similar API but with a more robust implementation through its proprietary backend. Auto Playwright was created with the aim of exploring the underlying technology of ZeroStep and establishing a basis for an open-source version of their software. For production environments, I suggest opting for ZeroStep.

Here's a side-by-side comparison of Auto Playwright and ZeroStep:

|Criteria|Auto Playwright|ZeroStep|
|---|---|---|
|Uses OpenAI API|Yes|No[^3]|
|Uses plain-text prompts|Yes|No|
|Uses [`functions`](https://www.npmjs.com/package/openai#automated-function-calls) SDK|Yes|No|
|Uses HTML sanitization|Yes|No|
|Uses Playwright API|Yes|No[^4]|
|Uses screenshots|No|Yes|
|Uses queue|No|Yes|
|Uses WebSockets|No|Yes|
|Snapshots|HTML|DOM|
|Implements parallelism|No|Yes|
|Allows scrolling|No|Yes|
|Provides fixtures|No|Yes|
|License|MIT|MIT|

[^3]: Uses ZeroStep proprietary API.
[^4]: Uses _some_ Playwright API, but predominantly relies on Chrome DevTools Protocol (CDP).

<details>
  <summary>Zero Step License</summary>

```
MIT License

Copyright (c) 2023 Reflect Software Inc

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
</details>
