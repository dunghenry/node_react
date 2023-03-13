const { Schema, models, model } = require('mongoose');
const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);
const User = models.User || model('User', userSchema);
module.exports = User;
