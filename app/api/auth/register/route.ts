import bcrypt from "bcrypt";
import UserEntity, { UserDocument } from "@/entities/user-entity";
import { NextRequest, NextResponse } from "next/server";
import AccountEntity, { AccountDocument } from "@/entities/account-entity";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();

    if (
      !email ||
      !password ||
      !isValidEmail(email) ||
      !isValidPassword(password)
    ) {
      return NextResponse.json({}, { status: 400 });
    }

    if (await UserEntity.findOne({ email })) {
      return NextResponse.json({}, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserEntity.create<UserDocument>({
      email,
      password: hashedPassword,
    });

    await AccountEntity.create<AccountDocument>({
      providerId: newUser._id,
      providerType: "credentials",
      user: newUser._id,
    });

    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({}, { status: 500 });
  }
};

const isValidEmail = (email: string) => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
};

const isValidPassword = (password: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(
    password,
  );
};
