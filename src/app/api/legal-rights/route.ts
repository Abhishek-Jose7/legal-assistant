import { NextResponse } from "next/server";
import { loadLegalData } from "@/lib/legalData";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const data = loadLegalData();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
