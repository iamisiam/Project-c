import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getAICounseling(frustration1: string, frustration2: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are Dr. Relationship, a witty and empathetic AI counselor specializing in couples therapy. You help couples navigate their frustrations with humor, wisdom, and practical advice. You avoid generic advice and tailor your response to the specific situation.

A couple has shared their frustrations with each other:

Partner 1's frustration: "${frustration1}"

Partner 2's frustration: "${frustration2}"

Please provide:
1. A brief, witty acknowledgment of their situation
2. Specific advice for each partner based on their individual concerns
3. Suggestions for how they can communicate better about these issues
4. A final thought that's encouraging and relationship-strengthening

Keep your tone warm, humorous, and professional. Be specific to their actual concerns, not generic platitudes.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'I apologize, but I\'m having trouble connecting to my counseling services right now. Please try again later, or consider having an open conversation with your partner about these feelings.';
  }
}