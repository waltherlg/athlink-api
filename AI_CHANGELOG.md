# AI Changelog

## 2026-03-11
- Added AI_CONTEXT.md to document architecture and conventions inferred from src; created file to guide AI-assisted development.
  Files: AI_CONTEXT.md
- Restructured into a pnpm monorepo with `apps/backend` and `apps/frontend`; moved backend sources/configs, added Vite React frontend scaffold, and added workspace config to keep backend scripts working from root.
  Files: package.json, pnpm-workspace.yaml, apps/backend/*, apps/frontend/*, AI_CONTEXT.md
