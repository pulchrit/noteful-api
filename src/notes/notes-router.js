const NotesService = require('./notes-service');
const express = require('express');
const xss = require('xss');
const path = require('path'); 

// Create router object
const notesRouter = express.Router();
// Save json method to bodyParser to pass req body thru
// and convert it into JSON.
const bodyParser = express.json();

const serializeNote = (note) => ({
     id: note.id,
     note_name: xss(note.note_name),
     date_modified: note.date_modified,
     content: xss(note.content),
     folder_id: note.folder_id
});

notesRouter 
    .route('/api/notes')
    .get((req, res, next) => {
        NotesService.getAllNotes(req.app.get('db'))
        .then(notes => {
            return res.json(notes.map(serializeNote)) ;
        })
        .catch(next);
    })
    .post(bodyParser, (req, res, next) => {
        // Get note name, date, content, folder id from req body.
        const {note_name, date_modified, content, folder_id} = req.body;

        // Loop over values in newNote, if any are null, then return 400
        // with error saying that field is missing.
        const newNote = {note_name, content, folder_id};
        for (const[key, value] of Object.entries(newNote)) {
            if (value == null) {
                res.status(400).json({
                    error: {message: `Missing ${key} in request body.`}
                });
            }
        }
           
        newNote.date_modified = date_modified;
        
        NotesService.insertNote(req.app.get('db'), newNote)
        .then(note => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `${note.id}`))
                .json(serializeNote(note))
        })
        .catch(next);
    })

notesRouter
    .route('/api/notes/:note_id')
    // For all request methods, return 404 if id is not found.
    .all((req, res, next) => {
        NotesService.getById(req.app.get('db'), req.params.note_id) 
        .then(note => {
            if (!note) {
                return res.status(404).json({
                    error: {message: `Note doesn't exist.`}
                });
            }
            res.note = note; // save note back onto res object
            next(); // call next middleware step
        })
    })
    .get((req, res, next) => {
        res.json(serializeNote(res.note)); // pull the note off the res object
    })
    .delete((req, res, next) => {
        NotesService.deleteNote(req.app.get('db'), req.params.note_id)
        .then(numRowsAffected => {
            res.status(204).end();
        })
        .catch(next);
    })
    .patch(bodyParser, (req, res, next) => {
        const {note_name, date_modified, content, folder_id} = req.body;

        // Check that required fields are present by checking that 
        // required fields are truthy.
        const noteToUpdate = {note_name, date_modified, content, folder_id};
        const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {message: "Reques must contain at least one of: note_name, date_modified, content, or folder_id."}
            });
        }

        NotesService.updateNote(req.app.get('db'), req.params.note_id, noteToUpdate)
        .then(numRowsAffected => {
            res.status(204).end();
        })
        .catch(next);
    })




module.exports = notesRouter;