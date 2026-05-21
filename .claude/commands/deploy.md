# Deploy Command

Run this when Mike says "deploy" or "push":

1. `cd` into the project folder (whispr/, draftwin/, etc.)
2. Run `npm run build` — fix ALL errors before proceeding
3. `git add <project-folder>/`
4. `git commit -m "feat: <describe what changed>"`
5. `git pull origin main --rebase`
6. `git push origin main`

If build fails: fix errors first, never push broken code.
If push rejected: always pull --rebase first, then push.
