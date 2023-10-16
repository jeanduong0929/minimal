import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import Auth from "@/models/auth";
import NoteEntity, { NoteDocument } from "@/entities/note-entity";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const { id } = params;
    const token = req.headers.get("token") as string;

    if (!id || !token) {
      return NextResponse.json({}, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as Auth;
    if (!decoded) {
      return NextResponse.json({}, { status: 401 });
    }

    await connectDB();
    const existingNote = await NoteEntity.findById<NoteDocument>({
      _id: id,
    });

    await NoteEntity.findByIdAndUpdate<NoteDocument>(
      { _id: id },
      {
        completed: !existingNote?.completed,
      },
    );

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({}, { status: 500 });
  }
};
