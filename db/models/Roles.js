const mongoose = require("mongoose");
const RolePrivileges = require("./RolePrivileges");

const schema = mongoose.Schema({
    role_name: {type: String, required: true, unique: true},
    is_active: {type: Boolean, default: true},
    created_by: {type: mongoose.SchemaTypes.ObjectId}
},{
    versionKey: false,
    timestamps:{
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});


class Roles extends mongoose.Model {
    // Rol silinirse ona ait olan yetkileri de sil
    static async deleteRoleById(id) {
      if (!id) {
        throw new Error("Role ID is required for deletion");
      }
  
      // RolePrivileges'dan ilgili yetkileri sil
      await RolePrivileges.deleteMany({ role_id: id });
  
      // Rolü sil
      return this.findOneAndDelete({ _id: id });
    }
  }
  

schema.loadClass(Roles);
module.exports = mongoose.model("roles", schema);