"use client";
import React from "react";
import Loader from "@/components/loader";
import Navbar from "@/components/navbar/navbar";
import Auth from "@/models/auth";
import SideBar from "@/components/sidebar";
import Note from "@/models/note";
import EllipsisVerticalIcon from "@/components/svgs/ellipsis-vertical-icon";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, PlusIcon } from "lucide-react";
import FormInput from "@/components/form/form-input";
import instance from "@/lib/axios-config";

const DashboardPage = () => {
  // States
  const [newNoteDialogOpen, setNewNoteDialogOpen] =
    React.useState<boolean>(false);

  // Session
  const { data: session, status } = useSession();
  const auth = session as Auth | null;

  // Notes
  const notes: Note[] = [
    {
      id: "1",
      title: "Note 1",
      completed: false,
    },

    {
      id: "2",
      title: "Note 2",
      completed: false,
    },
    {
      id: "3",
      title: "Note 3",
      completed: false,
    },
  ];

  if (status === "loading") {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex max-w-screen-lg w-11/12 mx-auto py-5">
        <SideBar />
        <div className="flex flex-col items-start pl-14 w-full">
          {/* Header */}
          <div className="flex items-center justify-between w-full mb-10">
            <h1 className="font-bold text-4xl">Notes</h1>
            <Button onClick={() => setNewNoteDialogOpen(true)}>
              <PlusIcon className="h-4 w-4 mr-4" /> New note
            </Button>

            {/* New note dialog */}
            <NewNoteDialog
              open={newNoteDialogOpen}
              setOpen={setNewNoteDialogOpen}
            />
          </div>

          {/* Notes */}
          {notes.map((note) => (
            <NoteItem note={note} />
          ))}
        </div>
      </div>
    </>
  );
};

interface NoteItemProps {
  note: Note;
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  return (
    <>
      <div
        key={note.id}
        className="flex items-center justify-between border w-full px-10 py-5"
      >
        <h3 className="font-bold text-lg">{note.title}</h3>
        <NoteDropdown />
      </div>
    </>
  );
};

const NoteDropdown = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVerticalIcon className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete note dialog */}
      <DeleteNoteDialog open={open} setOpen={setOpen} />
    </>
  );
};

interface DeleteNoteDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteNoteDialog: React.FC<DeleteNoteDialogProps> = ({
  open,
  setOpen,
}) => {
  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"secondary"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 text-white">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface DeleteNoteDialogProps {
  auth: Auth | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewNoteDialog: React.FC<DeleteNoteDialogProps> = ({
  auth,
  open,
  setOpen,
}) => {
  // Form states
  const [title, setTitle] = React.useState<string>("");

  // Error state
  const [error, setError] = React.useState<string>("");

  // Loading state
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleTitle = () => {
    setTitle(title);
  };

  const handleNewNoteForm = async () => {
    setLoading(true);
    try {
      await instance.post(
        "/note",
        {
          title: title,
        },
        {
          headers: {
            token: auth!.jwt as string,
          },
        },
      );
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogContent>
          <DialogHeader></DialogHeader>
          <div className="w-full py-5">
            <FormInput
              placeholder={"Example note"}
              type={"text"}
              value={title}
              onChange={handleTitle}
            />
          </div>
          <DialogFooter>
            <Button variant={"secondary"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={loading} onClick={handleNewNoteForm}>
              {loading && <Loader2 className="w-4 h-4 mr-2" />}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardPage;
