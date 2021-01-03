const mysql = require("mysql");
const express = require("express");
var app = express();
const bodyparser = require("body-parser");

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "asd123456",
  database: "employeedb",
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (!err) {
    console.log("DB Connection Succeded");
  } else {
    console.log(
      "DB Connection failed \n Error" + JSON.stringify(err, undefined, 2)
    );
  }
});

app.listen(3000, () => console.log("Express server started @ PORT:3000"));

//Get all employees
app.get("/employee", (res, req) => {
  mysqlConnection.query("SELECT * FROM Employee", (err, rows, fileds) => {
    if (!err) {
      console.log(rows);
      req.send(rows);
    } else {
      console.log(err);
    }
  });
});

//Get perticular employee id through like emp 1
app.get("/employee/:id", (res, req) => {
  mysqlConnection.query(
    "SELECT * FROM Employee WHERE EmpID = ?",
    [res.params.id],
    (err, rows, fileds) => {
      if (!err) {
        console.log(rows);
        req.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});

//Delete employee details through id
app.delete("/employee/:id", (res, req) => {
  mysqlConnection.query(
    "DELETE FROM Employee WHERE EmpID = ?",
    [res.params.id],
    (err, rows, fileds) => {
      if (!err) {
        console.log(err);
        req.send("Deleted Successfully.");
      } else console.log(err);
    }
  );
});

//Insert new employee
app.post("/employee", (req, res) => {
  const name = req.body.name;
  const empcode = req.body.empcode;
  const salary = req.body.salary;

  var sql = "INSERT INTO employee (Name,EmpCode,Salary) values (?,?,?);";
  mysqlConnection.query(sql,[name, empcode, salary],(err, rows, fields) => {
      if (!err) {  
       
        res.json({
          status:1,
          message: "Data inserted Successfully",
          data: rows
        });
      } else console.log(err);
    }
  );

}); 


//Update  employee
app.post('/employee/:id', (req, res) => {
  // let data = req.body;
  const name = req.body.name;
  const empcode = req.body.empcode;
  const salary = req.body.salary;
  let sql = "UPDATE employee SET Name='"+name+"', EmpCode= '"+ empcode +"', Salary='"+ salary +"' WHERE EmpID="+req.params.id; 
console.log(sql);

  mysqlConnection.query(sql, (err, rows,fields) => {
    if (!err) {
            console.log(sql)
             res.send('Updated Successfully');
            } else console.log(err);
  });
});

