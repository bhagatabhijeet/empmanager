const adminORM = require('./orm/adminorm');

// Admin Entity
// The Admin is used for seeding the data
// Admin object was created to avoid directly using 'database.js'
// Instead now Admin routes to adminorm which in turn calls 'database.js'
const Admin = {
    async seedData() {
        await adminORM.seedData();
    }
}

module.exports = Admin;