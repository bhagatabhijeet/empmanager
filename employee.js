const db = require('./database');
const cTable = require('console.table');

let Employee = {
  async addEmployee() {
    console.log('Adding employee...');
  },
  async viewAllEmployees() {
    
    let sqlQuery = `
          SELECT 
              e.id,
              e.first_name,
              e.last_name,
              r.title,
              r.salary,
              d.name 'department',
              e1.first_name AS 'manager'
          FROM
              employee e
                  LEFT JOIN
              employee e1 ON e.manager_id = e1.id
                  INNER JOIN
              role r ON e.role_id = r.id
                  INNER JOIN
              department d ON r.department_id = d.id;`
    
    try {
      const result = await db.executeQuery(sqlQuery);      
      console.table(result);
    }
    catch (e) {
      console.log(e);
    }    
  }
}

// function query(connection, sql) {
//   const promise = new Promise((resolve, reject) => {
//     connection.query(sql, (err, result) => {
//       if (err) {
//         reject(err);
//       }
//       else {
//         resolve(result);
//       }
//     });
//   });
//   return promise;
// }

module.exports = Employee;