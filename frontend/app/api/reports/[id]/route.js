import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.backendToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const res = await fetch(`${API_URL}/reports/${params.id}`, {
            headers: { 'Authorization': `Bearer ${session.user.backendToken}` }
        });
        const data = await res.json();
        
        if (!res.ok) {
            return NextResponse.json({ error: data.message || 'Error fetching report' }, { status: res.status });
        }
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Get report error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
