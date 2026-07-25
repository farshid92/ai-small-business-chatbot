# AI Small Business Chatbot

An AI-powered Sales & Support Assistant for a fictional home décor store.

## Tech Stack

- Python 3.12+
- FastAPI
- Google Gemini
- HTML/CSS/JavaScript

## Status

🚧 Work in Progress

## Git Milestone Workflow

This project uses milestone commits so the session shows progress clearly.

1. `ch1-demo-app-initial` — initial website, images, and static serving.
2. `ch2-chat-endpoint` — chat backend endpoint and frontend wiring.
3. `ch3-gemini-integration` — Gemini integration or mock-ready proxy.
4. `ch4-cleanup-ui` — UI polish and UX improvements.
5. `ch5-deploy-prep` — deployment notes and local run instructions.
6. `ch6-deploy-live` — final deployment and live URL notes.

After each milestone, run:

```bash
git add .
git commit -m "<milestone>: <summary>"
git push origin main
```

## Gemini API Setup

To use real AI responses, create a `.env` file from `.env.example` and add your Gemini API key:

```bash
copy .env.example .env
```

Then edit `.env` and set:

```ini
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash
# or gemini-1.5-proc if available
```

## Quick Start (Local)

**Requirements**: Python 3.12 or later

### Step 1: Clone and Install

```bash
cd ai-small-business-chatbot
python -m venv .venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -e .
```

### Step 2: Set Up Gemini API (Optional)

Copy the example environment file:

```bash
copy .env.example .env  # Windows
cp .env.example .env     # macOS/Linux
```

Edit `.env` and add your free Gemini API key:

```ini
GEMINI_API_KEY=your_free_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

(See **Gemini API Setup** section below for details on getting a free key.)

If you skip this step, the chat endpoint will return a mock response.

### Step 3: Run the App

```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Open your browser to **`http://127.0.0.1:8000`** and explore:
- **Bedroom, Living Room, Office** — Room-based product cards with images
- **Chat with AI** — Ask questions about furniture and decor

Press `Ctrl+C` to stop the server.

---

## Gemini API Setup

### Getting a Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) (free tier, no credit card required for basic usage)
2. Click **Create API Key**
3. Copy the key and paste it into `.env` as `GEMINI_API_KEY=...`
4. Set `GEMINI_MODEL=gemini-1.5-flash` (free tier model)

### Testing the Chat

Once the app is running, click "Chat with AI" on the home page and try a prompt like:
- *"Recommend a coffee table under $300"*
- *"What's a good office chair for a small space?"*
- *"Show me bedroom furniture ideas"*

The bot will respond with recommendations based on the context provided.

---

## Deployment

For production deployment on Network Solutions (or other shared hosting), see [DEPLOYMENT.md](DEPLOYMENT.md).
