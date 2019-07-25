const FoldersService = require('./folders-service');
const express = require('express');
const xss = require('xss');
const path = require('path'); 

// Create router object
const foldersRouter = express.Router();
// Save json method to bodyParser to pass req body thru
// and convert it into JSON.
const bodyParser = express.json();

const serializeFolder = (folder) => ({
     id: folder.id,
     folder_name: xss(folder.folder_name)
});

foldersRouter 
    .route('/api/folders')
    .get((req, res, next) => {
        FoldersService.getAllFolders(req.app.get('db'))
        .then(folders => {
            return res.json(folders.map(serializeFolder)) ;
        })
        .catch(next);
    })
    .post(bodyParser, (req, res, next) => {
        // Get folder name from req body.
        const {folder_name} = req.body;
        const newFolder = {folder_name};

        // If folder name is missing, return 400 bad request.
        if (!folder_name) {
            return res.status(400).json({
                error: {message: 'Missing folder name in request body.'}
            });
        }
        
        FoldersService.insertFolder(req.app.get('db'), newFolder)
        .then(folder => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `${folder.id}`))
                .json(serializeFolder(folder))
        })
        .catch(next);
    })

foldersRouter
    .route('/api/folders/:folder_id')
    // For all request methods, return 404 if id is not found.
    .all((req, res, next) => {
        FoldersService.getById(req.app.get('db'), req.params.folder_id) 
        .then(folder => {
            if (!folder) {
                return res.status(404).json({
                    error: {message: `Folder doesn't exist.`}
                });
            }
            res.folder = folder; // save folder back onto res object
            next(); // call next middleware step
        })
    })
    .get((req, res, next) => {
        res.json(serializeFolder(res.folder));
    })
    .delete((req, res, next) => {
        FoldersService.deleteFolder(req.app.get('db'), req.params.folder_id)
        .then(numRowsAffected => {
            res.status(204).end();
        })
        .catch(next);
    })
    .patch(bodyParser, (req, res, next) => {
        const {folder_name} = req.body;
        const newFolderName = {folder_name};

        if (!folder_name) {
            return res.status(400).json({
                error: {message: "Missing folder name in request body."}
            });
        }

        FoldersService.updateFolder(req.app.get('db'), req.params.folder_id, newFolderName)
        .then(numRowsAffected => {
            res.status(204).end();
        })
        .catch(next);
    })




module.exports = foldersRouter;
