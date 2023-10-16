import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import instance from "@/lib/axios-config";
import Auth from "@/models/auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import UserEntity, { UserDocument } from "@/entities/user-entity";
import AccountEntity, { AccountDocument } from "@/entities/account-entity";
import NextAuth, { Account, Profile, Session, User } from "next-auth";

interface GithubProfile extends Profile {
  id: string;
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          const { data } = await instance.post("/auth/login", {
            email,
            password,
          });

          return data;
        } catch (error: any) {
          console.error("Error when logging in: ", error.message);
          return null;
        }
      },
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
      console.log(account, profile);
      let providerId = "";
      let providerType = "";

      if (account && account.provider === "github") {
        const githubProfile = profile as GithubProfile;
        providerId = githubProfile.id;
        providerType = "github";
      }

      // Connect to db
      await connectDB();

      // Find account
      const existingAccount = await AccountEntity.findOne<AccountDocument>({
        providerId,
      });
      if (existingAccount) {
        return true;
      }

      // Find user
      const existingUser = await UserEntity.findOne<UserDocument>({
        email: user?.email,
      });
      if (existingUser) {
        // Create account
        await AccountEntity.create<AccountDocument>({
          providerId: providerId || existingUser._id,
          providerType: providerType || "credentials",
          user: existingUser._id,
        });
        return true;
      }

      // Create user and account
      const newUser = await UserEntity.create<UserDocument>({
        email: user?.email,
      });
      await AccountEntity.create<AccountDocument>({
        providerId,
        providerType,
        user: newUser._id,
      });

      // Return true to accept sign in
      return true;
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
        const existingUser = await UserEntity.findOne<UserDocument>({
          email: user.email,
        });

        // Create jwt token
        const jwtToken = jwt.sign(
          {
            _id: existingUser?._id,
            email: existingUser?.email,
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
