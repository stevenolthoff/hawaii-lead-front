# Hawaii Lead Water Front-End

## Overview
This application provides an interactive platform to track the replacement status of water fixtures in Hawaii schools. It offers a comprehensive view of fixture replacement progress, both geographically and at a detailed school level.

## Features

*   **Interactive Map:** Visualizes schools across Hawaii, with map markers color-coded to reflect the overall replacement status of their water fixtures.
*   **Data Filtering:** Allows users to efficiently search and filter schools by name, island, district, and the current replacement status of their fixtures (Not Started, In Progress, Completed).
*   **Rollup Statistics:** Displays aggregate statistics summarizing the replacement progress across all filtered schools and individual fixtures.
*   **School Summaries:** Provides concise overview cards for each school, detailing its status and fixture counts.
*   **Detailed School View:** A dedicated interactive modal for each school, presenting a list of all relevant fixtures, their individual replacement journey via a step-by-step progress indicator, key dates, and photos of replaced fixtures.
*   **Clear Status Definitions:** Explains the meaning behind each fixture replacement status within the application.
*   **Responsive Design:** Optimizes user experience across various devices, featuring a dynamic map/list toggle for mobile views.
*   **API-Driven Data:** Integrates with a geospatial API to fetch and display current fixture data.

## Technical Stack

*   **Frontend Framework:** React
*   **Mapping:** Axiom Maps (built on Leaflet)
*   **State Management:** React Context API
*   **Data Visualization:** D3.js for dynamic stacked bar charts
*   **Styling:** Tailwind CSS, with Heroicons for UI icons
*   **Core Libraries:** `axios` for API requests, `lodash` for utility functions, `luxon` for date handling, `usehooks-ts` for custom React hooks.
*   **Build System:** CRACO (Custom React App Configuration Override)
*   **Containerization:** Docker
*   **CI/CD:** GitLab CI for automated build, test, and deployment workflows.

## Getting Started

### Prerequisites

*   Node.js (v18+)
*   npm (comes with Node.js)
*   Docker (optional, for containerized development/deployment)

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd hawaii-lead-front
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *(Note: This project uses a custom npm registry for `@axds` packages, configured via `.npmrc`.)*
3.  **Run the development server:**
    ```bash
    npm start
    ```
    The application will launch at `http://localhost:3000`.

### Running with Docker

1.  **Build the Docker image:**
    ```bash
    docker build -t hawaii-lead:latest .
    ```
2.  **Start the container:**
    ```bash
    docker-compose up -d
    ```
    The application will be accessible at `http://localhost:8787`.
