const db = require('./database');

class Admin{
    async seedData(){
        await db.seedData();
    }
}

const adminORM = new Admin();
module.exports= adminORM;