const mongoose = require("mongoose");
let instance = null;

class Database {
    /**
     *
     */
    constructor() {
        this.mongoCollection = null;
        if(instance){
            instance=this;
        }
        return instance;
    }

    async connect(options){
        try {
            console.log("DB CONNECTING......");
            let db = await mongoose.connect(options.CONNECTION_STRING);
            
            this.mongoCollection = db;
            console.log("DB CONNECTED");
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
        
    }
}

module.exports = Database;

