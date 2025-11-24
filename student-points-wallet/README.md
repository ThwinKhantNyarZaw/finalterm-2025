# Digital Wallet for Student Points

## Project Overview

This project is a Digital Wallet for Student Points, designed as a no-backend MVP. Students can view their points, request additional points by filling out a form, and redeem rewards. Administrators review and approve point requests, and manage available rewards. The application simulates backend functionality using localStorage and a mock API with authentication, providing a seamless user experience without the need for a real server.

## Key Features

- 🔥 **Firebase-Style Authentication**: Sign up and login with email/password (fake Firebase implementation)
- ✅ **Student Dashboard**: View points balance, request points, redeem rewards, and track transaction history
- ✅ **Point Request System**: Students submit requests that require admin approval (no self-service point addition)
- ✅ **Admin Dashboard**: Review and approve/reject point requests, manage rewards inventory
- ✅ **Reward Redemption**: Students can redeem available rewards using their points
- ✅ **Transaction History**: Complete audit trail of all point earnings and redemptions
- 🆕 **User Registration**: Create new student or admin accounts with signup form

## Getting Started

### Option 1: Sign Up (Recommended)

1. Click **"Don't have an account? Sign Up"**
2. Fill in your details:
   - Full Name
   - Email Address
   - Password (min 6 characters)
   - Account Type (Student or Admin)
3. Click **"Sign Up"**
4. You'll be automatically logged in!

### Option 2: Use Demo Accounts

**Admin Account:**

- Email: `admin@gmail.com`
- Password: `admin123`

**Student Accounts:**

- Email: `alice@student.com` / Password: `student123`
- Email: `bob@student.com` / Password: `student123`
- Email: `charlie@student.com` / Password: `student123`

### Troubleshooting

If you can't log in with demo accounts:

1. Open browser console (F12)
2. Run: `window.resetData()`
3. Refresh the page

## Setup Instructions

To run this project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd student-points-wallet
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

## Project Structure

- **src/**: Contains the main application code, including components, pages, and utilities.
- **docs/**: Documentation files outlining system requirements, security considerations, AI prompts, architecture, and wireframes.
- **public/**: Static assets like the favicon.
- **lib/**: Contains the mock API and seed data for initial application state.

## UX Notes

- The application features a modern and minimal UI built with TailwindCSS, ensuring responsiveness across devices.
- Screenshots of the application can be captured by navigating to the respective pages in the browser and using the screenshot functionality.

## Example Screenshots

- **Dashboard**: Open `http://localhost:5173` and capture the Dashboard view showing the student list and points.
- **Admin Rewards Page**: Navigate to the Admin Rewards page to capture the rewards management interface.

This MVP intentionally uses localStorage to simulate backend functionality, allowing for quick development and testing of core features.
