# Library Management System API

A robust RESTful API for managing books and borrowing operations built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- **Book Management**: CRUD operations for books with validation
- **Borrowing System**: Track book borrowing with quantity management
- **Data Validation**: Zod schema validation for all inputs
- **Error Handling**: Comprehensive error handling middleware
- **TypeScript**: Full TypeScript support with type safety
- **MongoDB**: MongoDB with Mongoose ODM
- **RESTful API**: Clean REST API design

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd library-management-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   The application is currently configured to use MongoDB Atlas. If you want to use a local MongoDB instance or different connection string, update the connection string in `src/server.ts`:

   ```typescript
   await mongoose.connect("your-mongodb-connection-string");
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Book Endpoints

#### 1. Create a Book

**POST** `/books`

**Request Body:**

```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "FICTION",
  "isbn": "978-0743273565",
  "description": "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
  "copies": 5
}
```

**Response:**

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "FICTION",
    "isbn": "978-0743273565",
    "description": "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 2. Get All Books

**GET** `/books`

**Query Parameters:**

- `filter` (optional): Filter by genre (FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY)
- `sortBy` (optional): Sort field (default: createdAt)
- `sort` (optional): Sort order - "asc" or "desc" (default: asc)
- `limit` (optional): Number of results (default: 10)

**Example:**

```
GET /books?filter=FICTION&sortBy=title&sort=asc&limit=5
```

#### 3. Get Book by ID

**GET** `/books/:bookId`

**Example:**

```
GET /books/64f8a1b2c3d4e5f6a7b8c9d0
```

#### 4. Update Book

**PUT** `/books/:bookId`

**Request Body:**

```json
{
  "title": "Updated Book Title",
  "copies": 10
}
```

#### 5. Delete Book

**DELETE** `/books/:bookId`

**Note:** Deleting a book will also delete all associated borrow records.

### Borrow Endpoints

#### 1. Borrow a Book

**POST** `/borrows`

**Request Body:**

```json
{
  "book": "64f8a1b2c3d4e5f6a7b8c9d0",
  "quantity": 2,
  "dueDate": "2024-02-15T00:00:00.000Z"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "book": "64f8a1b2c3d4e5f6a7b8c9d0",
    "quantity": 2,
    "dueDate": "2024-02-15T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 2. Get Borrow Summary

**GET** `/borrows`

Returns a summary of all borrowed books with total quantities.

**Response:**

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Great Gatsby",
        "isbn": "978-0743273565"
      },
      "totalQuantity": 3
    }
  ]
}
```

## 📖 Data Models

### Book Schema

```typescript
{
  title: string;           // Required
  author: string;          // Required
  genre: string;           // Required - enum: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY
  isbn: string;            // Required, unique
  description?: string;    // Optional
  copies: number;          // Required, min: 0
  available: boolean;      // Auto-managed based on copies
}
```

### Borrow Schema

```typescript
{
  book: ObjectId; // Reference to Book
  quantity: number; // Number of copies borrowed
  dueDate: Date; // Due date for return
}
```

## 🔧 Available Genres

- `FICTION`
- `NON_FICTION`
- `SCIENCE`
- `HISTORY`
- `BIOGRAPHY`
- `FANTASY`

## ⚠️ Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## 🚀 Scripts

- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests (not implemented yet)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── types/           # TypeScript type definitions
│   └── validators/      # Zod validation schemas
├── app.ts              # Express app configuration
└── server.ts           # Server entry point
```

## 🔒 Validation

All API endpoints use Zod schemas for request validation:

- **Book Creation**: Validates required fields, genre enum, and ISBN uniqueness
- **Book Updates**: Validates optional fields and maintains data integrity
- **Borrowing**: Validates book existence, quantity availability, and due date

## 🗄️ Database

The application uses MongoDB with Mongoose ODM. Key features:

- **Automatic Timestamps**: All models include `createdAt` and `updatedAt`
- **Cascade Deletion**: Deleting a book removes all associated borrow records
- **Availability Management**: Book availability is automatically updated based on copy count
- **Unique Constraints**: ISBN must be unique across all books

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.
