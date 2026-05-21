# Fix Command

When Mike says "fix errors" or build fails:

1. Run `npm run build` in the project folder
2. Read each error carefully
3. Fix root cause — never comment out or ignore errors
4. Run build again to verify
5. Repeat until "✓ Compiled successfully"

Common Next.js 16 errors to watch for:
- Async params: `params: Promise<{ slug: string }>` → must await
- Client components: no `onMouseEnter` in Server Components
- Missing "use client" directive
- Import errors: check file paths and exports
- Type errors: fix properly, don't use `as any` unless truly necessary

Never push code with build errors.
