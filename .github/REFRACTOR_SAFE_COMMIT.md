# Safe commit: initial branch snapshot

This commit contains a small, low-risk change to kick off the refactor/production-ready branch and allow preview deployment to run. No site functionality, file moves, or deletions were performed.

Committed changes:

- Add `.github/REFRACTOR_SAFE_COMMIT.md` with a short explanation of the branch purpose and policies.

Reasoning and guarantees:

- No code that runs in the app was modified.
- No files were moved or deleted.
- This is a tiny change intended only to trigger the preview deployment for the new branch so you can inspect the site before larger changes.

Next steps (after you confirm preview looks good):

- Proceed with the agreed refactor tasks on this branch (remove duplicate lockfiles, replace CI with Bun, asset optimization, safe dead-code removal, etc.).

