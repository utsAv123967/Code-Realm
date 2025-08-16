# Code Realm

A collaborative coding platform built with SolidJS, TypeScript, and Firebase.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker Desktop

### Development Setup

1. **Clone and Install**

   ```bash
   git clone https://github.com/utsAv123967/Code-Realm.git
   cd Code-Realm
   npm install
   ```

2. **Environment Setup**

   ```bash
   # Copy environment template
   cp .env.example .env

   # Add your Firebase and RapidAPI credentials to .env
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

### Docker Deployment

1. **Build and Run**

   ```bash
   docker-compose up --build
   ```

2. **Access Services**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
├── src/
│   ├── Frontend/          # SolidJS frontend components
│   ├── Backend/           # Express.js API server
│   └── assets/            # Static assets
├── docker-compose.yml     # Development container setup
├── Dockerfile            # Frontend container
├── Dockerfile.backend    # Backend container
└── .env.example          # Environment template
```

## 🔧 Technologies

- **Frontend**: SolidJS, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Judge0 API
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Deployment**: Docker, GitHub Actions

## 📖 Documentation

- [`prep.md`](./prep.md) - Development preparation notes
- [`PRESENTATION_GUIDE.md`](./PRESENTATION_GUIDE.md) - Presentation guidelines

## 🌐 Environment Variables

Required environment variables are documented in `.env.example`.

**Important**: Never commit actual `.env` files to the repository!

## 🚢 Deployment

The project includes Docker configuration for easy deployment to any cloud platform that supports containers.

For production deployment, create a `.env.production` file with your production environment variables and use the provided Docker Compose configuration.

## 📝 License

This project is part of an educational initiative.
