import { Hono } from "hono";
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNotes,
  deleteNote,
} from "./note.controller";
import authenticate from "@/middlewares/authentication";
import { validateNote } from "@/middlewares/note-validator";

const noteRouter = new Hono();

noteRouter.get("/notes", authenticate, getAllNotes);
noteRouter.get("/notes/:id", authenticate, getNoteById);
noteRouter.post("/notes", authenticate, validateNote, createNote);
noteRouter.put("/notes/:id", authenticate, validateNote, updateNotes);
noteRouter.delete("/notes/:id", authenticate, deleteNote);

export default noteRouter;
