# Testing Report

This file summarizes the current backend load-testing setup for SanityFlow.

## Test Tool

- Artillery (baseline load test)
- Config location: `backend/load-tests/artillery/basic-test.yml`
- Runner script: `backend/load-tests/artillery/run-tests.ps1`

## Prerequisites

- Artillery CLI installed.
- Backend server running (default target: `http://localhost:3000`).

## Quick Run (PowerShell)

```powershell
cd backend\load-tests\artillery
.\run-tests.ps1 -target "http://localhost:3000" -duration 60 -arrivalRate 10
```

## Output

- Test reports are generated in:
  - `backend/load-tests/artillery/results`
- Output file format:
  - `report-<timestamp>.json`

## Customization

You can change test behavior in two ways:

1. Edit `basic-test.yml` directly.
2. Pass parameters to the script:
   - `-target`
   - `-duration`
   - `-arrivalRate`

## Notes

- The test YAML uses placeholders:
  - `TARGET_PLACEHOLDER`
  - `DURATION_PLACEHOLDER`
  - `RATE_PLACEHOLDER`
- These are replaced at runtime by `run-tests.ps1`.
