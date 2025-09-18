import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { text, url, extra } = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = [
      "You are KMRL Synapse, an AI assistant for Kochi Metro's document intelligence.",
      url ? `Source URL: ${url}` : undefined,
      extra ? `Context: ${extra}` : undefined,
      text ? `Content to analyze:\n${text}` : "Summarize key insights from the provided source if any. Return a crisp brief with bullet points titled 'Executive Summary', 'Risks', and 'Action Items'.",
    ]
      .filter(Boolean)
      .join("\n\n");

    const result = await model.generateContent(prompt);
    const out = await result.response.text();
    return NextResponse.json({ result: out });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}