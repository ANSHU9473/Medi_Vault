import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.backendToken) {
            return NextResponse.json({ folders: [] });
        }

        const res = await fetch(`${API_URL}/folders`, {
            headers: { 'Authorization': `Bearer ${session.user.backendToken}` }
        });
        const data = await res.json();
        return NextResponse.json({ folders: data.folders || [] });
    } catch (error) {
        console.error('Get folders error:', error);
        return NextResponse.json({ folders: [] });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.backendToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const body = await request.json();
        const res = await fetch(`${API_URL}/folders`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.backendToken}` 
            },
            body: JSON.stringify(body)
        });
        
        const data = await res.json();
        if (!res.ok) return NextResponse.json({ error: data.error }, { status: res.status });
        return NextResponse.json({ folder: data.folder }, { status: 201 });
    } catch (error) {
        console.error('Create folder error:', error);
        return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
    }
}
