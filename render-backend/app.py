"""
Usman Khan Portfolio Chatbot API - Render Backend
Flask-based API server for the portfolio chatbot using Groq API
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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


@app.route('/api/chat', methods=['OPTIONS'])
def chat_options():
    """Handle CORS preflight requests"""
    response = jsonify({'status': 'ok'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS, GET')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response


@app.route('/api/chat', methods=['GET'])
def chat_health():
    """Health check endpoint"""
    return jsonify({
        'status': 'API is working!',
        'message': 'Use POST to chat with the portfolio assistant'
    })


@app.route('/api/chat', methods=['POST'])
def chat():
    """Main chat endpoint - processes user messages and returns AI responses"""
    try:
        # Get the message from request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        message = data.get('message', '')
        
        # Validate message
        if not message or not message.strip():
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Check for API key
        groq_api_key = os.environ.get('GROQ_API_KEY')
        if not groq_api_key:
            return jsonify({'error': 'Server configuration error: GROQ_API_KEY not set'}), 500
        
        # Initialize Groq client
        client = OpenAI(
            api_key=groq_api_key,
            base_url="https://api.groq.com/openai/v1"
        )
        
        # Get response from Groq
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": message}
            ],
            max_tokens=500
        )
        
        bot_response = response.choices[0].message.content
        
        return jsonify({'response': bot_response})
        
    except Exception as e:
        app.logger.error(f'Error processing chat: {str(e)}')
        return jsonify({'error': f'Server error: {str(e)}'}), 500


@app.route('/health', methods=['GET'])
def health():
    """Simple health check endpoint for Render"""
    return jsonify({'status': 'healthy', 'service': 'usman-portfolio-chatbot'})


if __name__ == '__main__':
    # Get port from environment (Render sets PORT env variable)
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
