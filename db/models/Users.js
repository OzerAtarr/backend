const mongoose = require("mongoose");

const schema = mongoose.schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    is_active: {type: Boolean, required: true},
    first_name: String,
    last_name: String
},{
    timestamps:{
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Users extends mongoose.Model {

}

schema.loadClass(Users);
module.exports = mongoose.model("users", schema);