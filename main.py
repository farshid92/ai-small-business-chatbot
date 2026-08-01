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
    """Accepts {"prompt": "..."} and returns AI reply from Gemini API.

    Uses environment variables:
    - GEMINI_API_KEY: Your API key from Google AI Studio
    - GEMINI_MODEL: Model name (default: gemini-flash-latest)
    
    If no API key is set, returns a mock demo response.
    """
    gemini_key = os.getenv('GEMINI_API_KEY')
    gemini_model = os.getenv('GEMINI_MODEL', 'gemini-flash-latest')

    if gemini_key:
        # Use the latest Google Generative AI API endpoint
        gemini_url = f'https://generativelanguage.googleapis.com/v1beta/models/{gemini_model}:generateContent'

        payload = json.dumps({
            "system_instruction": {
                "parts": [{
                    "text": "You are a sales assistant for Homestyle Living. ALWAYS format responses using ONLY simple lists. NEVER use paragraphs, asterisks, bold, markdown, or long sentences.\n\nRULES:\n- Start each item on a NEW LINE with a number: 1. 2. 3.\n- Each item must be 1-2 sentences MAX.\n- Use plain text only - NO **bold**, NO _italic_, NO # headers.\n- Leave a blank line between different sections.\n- If showing multiple items, use ONLY: 1. Item\n2. Item\n3. Item\n\nEXAMPLE:\nYes, we have Scandinavian sofas.\n\n1. Nordic Minimalist 3-Seater ($799) - Clean lines, light oak legs, grey fabric\n2. Freja Compact Loveseat ($549) - Perfect for small spaces, soft tones\n3. Both available in different colors\n\nNEVER write like this: \"We have sofas with clean lines, light oak legs...\" Always use the numbered list format above."
                }]
            },
            "contents": [
                {
                    "parts": [
                        {
                            "text": body.prompt
                        }
                    ]
                }
            ]
        }).encode('utf-8')

        headers = {
            'Content-Type': 'application/json',
            'X-goog-api-key': gemini_key
        }

        req = urllib.request.Request(gemini_url, data=payload, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                resp_data = json.load(resp)

            # Extract text from Gemini API response
            if isinstance(resp_data, dict):
                if 'candidates' in resp_data and resp_data['candidates']:
                    candidate = resp_data['candidates'][0]
                    if 'content' in candidate and 'parts' in candidate['content']:
                        parts = candidate['content']['parts']
                        if parts and 'text' in parts[0]:
                            text = parts[0]['text']
                        else:
                            text = json.dumps(parts)
                    else:
                        text = json.dumps(candidate)
                else:
                    text = "No response from Gemini API"
            else:
                text = str(resp_data)

            return JSONResponse({"reply": text})
        except urllib.error.HTTPError as e:
            err_text = e.read().decode('utf-8', errors='ignore')
            return JSONResponse({"error": "provider_error", "message": err_text})
        except Exception as e:
            return JSONResponse({"error": "provider_error", "message": str(e)})

    # Mock reply for demo when no key provided
    reply = f"(demo) I received your prompt: {body.prompt}. This is a mock reply."
    return JSONResponse({"reply": reply})
app.mount("/", StaticFiles(directory="static", html=True), name="static")