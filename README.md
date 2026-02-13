# Contact Management System

A full-stack contact management application built with React, Express.js, PostgreSQL, and Drizzle ORM. This system allows users to manage their contacts with features like adding, viewing, searching, and deleting contacts.

---

# 🌐 Live Demo

- 🔗 **Frontend (Vercel)**  
  https://contact-management-system-eight.vercel.app

- 🔗 **Backend API (Render)**  
  https://contact-mangement-system-1h2p.onrender.com/api

- ❤️ **Health Check**
  https://contact-mangement-system-1h2p.onrender.com/health

---

##  Features

- ✅ **CRUD Operations**  
  Create, read, and delete contacts.

- ✅ **Search & Filter**  
  Search contacts by name or company (case-insensitive).

- ✅ **Form Validation**  
  Client-side and server-side validation using Zod.

- ✅ **Toast Notifications**  
  User-friendly success and error notifications.

- ✅ **Confirmation Dialogs**  
  Confirm before deleting contacts.

- ✅ **Loading States**  
  Smooth loading indicators for all async operations.

- ✅ **Error Handling**  
  Comprehensive error handling throughout the app.

- ✅ **Responsive Design**  
  Mobile-friendly UI built with Tailwind CSS.

- ✅ **Modern UI**  
  Clean, professional interface with smooth animations.

## Tech Stack

### Backend
- **Node.js** (v18+) with **Express.js**
- **PostgreSQL** (v14+) - Relational database
- **Drizzle ORM** - Type-safe ORM for PostgreSQL
- **Zod** - Schema validation
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** with **TypeScript**
- **Vite** - Build tool and dev server
- **TanStack Query** (React Query v5) - Server state management
- **React Hook Form** - Form handling
- **Headless UI** - Accessible UI components
- **Tailwind CSS** - Styling
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher)

## Project Structure

```
Contact-Management/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts          # Database schema
│   │   │   └── db.ts              # Database connection
│   │   ├── routes/
│   │   │   └── contacts.routes.ts # API routes
│   │   ├── validation/
│   │   │   └── validation.ts      # Zod schemas
│   │   └── server.ts              # Express server
│   ├── drizzle.config.ts          # Drizzle configuration
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.ts             # API client
│   │   ├── components/
│   │   │   ├── AddContactModal.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── Icons.tsx
│   │   ├── pages/
│   │   │   └── ContactsPage.tsx   # Main page
│   │   ├── types/
│   │   │   └── types.ts           # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

## Setup Instructions

### 1. Database Setup

First, create a PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE contacts_db;

# Exit psql
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL=postgresql://username:password@localhost:5432/contacts_db
# PORT=5000
# NODE_ENV=development

# Generate and run database migrations
npm run db:push

# Start the development server
npm run dev
```

The backend server should now be running on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application should now be running on `http://localhost:3000`.

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Get All Contacts
```http
GET /contacts?search=query
```

**Query Parameters:**
- `search` (optional): Search by name or company (case-insensitive)

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 234 567 8900",
    "company": "Acme Inc.",
    "createdAt": "2026-02-12T11:43:25.000Z"
  }
]
```

#### 2. Create Contact
```http
POST /contacts
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1 987 654 3210",
  "company": "Tech Corp"
}
```

**Response:**
```json
{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1 987 654 3210",
  "company": "Tech Corp",
  "createdAt": "2026-02-12T11:43:25.000Z"
}
```

#### 3. Delete Contact
```http
DELETE /contacts/:id
```

**Response:**
```json
{
  "message": "Contact deleted successfully",
  "contact": {
    "id": 2,
    "name": "Jane Smith",
    ...
  }
}
```

## Database Schema

### saved_contacts Table

| Column     | Type      | Constraints           | Description              |
|------------|-----------|-----------------------|--------------------------|
| id         | SERIAL    | PRIMARY KEY           | Auto-increment ID        |
| name       | TEXT      | NOT NULL              | Contact name (required)  |
| email      | TEXT      | NULL                  | Email address (optional) |
| phone      | TEXT      | NULL                  | Phone number (optional)  |
| company    | TEXT      | NULL                  | Company name (optional)  |
| created_at | TIMESTAMP | DEFAULT NOW(), NOT NULL | Creation timestamp     |

## Features in Detail

### Form Validation
- **Name**: Required, max 255 characters
- **Email**: Optional, must be valid email format, max 255 characters
- **Phone**: Optional, max 50 characters
- **Company**: Optional, max 255 characters

### Search Functionality
- Case-insensitive search
- Searches both name and company fields
- Debounced input (300ms) for better performance
- Real-time results update

### UI/UX Features
- Modern gradient background
- Smooth hover effects on table rows
- Loading spinner during data fetch
- Empty state messages
- Mobile-responsive design
- Toast notifications for all actions
- Confirmation dialog before deletion
- Accessible components (Headless UI)

## Assumptions Made

1. **Authentication**: Not implemented (assumed to be added later if needed)
2. **Pagination**: Basic count display only (can be extended)
3. **Edit Functionality**: Not included in MVP (only Create, Read, Delete)
4. **Phone Validation**: Basic length validation (no specific format enforced)
5. **Email Uniqueness**: Not enforced (multiple contacts can have same email)
6. **Single User**: App assumes single-user usage (no multi-tenancy)
7. **Local Development**: Setup assumes local PostgreSQL instance

## Available Scripts

### Backend

```bash
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript to JavaScript
npm run start      # Run production build
npm run db:generate # Generate migrations
npm run db:push    # Push schema to database
npm run db:studio  # Open Drizzle Studio
```

### Frontend

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://username:password@localhost:5432/contacts_db
PORT=5000
NODE_ENV=development
```

### Frontend (optional .env)

```env
VITE_API_URL=http://localhost:5000/api
```

## Future Enhancements

- [ ] Edit contact functionality
- [ ] Bulk delete operations
- [ ] Export contacts (CSV/JSON)
- [ ] Import contacts from file
- [ ] Contact groups/tags
- [ ] Advanced search filters
- [ ] Pagination for large datasets
- [ ] User authentication and authorization
- [ ] Contact profile pictures
- [ ] Activity history/audit log
- [ ] Favorites/starred contacts
- [ ] Multi-user support with permissions

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env file
- Ensure database exists and credentials are correct

### Port Already in Use
- Backend default: 5000
- Frontend default: 3000
- Change ports in .env (backend) or vite.config.ts (frontend)

### Module Not Found Errors
- Delete node_modules and package-lock.json
- Run `npm install` again

### CORS Errors
- Ensure backend CORS is properly configured
- Check frontend proxy settings in vite.config.ts

## License

ISC

## Author

Built as a technical assessment project for Contact Management System requirements.
