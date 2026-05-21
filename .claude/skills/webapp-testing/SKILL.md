---
name: webapp-testing
description: Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.
---

# Web Application Testing

Test local Next.js apps using Playwright browser automation.

## Decision Tree

```
User task → Is it static HTML?
    ├─ Yes → Read HTML directly to identify selectors → Write Playwright script
    └─ No (dynamic webapp) → Is server running?
        ├─ No → Run: npm run dev first
        └─ Yes → Navigate → wait networkidle → screenshot → identify selectors → execute
```

## Basic Pattern

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')  # CRITICAL for Next.js
    page.screenshot(path='/tmp/screenshot.png', full_page=True)
    browser.close()
```

## For Next.js Projects

1. `npm run dev` in project folder
2. Wait for `Ready on http://localhost:3000`
3. Run Playwright script against localhost:3000
4. Check console logs for errors

## Best Practices

- Always wait for `networkidle` before interacting
- Use `page.screenshot()` to debug visual issues
- Check `page.content()` to inspect DOM
- Use descriptive selectors: `text=`, `role=`, CSS selectors
