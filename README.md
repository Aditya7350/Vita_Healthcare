# Healthcare Document Automation (Patient Report System)

A modern, secure, and efficient healthcare document automation system. This application allows you to process PDF documents by adding logos, footers, and standardized formatting—all directly in your browser.

## 🚀 Deployment (Vercel)

The project is configured for a seamless Vercel deployment:

1.  **Connect to GitHub**: Push your code to a GitHub repository.
2.  **Import to Vercel**: Connect your Vercel account to the repo.
3.  **Configuration**: Vercel will automatically detect the `vercel.json` and split the build between the React frontend and the Node.js API.
4.  **Environment**: 
    - No specific env vars are required for basic usage.
    - Files are processed in memory or using `/tmp` on Vercel to bypass the read-only file system.

## 📁 Project Structure

- `frontend/`: React + Vite application (UI/UX).
- `api/`: Express.js backend (PDF Proxy & Drive Integration).
- `vercel.json`: Deployment configuration.

## Features

- **Client-Side Processing**: PDFs are processed in the browser using `pdf-lib` for maximum speed and privacy.
- **Drag & Drop Interface**: Easily upload multiple PDF files.
- **PDF URL Support**: Process PDFs directly from URLs via a secure backend proxy.
- **Custom Branding**: Upload your logo and position it (Left, Center, Right).
- **Footer Customization**: Add text or image footers to all pages.
- **Save to Google Drive**: Mock integration for saving processed reports.
- **Vercel Ready**: Optimized for deployment with Node.js and static builds.

## Prerequisites

- **Node.js 18+**

## Setup & Installation

1. **Install Dependencies**:
   
   In the root directory, run:
   ```bash
   npm install
   cd frontend && npm install
   ```

2. **Build & Start**:

   To run the full stack (Frontend + Node.js Proxy):
   ```bash
   npm run dev
   ```
   *The backend will run on port 8001, and the frontend on port 5173.*

## How to Run Locally (Windows)

Simply double-click the `run_app.bat` file in the root directory. It will handle dependency checks and start both the frontend and backend servers.

## Usage

1. Open your browser and go to `http://localhost:5173`.
2. **Upload PDFs** or enter **PDF URLs**.
3. Upload a **Logo** (optional) and select its position.
4. Set a **Footer** (Text or Image).
5. Click **Automate Documents**.
6. Preview the result and then **Download** or **Share**.

## Deployment

This project is configured for **Vercel**.
- The frontend is a Vite build.
- The backend is a Node.js Express server located in `api/index.js`.
