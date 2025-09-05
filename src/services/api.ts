// // Mock API service for Video Intelligence
// // In production, these would connect to actual Vertex AI endpoints

// export interface VideoAnalysisRequest {
//   campaign: string;
//   locality: string;
//   video: File;
//   analysisOptions: string[];
// }

// export interface MarketingAnalysisRequest {
//   campaign: string;
//   demographics: string[];
//   descriptors: string[];
//   video: File;
// }

// export interface YouTubeCommentsRequest {
//   videoUrl: string;
//   maxComments: number;
// }

// // Mock API delay to simulate real network requests
// const mockDelay = (ms: number = 2000) => new Promise(resolve => setTimeout(resolve, ms));

// // Video Analysis API (Tab 1)
// export const analyzeVideoBasic = async (request: VideoAnalysisRequest) => {
//   await mockDelay();

//   const results = {
//     "Video Description": `
// # Video Content Analysis

// **Campaign:** ${request.campaign}  
// **Target Market:** ${request.locality}

// ## Content Summary
// This video showcases a premium consumer product with emphasis on lifestyle benefits and emotional connection. The narrative structure follows a classic problem-solution format with strong visual storytelling.

// ## Key Insights
// - **Duration:** 2:34 minutes
// - **Primary Focus:** Product demonstration and lifestyle integration
// - **Visual Style:** High production value with professional lighting
// - **Pacing:** Moderate tempo with strategic pauses for emphasis
//     `,

//     "Audio-Text Mining": `
// # Audio & Speech Analysis

// ## Transcribed Content
// "Transform your daily routine with innovative solutions that bring convenience and style to your life..."

// ## Key Phrases Detected
// - "Premium quality" (mentioned 3 times)
// - "Life-changing experience" (2 times)
// - "Trusted by millions" (1 time)
// - "Easy to use" (4 times)

// ## Sentiment Analysis
// - **Overall Tone:** Positive (87%)
// - **Confidence Level:** High (94%)
// - **Emotional Triggers:** Aspiration, Trust, Convenience
//     `,

//     "Product Theme": `
// # Product Theme Analysis

// ## Primary Themes
// 1. **Innovation & Technology** (35%)
// 2. **Lifestyle Enhancement** (28%)
// 3. **Quality & Reliability** (22%)
// 4. **User Experience** (15%)

// ## Brand Positioning
// - Premium market segment
// - Focus on user empowerment
// - Technology-forward messaging
// - Lifestyle integration emphasis

// ## Competitive Advantages Highlighted
// - Unique design features
// - Superior performance claims
// - User testimonials and social proof
//     `,

//     "Ingredients": `
// # Ingredient & Component Analysis

// ## Visible Product Components
// - High-grade materials detected
// - Premium finishing elements
// - Advanced technology integration
// - Sustainable design elements

// ## Quality Indicators
// - Professional packaging presentation
// - Detailed component showcasing
// - Quality assurance messaging
// - Manufacturing excellence highlights

// *Note: Detailed ingredient analysis requires product category specification*
//     `,

//     "Ad Vibe": `
// # Ad Vibe Synthesis

// ## Sentiment Overview
// - **Positive Reviews:** 78%
// - **Neutral Reviews:** 15%
// - **Negative Reviews:** 7%

// ## Common Praise Points
// - "Exceeded expectations"
// - "Great value for money"
// - "Easy to use and effective"
// - "Stylish design"

// ## Areas for Improvement
// - Packaging could be more eco-friendly
// - Instructions could be clearer
// - Price point considerations

// ## Recommendation Score: 4.2/5.0
//     `,

//     "Packaging": `
// # Packaging Analysis

// ## Visual Assessment
// - **Design Quality:** Premium/Professional
// - **Brand Consistency:** High alignment with brand values
// - **Sustainability Indicators:** Moderate eco-friendly elements
// - **Shelf Appeal:** Strong visual impact

// ## Key Elements
// - Clear product visibility
// - Prominent brand positioning
// - Key benefit callouts
// - Regulatory compliance indicators

// ## Recommendations
// - Consider more sustainable materials
// - Enhance unboxing experience
// - Add QR codes for digital engagement
//     `
//   };

//   // Return only the requested analysis options
//   const filteredResults: Record<string, string> = {};
//   request.analysisOptions.forEach(option => {
//     if (results[option as keyof typeof results]) {
//       filteredResults[option] = results[option as keyof typeof results];
//     }
//   });

//   return filteredResults;
// };

// // Marketing Analysis API (Tab 2)
// export const analyzeAdMarketing = async (request: MarketingAnalysisRequest) => {
//   await mockDelay();

//   return {
//     campaignAnalysis: `
// # Marketing Campaign Analysis

// **Platform:** ${request.campaign}  
// **Target Demographics:** ${request.demographics.join(', ')}

// ## Performance Metrics Prediction

// | Metric | Projected Performance | Confidence |
// |--------|---------------------|------------|
// | Click-Through Rate | 3.2% | High |
// | Engagement Rate | 7.8% | Medium |
// | Conversion Rate | 2.1% | High |
// | Cost Per Acquisition | $24.50 | Medium |

// ## Audience Resonance Analysis
// - **Primary Appeal:** Lifestyle aspiration (${request.demographics.includes('Adults') ? 'Strong' : 'Moderate'})
// - **Secondary Appeal:** Product innovation (High across all demographics)
// - **Emotional Triggers:** Trust, convenience, status

// ## Optimization Recommendations
// 1. A/B test call-to-action placement
// 2. Increase social proof elements
// 3. Optimize for mobile viewing
// 4. Consider seasonal messaging adjustments
//     `,

//     brandAnalysis: `
// # Brand & Creative Quality Assessment

// ## Creative Elements Score: 8.2/10

// ### Strengths
// - **Visual Consistency:** Excellent brand alignment
// - **Message Clarity:** Clear value proposition
// - **Production Quality:** Professional-grade execution
// - **Emotional Connection:** Strong aspirational appeal

// ### Areas for Enhancement
// - **Call-to-Action:** Could be more prominent
// - **Social Proof:** Add more customer testimonials
// - **Mobile Optimization:** Text readability on smaller screens

// ## Brand Safety Score: 9.1/10
// All content meets platform guidelines and brand standards.
//     `,

//     complianceAnalysis: `
// # Regulatory & Claims Compliance (U.S.)

// ## Compliance Status: ✅ PASSED

// ### FTC Compliance
// - **Truth in Advertising:** All claims substantiated
// - **Clear Disclosures:** Material connections disclosed
// - **Endorsement Guidelines:** Proper testimonial handling

// ### Industry-Specific Regulations
// - **FDA Guidelines:** N/A (non-regulated product)
// - **Consumer Protection:** All claims verifiable
// - **Accessibility Standards:** WCAG 2.1 AA compliant

// ### Risk Assessment
// - **Low Risk:** No misleading claims detected
// - **Medium Risk:** Monitor emerging regulations
// - **Recommendations:** Maintain current compliance standards

// | Compliance Area | Status | Notes |
// |-----------------|--------|-------|
// | Truth in Advertising | ✅ Pass | All claims substantiated |
// | Disclosure Requirements | ✅ Pass | Clear and prominent |
// | Accessibility | ✅ Pass | WCAG 2.1 AA compliant |
// | Platform Policies | ✅ Pass | Meets all guidelines |
//     `
//   };
// };

// // YouTube Comments Analysis API (Tab 3)
// export const analyzeYouTubeComments = async (request: YouTubeCommentsRequest) => {
//   await mockDelay();

//   // Extract video ID from URL for realistic mock
//   const videoId = extractVideoId(request.videoUrl) || 'sample_video';

//   return {
//     summary: `
// # YouTube Comments Analysis

// **Video URL:** ${request.videoUrl}  
// **Comments Analyzed:** ${request.maxComments} (most recent)  
// **Analysis Date:** ${new Date().toLocaleDateString()}

// ## Overall Sentiment Distribution

// | Sentiment | Percentage | Count |
// |-----------|------------|-------|
// | Positive | 65% | ${Math.floor(request.maxComments * 0.65)} |
// | Neutral | 23% | ${Math.floor(request.maxComments * 0.23)} |
// | Negative | 12% | ${Math.floor(request.maxComments * 0.12)} |

// ## Key Themes Identified

// ### 1. Product Quality (42% of comments)
// - "Amazing quality for the price"
// - "Better than expected"
// - "Solid build and design"

// ### 2. User Experience (31% of comments)  
// - "So easy to use"
// - "Perfect for daily routine"
// - "Game changer for me"

// ### 3. Value Proposition (27% of comments)
// - "Worth every penny"
// - "Great deal compared to competitors"
// - "Finally something that works"

// ## Actionable Insights

// ### Strengths to Leverage
// 1. **Quality Perception:** Users consistently praise build quality
// 2. **Ease of Use:** Simplicity resonates strongly with audience
// 3. **Value Positioning:** Price point seen as fair/good value

// ### Areas Needing Attention
// 1. **Shipping Concerns:** 8% of negative comments mention delivery issues
// 2. **Instructions:** Some users want clearer setup guidance
// 3. **Color Options:** Requests for more variety

// ## Engagement Opportunities
// - Respond to shipping concerns with improved communication
// - Create tutorial content for easier onboarding
// - Consider limited edition color releases

// ## Competitive Intelligence
// Users frequently compare to Brand X (favorable) and Brand Y (mixed sentiment).
//     `,

//     recommendations: `
// # Strategic Recommendations

// ## Content Strategy
// 1. **Create Tutorial Series:** Address setup/usage questions
// 2. **Quality Showcase Videos:** Highlight build quality and durability
// 3. **Customer Success Stories:** Feature real user experiences

// ## Product Development
// 1. **Enhanced Packaging:** Address unboxing experience feedback
// 2. **Color Variants:** Respond to aesthetic customization requests
// 3. **Improved Documentation:** Clearer instruction materials

// ## Community Management
// 1. **Response Rate:** Aim for 24-48 hour response time
// 2. **Proactive Engagement:** Thank positive reviewers
// 3. **Issue Resolution:** Create public FAQ from common concerns

// ## Marketing Optimization
// - Emphasize quality and value in ad messaging
// - Use actual customer quotes in promotional materials
// - Highlight ease-of-use as primary selling point
//     `
//   };
// };

// // Helper function to extract video ID from YouTube URL
// const extractVideoId = (url: string): string | null => {
//   const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
//   const match = url.match(regex);
//   return match ? match[1] : null;
// };


//=====================================================================================


//api.ts - Real API service for Video Intelligence

// export interface VideoAnalysisRequest {
//   campaign: string;
//   locality: string;
//   video: File;
//   analysisOptions: string[];
// }

// export interface MarketingAnalysisRequest {
//   campaign: string;
//   demographics: string[];
//   descriptors: string[];
//   video: File;
// }

// export interface YouTubeCommentsRequest {
//   videoUrl: string;
//   maxComments: number;
// }

// const API_BASE = "http://localhost:8000"; // Change for production

// // Video Analysis API (Tab 1)
// export const analyzeVideoBasic = async (request: VideoAnalysisRequest) => {
//   const formData = new FormData();
//   formData.append("file", request.video);
//   formData.append("options", request.analysisOptions.join(","));

//   const response = await fetch(`${API_BASE}/video-analysis`, {
//     method: "POST",
//     body: formData,
//   });
//   if (!response.ok) throw new Error("Video analysis failed");
//   return await response.json();
// };

// // Marketing Analysis API (Tab 2)
// export const analyzeAdMarketing = async (request: MarketingAnalysisRequest) => {
//   const formData = new FormData();
//   formData.append("file", request.video);
//   formData.append("descriptors", request.descriptors.join(","));
//   formData.append("demographics", request.demographics.join(","));
//   formData.append("video_type", request.campaign);

//   const response = await fetch(`${API_BASE}/marketing-analysis`, {
//     method: "POST",
//     body: formData,
//   });
//   if (!response.ok) throw new Error("Marketing analysis failed");
//   return await response.json();
// };

// // YouTube Comments Analysis API (Tab 3)
// export const analyzeYouTubeComments = async (request: YouTubeCommentsRequest) => {
//   const response = await fetch(`${API_BASE}/comment-analysis`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ video_url: request.videoUrl }),
//   });
//   if (!response.ok) throw new Error("YouTube comment analysis failed");
//   return await response.json();
// };



//=================================================================================

import axios from 'axios';

export interface VideoAnalysisRequest {
  campaign: string;
  locality: string;
  video: File;
  analysisOptions: string[];
}

export interface MarketingAnalysisRequest {
  campaign: string;
  demographics: string[];
  descriptors: string[];
  video: File;
}

export interface YouTubeCommentsRequest {
  videoUrl: string;
  maxComments?: number;
}

const API_BASE = "http://localhost:8000";

// Video Analysis API (Tab 1)
export const analyzeVideoBasic = async (request: VideoAnalysisRequest) => {
  const formData = new FormData();
  formData.append("file", request.video);
  formData.append("campaign", request.campaign);
  formData.append("locality", request.locality);
  formData.append("options", request.analysisOptions.join(","));

  const response = await axios.post(`${API_BASE}/video-analysis`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.results;
};

// Marketing Analysis API (Tab 2)
export const analyzeAdMarketing = async (request: MarketingAnalysisRequest) => {
  const formData = new FormData();
  formData.append("file", request.video);
  formData.append("descriptors", request.descriptors.join(","));
  formData.append("demographics", request.demographics.join(","));
  formData.append("video_type", request.campaign);

  const response = await axios.post(`${API_BASE}/marketing-analysis`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.results;
};

// YouTube Comments Analysis API (Tab 3)
export const analyzeYouTubeComments = async (request: YouTubeCommentsRequest) => {
  const response = await axios.post(`${API_BASE}/comment-analysis`, {
    video_url: request.videoUrl,
    max_comments: request.maxComments || 50,
  });
  return response.data.insights;
};
