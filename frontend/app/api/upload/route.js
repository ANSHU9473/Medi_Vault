import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.backendToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const formData = await request.formData();
        const res = await fetch(`${API_URL}/reports/upload`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${session.user.backendToken}`
            },
            body: formData
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            console.error('Backend upload error:', errorData);
            return NextResponse.json({ error: errorData.error || 'Backend upload failed' }, { status: res.status });
        }
        
        const data = await res.json();
        return NextResponse.json({ document: data.report || data }, { status: 201 });
    } catch (error) {
        console.error('Upload proxy error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.backendToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        const res = await fetch(`${API_URL}/reports/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${session.user.backendToken}` }
        });
        
        return NextResponse.json({ message: 'Document deleted' });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.backendToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();

        const res = await fetch(`${API_URL}/reports/${id}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${session.user.backendToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.error || 'Update failed' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
