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

## Run locally

```bash
python -m uvicorn main:app --reload
```

Open the site at `http://127.0.0.1:8000`.
