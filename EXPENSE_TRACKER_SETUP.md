# Financial Management System Setup Guide

This guide will help you set up the Financial Management System (Income & Expense Tracker) feature for your agency.

## Features

- **Admin Authentication**: Secure login with hardcoded credentials
- **Comprehensive Financial Management**: Track both income and expenses
- **Income Tracking**: Add, edit, and delete income entries
- **Expense Tracking**: Add, edit, and delete expenses
- **Financial Overview**: Dashboard with income, expenses, and net amount
- **Category Management**: Predefined categories for both income and expenses
- **Advanced Filtering**: Filter by date, category, and search terms
- **Data Visualization**: Pie charts for expense and income breakdown
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Next.js project setup

## Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Create Environment File**
   Create a `.env.local` file in your project root with the following variables:

   ```env
   # Admin Authentication
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123456
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # MongoDB Connection
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/decors-digital

   # For MongoDB Atlas (cloud):
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/decors-digital
   ```

3. **Configure Next.js**
   The project has been configured to support dynamic API routes. The `next.config.mjs` file has been updated to remove static export configuration.

4. **Start MongoDB**

   - **Local MongoDB**: Start your local MongoDB service
   - **MongoDB Atlas**: Use the connection string from your Atlas cluster

5. **Run the Application**
   ```bash
   npm run dev
   ```

## Usage

1. **Access Admin Login**
   Navigate to `http://localhost:3000/admin/login`

2. **Login Credentials**

   - Username: `admin`
   - Password: `admin123456`

3. **Financial Management**
   - **Overview Tab**: View total income, expenses, and net amount with charts
   - **Income Tab**: Add, edit, and delete income entries
   - **Expenses Tab**: Add, edit, and delete expenses
   - Filter and search functionality for both income and expenses
   - Data visualization with pie charts for category breakdown

## API Endpoints

### Authentication

- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout

### Expenses

- `GET /api/admin/expenses` - Get all expenses
- `POST /api/admin/expenses` - Create new expense
- `PUT /api/admin/expenses/[id]` - Update expense
- `DELETE /api/admin/expenses/[id]` - Delete expense

### Income

- `GET /api/admin/income` - Get all income
- `POST /api/admin/income` - Create new income
- `PUT /api/admin/income/[id]` - Update income
- `DELETE /api/admin/income/[id]` - Delete income

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Prevents XSS attacks
- **Middleware Protection**: All admin routes are protected
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error handling and logging

## Database Schema

### Expenses Collection

```javascript
{
  _id: ObjectId,
  date: Date,
  category: String,  // e.g., "Operational Cost", "Employee Salary", "Travel"
  description: String,
  amount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Income Collection

```javascript
{
  _id: ObjectId,
  date: Date,
  category: String,  // e.g., "AV", "Web Development", "Social Media Services"
  description: String,
  amount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Expense Categories

- Operational Cost
- Employee Salary
- Travel
- Office Supplies
- Premium Licenses
- Travel Allowance
- Utilities
- Rent
- Insurance
- Intern TA
- Other

## Income Categories

- AV
- Web Development
- Social Media Services
- Photography
- Strategy
- Consultation
- Other

## Production Deployment

1. **Update Environment Variables**

   - Change default admin credentials
   - Use a strong JWT secret
   - Configure production MongoDB URI

2. **Security Considerations**

   - Use HTTPS in production
   - Set secure cookie flags
   - Implement rate limiting
   - Regular security updates

3. **Database Setup**
   - Create indexes for better performance
   - Set up regular backups
   - Monitor database performance

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Verify MongoDB is running
   - Check connection string in `.env.local`
   - Ensure network connectivity
   - For SSL issues, the connection options have been updated to handle TLS properly

2. **Authentication Issues**

   - Verify admin credentials in `.env.local`
   - Check JWT secret configuration
   - Clear browser cookies if needed

3. **API Errors**

   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check server logs for detailed errors

4. **Static Export Errors**
   - The project has been configured to support dynamic API routes
   - Remove `output: 'export'` from `next.config.mjs` if you need API functionality
   - Use `export const dynamic = 'force-dynamic'` in API routes

### Support

For additional support or feature requests, please contact your development team.

## File Structure

```
app/
├── admin/
│   ├── login/
│   │   └── page.js          # Admin login page
│   └── expenses/
│       └── page.js          # Expense tracker main page
├── api/
│   └── admin/
│       ├── login/
│       │   └── route.js     # Login API
│       ├── logout/
│       │   └── route.js     # Logout API
│       └── expenses/
│           ├── route.js     # GET/POST expenses
│           └── [id]/
│               └── route.js # PUT/DELETE individual expenses
└── utils/
    └── mongodb.js           # MongoDB connection utility
middleware.js                # Authentication middleware
next.config.mjs              # Next.js configuration (updated for dynamic routes)
```

## Recent Fixes

### Version 1.1 - Error Fixes

- **Fixed MongoDB SSL/TLS connection issues** by updating connection options
- **Resolved Next.js static export conflicts** by adding dynamic configuration
- **Added proper error handling** for database connections
- **Updated API routes** to support dynamic rendering
- **Improved connection timeout** and retry logic
