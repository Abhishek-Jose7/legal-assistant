import { NextResponse } from "next/server";
import { loadLegalData } from "@/lib/legalData";

export async function GET() {
    const data = loadLegalData();
    return NextResponse.json(data);
}
