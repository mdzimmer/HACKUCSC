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
		new Background(this.game, 0, 0, .33, .33, Person.EDULEVEL.low , 'work' , state),	// this.bgArray[0] == workLow
		new Background(this.game, 1, 0, .33, .33, Person.EDULEVEL.mid , 'work' , state),	// this.bgArray[1] == workMid
		new Background(this.game, 2, 0, .33, .33, Person.EDULEVEL.high, 'work' , state),	// this.bgArray[2] == workMid
		new Background(this.game, 0, 1, .33, .33, Person.EDULEVEL.low , 'house', state),	// this.bgArray[3] == houseLow
		new Background(this.game, 1, 1, .33, .33, Person.EDULEVEL.mid , 'house', state),	// this.bgArray[4] == houseMid
		new Background(this.game, 2, 1, .33, .33, Person.EDULEVEL.high, 'house', state),	// this.bgArray[5] == houseMid
		new Background(this.game, 0, 2,   1, .33, '',              'unemployed', state)		// this.bgArray[6] == unemployed
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
	
	var test = this.bgArray[6].group_manager;
	var testFlock = new Group(this.game, this.game.width / 2 + 100, this.game.height / 2 + 100, state);
    for (var i = 0; i < 10; i++) {
    	var testPerson = new Person(this.game, this.game.width / 2 + i * 15, this.game.height / 2 + i * 15, i);
    	this.game.add.existing(testPerson);
    	testFlock.addMember(testPerson);
    }
    test.addMember(testFlock);
	// testFlock = new Group(this.game, this.game.width / 2 - 100, this.game.height / 2 + 100, state);
	// for (var i = 0; i < 10; i++) {
    	// var testPerson = new Person(this.game, this.game.width / 2 + i * 15 - 100, this.game.height / 2 + i * 15 + 100, i);
    	// this.game.add.existing(testPerson);
    	// testFlock.addMember(testPerson);
    // }
    // test.addMember(testFlock);
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
	var transType = this.transferType(source, destination, group)
	if (transType.can) {	// Check if they can transfer up
		source.group_manager.transfer(destination.group_manager, group);
		if (transType.educate) {
			group.startEducation();
		}
		this.updateRatios();
		
		var test = destination.getVarsCenter();
		console.log(test);
	}
};
Background_Manager.prototype.transferType = function(source, destination, group) {
	var groupEdu = group.members[0].eduLevel;
	var can = this.canTransfer(source, destination, group);
	var educate = destination.type === 'house' && destination.incomeLevel > groupEdu
	return {can : can, educate : educate};
};
Background_Manager.prototype.canTransfer = function(source, destination, group) {
	// console.log(source, destination, group);
	if (source === null || destination === null) return false;
	var sourceEdu = group.members[0].eduLevel;
	if (destination.type === 'unemployed') {
		return true;
	}
	if (sourceEdu === Person.EDULEVEL.unemployed) {
		if (destination.incomeLevel === Person.EDULEVEL.low && destination.type === 'house') {
			return true;
		}
	} else if (sourceEdu === Person.EDULEVEL.low) {
		if (destination.incomeLevel === Person.EDULEVEL.low) {
			return true;
		} else if (destination.incomeLevel === Person.EDULEVEL.mid) {
			if (destination.type === 'house') {
				return true;
			}
		}
	} else if (sourceEdu === Person.EDULEVEL.mid) {
		if (destination.incomeLevel === Person.EDULEVEL.low) {
			return true;
		} else if (destination.incomeLevel === Person.EDULEVEL.mid) {
			return true;
		} else if (destination.incomeLevel === Person.EDULEVEL.high) {
			if (destination.type === 'house') {
				return true;
			}
		}
	} else if (sourceEdu === Person.EDULEVEL.high) {
		return true;
	}
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
	if (source.type === 'work' && destination.type === 'work') {
		if (source.incomeLevel === Person.EDULEVEL.low) {
			if (destination.incomeLevel === Person.EDULEVEL.mid) return this.bgArray[2];
			else if (destination.incomeLevel === Person.EDULEVEL.high) return this.bgArray[1];
		}
		else if (source.incomeLevel === Person.EDULEVEL.mid) {
			if (destination.incomeLevel === Person.EDULEVEL.low) return this.bgArray[2];
			else if (destination.incomeLevel === Person.EDULEVEL.high) return this.bgArray[0];
		}
		else if (source.incomeLevel === Person.EDULEVEL.high) {
			if (destination.incomeLevel === Person.EDULEVEL.low) return this.bgArray[1];
			else if (destination.incomeLevel === Person.EDULEVEL.mid) return this.bgArray[0];
		}
	}
	else if (source.type === 'house' && destination.type === 'house') {
		if (source.incomeLevel === Person.EDULEVEL.low) {
			if (destination.incomeLevel === Person.EDULEVEL.mid) return this.bgArray[5];
			else if (destination.incomeLevel === Person.EDULEVEL.high) return this.bgArray[4];
		}
		else if (source.incomeLevel === Person.EDULEVEL.mid) {
			if (destination.incomeLevel === Person.EDULEVEL.low) return this.bgArray[5];
			else if (destination.incomeLevel === Person.EDULEVEL.high) return this.bgArray[3];
		}
		else if (source.incomeLevel === Person.EDULEVEL.high) {
			if (destination.incomeLevel === Person.EDULEVEL.low) return this.bgArray[4];
			else if (destination.incomeLevel === Person.EDULEVEL.mid) return this.bgArray[3];
		}
	}
};

Background_Manager.prototype.updateRatios = function() {
	var hRatios = util.ratio(this.bgArray[0].numPeople(), this.bgArray[1].numPeople(), this.bgArray[2].numPeople());
	var employed = 0;
	for (var j = 0; j < 6; j++) {
		employed += this.bgArray[j].group_manager.numPeople();
	}
	var vRatios = util.ratio(this.bgArray[6].group_manager.numPeople(), employed);

	for (var i = 0 in this.bgArray) {
		if (i !== 6) {		// If not unemployed bg
			if (i < 3) {	// If work bg
				this.bgArray[i].newHRatio = hRatios[i];
				this.bgArray[i].newVRatio = vRatios[1] / 2;
			}
			else {			// If house bg
				this.bgArray[i].newHRatio = hRatios[i - 3];
				this.bgArray[i].newVRatio = vRatios[1] / 2;
			}
		}
		else bgArray[i].newVRatio = vRatios[0]; // Unemployed bg
	}
};

Background_Manager.prototype.getDimensions = function(background) {

};

Background_Manager.prototype.update = function() {
	for (var i in this.bgArray) {
		this.bgArray[i].update();
	}
	
	var test = this.bgArray[3].getVarsCenter();
	// console.log(test.center.x, test.center.y);
	// console.log(this.bgArray[3].group_manager.center);
};

module.exports = Background_Manager;