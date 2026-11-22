
### Server `README.md`

```markdown
# SalonBook Server

The SalonBook server provides the REST API for the SalonBook appointment booking platform. It manages authentication, salon services, appointments, admin operations, and Stripe payments.

## Features

- Express.js REST API
- MongoDB database integration
- Better Auth authentication
- Role-based authorization for protected APIs
- Salon service management
- Appointment request and status management
- Stripe Checkout for confirmed appointments
- Verified Stripe webhook handling for payment updates
- Email configuration for account-related messages

## Technology Stack

- Node.js
- TypeScript
- Express.js
- MongoDB
- Better Auth
- Stripe
- Resend

## Links

- **Live Website:** https://salonbook-client-tan.vercel.app/
- **Client Repository:** https://github.com/aliazazrafe/salonbook-client
- **Server Repository:** `ADD_SERVER_REPOSITORY_URL`
- **Live API:** `ADD_LIVE_SERVER_URL`

## Installation

Clone the server repository and install its dependencies:

```bash
git clone ADD_SERVER_REPOSITORY_URL
cd salonbook-server
npm install