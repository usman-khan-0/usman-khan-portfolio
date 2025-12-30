from http.server import BaseHTTPRequestHandler
import json
import os
from openai import OpenAI

PORTFOLIO_CONTEXT = """
Muhammad Usman Khan - Mechanical Engineer & Web Developer from Islamabad, Pakistan.
Currently 3rd semester at Air University studying Mechanical Engineering.

Contact: Email: usmankhan16122006@gmail.com | Phone: 03130152036 | WhatsApp: +923499702502
LinkedIn: linkedin.com/in/usman-khan-735944353 | GitHub: github.com/usman-khan-0 | Instagram: @u_s_m_a_n_0_07

Skills: C++ (95%), Java (90%), Python (85%), HTML/CSS (95%), JavaScript (85%), AutoCAD, SolidWorks, WordPress, SEO, GenAI, Video Editing, Photoshop

Education: KRL Grammar School (81%) → Islamabad Model College G-10/4 FSc Pre-Engineering (71%) → Air University

Projects: GPA Calculator, Portfolio Websites, AutoCAD designs, Drone Exploded View, V6 Engine, Robotic Arm, Ionic Thruster

Certifications: Adobe Photoshop, AutoCAD, SolidWorks, WordPress, SEO, Video Editing, GenAI Python Level 1

Services: Web Development, WordPress, CAD Modeling, AI Solutions, Video Editing, SEO
"""

SYSTEM_PROMPT = f"""You are Usman's Portfolio Assistant. Answer ONLY about Muhammad Usman Khan.
Knowledge: {PORTFOLIO_CONTEXT}
Rules: Only answer about Usman. Keep answers short (max 500 tokens). Refuse unrelated questions."""


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS, GET')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response = json.dumps({'status': 'API is working! Use POST to chat.'})
        self.wfile.write(response.encode())

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode()) if post_data else {}
            message = data.get('message', '')

            if not message.strip():
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = json.dumps({'error': 'Message cannot be empty'})
                self.wfile.write(response.encode())
                return

            client = OpenAI(
                api_key=os.environ.get('GROQ_API_KEY'),
                base_url="https://api.groq.com/openai/v1"
            )

            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": message}
                ],
                max_tokens=500
            )

            bot_response = response.choices[0].message.content

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response_data = json.dumps({'response': bot_response})
            self.wfile.write(response_data.encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = json.dumps({'error': str(e)})
            self.wfile.write(response.encode())
