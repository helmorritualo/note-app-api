import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		note: {
			type: String,
			required: true,
		},
		ownBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
