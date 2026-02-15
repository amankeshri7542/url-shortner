import { NextResponse } from 'next/server';

const LAMBDA_API = 'https://o4t5lb8wo4.execute-api.us-east-1.amazonaws.com/prod/shorten';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const response = await fetch(LAMBDA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to shorten URL');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Shorten URL error:', error);
    return NextResponse.json(
      { error: 'Failed to shorten URL' },
      { status: 500 }
    );
  }
}