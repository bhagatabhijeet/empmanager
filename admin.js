const adminORM = require('./orm/adminorm');

// Admin Entity
// The Admin is used for seeding the data
// Admin object was created to avoid directly using 'database.js'
// Instead now Admin routes to adminorm which in turn calls 'database.js'
const Admin = {
  async seedData() {
    try {
      await adminORM.seedData();
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = Admin;
