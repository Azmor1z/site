import { NextResponse } from "next/server";
import { getPortfolioHistory } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getPortfolioHistory());
}
