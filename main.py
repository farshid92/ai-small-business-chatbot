from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
from pydantic import BaseModel
from dotenv import load_dotenv
import json
import urllib.request

load_dotenv()

app = FastAPI(title="HomeStyle Living")


class ChatRequest(BaseModel):
    prompt: str


@app.get("/api/images")
def list_images():
    """Return a JSON list of image URLs found under static/images."""
    base_static = os.path.join(os.path.dirname(__file__), "static")
    images_dir = os.path.join(base_static, "images")
    result = []
    if not os.path.exists(images_dir):
        return JSONResponse(result)

    for root, dirs, files in os.walk(images_dir):
        for f in files:
            if f.lower().endswith((".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp")):
                abs_path = os.path.join(root, f)
                rel_path = os.path.relpath(abs_path, base_static)
                url = "/" + rel_path.replace("\\", "/")
                result.append(url)

    return JSONResponse(result)


@app.post('/api/chat')
async def chat_endpoint(body: ChatRequest):
    """Accepts {"prompt": "..."} and returns AI reply.

    If environment variables `GEMINI_API_URL` and `GEMINI_API_KEY` are set,
    this will proxy the request to that endpoint (expects JSON request/response).
    Otherwise returns a mock reply for local demos.
    """
    gemini_url = os.getenv('GEMINI_API_URL')
    gemini_key = os.getenv('GEMINI_API_KEY')
    gemini_model = os.getenv('GEMINI_MODEL', 'gemini-1.5-flash')

    if gemini_key:
        if not gemini_url:
            gemini_url = f'https://generativelanguage.googleapis.com/v1beta2/models/{gemini_model}:generate'

        payload = json.dumps({
            "prompt": {"text": body.prompt},
            "temperature": 0.3,
            "candidate_count": 1
        }).encode('utf-8')

        headers = {'Content-Type': 'application/json'}
        if gemini_key:
            headers['Authorization'] = f'Bearer {gemini_key}'

        req = urllib.request.Request(gemini_url, data=payload, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                resp_data = json.load(resp)

            if isinstance(resp_data, dict):
                if 'candidates' in resp_data and resp_data['candidates']:
                    text = resp_data['candidates'][0].get('output')
                elif 'output' in resp_data:
                    text = resp_data['output']
                else:
                    text = json.dumps(resp_data)
            else:
                text = str(resp_data)

            return JSONResponse({"reply": text})
        except urllib.error.HTTPError as e:
            err_text = e.read().decode('utf-8', errors='ignore')
            return JSONResponse({"error": "provider_error", "message": err_text})
        except Exception as e:
            return JSONResponse({"error": "provider_error", "message": str(e)})

    # Mock reply for demo when no key/url provided
    reply = f"(demo) I received your prompt: {body.prompt}. This is a mock reply."
    return JSONResponse({"reply": reply})
app.mount("/", StaticFiles(directory="static", html=True), name="static")