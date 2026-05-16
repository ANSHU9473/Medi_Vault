import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.backendToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const res = await fetch(`${API_URL}/folders/${params.id}`, {
            headers: { 'Authorization': `Bearer ${session.user.backendToken}` }
        });
        const data = await res.json();
        if (!res.ok) return NextResponse.json({ error: data.error || data.message }, { status: res.status });

        return NextResponse.json({ folder: data.folder, documents: data.documents || [] });
    } catch (error) {
        console.error('Get folder error:', error);
        return NextResponse.json({ error: 'Failed to get folder' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.backendToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const res = await fetch(`${API_URL}/folders/${params.id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.backendToken}` 
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) return NextResponse.json({ error: data.error || data.message }, { status: res.status });
        return NextResponse.json({ folder: data.folder });
    } catch (error) {
        console.error('Update folder error:', error);
        return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession();
        if (!session?.user?.backendToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const res = await fetch(`${API_URL}/folders/${params.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${session.user.backendToken}` }
        });
        const data = await res.json();
        if (!res.ok) return NextResponse.json({ error: data.error || data.message }, { status: res.status });
        return NextResponse.json({ message: 'Folder deleted' });
    } catch (error) {
        console.error('Delete folder error:', error);
        return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
    }
}
