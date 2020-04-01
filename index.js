//========================================
//Requiring npm packages
//========================================
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
var CFonts = require("cfonts");
//========================================
//Title section
//========================================
CFonts.say('Employee|Manager!', {
    font: 'block',
    align: 'center',
    colors: ['system'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
});
//========================================
//Creating database connection
//========================================
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: process.env.PORT || 3306,

    // Your username
    user: "root",

    // Your password
    password: "coding26",
    database: "employeeDB"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});
//========================================
//Start application
//========================================
function start() {
    inquirer
//========================================
//prompt using inquirer first question
//========================================
        .prompt({
            name: "begin",
            type: "list",
            message: "What would you like to do?",
            choices:
                [
                    "View All Employee's",
                    "View Employee's by Department",
                    "View Employee's by Role",
                    "Add Employee",
                    "Add Employee Role",
                    "Add Employee Department",
                    "Update Employee's Role",
                    "Quit"
                ]
        })
        .then(function (answer) {
            //================================================
            // based on their answer, call the function
            //================================================
            if (answer.begin === "View All Employee's") {
                viewAllEmp();
            }
            else if (answer.begin === "View Employee's by Department") {
                viewEmpDepartment();
            }
            else if (answer.begin === "View Employee's by Role") {
                viewEmpRole();
            }
            else if (answer.begin === "Add Employee") {
                addEmployee();
            }
            else if (answer.begin === "Add Employee Role") {
                addEmployeeRole();
            }
            else if (answer.begin === "Add Employee Department") {
                    addEmployeeDepartment();
            }
            else if (answer.begin === "Update Employee's Role") {
                updateRole();
            }
            else if (answer.begin === "Remove Employee") {
                removeEmp();
            }
            else if (answer.begin === "Quit") {
                console.log("====Goodbye====");
            }
            else {
                connection.end();
            }
        });
}
//=======================================
//View all employee's
//========================================
function viewAllEmp() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.department FROM ((employee INNER JOIN roles ON employee.role_id = roles.id) INNER JOIN department ON roles.department_id = department.id)", function (err, result) {
        if (err) throw err;

        console.table(result);
        start();
    });
}
//========================================
//View all employee's by department
//========================================
function viewEmpDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "list",
            message: "Which department would you like to see employee's for?",
            choices: ["Sales", "Engineering", "Finance", "Legal"]
        })
//================================================
// based on answer, call the function
//================================================
        .then(function (answer) {
            if (answer.department === "Sales" || "Engineering" || "Finance" || "Legal") {
                connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.department FROM ((employee INNER JOIN roles ON employee.role_id = roles.id) INNER JOIN department ON roles.department_id = department.id) WHERE department = ?", [answer.department], function (err, result) {
                    if (err) throw err;

                    console.table(result);
                    start();
                });
            }
        });
}
//========================================
//View all employee's by role
//========================================
function viewEmpRole() {
    inquirer
        .prompt({
            name: "role",
            type: "list",
            message: "Which role would you like to see employee's for?",
            choices:
                [
                    "Salesperson",
                    "Sales Lead",
                    "Lead Engineer",
                    "Software Engineer",
                    "Finance Lead",
                    "Accountant",
                    "Lawyer",
                    "Legal Team Lead"
                ]
        })
//================================================
// based on answer, call the function
//================================================
        .then(function (answer) {
            if (answer.role === "Salesperson" || "Sales Lead" || "Lead Engineer" || "Software Engineer" || "Finance Lead" || "Accountant" || "Lawyer" || "Legal Team Lead") {
                connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.department FROM ((employee INNER JOIN roles ON employee.role_id = roles.id) INNER JOIN department ON roles.department_id = department.id) WHERE title = ?", [answer.role], function (err, result) {
                    if (err) throw err;

                    console.table(result);
                    start();
                });
            }
        });
}
//========================================
//Add new employee
//========================================
function addEmployee() {
    connection.query("select roles.title as name, roles.id as value from roles", function (err, result) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "first",
                    type: "input",
                    message: "What is your employee's first name?"
                },
                {
                    name: "last",
                    type: "input",
                    message: "What is your employee's last name?"
                },
                {
                    name: "role_id",
                    type: "list",
                    message: "What is your employee's role?",
                    choices: result
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is your employee's salary?"
                },
                {
                    name: "dept",
                    type: "list",
                    message: "What is your employee's department?",
                    choices: ["Sales", "Engineering", "Finance", "Legal"]
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Who is your employee's manager?",
                    choices: ["John", "Mike", "Paul", "Carl", "None"]
                }
            ])
            .then(function (answer) {

                var dept_id;

                if (answer.dept === "Sales") {
                    dept_id = 1;
                }
                else if (answer.dept === "Engineering") {
                    dept_id = 2;
                }
                else if (answer.dept === "Finance") {
                    dept_id = 3;
                }
                else if (answer.dept === "Legal") {
                    dept_id = 4;
                }
                 var manager_id;
                if (answer.manager === "John") {
                    manager_id = 1;
                }
                else if (answer.manager === "Mike") {
                    manager_id = 2;
                }
                else if (answer.manager === "Paul") {
                    manager_id = 3;
                }
                else if (answer.manager === "Carl") {
                    manager_id = 4;
                }
                else if (answer.manager === "None") {
                    manager_id = null;
                }
                connection.query("INSERT INTO employee SET ?",
                    {
                        first_name: answer.first,
                        last_name: answer.last,
                        role_id: answer.role_id,
                        manager_id: manager_id
                    },
                    function (err, result) {
                        if (err) throw err;

                        console.log("=== New Employee Added ===");
                        start();
                    }
                );
            });
    })
}
//========================================
// Add new employee role
//========================================
function addEmployeeRole() {
    connection.query("SELECT department.id as value, department.department as name from department", function (err, result) {
        if (err) throw err;
        console.log(result);
        inquirer
            .prompt([
                {
                    name: "role",
                    type: "input",
                    message: "What role would you like to add?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What would be the salary?"
                },
                {
                    name: "dept_id",
                    type: "list",
                    message: "What department?",
                    choices: result
                }
            ])
            .then(function (answer) {
                connection.query("INSERT INTO roles SET ?",
                    {
                        title: answer.role,
                        salary: answer.salary,
                        department_id: answer.dept_id
                    },
                    function (err, result) {
                        if (err) throw err;
                        start();
                    });
            })
        })
    }
//========================================
//Add New Employee Department
//========================================
function addEmployeeDepartment() {
    connection.query("SELECT roles.id as value, roles.department as name from roles", function (err, result) {
        if (err) throw err;
        console.log(result);
        inquirer
            .prompt([
                {
                    name: "dept_id",
                    type: "input",
                    message: "What Department would you like to add?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What would be the salary?"
                },
                {
                    name: "role",
                    type: "list",
                    message: "What role?",
                    choices: result
                }
            ])
            .then(function (answer) {
                connection.query("INSERT INTO roles SET ?",
                    {
                        title: answer.dept_id,
                        salary: answer.salary,
                        department_id: answer.role
                    },
                    function (err, result) {
                        if (err) throw err;
                        start();
                    });
            })
        })
    }
//========================================
//Update employee role
//========================================
function updateRole() {
            connection.query("SELECT id, first_name, last_name FROM employee", function (err, result) {
                if (err) throw err;

                var choiceArray = [];

                for (var i = 0; i < result.length; i++) {
                    var choices = result[i].id;
                    choiceArray.push(choices);
                    }
                    questions = [
                    {
                        name: "employee",
                        type: "list",
                        message: "Which employee would you like to update?",
                        choices: choiceArray
                    },
                    {
                        name: "newTitle",
                        type: "list",
                        message: "What is the employee's new role?",
                        choices:
                            [
                                "Salesperson",
                                "Sales Lead",
                                "Lead Engineer",
                                "Software Engineer",
                                "Finance Lead",
                                "Accountant",
                                "Lawyer",
                                "Legal Team Lead"
                            ]
                    }]
                inquirer
                    .prompt(questions)
                    .then(function (answer) {
                        console.log(answer.employee);
                        console.log(answer.newTitle)

                        let role_id = 0;

                        if (answer.newTitle == "Salesperson") {
                            role_id = 1;
                        }
                        else if (answer.newTitle == "Sales Lead") {
                            role_id = 2;
                        }
                        else if (answer.newTitle == "Lead Engineer") {
                            role_id = 3;
                        }
                        else if (answer.newTitle == "Software Engineer") {
                            role_id = 4;
                        }
                        else if (answer.newTitle == "Finance Lead") {
                            role_id = 5;
                        }
                        else if (answer.newTitle == "Accounting") {
                            role_id = 6;
                        }
                        else if (answer.newTitle == "Lawyer") {
                            role_id = 6;
                        }
                        else if (answer.newTitle == "Legal Team") {
                            role_id = 6;
                        }

                        connection.query("UPDATE employee SET role_id = ? WHERE id=?",
                            [role_id, answer.employee],
                            function (err, result) {
                                if (err) throw err;

                                console.log("=== Updated Employee ===");
                                start();
                            })
                    });
            })
        }
