const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    title: String,
    note: String,
    lable: String,
    userId: { type: String, required: true }
})

const noteModel = mongoose.model("note", noteSchema)

module.exports = { noteModel }