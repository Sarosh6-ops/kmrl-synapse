import { NextRequest, NextResponse } from "next/server";
import Tesseract from "tesseract.js";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, lang = "eng" } = await req.json();
    if (!imageUrl) return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    const { data } = await Tesseract.recognize(imageUrl, lang);
    return NextResponse.json({ text: data.text ?? "" });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}