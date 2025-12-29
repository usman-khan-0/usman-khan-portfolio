from flask import Flask, request, jsonify
import os
from openai import OpenAI

app = Flask(__name__)

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


@app.route('/api/chat', methods=['POST', 'OPTIONS', 'GET'])
def chat():
    if request.method == 'OPTIONS':
        resp = jsonify({})
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return resp

    if request.method == 'GET':
        resp = jsonify({'status': 'API is working! Use POST to chat.'})
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

    try:
        data = request.get_json() or {}
        message = data.get('message', '')

        if not message.strip():
            resp = jsonify({'error': 'Message cannot be empty'})
            resp.headers['Access-Control-Allow-Origin'] = '*'
            return resp, 400

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
        resp = jsonify({'response': bot_response})
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

    except Exception as e:
        resp = jsonify({'error': str(e)})
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp, 500


@app.route('/', methods=['GET'])
def home():
    return jsonify({'status': 'Portfolio Chatbot API Running'})
