# Artillery load tests

This folder contains a baseline Artillery load test for the SanityFlow backend.

Prerequisites:
- Artillery CLI installed (globally or in a project). You mentioned it's already installed.
- The backend server running (default assumed: `http://localhost:3000`).

Quick run (PowerShell):

```powershell
cd backend\load-tests\artillery
.\run-tests.ps1 -target "http://localhost:3000" -duration 60 -arrivalRate 10
```

Outputs:
- Reports are written to the `results` folder as `report-<timestamp>.json`.

Customize:
- Edit `basic-test.yml` or provide `-target`, `-duration`, and `-arrivalRate` to the script.

Notes:
- The YAML uses placeholders (TARGET_PLACEHOLDER, DURATION_PLACEHOLDER, RATE_PLACEHOLDER)
  that the run script replaces at runtime.
