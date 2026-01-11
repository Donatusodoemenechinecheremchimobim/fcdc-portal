import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";

const handler = NextAuth({
  providers: [
    // 1. GOOGLE LOGIN
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    
    // 2. FIREBASE EMAIL LOGIN
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth, 
            credentials.email, 
            credentials.password
          );
          const user = userCredential.user;
          return {
            id: user.uid,
            email: user.email,
            name: user.displayName || "Agent",
          };
        } catch (error) {
          console.error("Firebase Login Error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login', // Redirects here if not logged in
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }