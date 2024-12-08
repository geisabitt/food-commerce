import { NextResponse } from "next/server";

export function handleError(error: unknown, status: number = 400) {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return NextResponse.json({ message: errorMessage }, { status });
}