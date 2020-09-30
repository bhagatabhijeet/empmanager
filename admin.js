const adminORM = require('./orm/adminorm');

const Admin = {
    async seedData() {
        await adminORM.seedData();
    }
}

module.exports = Admin;