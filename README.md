# University Chatbot Frontend

A modern React frontend built with **Vite + TypeScript + Tailwind CSS** for a university chatbot system.

## Features

- **Modern Chat Interface** - Real-time conversation with the university chatbot
- **Document Upload System** - Drag-and-drop PDF upload with metadata management
- **Admin Dashboard** - Document management and system statistics
- **Responsive Design** - Mobile-first approach with modern UI/UX
- **Real-time Updates** - Live status updates and progress tracking

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for HTTP requests
- **Lucide React** for icons

## Project Structure

```
src/
├── components/
│   ├── Chat/
│   │   ├── ChatInterface.tsx    # Main chat component
│   │   ├── MessageList.tsx      # Message display
│   │   └── MessageInput.tsx     # Message input form
│   ├── Admin/
│   │   ├── Dashboard.tsx        # Admin dashboard with stats
│   │   ├── DocumentList.tsx     # Document management
│   │   └── FileUpload.tsx       # File upload with drag-and-drop
│   └── Layout/
│       └── Header.tsx           # Navigation header
├── services/
│   └── api.ts                   # API service layer
├── types/
│   └── index.ts                 # TypeScript interfaces
└── App.tsx                      # Main application component
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on port 5000 (or configure `VITE_API_BASE_URL`)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (optional):

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Integration

The frontend integrates with the following backend endpoints:

### Health Check

- `GET /health` - System health status

### Chat System

- `POST /chat/session` - Create new chat session
- `POST /chat/session/{id}/message` - Send message

### Document Management

- `POST /upload-document` - Upload PDF documents
- `GET /documents` - List all documents
- `DELETE /documents/{id}` - Delete document

### Statistics

- `GET /vector-stats` - Get system statistics

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Chat Interface

- Clean, modern chat UI with user/bot message differentiation
- Real-time message sending and receiving
- Auto-scroll to latest messages
- Loading states during bot responses
- Error handling with retry functionality

### Document Upload

- Drag-and-drop file upload area
- PDF file validation (max 10MB)
- Metadata form (title, description, category)
- Upload progress indicators
- Success/error notifications

### Admin Dashboard

- System statistics overview
- Document processing status
- Real-time metrics display
- Document list with management controls
- Processing progress visualization

## Styling

The application uses Tailwind CSS with a custom color palette:

- **Primary Colors**: Various shades of blue for interactive elements
- **Status Colors**: Green for success, yellow for processing, red for errors
- **Layout**: Professional gray-scale color scheme

### Custom CSS Classes

- `.chat-bubble` - Base message bubble styling
- `.chat-bubble-user` - User message styling (blue background)
- `.chat-bubble-bot` - Bot message styling (gray background)
- `.upload-area` - File upload drop zone with hover effects

## Environment Configuration

The application supports the following environment variables:

- `VITE_API_BASE_URL` - Backend API base URL (default: `http://localhost:5000/api`)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new components
3. Add proper error handling
4. Test responsive design on multiple screen sizes
5. Use semantic HTML and proper accessibility attributes

## API Response Types

The application expects the following API response formats:

```typescript
// Chat message
interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
}

// Document
interface Document {
  id: string;
  title: string;
  original_filename: string;
  category: string;
  file_size: number;
  is_processed: boolean;
  chunk_count: number;
  uploaded_at: string;
}

// Statistics
interface VectorStats {
  vector_database: { total_chunks: number };
  database: {
    total_documents: number;
    processed_documents: number;
    unprocessed_documents: number;
  };
}
```

## License

This project is licensed under the MIT License.
