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
		new Background(this.game, Person.EDULEVEL.low , 'work' , state),	// this.bgArray[0] == workLow
		new Background(this.game, Person.EDULEVEL.mid , 'work' , state),	// this.bgArray[1] == workMid
		new Background(this.game, Person.EDULEVEL.high, 'work' , state),	// this.bgArray[2] == workMid
		new Background(this.game, Person.EDULEVEL.low , 'house', state),	// this.bgArray[3] == houseLow
		new Background(this.game, Person.EDULEVEL.mid , 'house', state),	// this.bgArray[4] == houseMid
		new Background(this.game, Person.EDULEVEL.high, 'house', state),	// this.bgArray[5] == houseMid
		new Background(this.game, '',              'unemployed', state)		// this.bgArray[6] == unemployed
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
			this.bgArray[i].tint = 0x808080;
		}
		// this.border = 100;
	}
	this.border = 100;
	this.minRatio = .2;
	this.updateRatios();
};

Background_Manager.prototype.constructor = Background_Manager;

Background_Manager.prototype.sendTo = function(source, destination, group) {
	if (destination === null) {
		return;
	}
	var transType = this.transferType(source, destination, group)
	// console.log(source, destination, group, transType);
	if (transType.can) {	// Check if they can transfer up
		// console.log('can');
		source.group_manager.transfer(destination.group_manager, group);
		if (transType.educate) {
			group.startEducation();
		}
		this.updateRatios(destination);
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
    if (this.state.curMoney < 0) {
    	happinessModifier -= 1;
    	this.negMoney = true;
    }
    else if (this.negMoney){
    	happinessModifier += 1;
    }
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
	
	var mouseX = this.game.input.x;
	var mouseY = this.game.input.y;
	if (mouseY >= this.border) {
		if (mouseY <= this.bgArray[0].height + this.border) {
			if (mouseX <= this.bgArray[0].width) {
				// console.log('0');
				return this.bgArray[0];
			} else if (mouseX <= this.bgArray[0].width + this.bgArray[1].width) {
				// console.log('1');
				return this.bgArray[1];
			} else {
				// console.log('2');
				return this.bgArray[2];
			}
		} else if (mouseY <= this.bgArray[4].height + this.bgArray[0].height + this.border) {
			if (mouseX <= this.bgArray[0].width) {
				// console.log('3');
				return this.bgArray[3];
			} else if (mouseX <= this.bgArray[0].width + this.bgArray[1].width) {
				// console.log('4');
				return this.bgArray[4];
			} else {
				// console.log('5');
				return this.bgArray[5];
			}
		} else {
			// console.log('6');
			return this.bgArray[6];
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

// Background_Manager.prototype.updateRatios = function(destination) {
	// work 0 - 2 house 3 - 5 unemployed 6
Background_Manager.prototype.updateRatios = function() {
	
	var lowSum = this.bgArray[0].numPeople() + this.bgArray[3].numPeople();
	var midSum = this.bgArray[1].numPeople() + this.bgArray[4].numPeople();
	var highSum = this.bgArray[2].numPeople() + this.bgArray[5].numPeople();
	// console.log('low', lowSum, 'mid', midSum, 'high', highSum);
	var hRatio = util.ratio(lowSum, midSum, highSum, this.minRatio);
	var workSum = this.bgArray[0].numPeople() + this.bgArray[1].numPeople() + this.bgArray[2].numPeople();
	var homeSum = this.bgArray[3].numPeople() + this.bgArray[4].numPeople() + this.bgArray[5].numPeople();
	var unemSum = this.bgArray[6].numPeople();
	var vRatio = util.ratio(workSum, homeSum, unemSum, this.minRatio);
	var gWidth = this.game.width;
	var gHeight = this.game.height - this.border;

	var offsetX = 0;
	var offsetY = 0;
	var workHeight = gHeight * vRatio.a;
	var houseHeight = gHeight * vRatio.b;
	var unemHeight = gHeight * vRatio.c;
	// console.log(gWidth, gHeight, workSum, homeSum, unemSum, hRatio, vRatio);

	var lowWork = {width : gWidth * hRatio.a, height : workHeight, center : null};
	lowWork.center = {x : offsetX + lowWork.width / 2, y : offsetY + workHeight / 2};;
	offsetX += lowWork.width;
	this.bgArray[0].updateVars(lowWork);
	var midWork = {width : gWidth * hRatio.b, height : workHeight, center : null};
	midWork.center = {x : offsetX + midWork.width / 2, y : offsetY + workHeight / 2};
	offsetX += midWork.width;
	this.bgArray[1].updateVars(midWork);
	var highWork = {width : gWidth * hRatio.c, height : workHeight, center : null}
	highWork.center = {x : offsetX + highWork.width / 2, y : offsetY + workHeight / 2};
	offsetX = 0;
	offsetY += workHeight;
	this.bgArray[2].updateVars(highWork);
	var lowHouse = {width : gWidth * hRatio.a, height : houseHeight, center : null};
	lowHouse.center = {x : offsetX + lowHouse.width / 2, y : offsetY + houseHeight / 2};
	offsetX += lowHouse.width;
	this.bgArray[3].updateVars(lowHouse);
	var midHouse = {width : gWidth * hRatio.b, height : houseHeight, center : null};
	midHouse.center = {x : offsetX + midHouse.width / 2, y : offsetY + houseHeight / 2};
	offsetX += midHouse.width;
	this.bgArray[4].updateVars(midHouse);
	var highHouse = {width : gWidth * hRatio.c, height : houseHeight, center : null};
	highHouse.center = {x : offsetX + highHouse.width / 2, y : offsetY + houseHeight / 2};
	offsetY += houseHeight;
	this.bgArray[5].updateVars(highHouse);
	var unemployed = {width : gWidth * 1, height : unemHeight, center : null};
	unemployed.center = {x : unemployed.width / 2, y : offsetY + unemHeight / 2};
	this.bgArray[6].updateVars(unemployed);

};

Background_Manager.prototype.endQuit = function() {
    this.justQuit = false;
};

module.exports = Background_Manager;