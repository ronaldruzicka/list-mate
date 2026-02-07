---
name: bun-executor
description: Enforces the use of Bun for all package management and script execution tasks within this project.
---

# Bun Executor Skill

This skill provides instructions and patterns for using Bun as the primary package manager and runtime for this project.

## Core Principles

- **Exclusivity**: Use `bun` for all tasks. Do not use `npm`, `yarn`, or `pnpm` unless explicitly requested by the user for comparison.
- **Speed**: Leverage Bun's performance for installations and script runs.

## Command Reference

### Dependency Management

- **Install all**: `bun install`
- **Add runtime dependency**: `bun add <package>`
- **Add dev dependency**: `bun add -d <package>`
- **Remove dependency**: `bun remove <package>`
- **Update dependencies**: `bun update`

### Script Execution

- **Run project scripts**: `bun run <script-name>` (e.g., `bun run dev`, `bun run build`)
- **Execute binaries**: `bun x <command>` (equivalent to `npx`)

### Specific Bun Features

- **Run with Bun runtime**: When running scripts that can benefit from Bun's built-in APIs or speed, use `bun run --bun <command>`.

## File Integrity

- Ensure `bun.lock` remains the source of truth for dependencies.
- Avoid generating `package-lock.json` or `yarn.lock`. If they are created accidentally, remove them.
