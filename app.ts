// import * as mysql from "mysql";
const CFonts = require('cfonts');
import boxen, { BorderStyle } from "boxen";
import * as chalk from "chalk";
import { formatWithOptions } from "util";

CFonts.say('Emp.Manager', {
	font: 'block',              // define the font face
	align: 'center',              // define text alignment
	colors: ['red','blue'],         // define all colors
	background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
	letterSpacing: 1,           // define letter spacing
	lineHeight: 1,              // define the line height
	space: true,                // define if the output text should have empty lines on top and on the bottom
	maxLength: '0',             // define how many character can be on one line
	gradient: ['red','blue'],            // define your two gradient colors
	independentGradient: false, // define if you want to recalculate the gradient for each new line
	transitionGradient: false,  // define if this is a transition between colors directly
	env: 'node'                 // define the environment CFonts is being executed in
});

;;


console.log(`
${boxen(`Developer : Abhijeet Bhagat (https://github.com/bhagatabhijeet)
GitHub Repo : https://github.com/bhagatabhijeet/empmanager`,{borderColor:"blueBright",align:"left",padding:2})}`
);
