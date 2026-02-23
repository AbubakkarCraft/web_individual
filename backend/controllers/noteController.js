const { Note } = require('../models');

const getNotesByBookId = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.userId;

        const notes = await Note.findAll({
            where: { bookId, userId },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error: error.message });
    }
};

const addNote = async (req, res) => {
    try {
        const { bookId, text } = req.body;
        const userId = req.user.userId;

        const note = await Note.create({
            text,
            userId,
            bookId
        });

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Error adding note', error: error.message });
    }
};

const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const note = await Note.findOne({
            where: { id, userId }
        });

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await note.destroy();
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note', error: error.message });
    }
};

module.exports = { getNotesByBookId, addNote, deleteNote };
