import json
import logging
from typing import Dict, List

import vertexai
from fastapi import Body, FastAPI, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2 import service_account
from pydantic import BaseModel
from vertexai.generative_models import GenerativeModel, Part
from youtube_comment_downloader import YoutubeCommentDownloader

# -------------------------------------------------------------------
# CONFIGURATION
# -------------------------------------------------------------------
SERVICE_ACCOUNT_FILE = "gemini-copilot-testing-f0aa48c28d38.json"

with open(SERVICE_ACCOUNT_FILE, "r") as f:
    sa_info = json.load(f)

project_id = sa_info["project_id"]
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE
)

vertexai.init(project=project_id, location="us-central1", credentials=credentials)
model = GenerativeModel("gemini-2.5-pro")

# -------------------------------------------------------------------
# APP SETUP
# -------------------------------------------------------------------
app = FastAPI(title="InsightGemSuite Backend", version="1.0.0")

# Allow React frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔒 TODO: Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

# -------------------------------------------------------------------
# PROMPTS CONFIGURATION
# -------------------------------------------------------------------
VIDEO_PROMPT_OPTIONS: Dict[str, str] = {
    "Video Description": "Please analyze this video and provide a clear description of what is happening.",
    "Audio-Text Mining": """You are an intelligent assistant capable of transcribing audio and extracting structured insights.  
Step 1: Accurately transcribe the audio content.  
Step 2: Analyze the transcript and extract information in the following structured format:  
1. **Key Topics:** List the main subjects discussed.  
2. **Critical Points / Facts:** Highlight important statements, data, or insights.  
3. **Decisions / Actions:** Capture any instructions, recommendations, or next steps.  
4. **Speakers & Roles:** Identify speakers if multiple and their roles or perspectives.  
5. **Sentiment & Tone:** Describe the speaker’s emotions, emphasis, or intent.  
6. **Summary:** Provide a concise overview of the audio content in 2–3 sentences.  
""",
    "Product Theme": """Analyze this video and extract the product theme in detail. For the theme, provide:
1. **Theme / Main Feature:** Describe the core aspect or highlight of the product.
2. **Sentiment:** Indicate whether the theme is portrayed positively, negatively, or neutrally.
3. **Explanation:** Give a short explanation supporting the sentiment, mentioning why this feature is important or highlighted in the video.
""",
    "Ingredients": """Analyze this video and extract information about the product's ingredients. For each ingredient, provide:
1. **Ingredients:** List all mentioned ingredients.
2. **Sentiment:** Indicate whether the ingredients are portrayed positively, negatively, or neutrally.
3. **Explanation:** Provide a brief explanation supporting the sentiment, highlighting why the ingredients are considered good or bad in the context of the product.
""",
    "Ad Vibe": """Analyze this ketchup review video and extract the reviewer or consumer reaction in detail. For this, provide:
1. **Reaction:** Describe the reviewer’s or consumer’s observable behavior or response.
2. **Sentiment:** Indicate whether the reaction is positive, neutral, or negative.
3. **Explanation:** Explain why the reviewer reacted this way based on taste, texture, aroma, or presentation.
""",
    "Packaging": """Analyze this video and extract information about the product’s packaging:
1. **Package Type:** Describe the packaging type.
2. **Package Type Sentiment:** Positive, negative, or neutral.
3. **Explanation for Type Sentiment:** Briefly explain the sentiment.
4. **Package Size / Variants:** List available sizes or variants.
5. **Size Sentiment:** Positive, negative, or neutral.
6. **Explanation for Size Sentiment:** Brief reasoning for sentiment.
""",
}

PROMPT_OPTIONS: Dict[str, str] = {
    "Consumer Impact & Engagement": """
**Context:**  
You are an audience member watching a new advertisement video. The video is [description of the video]. Your task is to provide honest and detailed feedback as a viewer.

**Persona Description:**  
[persona details]

**Instructions:**  
1. Watch (or imagine watching) the ad video described above.  
2. Evaluate the following attributes: Attention, Clarity, Relevance, Emotional Appeal, Persuasiveness, Memorability.  
3. Provide a **score from 1–5** for each attribute **for only the selected demographic(s)**.  
4. Present results in a **markdown table**, showing attributes as rows and selected demographic(s) as columns.  
5. Include brief justification (1–2 lines) for each score.
""",
    "Brand & Creative Quality": """
**Context:**  
You are an audience member watching a new advertisement video. The video is [description of the video]. Your task is to provide honest and detailed feedback as a viewer.

**Persona Description:**  
[persona details]

**Instructions:**  
1. Evaluate these attributes: Brand Presence, Product Appeal, Packaging Visibility, Consistency, Distinctiveness, CTA Strength.  
2. Provide a **score from 1–5** for each attribute **for only the selected demographic(s)**.  
3. Present results in a **markdown table**, showing attributes as rows and selected demographic(s) as columns.  
4. Include brief justification (1–2 lines) for each score.
""",
    "Regulatory & Claims Compliance (U.S.)": """
**Context:**  
You are an audience member watching a new advertisement video. The video is [description of the video]. Your task is to provide honest and detailed feedback as a viewer.

**Persona Description:**  
[persona details]

**Instructions:**  
1. Evaluate these attributes: FDA/FTC Claim Accuracy, Nutrition Claims, Structure/Function Claims, USDA Rules, Allergen Disclosure, Comparative Claims, Children’s Standards, Disclaimers.  
2. Provide a **score from 1–5** for each attribute **for only the selected demographic(s)**.  
3. Present results in a **markdown table**, showing attributes as rows and selected demographic(s) as columns.  
4. Include brief justification (1–2 lines) for each score.
""",
}

VIDEO_DESCRIPTIONS = {
    "YouTube": "Advertisement of a ketchup product, highlighting taste, quality, and packaging. Theme is family-friendly, with a cheerful and appetizing mood, encouraging purchase."
}

PERSONA_DICT = {
    "Male": "I am a 30-year-old male urban professional, interested in cooking and convenience, who often buys popular food brands and enjoys trying new flavors.",
    "Female": "I am a 28-year-old female urban professional, interested in wellness and environmental sustainability, who regularly purchases organic skincare products.",
    "Kids": "I am a 10-year-old kid, love fun and colorful foods, cartoons, and products that are sweet and tasty.",
    "Teens": "I am a 16-year-old teenager, enjoy trendy snacks, social media, friends' recommendations, and fun, visually appealing products.",
    "Adults": "I am a 40-year-old adult, focus on quality and value, enjoy cooking at home, and prefer trusted food brands for family meals.",
    "Seniors": "I am a 65-year-old senior, value simplicity and healthiness, prefer trusted and familiar food brands, and look for clear labeling.",
}


# -------------------------------------------------------------------
# HELPERS
# -------------------------------------------------------------------
def analyze_video(video_bytes: bytes, selected_options: List[str]) -> Dict[str, str]:
    """Analyze a video for selected prompts."""
    video_part = Part.from_data(mime_type="video/mp4", data=video_bytes)
    results = {}
    for option in selected_options:
        prompt = VIDEO_PROMPT_OPTIONS.get(option)
        if prompt:
            logging.info(f"Analyzing video with prompt: {option}")
            response = model.generate_content([video_part, prompt])
            results[option] = response.text
    return results


def generate_marketing_prompt(
    descriptor: str, demographics: List[str], video_key: str
) -> str:
    """Generate marketing analysis prompt dynamically."""
    video_desc = VIDEO_DESCRIPTIONS.get(video_key, "Advertisement video")
    persona_text = "\n".join(
        [f"{demo}: {PERSONA_DICT.get(demo, '')}" for demo in demographics]
    )
    prompt_template = PROMPT_OPTIONS.get(descriptor, "")
    return (
        prompt_template.replace("[description of the video]", video_desc).replace(
            "[persona details]", persona_text
        )
        + f"\n\nSelected Demographics: {', '.join(demographics)}"
    )


def analyze_marketing(
    video_bytes: bytes, descriptors: List[str], demographics: List[str], video_key: str
) -> Dict[str, str]:
    """Analyze marketing video based on descriptors & demographics."""
    video_part = Part.from_data(mime_type="video/mp4", data=video_bytes)
    results = {}
    for descriptor in descriptors:
        prompt = generate_marketing_prompt(descriptor, demographics, video_key)
        logging.info(f"Marketing analysis with descriptor: {descriptor}")
        response = model.generate_content([video_part, prompt])
        results[descriptor] = response.text
    return results


def fetch_youtube_comments(video_url: str, max_comments: int = 50) -> List[str]:
    """Fetch comments from a YouTube video."""
    downloader = YoutubeCommentDownloader()
    comments = []
    try:
        for comment in downloader.get_comments_from_url(video_url, sort_by=0):
            comments.append(comment["text"])
            if len(comments) >= max_comments:
                break
    except Exception as e:
        logging.error(f"Error fetching comments: {e}")
    return comments


def analyze_youtube_comments(video_url: str) -> str:
    """Analyze YouTube comments using Gemini."""
    comments = fetch_youtube_comments(video_url, max_comments=50)
    if not comments:
        return "⚠️ No comments found."

    comment_text = "\n".join([f"- {c}" for c in comments])
    prompt = f"""
You are an AI marketing analyst. Analyze the following YouTube comments for insights:

Video URL: {video_url}

Comments:
{comment_text}

**Instructions:**
1. Use professional and balanced wording rather than overly strong terms (avoid “overwhelmingly negative”).
2. Summarize the main themes of the comments.
3. Identify sentiment (positive, negative, neutral).
4. Extract product feedback, complaints, or praise.
5. Provide 3–5 actionable insights for the business.
"""
    response = model.generate_content([prompt])
    return response.text


# -------------------------------------------------------------------
# API ENDPOINTS
# -------------------------------------------------------------------
@app.post("/video-analysis")
async def video_analysis(file: UploadFile, options: str = Form(...)):
    """Analyze uploaded video for selected analysis types."""
    selected_options = [opt.strip() for opt in options.split(",")]
    file_bytes = await file.read()
    results = analyze_video(file_bytes, selected_options)
    return {"results": results}


@app.post("/marketing-analysis")
async def marketing_analysis(
    file: UploadFile,
    descriptors: str = Form(...),
    demographics: str = Form(...),
    video_type: str = Form(...),
):
    """Perform marketing analysis on uploaded video."""
    descriptors_list = [d.strip() for d in descriptors.split(",")]
    demographics_list = [d.strip() for d in demographics.split(",")]
    file_bytes = await file.read()
    results = analyze_marketing(
        file_bytes, descriptors_list, demographics_list, video_type
    )
    return {"results": results}


class CommentRequest(BaseModel):
    video_url: str
    max_comments: int = 50


@app.post("/comment-analysis")
async def comment_analysis(request: CommentRequest):
    """Analyze comments for a given YouTube video URL."""
    insights = analyze_youtube_comments(request.video_url)
    return {"insights": insights}


@app.get("/")
async def root():
    """Root endpoint to verify backend status."""
    return {"message": "InsightGemSuite Backend is running!"}
