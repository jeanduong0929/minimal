import connectDB from "@/lib/db";
import AccountEntity from "@/entities/account-entity";
import UserEntity from "@/entities/user-entity";
import GithubProvider from "next-auth/providers/github";
import jwt from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import NextAuth, { Account, Profile, Session, User } from "next-auth";
import Auth from "@/models/auth";

interface GithubProfile extends Profile {
  id: string;
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User | null;
      account: Account | null;
      profile?: Profile | null;
    }): Promise<boolean> {
      if (account && profile) {
        let providerId,
          providerType = "";

        if (account.provider === "github") {
          const githubProfile = profile as GithubProfile;
          providerId = githubProfile?.id;
          providerType = "github";
        } else {
          providerId = account.id;
          providerType = "credentials";
        }

        // Connect to db
        await connectDB();

        // Find account
        const existingAccount = await AccountEntity.findOne({ providerId });
        if (existingAccount) {
          return true;
        }

        // Find user
        const existingUser = await AccountEntity.findOne({
          email: user?.email,
        });
        if (existingUser) {
          // Create account
          await AccountEntity.create({
            providerId,
            providerType,
            user: existingUser._id,
          });
          return true;
        }

        // Create user and account
        const newUser = await UserEntity.create({
          email: user?.email,
        });
        await AccountEntity.create({
          providerId,
          providerType,
          user: newUser._id,
        });

        // Return true to accept sign in
        return true;
      }
      return false;
    },
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user: User | null;
    }): Promise<JWT> {
      if (user) {
        // Connect to db
        await connectDB();

        // Find user
        const existingUser = await UserEntity.findOne({ email: user.email });

        // Create jwt token
        const jwtToken = jwt.sign(
          {
            id: existingUser._id,
            email: existingUser.email,
          },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "1d",
          },
        );

        // Set jwt token
        token.jwt = jwtToken;
      }

      // Return token
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT | null;
    }): Promise<Session> {
      const auth = session as Auth;
      if (token) {
        auth.jwt = token.jwt as string;
      }
      return auth;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
});

export { handler as GET, handler as POST };
