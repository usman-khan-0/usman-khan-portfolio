from flask import Flask, request, jsonify
import os
from openai import OpenAI

app = Flask(__name__)

# Portfolio Knowledge Base
PORTFOLIO_CONTEXT = """
# Muhammad Usman Khan - Complete Portfolio Information

## Personal Information
- Full Name: Muhammad Usman Khan
- Title: Mechanical Engineer & Web Developer
- Location: Islamabad, Pakistan
- University: Air University, E-9 Islamabad (3rd semester, Mechanical Engineering)

## Contact
- Email: usmankhan16122006@gmail.com
- Phone: 03130152036
- WhatsApp: +923499702502
- LinkedIn: linkedin.com/in/usman-khan-735944353/
- GitHub: github.com/usman-khan-0
- Instagram: @u_s_m_a_n_0_07
- YouTube: @usman-khan-556

## Portfolio Links
- Main: https://usman-khan-web-developer.vercel.app/
- GitHub: https://usman-khan-0.github.io/Portfolio/
- Netlify: https://usman-portfolio-1122.netlify.app
- Resume: https://flowcv.com/resume/fpcnsolb1r9c

## Education
- School: KRL Grammar School - Matriculation (81%)
- College: Islamabad Model College for Boys G-10/4 - FSc Pre-Engineering (71%)
- University: Air University - Mechanical Engineering (Current)

## Skills
- Programming: C++ (95%), Java (90%), Python (85%), HTML/CSS (95%), JavaScript (85%)
- Engineering: AutoCAD, SolidWorks
- Web: WordPress, HTML, CSS, JavaScript, SEO
- AI: GenAI, Agentic AI, Python for AI
- Other: Video Editing, Photoshop, Freelancing, MS Office

## Stats
- 5+ Projects, 500+ Hours Programming, 3+ Portfolios, 8+ Technologies

## Projects
- Web: GPA Calculator, Multiple Portfolio Websites
- Engineering: AutoCAD designs, Drone Exploded View, V6 Engine, Robotic Arm, Ionic Thruster, Thermodynamics

## Certifications
Adobe Photoshop, AutoCAD, SolidWorks, WordPress, SEO, Video Editing, Freelancing, GenAI Python Level 1

## Hobbies
Football, Cricket, Martial Arts, Running, Coding, Gaming

## Services
Web Development, WordPress, CAD Modeling, AI Solutions, Video Editing, SEO
"""

SYSTEM_PROMPT = f"""You are Usman's Portfolio Assistant. Answer questions ONLY about Muhammad Usman Khan.

KNOWLEDGE BASE:
{PORTFOLIO_CONTEXT}

RULES:
1. ONLY answer about Usman's skills, projects, education, certifications, contact info, services, hobbies.
2. REFUSE general knowledge, news, other people, coding help, anything unrelated to Usman.
3. Keep answers SHORT - max 500 tokens. Be concise and friendly.
4. When declining: "I only answer questions about Usman. Ask me about his skills, projects, or contact info!"
"""


@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    try:
        data = request.get_json()
        message = data.get('message', '')

        if not message.strip():
            return jsonify({'error': 'Message cannot be empty'}), 400

        # Use Groq API
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
        resp.headers.add('Access-Control-Allow-Origin', '*')
        return resp

    except Exception as e:
        resp = jsonify({'error': str(e)})
        resp.headers.add('Access-Control-Allow-Origin', '*')
        return resp, 500
