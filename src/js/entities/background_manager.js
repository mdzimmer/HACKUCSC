//Controls background elements

var Background = require('./background');
var Person = require('./person');
var util = require('../utils');

var Group = require('./group');

var Background_Manager = function(game, state) {
	this.game = game;
	this.state = state;

	//Create array of backgrounds
	this.bgArray = [
		new Background(this.game, 0, 0, .33, .33, Person.EDULEVEL.low, 'work', state),		// this.bgArray[0] == workLow
		new Background(this.game, 1, 0, .33, .33, Person.EDULEVEL.mid, 'work', state),		// this.bgArray[1] == workMid
		new Background(this.game, 2, 0, .33, .33, Person.EDULEVEL.high, 'work', state),	// this.bgArray[2] == workMid
		new Background(this.game, 0, 1, .33, .33, Person.EDULEVEL.low, 'house', state),	// this.bgArray[3] == houseLow
		new Background(this.game, 1, 1, .33, .33, Person.EDULEVEL.mid, 'house', state),	// this.bgArray[4] == houseMid
		new Background(this.game, 2, 1, .33, .33, Person.EDULEVEL.high, 'house', state),	// this.bgArray[5] == houseMid
		new Background(this.game, 0, 2, .33, .33, '', 'unemployed', state),				// this.bgArray[6] == unemployed
	];
	for (bg in this.bgArray) {
		this.bgArray[bg].myManager = this;
	}
	
	for (var i in this.bgArray) {
		if (this.bgArray[i].type == 'work') {
			if (this.bgArray[i].incomeLevel === Person.EDULEVEL.low) {
				this.bgArray[i].tint = 0xe2402b;
			}
			else if (this.bgArray[i].incomeLevel === Person.EDULEVEL.mid) {
				this.bgArray[i].tint = 0x56e22b;
			}
			else if (this.bgArray[i].incomeLevel === Person.EDULEVEL.high) {
				this.bgArray[i].tint = 0x2b59e2;
			}
		}
		else if (this.bgArray[i].type == 'house') {
			if (this.bgArray[i].incomeLevel === Person.EDULEVEL.low) {
				this.bgArray[i].tint = 0xe55340;
			}
			else if (this.bgArray[i].incomeLevel === Person.EDULEVEL.mid) {
				this.bgArray[i].tint = 0x6ae246;
			}
			else if (this.bgArray[i].incomeLevel === Person.EDULEVEL.high) {
				this.bgArray[i].tint = 0x5476dd;
			}
		}
		else { // Unemployed background
			this.bgArray[i].tint = 0x939393;
		}
	}
	
	var test = this.bgArray[0].group_manager;
	var testFlock = new Group(this.game, this.game.width / 2 + 100, this.game.height / 2 + 100, state);
    //this.flocks.push(testFlock);
    for (var i = 0; i < 10; i++) {
    	var testPerson = new Person(this.game, this.game.width / 2 + i * 15, this.game.height / 2 + i * 15, i);
    	this.game.add.existing(testPerson);
    	testFlock.addMember(testPerson);
    }
    test.addMember(testFlock);
	testFlock = new Group(this.game, this.game.width / 2 - 100, this.game.height / 2 + 100, state);
	for (var i = 0; i < 10; i++) {
    	var testPerson = new Person(this.game, this.game.width / 2 + i * 15 - 100, this.game.height / 2 + i * 15 + 100, i);
    	this.game.add.existing(testPerson);
    	testFlock.addMember(testPerson);
    }
	//this.flocks.push(testFlock);
    test.addMember(testFlock);
	
};

Background_Manager.prototype.constructor = Background_Manager;

/*Background_Manager.BGNAMES = {
		workLow    : this.bgArray[0],
		workMid    : this.bgArray[1],
		workHigh   : this.bgArray[2],
		houseLow   : this.bgArray[3],
		houseMid   : this.bgArray[4],
		houseHigh  : this.bgArray[5],
		unemployed : this.bgArray[6]
};*/

Background_Manager.prototype.sendTo = function(source, destination, group) {
	if (this.canTransfer(source, destination, group)) {	// Check if they can transfer up
		source.group_manager.transfer(destination.group_manager, group);
		
		// var ratio = util.ratio(source.numPeople, destination.numPeople, findOther(source, destination).numPeople);
		// source.myUpdate(ratio);							// Used for changing background size
		// destination.myUpdate(ratio);
	}
};

Background_Manager.prototype.canTransfer = function(source, destination, group) {
	if (source === null || destination === null) return false;
	else if (destination.type === 'work' && group.members[0].eduLevel >= destination.incomeLevel) return true;
	else if (destination.type === 'house') {
		if (group.members[0].eduLevel === Person.EDULEVEL.low && destination.incomeLevel === Person.EDULEVEL.high) return false;
		else return true;
	}
	else if (destination.type === 'unemployed') return true;
	return false;
};

Background_Manager.prototype.whereClicked = function() {
	for (var i in this.bgArray) {
		var curDimensions = this.bgArray[i].getVars();
		var mouseX = this.game.input.x;
		var mouseY = this.game.input.y;
		if (mouseX > curDimensions[0] && mouseX <= curDimensions[0] + curDimensions[2]) {
			if (mouseY > curDimensions[1] && mouseY <= curDimensions[1] + curDimensions[3]) {
				return this.bgArray[i];
			}
		}
	}
	return null;
};

Background_Manager.prototype.findOther = function(source, destination) {
	/*if (source.type === 'work' && destination.type === 'work') {
		if (source.incomeLevel === 'low') {
			if (destination.incomeLevel === 'mid') return this.bgNames.workHigh;
			else if (destination.incomeLevel === 'high') return this.bgNames.workMid;
		}
		else if (source.incomeLevel === 'mid') {
			if (destination.incomeLevel === 'low') return this.bgNames.workHigh;
			else if (destination.incomeLevel === 'high') return this.bgNames.workLow;
		}
		else if (source.incomeLevel === 'high') {
			if (destination.incomeLevel === 'low') return this.bgNames.workMid;
			else if (destination.incomeLevel === 'mid') return this.bgNames.workLow;
		}
	}
	else if (source.type === 'house' && destination.type === 'house') {
		if (source.incomeLevel === 'low') {
			if (destination.incomeLevel === 'mid') return this.bgNames.houseHigh;
			else if (destination.incomeLevel === 'high') return this.bgNames.houseMid;
		}
		else if (source.incomeLevel === 'mid') {
			if (destination.incomeLevel === 'low') return this.bgNames.houseHigh;
			else if (destination.incomeLevel === 'high') return this.bgNames.houseLow;
		}
		else if (source.incomeLevel === 'high') {
			if (destination.incomeLevel === 'low') return this.bgNames.houseMid;
			else if (destination.incomeLevel === 'mid') return this.bgNames.houseLow;
		}
	}*/
};

Background_Manager.prototype.getDimensions = function(background) {

};

// Background_Manager.prototype.update = function() {
	// for (var i in this.bgArray) {
		// this.bgArray[i].update();
	// }
// };

module.exports = Background_Manager;