const db = require('./database');

class Admin {
  async seedData() {
    try {
      await db.seedData();
    } catch (err) {
      console.log(err);
    }
  }
}

const adminORM = new Admin();
module.exports = adminORM;
