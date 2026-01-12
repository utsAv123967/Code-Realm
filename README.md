# Code-Realm - Collaborative Coding with AI

A real-time collaborative coding platform with AI assistance powered by Google Gemini.

## Setup & Installation

```bash
$ npm install # or pnpm install or yarn install
```

## Environment Variables

Create a `.env` file in the root directory with:

### Firebase Configuration
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Backend APIs
```env
PORT=5000
RAPID_API_HOST=judge0-ce.p.rapidapi.com
RAPID_API_KEY=your_rapidapi_key
GEMINI_API_KEY=your_gemini_api_key
```

### Getting API Keys:

**RapidAPI (Judge0)** - For code execution:
- Visit: https://rapidapi.com/judge0-official/api/judge0-ce
- Sign up and subscribe to free plan
- Copy your API key

**Google Gemini** - For AI chatbot:
- Visit: https://makersuite.google.com/app/apikey
- Sign in with Google account
- Create new API key
- Copy to `.env`

## Running the Application

**Frontend:**
```bash
npm run dev
```

**Backend (in separate terminal):**
```bash
cd src/Backend
node index.js
```

## Features

- 🤝 Real-time collaborative coding
- 🤖 AI assistant with Gemini (code context support)
- ▶️ Code execution with Judge0
- 📁 Multi-file projects
- 👥 Team chat
- 🔥 Firebase auth & storage

## Usage

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

Learn more about deploying your application with the [documentations](https://vite.dev/guide/static-deploy.html)
