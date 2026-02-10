# News App Preview:🗞️

![News App Screenshot](./docs/news-app-preview.png)

A News App built with a React (Vite) frontend and a Vercel Serverless Functions backend (API proxy).

## ✨ Overview

This project is a **News App** with:

- **Frontend:** React (Vite) inside `/client`
- **Backend/API Proxy:** Vercel Serverless Functions inside `/api`

The backend proxy is used to:
- Call the News API securely (**no API key exposed in the browser**)
- Avoid **CORS** issues

---

## ✅ Prerequisites

Install the following:

- **Node.js** (recommended: **Node 18+**)
- **npm** (comes with Node)
- **Vercel CLI** (global install)

### Install Vercel CLI
```bash
npm install -g vercel

🚀 Clone & Install Dependencies
1) Clone the repo
git clone <YOUR_REPO_URL>
cd news-app

2) Install root dependencies (if applicable)
npm install

3) Install frontend dependencies

cd client
npm install
cd ..


