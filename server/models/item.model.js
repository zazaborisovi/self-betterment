const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    name: String,
    price: {
        type: Number,
        required: true
    },
    description: String,
    effect: {
        
    },
})

const Item = mongoose.model("Item" , itemSchema)

module.exports = Item