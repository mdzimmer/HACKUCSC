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
				this.bgArray[i].tint = 0xed5c5a;
			}
			else if (this.bgArray[i].incomeLevel === Person.EDULEVEL.mid) {
				this.bgArray[i].tint = 0x6ae246;
			}
			else if (this.bgArray[i].incomeLevel === Person.EDULEVEL.high) {
				this.bgArray[i].tint = 0x2b59e2;
			}
		}
		else if (this.bgArray[i].type == 'house') {
			if (this.bgArray[i].incomeLevel === Person.EDULEVEL.low) {
				this.bgArray[i].tint = 0xed8180;
			}
			else if (this.bgArray[i].incomeLevel === Person.EDULEVEL.mid) {
				this.bgArray[i].tint = 0x94ea79;
			}
			else if (this.bgArray[i].incomeLevel === Person.EDULEVEL.high) {
				this.bgArray[i].tint = 0x5476dd;
			}
		}
		else { // Unemployed background
			this.bgArray[i].tint = 0xe7e7e7;
		}
		this.border = 100;
	}
	
	// var test = this.bgArray[6].group_manager;
	// var testFlock = new Group(this.game, this.game.width / 2 + 100, (this.game.height - this.border) / 2 + 100, state);
 //    for (var i = 0; i < 10; i++) {
 //    	var testPerson = new Person(this.game, this.game.width / 2 + i * 15, (this.game.height - this.border) / 2 + i * 15, i);
 //    	this.game.add.existing(testPerson);
 //    	testFlock.addMember(testPerson);
 //    }
 //    test.addMember(testFlock);
	// testFlock = new Group(this.game, this.game.width / 2 - 100, (this.game.height - this.border) / 2 + 100, state);
	// for (var i = 0; i < 10; i++) {
    	// var testPerson = new Person(this.game, this.game.width / 2 + i * 15 - 100, (this.game.height - this.border) / 2 + i * 15 + 100, i);
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
	// console.log('send to', source, destination, group);
	// console.log(destination);
	// console.log(source, destination);
	if (destination === null) {
		return;
	}
	var transType = this.transferType(source, destination, group)
	// console.log(source, destination, group, transType);
	if (transType.can) {	// Check if they can transfer up
		// console.log('can');
		source.group_manager.transfer(destination.group_manager, group, transType.happiness);
		if (transType.educate) {
			group.startEducation();
		}
		if (source.incomeLevel !== destination.incomeLevel) {
			this.updateRatios(destination);
		}
        group.happinessModifier = transType.happinessModifier;
	}
	// console.log(group.happinessModifier);
};
Background_Manager.prototype.numPeople = function() {
	var count = 0;
	for (var i in this.bgArray) {
		count += this.bgArray[i].group_manager.numPeople();
	}
	return count;
};
Background_Manager.prototype.transferType = function(source, destination, group) {
    if (destination == null) {
        return;
    }
	var groupEdu = group.members[0].eduLevel;
	var can = this.canTransfer(source, destination, group);
	// console.log(destination);
	// console.log(destination.type, destination.incomeLevel);
	var educate = (destination.type === 'house' && destination.incomeLevel) > groupEdu;
    var happinessModifier = 0;
    if (destination.type == 'unemployed' && source.type != 'unemployed') {
    	// console.log('unemployment');
        happinessModifier -= 1;
    }
    if (destination.incomeLevel < groupEdu) {
    	// console.log('education');
        happinessModifier -= groupEdu - destination.incomeLevel;
    }
    if (destination.type == 'house') {
    	// console.log('housing');
    	happinessModifier += 1;
    }
    if (destination.type == 'work') {
    	// console.log('tax', destination.incomeLevel, this.state.taxMod.low);
    	if (destination.incomeLevel == 0) {
	    	if (this.state.taxMod.low == .5) {
	    		happinessModifier += 1;
	    	} else if (this.state.taxMod.low == 1) {
	    		
	    	} else if (this.state.taxMod.low == 1.5) {
	    		happinessModifier -= 1;
	    	}
    	} else if (destination.incomeLevel == 1) {
	    	if (this.state.taxMod.mid == .5) {
	    		happinessModifier += 1;
	    	} else if (this.state.taxMod.mid == 1) {
	    		
	    	} else if (this.state.taxMod.mid == 1.5) {
	    		happinessModifier -= 1;
	    	}
    	} else if (destination.incomeLevel == 2) {
	    	if (this.state.taxMod.high == .5) {
	    		happinessModifier += 1;
	    	} else if (this.state.taxMod.high == 1) {

	    	} else if (this.state.taxMod.high == 1.5) {
	    		happinessModifier -= 1;
	    	}
    	}
 	}
 	// console.log(happinessModifier, group.happinessModifier);
    var happinessChange = happinessModifier - group.happinessModifier;
    // console.log(happinessChange, happinessModifier, group.happinessModifier);
    var incomeChange = 0;
    var baseIncome = group.income();
    var newIncome = 0;
    var numPeople = group.numPeople();
    if (destination.type == 'work') {
    	// console.log('tax', destination.incomeLevel, this.state.taxMod.low);
    	if (destination.incomeLevel == 0) {
	    	newIncome += numPeople * Person.INCOMES.low * this.state.taxMod.low;
    	} else if (destination.incomeLevel == 1) {
	    	newIncome += numPeople * Person.INCOMES.mid * this.state.taxMod.mid;
    	} else if (destination.incomeLevel == 2) {
	    	newIncome += numPeople * Person.INCOMES.high * this.state.taxMod.high;
    	}
 	} else if (destination.type == 'home') {
 		if (destination.incomeLevel == 0) {
	    	newIncome -= numPeople * Person.INCOMES.low;
    	} else if (destination.incomeLevel == 1) {
	    	newIncome -= numPeople * Person.INCOMES.mid;
    	} else if (destination.incomeLevel == 2) {
	    	newIncome -= numPeople * Person.INCOMES.high;
    	}
 	}
 	// console.log(newIncome, baseIncome)
 	var incomeChange = newIncome - baseIncome;
 	// console.log(happinessModifier);
	return {can : can, educate : educate, happinessChange : happinessChange, incomeChange : incomeChange, happinessModifier : happinessModifier};
};
Background_Manager.prototype.canTransfer = function(source, destination, group) {
	// console.log(source, destination, group);
	if (source === null || destination === null) return false;
	if (source.type == destination.type && source.incomeLevel == destination.incomeLevel) {
		return false;
	}
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
Background_Manager.prototype.backgroundBy = function(type, incomeLevel) {
	for (var bg in this.bgArray) {
		bg = this.bgArray[bg];
		if (bg.type == type && bg.incomeLevel == incomeLevel) {
			return bg;
		}
	}
	return null;
};

Background_Manager.prototype.whereClicked = function() {
	for (var i in this.bgArray) {
		var curDimensions = this.bgArray[i].getVars();
		var mouseX = this.game.input.x;
		var mouseY = this.game.input.y;
		// if(i == 6) console.log('curDimensions: ' + curDimensions);
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

Background_Manager.prototype.updateRatios = function(destination) {
	if (destination.type === 'work') {
		var hRatios = util.ratio(this.bgArray[0].numPeople(), this.bgArray[1].numPeople(), this.bgArray[2].numPeople());
	}
	else{
		var hRatios = util.ratio(this.bgArray[3].numPeople(), this.bgArray[4].numPeople(), this.bgArray[5].numPeople());
	}
	var employed = 0;
	for (var j = 0; j < 6; j++)
		employed += this.bgArray[j].numPeople();
	var vRatios = util.ratio(this.bgArray[6].numPeople(), employed);
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

Background_Manager.prototype.update = function() {
	for (var i in this.bgArray) {
    	if (this.bgArray[i].incomeLevel === Person.EDULEVEL.mid) {
    		this.bgArray[i].x = this.bgArray[0].getVars()[2];
    	}
    	else if (this.bgArray[i].incomeLevel === Person.EDULEVEL.high) {
    	    this.bgArray[i].x = this.bgArray[1].getVars()[0] + this.bgArray[1].getVars()[2];
    	}
    	this.bgArray[i].y = (this.bgArray[i].baseY * this.bgArray[i].vRatio * (this.game.height - this.border)) + this.border;
		this.bgArray[i].update();
	}
	var test = this.bgArray[3].getVarsCenter();
};

module.exports = Background_Manager;