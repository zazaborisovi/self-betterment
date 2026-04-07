const mongoose = require("mongoose")

const inventorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    items: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Item"
    }]
})

const Inventory = mongoose.model("Inventory" , inventorySchema)

module.exports = Inventory