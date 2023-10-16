import bcrypt from "bcrypt";
import UserEntity, { UserDocument } from "@/entities/user-entity";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({}, { status: 400 });
    }

    const existingUser = await UserEntity.findOne<UserDocument>({ email });
    if (!existingUser || !bcrypt.compare(password, existingUser.password)) {
      return NextResponse.json({}, { status: 401 });
    }

    return NextResponse.json(
      {
        _id: existingUser._id,
        email: existingUser.email,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({}, { status: 500 });
  }
};
