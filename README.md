# Heavenly Furniture Store

Heavenly Furniture Store is a full-stack e-commerce application for exploring and shopping for furniture. It brings a React storefront and an Express API together to support product discovery, customer accounts, shopping lists, checkout, and order management.

## About

The project is designed to make it easy for customers to find furniture for their homes. Shoppers can browse furniture by room, save products to a wishlist, and manage a shopping cart. The storefront also includes account and order workflows, along with information and support pages to help customers throughout their shopping experience.

## Features

- **Storefront and catalog:** A responsive home page, shop landing page, room-based categories, and product listings loaded from the API.
- **Shopping tools:** Add products to a cart, adjust quantities, remove items, and save favorites to a wishlist. Cart and wishlist data persist in the browser.
- **Checkout and orders:** Checkout flow and order-tracking page for following an order's progress.
- **Customer accounts:** Sign up and sign in, email OTP verification, session management, and forgot/reset-password flows.
- **Store information and support:** About, contact, FAQ, care guide, shipping and returns, sustainability, careers, press, privacy, and terms pages.
- **Administration:** A separate admin dashboard route.
- **API-backed application:** An Express server provides API endpoints and authentication; Prisma is used for database access.

## Technology

- **Frontend:** React 19, TypeScript, Vite, React Router, Tailwind CSS
- **Data and state:** TanStack Query, Zustand
- **Backend:** Express 5, TypeScript, Better Auth, Prisma

## Project Structure

```text
.
├── src/                 # React storefront, pages, components, and client-side state
├── public/              # Static images and other public assets
└── express-api/          # Express API, authentication, and Prisma database schema
```

## Getting Started

### Requirements

- Node.js and npm
- The environment configuration and services required by the API (including its database)

### Install dependencies

Install the frontend dependencies from the repository root:

```bash
npm install
```

Install the API dependencies separately:

```bash
cd express-api
npm install
```

Configure the API's environment variables and database for your local setup. Set the frontend's `VITE_API_BASE_URL` to the URL where your API is running.

### Run locally

Start the API in one terminal:

```bash
cd express-api
npm run dev
```

Start the storefront from the repository root in another terminal:

```bash
npm run dev
```

Vite prints the local storefront URL when the development server starts.

## Available Scripts

From the repository root:

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and build the storefront
npm run lint     # Lint the project
npm run preview  # Preview the production build
```

From `express-api/`:

```bash
npm run dev      # Start the API in development
npm run build    # Generate the Prisma client and build the API
npm start        # Apply deployed Prisma migrations and start the API
```
