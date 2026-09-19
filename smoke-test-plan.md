# Smoke-test plan (step 05: mail + avatar)

Scripts in `scripts/smoke/`. Ignore `test-progress.md` (old plan).

## New scripts

1. `09-reset-email.mjs` — POST `/auth/request-reset-email`
   - valid email → 200 `Password reset email sent successfully`
   - unknown email → 200 same
   - invalid email → 400
2. `10-reset-password.mjs` — POST `/auth/reset-password`
   - valid token (from mail) → 200 `Password reset successfully`; login with new password → 200
   - fake/expired token → 401 `Invalid or expired token`
   - wrong user/token pair → 404 `User not found`
3. `11-avatar.mjs` (use image.png) — PATCH `/users/me/avatar`
   - no cookie → 401
   - cookie, no file → 400 `No file`
   - `.png` ≤2MB → 200 `{ url: 'https://res.cloudinary.com/...' }`
   - `.txt` → `Only images allowed`
   - file >2MB → 400 (multer limit)
4. `12-not-found.mjs` — unknown route → 404 (reuse pattern from `08-not-found.mjs`)

## Steps

- [ ] write 09–12 scripts in `scripts/smoke/` (use `helpers.mjs`)
- [ ] run all: `node scripts/smoke/09-reset-email.mjs` … `12`
- [ ] manual: open reset link, verify avatar image loads
