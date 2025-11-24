# Architecture of the Digital Wallet for Student Points MVP

```mermaid
graph LR
    Frontend --> MockAPI[Mock API (localStorage)]
    MockAPI --> LocalStorage[(localStorage)]
    Frontend --> AuthMock[Auth (mock select)]
    Frontend --> ExternalEmail[Email Service (placeholder)]
    MockAPI --> Logging[(Console / Local logs)]
```

## Components Description

- **Frontend**: The user interface built with React and styled using TailwindCSS. It includes components for displaying students, rewards, and modals for adding points and creating rewards.
  
- **Mock API**: A wrapper around localStorage that simulates API calls. It handles data retrieval and storage with simulated network delays to mimic real API behavior.

- **Authentication Mock**: A simple authentication simulation that allows users to select between a student and an admin role, affecting the UI displayed.

- **Local Storage**: Used to persist user data, rewards, and transactions without a real backend. Data is stored under specific keys for easy access.

- **External Services**: Placeholder for potential integration with external services, such as email notifications, which can be implemented in the future.

- **Logging**: Console logs are used to track API requests and responses, providing visibility into the application's operations.

This architecture provides a clear separation of concerns, allowing for easy maintenance and future enhancements while ensuring a smooth user experience.