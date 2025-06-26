import { Context } from "hono";
import Note from "@/models/note.model";
import { BadRequestError, NotFoundError } from "@/utils/error";

export const getAllNotes = async (c: Context) => {
	try {
		const notes = await Note.find().sort({ createdAt: -1 });
		if (notes.length === 0) {
			throw new NotFoundError("Notes not found");
		}

		return c.json(
			{
				success: true,
				data: {
					notes,
				},
			},
			200,
		);
	} catch (error) {
		if (error instanceof NotFoundError) {
			throw error;
		}
	}
};

export const getNoteById = async (c: Context) => {
	try {
		const noteId = c.req.param("id");

		const note = await Note.findById(noteId);
		if (!note) {
			throw new NotFoundError("Note not found");
		}

		return c.json(
			{
				success: true,
				data: {
					note,
				},
			},
			200,
		);
	} catch (error) {
		if (error instanceof NotFoundError) {
			throw error;
		}
	}
};

export const createNote = async (c: Context) => {
	try {
		const userId = c.get("user_id");
		const { title, note } = c.get("validatedNoteData");

		const newNote = new Note({
			title,
			note,
			userId,
		});

		await newNote.save();

		return c.json(
			{
				success: true,
				message: "Note successfully created",
				data: {
					note: newNote,
				},
			},
			201,
		);
	} catch (error) {
		console.error(`Failed to create note: ${error}`);
		throw new BadRequestError("Failed to create noted");
	}
};

export const updateNotes = async (c: Context) => {
	try {
		const noteId = c.req.param("id");
		const { title, note } = c.get("validatedNoteData");

		const isNoteExist = await Note.findById(noteId);
		if (!isNoteExist) {
			throw new NotFoundError("Note not found");
		}

		const updateNote = await Note.findByIdAndUpdate(
			noteId,
			{ title, note },
			{
				new: true,
			},
		);

		if (!updateNote) {
			throw new BadRequestError("Failed to update note");
		}

		return c.json(
			{
				success: true,
				message: "Note updated successfully",
				data: {
					note: updateNote,
				},
			},
			201,
		);
	} catch (error) {
		if (error instanceof NotFoundError || error instanceof BadRequestError) {
			throw error;
		}
	}
};

export const deleteNote = async (c: Context) => {
	try {
		const noteId = c.req.param("id");
		const noteToDelete = await Note.findById(noteId);

		if (!noteToDelete) {
			throw new NotFoundError("Note not found");
		}

		await Note.findByIdAndDelete(noteId);

		return c.json(
			{
				success: true,
				message: "Note deleted successfully",
			},
			200,
		);
	} catch (error) {
		if (error instanceof NotFoundError) {
			throw error;
		}
	}
};
