const Source = require('./SourceFile.js');

let file = new Source('data/gen_kinds.json');

console.log(file.getValue(2));