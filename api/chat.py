from http.server import BaseHTTPRequestHandler
import json
import os
from openai import OpenAI

# Portfolio Knowledge Base
PORTFOLIO_CONTEXT = """
# Muhammad Usman Khan - Complete Portfolio Information
# Official Portfolio: https://usman-khan-web-developer.vercel.app/

## Personal Information
- **Full Name:** Muhammad Usman Khan
- **Title:** Mechanical Engineer & Web Developer
- **Location:** Islamabad, Pakistan
- **University:** Air University, E-9 Islamabad
- **Current Status:** 3rd semester, Bachelor's in Mechanical Engineering

## About Usman
Experienced web developer capable of designing responsive, user-friendly websites using WordPress. Proficient in SolidWorks and AutoCAD for mechanical component design. Demonstrates passion for programming, continuous learning, and maintaining physical fitness through sports and martial arts.

## Contact Information
- **Email:** usmankhan16122006@gmail.com
- **Phone:** 03130152036
- **WhatsApp:** +923499702502
- **LinkedIn:** linkedin.com/in/usman-khan-735944353/
- **GitHub:** github.com/usman-khan-0
- **Instagram:** @u_s_m_a_n_0_07
- **YouTube:** @usman-khan-556 (Usman Khan)

## Portfolio & Resume Links
- **Main Portfolio:** https://usman-khan-web-developer.vercel.app/
- **GitHub Portfolio:** https://usman-khan-0.github.io/Portfolio/
- **Netlify Portfolio:** https://usman-portfolio-1122.netlify.app
- **FlowCV Resume:** https://flowcv.com/resume/fpcnsolb1r9c
- **CV & Resume:** Available for download on the portfolio website

## Education History
- **School:** KRL Grammar School - Matriculation (81%)
- **College:** Islamabad Model College for Boys G-10/4 - FSc Pre-Engineering (71%)
- **University:** Air University, E-9 Islamabad - Bachelor's in Mechanical Engineering (Current - 3rd semester)

## Technical Skills with Proficiency
### Programming Languages:
- C++ (95%)
- Java (90%)
- Python (85%)
- HTML/CSS (95%)
- JavaScript (85%)

### Engineering & Design Tools:
- AutoCAD (Professional 2D/3D CAD)
- SolidWorks (3D CAD design and simulation)
- Basic Electrical Systems

### Web Development:
- WordPress Website Development
- HTML, CSS, JavaScript
- Responsive Web Design
- SEO Optimization
- GitHub Pages & Netlify Deployment

### AI/Technology:
- Generative AI (GenAI)
- Agentic AI Development
- Python for AI Applications

### Multimedia:
- Video Editing
- Adobe Photoshop
- Animation & Motion Graphics
- Vlogging

### Other Professional Skills:
- Freelancing & Client Management
- Microsoft Office (Word, Excel, PowerPoint)

## Key Statistics & Achievements
- 5+ Projects Completed
- 500+ Hours of Programming
- 3+ Website Portfolios Built
- 8+ Technologies Learned/Mastered

## Projects (Complete List)
### Web Development Projects:
1. **GPA Calculator** - JavaScript web application tool for calculating GPA
2. **First Portfolio Website** - Built with HTML, CSS, JavaScript (hosted on Netlify)
3. **Second Portfolio Website** - Hosted on GitHub Pages
4. **Gamma AI Portfolio** - AI-assisted portfolio design
5. **AI Landing Page Portfolio** - Modern landing page (bolt.host)
6. **Current Portfolio** - https://usman-khan-web-developer.vercel.app/

### Engineering & CAD Projects:
7. **AutoCAD Project** - Engineering design demonstration
8. **Drone Exploded View** - Detailed 3D exploded view in SolidWorks
9. **V6 Engine Model** - Complete V6 engine 3D model in SolidWorks
10. **Robotic Arm Project** - Robotics and mechanical design
11. **Ionic Thruster** - Research project on ionic propulsion
12. **Thermodynamics & Power Conversion** - Trent 1000 engine analysis project
13. **Thermodynamics Project Videos** - Engineering demonstration videos
14. **SD Project Report** - Software development documentation

## Certifications (Complete List)
- Adobe Photoshop Certification
- AutoCAD Certification
- SolidWorks Certification (multiple certificates including intensive course)
- WordPress Development Certification
- SEO Certification
- Video Editing, Animation and Vlogging Certification
- Freelancing Certification
- GenAI Python Level 1 Certification
- Advanced Internal Combustion Engine Analysis and Design Certification

## Hobbies & Interests
- Football
- Cricket
- Martial Arts (Boxing)
- Running
- Studying
- Watching Movies
- Badminton
- Online Games (PUBG, Snooker, Bike Riders)
- Coding

## Usman's Personal Philosophy & Quotes
- "Discipline turns ambition into reality."
- "Every expert was once a beginner who didn't quit."
- "Consistency beats talent when talent stops practicing."
- "Silence the noise. Let results speak."
- "While others wait for motivation, I rely on discipline."
- "I don't fear failure. I fear staying average."
- "Learning never exhausts the mind."

## Services Offered
- Custom Web Development (HTML/CSS/JavaScript)
- WordPress Website Development
- Mechanical Design & CAD Modeling (SolidWorks, AutoCAD)
- Freelance Project Work
- AI Solution Development (GenAI, Agentic AI)
- Video Content Creation & Editing
- SEO Optimization

## Why Hire Usman?
- Strong foundation in both mechanical engineering and software development
- Diverse skill set spanning web development, CAD design, and AI
- Proven track record with 500+ hours of programming
- Multiple completed projects across different domains
- Certified in multiple technologies and tools
- Dedicated to continuous learning and professional growth
- Disciplined, consistent, and results-oriented approach
- Available for freelance work and collaborations
"""

SYSTEM_PROMPT = f"""You are Usman's Portfolio Assistant. Answer questions ONLY about Muhammad Usman Khan.

## KNOWLEDGE BASE:
{PORTFOLIO_CONTEXT}

## RULES:
1. **ONLY answer about:** Usman's skills, projects, education, certifications, contact info, services, hobbies.
2. **REFUSE:** General knowledge, news, other people, coding help, anything unrelated to Usman.
3. **RESPONSE STYLE:**
   - Keep answers SHORT - maximum 500 tokens
   - Be concise and to the point
   - Friendly but brief
4. **When declining:** "I only answer questions about Usman. Ask me about his skills, projects, or contact info!"
"""


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        try:
            data = json.loads(post_data.decode('utf-8'))
            message = data.get('message', '')

            if not message.strip():
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Message cannot be empty'}).encode())
                return

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

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'response': bot_response}).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
