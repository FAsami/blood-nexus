![alt text](demo-img.png)

# Blood Nexus - Blood Donation Platform

Blood Nexus is a modern web application built with Next.js that connects blood donors with those in need. The platform facilitates blood donation requests and matches donors based on location and blood type compatibility.

## Features

- User authentication with email/phone and password
- OAuth integration for social login
- OTP verification for phone numbers and email addresses
- Password reset functionality
- Location-based donor search using Google Places API
- Real-time donor matching
- Responsive design for all devices
- reCAPTCHA integration for security

## Tech Stack

- **Frontend**: Next.js 14, React 18, Material UI, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **APIs**: Google Maps/Places API
- **Container**: Docker
- **Type Safety**: TypeScript
- **Form Handling**: React Hook Form, Zod
- **Styling**: TailwindCSS, Material UI

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL
- Google Maps API key
- reCAPTCHA API keys

## Environment Variables

Create a `.env` file in the root directory with the following variables:

Database

```
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:7649/bloodnexus"
```

NextAuth

```

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

```

Google

```

GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key"

```

Email (for OTP)

```

NO_REPLY_EMAIL="noreply@yourdomain.com"
SMTP_HOST="smtp.yourdomain.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-username"
SMTP_PASSWORD="your-smtp-password"

```

The application will be available at `http://localhost:3000`

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable React components
- `/src/auth` - Authentication configuration and utilities
- `/src/schema` - Zod validation schemas
- `/src/utils` - Helper functions and utilities
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run prisma:seed` - Seed the database

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Material UI team for the component library
- All contributors who have helped with the project

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/blood-nexus.git
cd blood-nexus
```

2. Install dependencies:

```bash
npm install
```

3. Start the PostgreSQL database:

```bash
docker-compose up -d
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Seed the database:

```bash
npm run prisma:seed
```

6. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable React components
- `/src/auth` - Authentication configuration and utilities
- `/src/schema` - Zod validation schemas
- `/src/utils` - Helper functions and utilities
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run prisma:seed` - Seed the database

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
