#!/usr/bin/env bash
set -euo pipefail

# Formatting (oxfmt) and eslint
bun run lint

# Type checking (svelte-check)
bun run check
