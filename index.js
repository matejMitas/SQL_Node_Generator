/*
Main executable file
@project: SQL Generator
@brief: Main executable file
@author: Matej Mitas
@file: index.js
*/

const Source = require('./file.js');
const Table = require('./table.js');



let file = new Source('data/gen_kinds.json');
console.log(file.getValue(2));