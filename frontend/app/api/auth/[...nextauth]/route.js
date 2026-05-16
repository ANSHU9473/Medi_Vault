import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter email and password');
                }

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api'}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: credentials.email, password: credentials.password })
                    });
                    
                    const data = await res.json();
                    
                    if (!res.ok) {
                        throw new Error(data.message || data.error || 'Login failed');
                    }
                    
                    if (data.user) {
                        return {
                            id: data.user._id,
                            name: data.user.name,
                            email: data.user.email,
                            accountType: data.user.accountType,
                            backendToken: data.token,
                        };
                    }
                    return null;
                } catch (error) {
                    throw new Error(error.message || 'Error communicating with backend');
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.accountType = user.accountType;
                token.backendToken = user.backendToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.accountType = token.accountType;
                session.user.backendToken = token.backendToken;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/login',
    },
    secret: process.env.NEXTAUTH_SECRET || 'medivault-dev-secret-key-change-in-production',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
