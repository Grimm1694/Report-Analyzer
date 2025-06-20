import Groq from "groq-sdk";
import endent from "endent";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function processMedicalReport(documents: any[]) {
  const documentText = documents.map((doc) => doc.text).join("\n");
  // console.log({ documentText });

  // Check if documentText contains medical terminology or relevant information
  const medicalKeywords = [
    "blood",
    "test",
    "diagnosis",
    "report",
    "health",
    "scan",
    "medical",
    "doctor",
  ];
  const containsMedicalContent = medicalKeywords.some((keyword) =>
    documentText.toLowerCase().includes(keyword)
  );

  if (!containsMedicalContent) {
    return {
      originalDocument: documentText,
      analysis: "Please provide a proper medical report for analysis.",
    };
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: endent`You are a compassionate and knowledgeable medical report interpreter designed to transform complex medical documents into clear, understandable insights. Your goal is to empower patients by:

          - Translating medical jargon into simple, accessible language
          - Providing a holistic view of the patient's health
          - Offering supportive and constructive guidance
          - Delivering personalized, actionable health recommendations
          
          Communication Principles:
          - Use warm, encouraging language
          - Avoid medical intimidation
          - Focus on empowerment and positive health strategies
          - Provide clear, practical advice
          - Maintain a balance between medical accuracy and patient comprehension`,
        },
        {
          role: "user",
          content: endent`Analyze this medical report and create a comprehensive, patient-friendly breakdown:

          Medical Report Content:
          ${documentText}

          Generate a detailed, supportive medical report in the structure below. Use clear, simple language. Bold all significant findings, values, and recommendations to make them stand out. Keep the tone informative, encouraging, and non-alarming.

Personalized Greeting

Address the patient by name

Mention the purpose of the report

Report Overview

Specify the type of medical test/report

Mention the key health areas examined

Briefly explain the importance of the test

Simplified Medical Explanation

Break down complex medical terms

Explain each major finding in plain language

Use analogies or comparisons where helpful

Bold all key findings or terms (e.g., High LDL Cholesterol)

Health Status Assessment

Highlight positive/healthy results

Identify and explain any concerning values

Compare results to standard healthy ranges and bold actual values

Potential Health Implications

Discuss possible reasons for abnormal results

Explain potential short-term and long-term effects

Provide context without causing alarm

Personalized Improvement Recommendations

Suggest specific diet changes

Recommend tailored exercises

Propose lifestyle changes based on findings

Include stress management techniques if relevant

Keep all suggestions practical and patient-specific

Tone: Supportive and empowering
Goal: Help the patient clearly understand their health and how to improve it
Style: Plain, clear, and concise with important elements in bold

`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    // Extract the AI-generated analysis
    const reportAnalysis =
      chatCompletion.choices[0]?.message?.content || "Unable to process report";
    console.log({ reportAnalysis });
    return {
      originalDocument: documentText,
      analysis: reportAnalysis,
    };
  } catch (error) {
    console.error("Error processing medical report:", error);
    throw new Error("Failed to analyze medical report");
  }
}
