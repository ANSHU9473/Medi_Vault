import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.backendToken) return NextResponse.json({ profile: null });

        const res = await fetch(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${session.user.backendToken}` }
        });

        if (!res.ok) {
            console.error('Backend GET profile failed:', res.status);
            return NextResponse.json({ profile: null });
        }

        const data = await res.json();
        const emergencyProfile = data.user?.emergencyProfile;

        // Only return the profile if it has at least one real field set
        const hasData = emergencyProfile &&
            typeof emergencyProfile === 'object' &&
            Object.values(emergencyProfile).some(v => v && String(v).trim() !== '');

        return NextResponse.json({
            profile: hasData ? emergencyProfile : null,
            user: {
                name: data.user?.name,
                email: data.user?.email,
                accountType: data.user?.accountType,
                familyMembers: data.user?.familyMembers,
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.backendToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        const res = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.backendToken}`
            },
            body: JSON.stringify({ emergencyProfile: body.emergencyProfile })
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            console.error('Backend PUT profile failed:', res.status, errData);
            return NextResponse.json({ error: 'Backend update failed', details: errData }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json({ profile: data.profile || body.emergencyProfile, message: 'Profile updated' });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}

