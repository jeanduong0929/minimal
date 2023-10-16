"use client";
import React from "react";
import Loader from "@/components/loader";
import Navbar from "@/components/navbar/navbar";
import Auth from "@/models/auth";
import SideBar from "@/components/sidebar";
import Note from "@/models/note";
import FormInput from "@/components/form/form-input";
import EllipsisVerticalIcon from "@/components/svgs/ellipsis-vertical-icon";
import instance from "@/lib/axios-config";
import { Button } from "@/components/ui/button";
import { Loader2, PlusIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
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

const DashboardPage = () => {
  // States
  const [newNoteDialogOpen, setNewNoteDialogOpen] =
    React.useState<boolean>(false);
  const [notes, setNotes] = React.useState<Note[]>([]);

  // Session
  const { data: session, status } = useSession();
  const auth = session as Auth | null;

  React.useEffect(() => {
    if (auth) {
      getNotes();
    }
  }, [auth, newNoteDialogOpen]);

  const getNotes = async () => {
    try {
      const { data } = await instance.get("/note", {
        headers: {
          token: auth!.jwt as string,
        },
      });

      setNotes(data);
      console.log(data);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        signOut();
      }
    }
  };

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
              <PlusIcon className="h-4 w-4 mr-4" />
              New note
            </Button>

            {/* New note dialog */}
            <NewNoteDialog
              auth={auth}
              open={newNoteDialogOpen}
              setOpen={setNewNoteDialogOpen}
            />
          </div>

          {/* Notes */}
          {notes.map((note) => (
            <NoteItem
              key={note._id}
              note={note}
              auth={auth}
              setNotes={setNotes}
            />
          ))}
        </div>
      </div>
    </>
  );
};

interface NoteItemProps {
  note: Note;
  auth: Auth | null;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, auth, setNotes }) => {
  const [markDoneLoading, setMarkDoneLoading] = React.useState<boolean>(false);

  return (
    <>
      <div className="flex items-center justify-between border w-full px-10 py-5">
        {markDoneLoading ? (
          <Loader2 className="h-4 m-4 animate-spin" />
        ) : (
          <h3
            className={`font-bold text-lg ${note.completed && "line-through"}`}
          >
            {note.title}
          </h3>
        )}
        <NoteDropdown
          auth={auth}
          note={note}
          setMarkDoneLoading={setMarkDoneLoading}
          setNotes={setNotes}
        />
      </div>
    </>
  );
};

interface NoteDropdownProps {
  auth: Auth | null;
  note: Note;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setMarkDoneLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const NoteDropdown: React.FC<NoteDropdownProps> = ({
  auth,
  note,
  setNotes,
  setMarkDoneLoading,
}) => {
  // Variable states
  const [open, setOpen] = React.useState(false);

  const markDone = async () => {
    setMarkDoneLoading(true);
    try {
      await instance.patch(
        `/note/${note._id}`,
        {},
        {
          headers: {
            token: auth!.jwt as string,
          },
        },
      );

      setNotes((prev) => {
        // Create a new note object with the toggled completed status
        const updatedNote = { ...note, completed: !note.completed };

        // Separate notes into incomplete and completed arrays
        const incompleteNotes = prev.filter(
          (n) => n._id !== note._id && !n.completed,
        );
        const completedNotes = prev.filter(
          (n) => n._id !== note._id && n.completed,
        );

        // If updated note is completed move the updated note to the end of the completed notes array
        if (updatedNote.completed) {
          return [...prev.filter((n) => n._id !== note._id), updatedNote];
        }

        // If updated note is incomplete concat it to the end of the incomplete notes array
        return [...incompleteNotes, updatedNote, ...completedNotes];
      });
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        signOut();
      }
    } finally {
      setMarkDoneLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVerticalIcon className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => markDone()}>
            {note.completed ? "Undone" : "Done"}
          </DropdownMenuItem>
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
      <DeleteNoteDialog
        open={open}
        setOpen={setOpen}
        auth={auth}
        note={note}
        setNotes={setNotes}
      />
    </>
  );
};

interface DeleteNoteDialogProps {
  auth: Auth | null;
  note: Note;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

const DeleteNoteDialog: React.FC<DeleteNoteDialogProps> = ({
  auth,
  note,
  open,
  setOpen,
  setNotes,
}) => {
  // Loading state
  const [loading, setLoading] = React.useState<boolean>(false);

  // Custom hooks
  const { toast } = useToast();

  const handleDeleteNote = async () => {
    setLoading(true);
    try {
      await instance.delete(`/note/${note._id}`, {
        headers: {
          token: auth!.jwt as string,
        },
      });

      toast({
        title: "Note deleted successfully.",
        className: "bg-green-500 text-white",
      });

      setNotes((prev) => prev.filter((n) => n._id !== note._id));
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        signOut();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="bg-red-600 text-white"
              type="button"
              variant={"destructive"}
              disabled={loading}
              onClick={() => handleDeleteNote()}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface NewNoteDialogProps {
  auth: Auth | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewNoteDialog: React.FC<NewNoteDialogProps> = ({
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

  // Custom hooks
  const { toast } = useToast();

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);

    if (!e.target.value.trim()) {
      setError("Title cannot be empty.");
    } else {
      setError("");
    }
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

      clearForm();

      toast({
        title: "Note created successfully.",
        className: "bg-green-500 text-white",
      });
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        setError("Title cannot be empty.");
      }

      if (error.response && error.response.status === 401) {
        signOut();
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setTitle("");
    setError("");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogContent>
          <form onSubmit={handleNewNoteForm}>
            <div className="w-full py-5">
              <FormInput
                placeholder={"Example note"}
                type={"text"}
                value={title}
                onChange={handleTitle}
                error={error}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2" />}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardPage;
