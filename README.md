# ShopNest

ShopNest is a MERN e-commerce application with authentication, product browsing, cart management, checkout support, and admin product management.

## Project Structure

- `backend/` - Express.js API server with MongoDB, JWT auth, product and order routes, Cloudinary uploads, Razorpay payment integration, and seed data utilities.
- `frontend/` - React app created with Create React App, using Redux Toolkit for cart state and React Router for navigation.

## Features

- User registration, login, and OTP verification flow
- JWT-based authentication and protected routes
- Product listing, detail pages, and add-to-cart behavior
- Cart persistence with Redux state
- Checkout flow with order creation
- Admin product CRUD operations
- Seed script to populate demo users, products, and orders

## Prerequisites

- Node.js (recommended latest LTS)
- npm
- MongoDB Atlas or local MongoDB instance
- Optional: Cloudinary account for image uploads
- Optional: Razorpay account for payment integration

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Darshi7587/ShopNest.git
   cd ShopNest
   ```

2. Install dependencies for backend and frontend:

   ```bash
   npm run install
   ```

3. Create a `.env` file inside `backend/` with values for your environment:

   ```env
   PORT=5000
   MONGO_URI=<your_mongo_connection_string>
   JWT_SECRET=<your_jwt_secret>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   EMAIL_HOST=<smtp_host>
   EMAIL_PORT=<smtp_port>
   EMAIL_USER=<smtp_email_user>
   EMAIL_PASS=<smtp_email_password>
   RAZORPAY_KEY_ID=<your_razorpay_key_id>
   RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
   ```

   If you do not use Cloudinary or Razorpay, the related features will not function until configured.

## Run Locally

Start backend and frontend concurrently from the root:

```bash
npm run dev
```

This uses:

- Backend: `backend/` on `http://localhost:5000`
- Frontend: `frontend/` on `http://localhost:3000`

Alternatively, start services separately:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm start
```

## Backend Scripts

- `npm run dev` - starts backend with `nodemon`
- `npm start` - starts backend with Node
- `npm run seed` - seeds demo users, products, and orders from `backend/utils/seed.js`

## Frontend Scripts

- `npm start` - runs the React development server
- `npm run build` - builds the production app
- `npm test` - runs React test suites

## API Endpoints

The backend exposes REST endpoints under `/api`.

Common route groups:

- `/api/auth` - auth, register, login, OTP verification
- `/api/products` - product listing, details, admin create/update/delete
- `/api/orders` - order creation and order listing
- `/api/payments` - payment integration and order capture
- `/api/analytics` - admin analytics routes

## Notes

- The frontend `package.json` is configured with a proxy to `http://localhost:5000`, so API calls from React will route to the backend during development.
- Make sure the backend `.env` values are valid before starting the app.
- If using seed data, run `cd backend && npm run seed` after installing backend dependencies.

## License

This project is distributed under the ISC License.
