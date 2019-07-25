const NotesService = {

    // GET/READ/SELECT
    getAllNotes(knexInstance) {
        return knexInstance.select('*').from('notes');
    },

    getById(knexInstance, id) {
        return knexInstance
            .select('*')
            .from('notes')
            .where({id})
            .first();
    },

    // POST/INSERT/CREATE
    insertNote(knexInstance, newNote) {
        return knexInstance
            .insert(newNote)
            .into('notes')   
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },

    // DELETE
    deleteNote(knexInstance, id) {
        return knexInstance('notes')
            .where({id})
            .delete();
    },

    // PATCH/PUT/UPDATE
    updateNote(knexInstance, id, newNoteFields) {
        return knexInstance('notes')
            .where({id})
            .update(newNoteFields);
    }
};

module.exports = NotesService;