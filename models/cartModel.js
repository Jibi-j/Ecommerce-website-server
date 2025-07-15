const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            size: {
                type: String,
                required: false,
            },
            price: {
                type: Number,
                required: true,
            },
            totalprice: {
                type: Number,
                required: true
            }
        }
    ]
}, {
    timestamps: true

})
cartSchema.methods.calculateTotal = function () {
    return this.items.reduce((total, item) => total + item.totalprice, 0);
};

module.exports = mongoose.model('Cart', cartSchema)