import connectDB from "@/lib/db";
import jwt from "jsonwebtoken";
import Auth from "@/models/auth";
import NoteEntity, { NoteDocument } from "@/entities/note-entity";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const token = req.headers.get("token");

    if (!token) {
      return NextResponse.json({}, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as Auth;
    if (!decoded) {
      return NextResponse.json({}, { status: 401 });
    }

    await connectDB();

    let notes = await NoteEntity.find<NoteDocument>({
      user: decoded._id,
    });
    const incompleteNotes = notes.filter((note) => !note.completed);
    const completeNotes = notes.filter((note) => note.completed);
    notes = [...incompleteNotes, ...completeNotes];
    return NextResponse.json(notes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({}, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { title } = await req.json();
    const token = req.headers.get("token");

    if (!token || !title) {
      return NextResponse.json({}, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as Auth;
    if (!decoded) {
      return NextResponse.json({}, { status: 401 });
    }

    await connectDB();

    await NoteEntity.create<NoteDocument>({
      title,
      user: decoded._id,
    });

    return NextResponse.json({}, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({}, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const { _id, title } = await req.json();
    const token = req.headers.get("token");

    if (!_id || !token || !title) {
      return NextResponse.json({}, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as Auth;
    if (!decoded) {
      return NextResponse.json({}, { status: 401 });
    }

    await connectDB();
    await NoteEntity.findByIdAndUpdate<NoteDocument>({ _id }, { title });
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({}, { status: 500 });
  }
};
