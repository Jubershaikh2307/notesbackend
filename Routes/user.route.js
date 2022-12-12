const express = require('express');
const { noteModel } = require("../Models/note.model")

// const user=
const notesRouter = express.Router()

//create
notesRouter.post("/:userId/create", async (req, res) => {
    const userId = req.params.userId
    const { title, note, lable } = req.body
    const new_node = new noteModel({
        title,
        note,
        lable,
        userId
    })
    await new_node.save()
    res.send({ responce: "Success" })
})

//read
notesRouter.get("/:userId", async (req, res) => {
    const userId = req.params.userId
    const notes = await noteModel.find({ userId })
    res.send(notes)
})

//update
notesRouter.patch("/:userId/update/:noteId", async (req, res) => {
    const userId = req.params.userId
    const noteId = req.params.noteId
    const note = await noteModel.findOne({ _id: noteId })
    if (note.userId != userId) {
        res.send("Note NOt exist")
    }
    await noteModel.findByIdAndUpdate(noteId, req.body)
    res.send({ responce: "Success" })
})

//delete
notesRouter.delete("/:userId/delete/:noteId", async (req, res) => {
    const userId = req.params.userId
    const noteId = req.params.noteId
    const note = await noteModel.findOne({ _id: noteId })
    if (note.userId != userId) {
        res.send("Note NOt exist")
    }
    await noteModel.findByIdAndDelete(noteId, req.body)
    res.send({ responce: "Success" })
})

module.exports = { notesRouter }