//Requiring npm packages
//========================================
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
var CFonts = require("cfonts");

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

//Start application
//========================================
function start() {
    inquirer
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
                    "Update Employee's Role",
                    "Quit"
                ]
        })
        .then(function (answer) {
            // based on their answer, call the function
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

//View all employee's
//========================================
function viewAllEmp() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.department FROM ((employee INNER JOIN roles ON employee.role_id = roles.id) INNER JOIN department ON roles.department_id = department.id)", function (err, result) {
        if (err) throw err;

        console.table(result);
        start();
    });
}

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

//Add new employee
//========================================
function addEmployee() {
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
                name: "title",
                type: "list",
                message: "What is your employee's role?",
                choices:
                    [
                        "Fundraising Manager",
                        "Fundraising Assistant",
                        "Development Manager",
                        "Associate Development Manager",
                        "Lead Advisor",
                        "Associate Advisor",
                        "Marketing Manager",
                        "Associate Marketing Manager"
                    ]
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
                choices: ["Kathy", "Erin", "Paul", "Aubrey", "None"]
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

            connection.query("INSERT INTO roles SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: dept_id
                },
                function (err, result) {
                    if (err) throw err;
                }
            );

            var manager_id;
            if (answer.manager === "Kathy") {
                manager_id = 1;
            }
            else if (answer.manager === "Erin") {
                manager_id = 2;
            }
            else if (answer.manager === "Paul") {
                manager_id = 3;
            }
            else if (answer.manager === "Aubrey") {
                manager_id = 4;
            }
            else if (answer.manager === "None") {
                manager_id = null;
            }

            var role_id;
            if (answer.title === "Salesperson") {
                role_id = 1;
            }
            else if (answer.title === "Sales Lead") {
                role_id = 2;
            }
            else if (answer.title === "Lead Engineer") {
                role_id = 3;
            }
            else if (answer.title === "Software Engineer") {
                role_id = 4;
            }
            else if (answer.title === "Finance Lead") {
                role_id = 5;
            }
            else if (answer.title === "Accountant") {
                role_id = 6;
            }
            else if (answer.title === "Lawyer") {
                role_id = 7;
            }
            else if (answer.title === "Legal Team Lead") {
                role_id = 8;
            }

            connection.query("INSERT INTO employee SET ?",
                {
                    first_name: answer.first,
                    last_name: answer.last,
                    role_id: role_id,
                    manager_id: manager_id
                },
                function (err, result) {
                    if (err) throw err;

                    console.log("=== New Employee Added ===");
                    start();
                }
            );
        });
}

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
                    }
                )

            });
    })
}
