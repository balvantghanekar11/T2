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
  let emp = req.body;
  var sql =
    "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?;\
   CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
  mysqlConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],(err, rows, fileds) => {
      if (!err) {
        rows.forEach(element => {
          if (element.constructor == Array)
            res.send("Inserted employee id :" + element[0].EmpID);
        });
      } else console.log(err);
    }
  );
});
