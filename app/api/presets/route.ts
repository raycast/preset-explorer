import { NextResponse } from "next/server";
import { categories } from "../../../data/presets";

export async function GET() {
  return NextResponse.json(categories);
}
