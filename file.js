/*
Handling JSON input files
@project: SQL Generator
@brief: Handling JSON input files
@author: Matej Mitas
@file: file.js
*/

const fs = require('fs');

 
module.exports = class File {
	// we load a JSON file, an directly parse
	// it into JS string
	constructor(path) {
		// try to open the file pointed by a path
		// throw an error if needed
		try {
		  	const fp = fs.readFileSync(path);
		  	// parsing JSON file
		  	this.ctx = JSON.parse(fp);
		  	// length of the file, useful for maximum
		  	// range of ranmun generation
		  	this.len = this.ctx.length;
		  	// creates an empty array with lenght according
		  	// to file content read above, used for preventing
		  	// duplicates in generated code
		  	this.used = new Array(this.len).fill(0);

		} catch (err) {
		  	// Here you get the error when the file was not found,
		  	// but you also get any other error
		  	throw new Error(`Could not open file ${path}`);
		}
	}
	// getter method for particular item in array
	getValue(index) {
		if (this._indexOk(index)) {
			return this.ctx[index];
		}
	}

	// 
	isUsed(index) {
		if (this._indexOk(index)) {
			if (this.used[index]) {
				return true;
			} else {
				return false;
			}
		}
	} 

	//
	addUse(index) {
		if (this._indexOk(index)) {
			this.used[index] = 1;

			if (this.isUsed(index)) {
				throw new Error(`Item on ${index} is already in use`);
			}
		}
	}

	// Helper function for indexing in content
	_indexOk(index) {
		if (index < this.len) {
			return true;
		} else {
			throw new Error(`Can't index with ${index}`);
		}
	}
}
