import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { documentText, templateType, userPrompt } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `You are an expert bilingual (Bengali and English) document data extractor and PDF designer.
Given a document text, title, or user prompt, extract and return a valid JSON object matching this structure:
{
  "title": string,
  "orgName": string,
  "orgTagline": string,
  "orgAddress": string,
  "orgPhone": string,
  "orgEmail": string,
  "docNumber": string,
  "docDate": string,
  "recipientName": string,
  "recipientOrg": string,
  "recipientAddress": string,
  "recipientPhone": string,
  "items": [
    { "id": "1", "description": string, "quantity": number, "unitPrice": number, "total": number }
  ],
  "subtotal": number,
  "discount": number,
  "taxPercent": number,
  "paidAmount": number,
  "dueAmount": number,
  "amountInWords": string,
  "memoSubject": string,
  "bodyContent": string,
  "notes": string,
  "signatoryName": string,
  "signatoryTitle": string
}
Keep Bengali texts authentic, formal, and cleanly formatted. If fields are missing in input, provide realistic professional Bengali defaults suitable for an official Bangladeshi document. Return ONLY valid JSON without markdown fence.`;

    const prompt = `Analyze this document content for template type "${templateType || 'invoice'}":
Input:
${documentText || userPrompt || 'New professional document'}
Return the JSON object.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    let parsedData = {};
    try {
      parsedData = JSON.parse(text);
    } catch {
      // Cleanup backticks if any
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Extraction error';
    return NextResponse.json(
      { error: message, fallback: true },
      { status: 500 }
    );
  }
}
