# Deployment Guide: Network Solutions Hosting

This guide covers deploying the AI Small Business Chatbot to Network Solutions shared hosting, one week before your class date.

## Prerequisites

- Network Solutions hosting account (with Python 3.12+ support)
- Domain name configured and active
- SSH/SFTP access credentials
- Gemini API key (free tier from Google AI Studio)

## Step 1: Upload Project to Hosting

### Via SFTP

1. Open your SFTP client (e.g., FileZilla, WinSCP)
2. Connect to your Network Solutions server using provided SSH credentials
3. Navigate to the web root (`public_html/`, `www/`, or as directed by your host)
4. Upload the entire project folder:
   - `main.py`
   - `pyproject.toml`
   - `static/` folder (all images and JS/CSS files)
   - `.env.example` (will copy to `.env` next)
   - `README.md`

### Via Git (if SSH allows)

```bash
ssh user@your-hosting-domain
cd public_html
git clone https://github.com/your-username/ai-small-business-chatbot.git
cd ai-small-business-chatbot
```

## Step 2: Install Dependencies

SSH into your hosting account:

```bash
ssh user@your-hosting-domain
cd public_html/ai-small-business-chatbot  # or your upload path

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install from pyproject.toml
pip install -e .
```

## Step 3: Configure Environment Variables

```bash
cp .env.example .env
nano .env
```

Edit `.env` and set:

```ini
GEMINI_API_KEY=your_free_api_key_here
GEMINI_MODEL=gemini-flash-latest
```

Save and exit (Ctrl+X, Y, Enter in nano).

## Step 4: Test the App Locally on Server

```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Should output:
```
INFO:     Started server process [PID]
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Test in your browser at `http://your-server-ip:8000` or via curl from the server.

Press Ctrl+C to stop.

## Step 5: Configure Hosting Control Panel

Your Network Solutions control panel (usually cPanel) may have an **App Manager**, **Node.js/Python App Installer**, or **Passenger App** section. Consult Network Solutions support for your specific setup.

### Typical cPanel Flow:
1. Go to **Setup Node.js App** or **Application Manager**
2. Select Python interpreter version (3.12)
3. Point to your app directory and startup file (`main:app` from `main.py`)
4. Set the port (if needed)
5. Save and start the app

### Manual Background Setup (if no auto manager):
Use **Supervisor** or **systemd** to run Uvicorn in the background:

```bash
# Install supervisor (if not already installed)
pip install supervisor

# Create config file
nano /home/user/supervisor.conf
```

Add:
```ini
[program:chatbot]
command=/home/user/public_html/ai-small-business-chatbot/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
directory=/home/user/public_html/ai-small-business-chatbot
autostart=true
autorestart=true
```

Then:
```bash
supervisord -c /home/user/supervisor.conf
```

## Step 6: Enable SSL/HTTPS

1. In cPanel, find **AutoSSL** or **Let's Encrypt** section
2. Select your domain and enable automatic renewal
3. Update DNS to point to your hosting (if not already done)

Ensure traffic is redirected from HTTP to HTTPS.

## Step 7: Point Domain to App

If using a subdomain or reverse proxy:
1. In cPanel **Addon Domains** or **Subdomains**, point your domain/subdomain to the public_html folder
2. Ensure the app port is forwarded correctly (often done automatically by cPanel)

Your domain should now be accessible at `https://your-domain.com`

## Step 8: Test on Live Domain

1. Visit your domain in a browser
2. Verify landing page loads and images display
3. Test a chat prompt to confirm Gemini API integration works
4. Check on mobile for responsive design

## Troubleshooting

### App won't start
- Check error logs: `tail -f /home/user/public_html/ai-small-business-chatbot/error.log`
- Verify Python 3.12 is installed: `python3 --version`
- Ensure dependencies installed: `.venv/bin/pip list | grep fastapi`

### Chat returns blank/error
- Verify `.env` file exists and is readable
- Check Gemini API key is correct in `.env`
- Test API key directly: `.venv/bin/python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('GEMINI_API_KEY'))"`

### Images not loading
- Verify static files are uploaded to `static/images/`
- Check file permissions: `ls -la static/images/`
- Ensure FastAPI mount point is correct in `main.py`

### Domain not resolving
- Allow 24–48 hours for DNS propagation
- Flush your local DNS cache
- Verify A record points to hosting server IP

## Support

- **Network Solutions Support**: 1-877-610-2266 or their online chat
- **Gemini API Docs**: https://ai.google.dev/
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Project GitHub**: https://github.com/your-username/ai-small-business-chatbot

---

**Deployment Completed!** Your app is now live on your domain.
