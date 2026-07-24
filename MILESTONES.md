# Milestone Guide and Git Push Plan

This project is taught as a single session, but we will still use multiple git commits to show progress and workflow.

## Milestones

1. `ch1-demo-app-initial`
   - What: Add the working website UI, static image gallery, and FastAPI static file serving.
   - Why: Demonstrates the complete website structure and shows the project running locally.
   - Push: `git add . && git commit -m "ch1-demo-app-initial: add website UI, image gallery, and static serving" && git push`

2. `ch2-chat-endpoint`
   - What: Add `/api/chat` endpoint to the backend and wire the Send button to it.
   - Why: Shows how the chatbot connects the frontend to a backend API.
   - Push: `git add . && git commit -m "ch2-chat-endpoint: add AI chat API and frontend integration" && git push`

3. `ch3-gemini-integration`
   - What: Add real Gemini integration support or a proxy-ready template, with environment variable support.
   - Why: Introduces the actual AI provider and safe configuration.
   - Push: `git add . && git commit -m "ch3-gemini-integration: add Gemini proxy endpoint and config support" && git push`

4. `ch4-cleanup-ui`
   - What: Polish the chat UI, featured products, and gallery layout.
   - Why: Demonstrates iterative improvement and UX focus.
   - Push: `git add . && git commit -m "ch4-cleanup-ui: improve website layout and chat UI" && git push`

5. `ch5-deploy-prep`
   - What: Add a deployment note, local run instructions, and a `README.md` update.
   - Why: Prepares the project for showing hosting and launch workflow.
   - Push: `git add . && git commit -m "ch5-deploy-prep: add deployment notes and README instructions" && git push`

6. `ch6-deploy-live`
   - What: Deploy on Network Solutions and push a note about the hosted URL or deployment steps.
   - Why: Shows the full delivery from code to live website.
   - Push: `git add . && git commit -m "ch6-deploy-live: finalize deployment steps and live URL" && git push`

## General push reminder

Always push after each milestone so the class can see the workflow live. Use these exact commands in the session:

```bash
git status
git add .
git commit -m "<milestone>: <short description>"
git push origin main
```
