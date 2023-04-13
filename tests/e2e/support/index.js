// ***********************************************
// This file is processed and loaded automatically before each test file.
//
// See documentation for more info:
// https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Support-file
// ***********************************************

// Import custom commands
import "./commands.js";

// Prevents Cypress from failing test
// when an unhandled error occur
Cypress.on("uncaught:exception", () => false);
