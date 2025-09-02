import Prisma from "../config/prisma.config.js";

export const createNote = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .send({ success: false, message: "Please enter all fields" });
    }

    const createNote = await Prisma.notes.create({
      data: {
        name,
        body: description,
      },
    });

    if (!createNote) {
      return res
        .status(400)
        .send({ success: false, message: "Note not created" });
    }

    return res.status(201).send({ success: true, data: createNote });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Prisma.notes.findMany({
      orderBy: {
        create_at: "desc",
      },
    });

    return res.status(200).send({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

export const viewNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    if (!noteId) {
      return res
        .status(400)
        .send({ success: false, message: "Note ID is required" });
    }

    const note = await Prisma.notes.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!note) {
      return res
        .status(404)
        .send({ success: false, message: "Note not found" });
    }

    return res.status(200).send({ success: true, data: note });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { name, description } = req.body;

    if (!noteId) {
      return res
        .status(400)
        .send({ success: false, message: "Note ID is required" });
    }

    if (!name && !description) {
      return res.status(400).send({
        success: false,
        message:
          "At least one field (name or description) is required to update",
      });
    }

    const existingNote = await Prisma.notes.findUnique({
      where: { id: noteId },
    });

    if (!existingNote) {
      return res
        .status(404)
        .send({ success: false, message: "Note not found" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.body = description;

    const updatedNote = await Prisma.notes.update({
      where: {
        id: noteId,
      },
      data: updateData,
    });

    return res.status(200).send({
      success: true,
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    if (!noteId) {
      return res
        .status(400)
        .send({ success: false, message: "Note ID is required" });
    }

    const existingNote = await Prisma.notes.findUnique({
      where: { id: noteId },
    });

    if (!existingNote) {
      return res
        .status(404)
        .send({ success: false, message: "Note not found" });
    }

    const deletedNote = await Prisma.notes.delete({
      where: {
        id: noteId,
      },
    });

    return res.status(200).send({
      success: true,
      message: "Note deleted successfully",
      data: deletedNote,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
