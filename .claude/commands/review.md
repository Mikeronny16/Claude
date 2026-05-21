# Review Command

When Mike says "review" or "check code":

## Run These Checks

### 1. Build Check
```bash
npm run build
```
Must be zero errors before anything else.

### 2. Security Check
- No secrets in client code (NEXT_PUBLIC_ = public)
- All admin routes have password check
- Passwords use bcrypt
- User inputs validated

### 3. Mobile Check  
- All buttons min 44px touch target
- No horizontal scroll on 390px
- Text min 14px
- Forms have correct input types

### 4. Performance Check
- No `<img>` tags (use next/image)
- Dynamic imports for heavy libraries
- No unnecessary re-renders
- API routes have `force-dynamic`

### 5. Code Quality
- No unused imports
- No `console.log` left in production code
- Error states handled
- Loading states shown

## Report Format
After review, report:
✅ Passing: [list]
⚠️ Warnings: [list]
❌ Must Fix: [list]
