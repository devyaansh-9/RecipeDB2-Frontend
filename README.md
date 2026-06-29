# RecipeDB2 Frontend

This is a premium Single-Page Application (SPA) for the RecipeDB2 Computational Gastronomy Portal. It interfaces with the Foodoscope API and utilizes external AI tools for content generation.

## 🚀 Quick Start Guide

### Prerequisites
1. **Node.js**: Make sure you have Node.js installed (v18 or higher recommended).
2. **Git**: To clone the repository.

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/devyaansh-9/RecipeDB2-Frontend.git
   cd RecipeDB2-Frontend
   ```

2. **Configure Environment Variables (API Keys)**
   You must set up your local secrets. Create a file named `.env` in the root directory and add the following keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   STABILITY_KEY=your_stability_api_key_here
   API_KEY=your_foodoscope_api_key_here
   ```
   *(Note: The `.env` file is intentionally ignored by git for security purposes, so you must create it manually).*

3. **Install Dependencies**
   (If applicable, run the following, though the built files in `dist` do not require a build step to run):
   ```bash
   npm install
   ```

4. **Run the Application**
   Start the local proxy and file server:
   ```bash
   node server.js
   ```

5. **View in Browser**
   Once the server starts, it will output the local port it is bound to (usually `8080` or `8085`).
   Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

---
*The local server automatically proxies API requests to bypass CORS restrictions and handles the secure fetching of AI-generated content (images and news) via your configured `.env` keys.*
