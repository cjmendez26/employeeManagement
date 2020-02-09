
USE employeeDB;

INSERT INTO department (department)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES 
('Salesperson', 45000, 1),
('Sales Lead', 50000, 1),
('Lead Engineer', 70000, 2),
('Software Engineer', 50000, 2),
('Finance Lead', 45000, 3),
('Accountant', 70000, 3),
('Lawyer', 90000, 4),
('Legal Team Lead', 75000, 4);
   

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Do', 1, NULL),
    ('Jane', 'Do', 2, 1),
    ('Mike', 'Chang', 3, NULL),
    ('Michele', 'Chang', 4, 3),
    ('Paul', 'McCarthy', 5, NULL),
    ('Paula', 'McCarthy', 6, 5),
    ('Carl', 'Jr', 7, NULL),
    ('Carla', 'Jr', 8, 7);
