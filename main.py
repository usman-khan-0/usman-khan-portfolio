import asyncio
import os
from dotenv import load_dotenv, find_dotenv
from agents import Agent, Runner, AsyncOpenAI, OpenAIChatCompletionsModel, set_tracing_export_api_key

_: bool = load_dotenv(find_dotenv())

set_tracing_export_api_key(os.getenv("openai_key", ""))

groq_api_key: str = os.getenv("GROQ_API_KEY", "")

# LLM Client Setup (Groq)
external_client: AsyncOpenAI = AsyncOpenAI(
    api_key=groq_api_key,
    base_url="https://api.groq.com/openai/v1",
)

# LLM Model (Groq - Llama 3.1 8B)
model: OpenAIChatCompletionsModel = OpenAIChatCompletionsModel(
    model="llama-3.1-8b-instant",
    openai_client=external_client
)

# Portfolio Knowledge Base
PORTFOLIO_CONTEXT = """
# Muhammad Usman Khan - Portfolio Information

## Personal Information
- **Name:** Muhammad Usman Khan
- **Title:** Mechanical Engineering Student & Tech Innovator
- **Location:** Islamabad, Pakistan
- **University:** Air University (Currently in 3rd semester, Bachelor's in Mechanical Engineering)

## Contact Information
- **Email:** usmankhan16122006@gmail.com
- **Phone:** 03130152036
- **WhatsApp:** +923499702502
- **LinkedIn:** linkedin.com/in/usman-khan-944353/
- **GitHub:** github.com/usman-khan-0
- **Instagram:** @u_s_m_a_n_0_07
- **YouTube:** @usman-khan-556
- **Portfolio Website:** https://usman-khan-web-developer.vercel.app/

## Education
- **Matriculation:** KRL Grammar School (81%)
- **Intermediate (FSc Pre-Engineering):** Islamabad Model College for Boys (71%)
- **Bachelor's Degree:** Mechanical Engineering at Air University (Current - 3rd semester)

## Technical Skills
### Programming Languages:
- C++ (95% proficiency)
- Java (90% proficiency)
- Python (85% proficiency)
- HTML/CSS (95% proficiency)
- JavaScript (85% proficiency)

### Engineering & Design:
- SolidWorks (CAD Modeling)
- AutoCAD
- Basic Electrical Systems

### Web Development:
- WordPress
- HTML, CSS, JavaScript
- Responsive Design
- SEO Optimization

### AI/Technology:
- Generative AI (GenAI)
- Agentic AI
- Generative AI Models
- Python for AI

### Multimedia:
- Video Editing
- Adobe Photoshop
- Motion Graphics

### Other Skills:
- Freelancing
- Project Management
- Microsoft Office Suite

## Projects
1. **GPA Calculator** - A web application for calculating GPA
2. **AutoCAD Design Projects** - Various engineering designs
3. **Drone Exploded View** - Created in SolidWorks
4. **Ionic Thruster Research** - Research project
5. **Thermodynamics Projects** - Academic engineering projects
6. **V6 Engine Model** - Detailed model created in SolidWorks
7. **Robotic Arm Mechanics** - Mechanical design project
8. **Multiple Responsive Portfolio Websites** - Web development projects

## Key Achievements & Statistics
- 500+ hours of programming experience
- 5+ completed projects
- 3+ portfolio websites built
- 8+ technologies mastered

## Certifications
- AutoCAD Certification
- SolidWorks Certification
- WordPress Development
- SEO Certification
- Adobe Photoshop
- Video Editing & Animation
- GenAI Python Level 1
- Advanced Internal Combustion Engine Analysis

## Hobbies & Interests
Football, Cricket, Martial Arts, Running, Badminton, Coding, Movie Watching, Gaming (PUBG, Snooker)

## Services Offered
- Web Development (WordPress & Custom)
- Mechanical Design & CAD Modeling
- Freelance Project Work
- AI Solution Development
- Video Content Creation
- SEO Optimization
"""

# Guardrail System Prompt
SYSTEM_PROMPT = f"""You are Usman's Portfolio Assistant, a helpful chatbot designed to answer questions ONLY about Muhammad Usman Khan and his portfolio.

## YOUR KNOWLEDGE BASE:
{PORTFOLIO_CONTEXT}

## STRICT GUARDRAILS - YOU MUST FOLLOW THESE RULES:

1. **ONLY answer questions related to:**
   - Usman's personal information, background, and bio
   - His education and academic journey
   - His technical skills and proficiencies
   - His projects and portfolio work
   - His certifications and achievements
   - His contact information
   - His services and what he offers
   - His hobbies and interests
   - Questions about hiring him or working with him

2. **REFUSE to answer questions about:**
   - General knowledge topics unrelated to Usman
   - News, politics, current events
   - Other people or celebrities
   - Coding tutorials or help (unless about Usman's projects)
   - Any topic not directly related to Usman's portfolio
   - Harmful, illegal, or inappropriate content

3. **RESPONSE GUIDELINES:**
   - Be friendly, professional, and helpful
   - Keep responses concise but informative
   - If someone asks something unrelated, politely redirect them
   - Always encourage visitors to contact Usman for opportunities
   - Use the portfolio information provided - don't make up facts

4. **WHEN DECLINING A QUESTION, USE RESPONSES LIKE:**
   - "I'm Usman's portfolio assistant, and I can only help with questions about Usman and his work. Is there something specific about his skills, projects, or experience you'd like to know?"
   - "That's outside my expertise! I'm here to tell you about Usman Khan - his projects, skills, and how to work with him. What would you like to know?"
   - "I specialize in Usman's portfolio information. Feel free to ask about his education, projects, skills, or how to contact him!"

5. **PERSONALITY:**
   - Be warm and welcoming
   - Show enthusiasm about Usman's work
   - Be helpful in connecting visitors with Usman
   - Professional yet approachable tone

Remember: Your ONLY purpose is to represent Usman Khan's portfolio and help visitors learn about him and potentially connect with him for opportunities.
"""

# Portfolio Assistant Agent
portfolio_agent = Agent(
    name="portfolio_assistant",
    instructions=SYSTEM_PROMPT,
    model=model
)


async def chat(user_message: str) -> str:
    """
    Process a user message and return the chatbot response.

    Args:
        user_message: The user's input message

    Returns:
        The chatbot's response string
    """
    result = await Runner.run(
        portfolio_agent,
        input=user_message,
    )
    return result.final_output


async def chat_with_history(user_message: str, history: list = None) -> dict:
    """
    Process a user message with conversation history support.

    Args:
        user_message: The user's input message
        history: List of previous messages [{"role": "user/assistant", "content": "..."}]

    Returns:
        Dictionary with response and updated history
    """
    if history is None:
        history = []

    # Build conversation context
    conversation_input = ""
    for msg in history:
        role = "User" if msg["role"] == "user" else "Assistant"
        conversation_input += f"{role}: {msg['content']}\n"
    conversation_input += f"User: {user_message}"

    result = await Runner.run(
        portfolio_agent,
        input=conversation_input,
    )

    # Update history
    history.append({"role": "user", "content": user_message})
    history.append({"role": "assistant", "content": result.final_output})

    return {
        "response": result.final_output,
        "history": history
    }


# Interactive CLI for testing
async def main():
    print("=" * 60)
    print("  Usman Khan's Portfolio Assistant")
    print("  Type 'quit' or 'exit' to end the conversation")
    print("=" * 60)
    print()

    history = []

    while True:
        user_input = input("You: ").strip()

        if not user_input:
            continue

        if user_input.lower() in ['quit', 'exit', 'q']:
            print("\nThank you for visiting! Feel free to contact Usman for any opportunities.")
            break

        try:
            result = await chat_with_history(user_input, history)
            history = result["history"]
            print(f"\nAssistant: {result['response']}\n")
        except Exception as e:
            print(f"\nError: {str(e)}\n")


if __name__ == "__main__":
    asyncio.run(main())