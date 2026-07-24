from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
from pydantic import BaseModel
from fastapi import Request
import json
import urllib.request

app = FastAPI(title="HomeStyle Living")


@app.get("/api/images")
def list_images():
	"""Return a JSON list of image URLs found under static/images."""
	base_static = os.path.join(os.path.dirname(__file__), "static")
	images_dir = os.path.join(base_static, "images")
	result = []
	if not os.path.exists(images_dir):
		return JSONResponse(result)


	class ChatRequest(BaseModel):
		prompt: str


	@app.post('/api/chat')
	async def chat_endpoint(body: ChatRequest):
		"""Accepts {"prompt": "..."} and returns AI reply.

		If environment variables `GEMINI_API_URL` and `GEMINI_API_KEY` are set,
		this will proxy the request to that endpoint (expects JSON request/response).
		Otherwise returns a mock reply for local demos.
		"""
		gemini_url = os.getenv('GEMINI_API_URL')
		gemini_key = os.getenv('GEMINI_API_KEY')

		if gemini_url and gemini_key:
			payload = json.dumps({"prompt": body.prompt}).encode('utf-8')
			req = urllib.request.Request(gemini_url, data=payload,
										 headers={
											 'Content-Type': 'application/json',
											 'Authorization': f'Bearer {gemini_key}'
										 })
			try:
				with urllib.request.urlopen(req, timeout=20) as resp:
					resp_data = json.load(resp)
				return JSONResponse(resp_data)
			except Exception as e:
				return JSONResponse({"error": "provider_error", "message": str(e)})

		# Mock reply for demo when no key/url provided
		reply = f"(demo) I received your prompt: {body.prompt}. This is a mock reply."
		return JSONResponse({"reply": reply})

	for root, dirs, files in os.walk(images_dir):
		for f in files:
			if f.lower().endswith((".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp")):
				abs_path = os.path.join(root, f)
				rel_path = os.path.relpath(abs_path, base_static)
				url = "/" + rel_path.replace("\\", "/")
				result.append(url)

	return JSONResponse(result)


app.mount("/", StaticFiles(directory="static", html=True), name="static")