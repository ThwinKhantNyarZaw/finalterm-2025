# AI_PROMPTS.md

# AI Prompts for Digital Wallet for Student Points Project

## Prompts Used with ChatGPT

1. **Tech Stack Recommendation Prompt:**
   "What is a suitable tech stack for a no-backend MVP digital wallet application using React, TypeScript, and TailwindCSS?"

2. **Database Schema Prompt:**
   "Can you suggest a database schema for a digital wallet application that includes users, rewards, and transactions?"

3. **API Endpoints Prompt:**
   "What are three key REST API endpoints that would be necessary for a digital wallet application managing user points and rewards?"

## AI-Generated Outputs

### Recommended Tech Stack
- Vite
- React
- TypeScript
- TailwindCSS
- Heroicons (optional)

### Database Schema
1. **Users Table**
   - id: string
   - name: string
   - studentId: string
   - role: 'STUDENT' | 'ADMIN'
   - email: string
   - phone: string
   - points: number

2. **Rewards Table**
   - id: string
   - title: string
   - cost: number
   - quantity: number
   - description: string

3. **Transactions Table**
   - id: string
   - userId: string
   - amount: number
   - reason: string
   - date: Date

### Key API Endpoints
1. **GET /students**
   - Retrieves a list of all students.

2. **POST /transactions**
   - Records a transaction for a user.

3. **POST /rewards**
   - Creates a new reward.

## Brief Explanation
The recommended tech stack provides a modern and efficient framework for building the application. The database schema outlines the necessary tables to manage users, rewards, and transactions, even though the application will use localStorage instead of a real database. The API endpoints represent the core functionalities required for managing student points and rewards, which will be simulated through a mock API in the application.

## Mapping to Task 3 Rubric
- The prompts and outputs align with the requirements for Task 3, demonstrating the thought process behind the tech stack selection, database design, and API structure necessary for the MVP.