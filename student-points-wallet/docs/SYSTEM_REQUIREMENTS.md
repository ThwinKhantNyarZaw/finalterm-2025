# SYSTEM_REQUIREMENTS.md

## Problem Statement
The Digital Wallet for Student Points is designed to facilitate a point-based reward system for students. Students earn points through various activities, which can be redeemed for rewards managed by administrators. The application aims to provide a user-friendly interface for both students and admins, ensuring seamless interaction with the point system without the need for a backend server.

## Core User Stories
1. As a student, I want to view my current points and transaction history so that I can track my rewards.
2. As a student, I want to earn points by completing activities so that I can redeem them for rewards.
3. As an admin, I want to create and manage rewards so that students have options to redeem their points.
4. As an admin, I want to view all students and their points so that I can manage the point distribution effectively.
5. As a user, I want to log in with different roles (student/admin) so that the interface adapts to my permissions.

## Non-Functional Requirements
1. The application should be responsive and accessible on various devices.
2. The application should load within 2 seconds to ensure a smooth user experience.
3. The application should maintain data integrity by using localStorage for persistent data storage.

## Key Risks & Threats
1. Data loss due to localStorage limitations (e.g., quota exceeded).
2. Security vulnerabilities related to client-side storage and potential data exposure.
3. User experience issues if the application does not handle errors gracefully (e.g., failed API calls).

## Task 1 Rubric Mapping
- Problem Statement: Clearly outlines the purpose and functionality of the application.
- Core User Stories: Provides a comprehensive list of user interactions and expectations.
- Non-Functional Requirements: Specifies performance and usability criteria.
- Key Risks & Threats: Identifies potential challenges and security concerns.