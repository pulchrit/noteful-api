const FoldersService = {

    // GET/READ/SELECT
    getAllFolders(knexInstance) {
        return knexInstance.select('*').from('folders');
    },

    getById(knexInstance, id) {
        return knexInstance
            .select('*')
            .from('folders')
            .where({id})
            .first();
    },

    // POST/INSERT/CREATE
    insertFolder(knexInstance, newFolder) {
        return knexInstance
            .insert(newFolder)
            .into('folders')   
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },

    // DELETE
    deleteFolder(knexInstance, id) {
        return knexInstance('folders')
            .where({id})
            .delete();
    },

    // PATCH/PUT/UPDATE
    updateFolder(knexInstance, id, newFolderName) {
        return knexInstance('folders')
            .where({id})
            .update(newFolderName);
    }
};

module.exports = FoldersService;