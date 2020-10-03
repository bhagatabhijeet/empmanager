# empmanager
Emp. Manager  is a CLI application to view and manage the departments, roles, and employees

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/bhagatabhijeet/empmanager)
[![GitHub forks](https://img.shields.io/github/forks/bhagatabhijeet/empmanager)](https://github.com/bhagatabhijeet/empmanager/network)
[![GitHub stars](https://img.shields.io/github/stars/bhagatabhijeet/empmanager)](https://github.com/bhagatabhijeet/empmanager/stargazers)

![Welcome Screen](https://github.com/bhagatabhijeet/empmanager/raw/master/readme_assets/welcomescreen.png)

## Table of Contents
- [Description](#description)
- [Demo](#demo)
- [Installation](#installation)
- [Run](#run)
- [Usage](#usage)
- [License](#license)
- [Technical Details and Architecture](#Technical-Details-and-Architecture)
- [Questions](#questions)


## Description
Emp. Manager is a CLI application to view and manage the departments, roles, and employees. 

## Demo
* This is around 12 minutes of end to end demo. Please watch till end for all the operations.
--- 
![Demo](https://github.com/bhagatabhijeet/empmanager/raw/master/readme_assets/empmanagerDemo.gif)

## Installation
To install dependencies, run the following command:
<code>npm install</code>

## Run
To run the application use <code>node app</code> command

## Usage
* You need to have the same DB Schema as used in the application.
* For convinience schema file is provided with the project. The file path is /db/schema.sql

## License
This project is licensed under the MIT license

## Technical Details and Architecture

### Dependencies:
  * boxen
  * cfonts
  * chalk"
  * console.table
  * dotenv
  * inquirer
  * mysql"
### Technical Description
emp.manager uses modular architecture. The app's entry point is app.js.
App.js presents operations menu to the user and on userselection routes to appropriate enitity. The entity JS for example department.js in make use of entity specific ORM to perform the operations.
There are 4 ORM code files in this project
1. deptorm - Department Table ORM
2. roleorm - Role Table ORM
3. emporm - Employee Table ORM

The orm tables in turn make use of Database class defined in database.js to perform Database CRUD operations DMLs and DDL
The architecture diagram below shows the interactions.
![Architecture Diagram](https://github.com/bhagatabhijeet/empmanager/raw/master/readme_assets/architecture.png)


## Questions
If you have any questions you can contact me direct at <bhagat.abhijeet@gmail.com>.
Reach out to me at GitHub : [bhagatabhijeet](https://github.com/bhagatabhijeet)
<br/>![Profile Picture](https://avatars1.githubusercontent.com/u/7333004?v=4)<br/>
[![GitHub followers](https://img.shields.io/github/followers/bhagatabhijeet.svg?style=social&label=Follow)](https://github.com/bhagatabhijeet)
