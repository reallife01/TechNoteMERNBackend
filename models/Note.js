const mongoose = require('mongoose');
// Another method of storing schema
// const Schema = mongoose.Schema;
const  AutoIncrement = require('mongoose-sequence')(mongoose)

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    title: {
        type: String,
        require: true,
    },
    text:{
        type: String,
        require: true,
    },
    completed: {
        type: Boolean,
        default: true
    },

},
{
    timestamps: true,
}
);


// noteSchema.plugin(AutoIncrement,{
//     inc_field: 'ticket',
//     id: 'ticketNums',
//     start_seq: 500
// });

// module.exports =  mongoose.model("Employee", employeeSchema);

const Note = mongoose.model("Note", noteSchema);
module.exports = Note