# Testing Instructions Report

This document outlines the testing strategy, setup, and execution procedures for the SanityFlow platform. Our testing suite ensures high reliability by covering unit logic, integration with external services/databases, and performance under load.

## 1. Testing Environment Configuration Details

The backend utilizes a comprehensive testing environment configured for isolated and deterministic test execution:
- **Test Runner:** Jest (	s-jest for TypeScript support)
- **Database Mocking:** mongodb-memory-server spins up an in-memory MongoDB instance automatically before integration tests.
- **External Services Isolation:** 
  - **AI (Groq API):** Intercepted via jest.mock('groq-sdk').
  - **Weather (OpenWeather API):** Intercepted via jest.mock('axios').
  - **Email (Resend):** Intercepted via jest.mock('resend').
  - **Barcode Lookup:** Intercepted natively to return mock product details.
- **Environment Variables:** Configured for the test environment to ensure development keys do not pollute the testing space.

## 2. How to Run Unit Tests

Unit tests are isolated to individual controller/service files inside src/controllers/tests/, validating component logic, input validation (zod), and expected output formats without spinning up the database or hitting real HTTP protocols.

**Execution:**
To run only the unit tests:
`powershell
cd backend
npx jest src/controllers/tests/
`

## 3. Integration Testing Setup and Execution

Integration tests are located in src/tests/integration/. They validate the correct flow of data from the API routes to the controllers, through the services, and into the MongoDB memory server. It leverages supertest to make mock HTTP requests to the Express application.

**Setup Highlights:**
- The database is cleared between each test block to ensure clean states.
- An isolated in-memory mongo cluster is formed before tests and destroyed after.
- All requests run against the core Express pp.ts independently of server.ts.

**Execution:**
To run only the integration tests:
`powershell
cd backend
npx jest src/tests/integration/
`

To run the **entire test suite** (both unit and integration tests � 165 tests):
`powershell
cd backend
npm run test
`

## 4. Performance Testing Setup and Execution

Performance and load testing is handled using **Artillery**. It evaluates how the backend performs under concurrent user load to identify bottlenecks.

**Setup & Configuration:**
- **Tool:** Artillery CLI  
- **Test Configuration:** ackend/load-tests/artillery/basic-test.yml  
- **Test Runner Script:** ackend/load-tests/artillery/run-tests.ps1  

**Execution:**
Ensure the backend server is actively running (e.g., 
pm run dev) before launching load tests.

`powershell
cd load-tests\artillery
.\run-tests.ps1 -target "http://localhost:3000" -duration 60 -arrivalRate 10
`

**Parameters:**
- -target: The base URL of the running API.
- -duration: Length of the test in seconds.
- -arrivalRate: Expected new connections per second.

**Output:**
Artillery will output an interactive progress log in the terminal, and a full JSON/HTML report timestamped in ackend/load-tests/artillery/results/.
