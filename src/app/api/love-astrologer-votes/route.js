import { NextResponse } from 'next/server';
import {
  LOVE_VOTER_COOKIE,
  getVoteCount,
  getVoterId,
  incrementVoteCount,
} from '@/lib/loveAstrologerVotes';

export async function GET(request) {
  try {
    const count = await getVoteCount();
    const voterId = request.cookies.get(LOVE_VOTER_COOKIE)?.value;
    return NextResponse.json({ count, hasVoted: Boolean(voterId) });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to load votes.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const voter = getVoterId(request);

    if (!voter.isNew) {
      // already voted — just return the current count, don't increment again
      const count = await getVoteCount();
      return NextResponse.json({ count, hasVoted: true });
    }

    const count = await incrementVoteCount();

    const response = NextResponse.json({ count, hasVoted: true });
    response.cookies.set(LOVE_VOTER_COOKIE, voter.id, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to record vote.' }, { status: 500 });
  }
}