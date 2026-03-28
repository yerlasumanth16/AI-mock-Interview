import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const generateInterviewQuestion = async (
  company: string,
  role: string,
  difficulty: string,
  type: string,
  history: string[] = [],
  interviewerPrompt: string = ""
) => {
  const model = "gemini-3.1-pro-preview";
  const prompt = `${interviewerPrompt ? interviewerPrompt : `You are a strict, highly experienced senior interviewer at ${company} interviewing a candidate for a ${role} position.`}
  The difficulty level is ${difficulty} and the interview type is ${type}.
  Current interview history: ${history.join("\n")}
  
  Generate the next question for the candidate. 
  If it's a coding interview, provide a realistic, challenging problem statement similar to what ${company} asks.
  If it's a conceptual interview, ask a deep technical question that tests fundamental understanding and practical experience.
  If it's an HR interview, ask behavioral questions using the STAR method.
  Be professional, direct, and act like a real interviewer.
  
  Return the response in JSON format:
  {
    "question": "The question text",
    "type": "conceptual" | "coding" | "behavioral",
    "expectedAnswer": "Brief expected answer or key points for evaluation"
  }`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
};

export const evaluateResponse = async (
  history: string[],
  role: string,
  company: string,
  interviewerPrompt: string = "",
  feedbackDepth: string = "Detailed"
) => {
  const model = "gemini-3.1-pro-preview";
  const prompt = `Evaluate the following candidate's performance in an interview for a ${role} position at ${company}.
  Interview Transcript:
  ${history.join("\n")}
  
  ${interviewerPrompt ? `Evaluate this candidate from the perspective of this persona: ${interviewerPrompt}` : `Provide a rigorous evaluation as a strict senior engineer.`}
  Score from 0-100 based on accuracy, depth, clarity, and problem-solving skills.
  Provide ${feedbackDepth} constructive feedback on what was good and what was missing.
  Identify specific strengths and weaknesses.
  Provide scores (0-100) for specific categories: technical, communication, confidence, and problemSolving.
  Also provide a 4-step actionable improvement plan and a short sentence on their FAANG readiness.
  
  Return the response in JSON format:
  {
    "score": number,
    "feedback": "Detailed, constructive feedback",
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "ratings": {
      "technical": number,
      "communication": number,
      "confidence": number,
      "problemSolving": number
    },
    "improvementPlan": ["step1", "step2", "step3", "step4"],
    "faangReadiness": "Short sentence on FAANG readiness"
  }`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
};
