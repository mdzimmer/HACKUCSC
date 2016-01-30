//Controls background elements

var Background = require('./background');
var Person = require('./person');
var util = require('../utils');

var Background_Manager = function(game) {
	this.game = game;

	//Create array of backgrounds
	this.bgArray = [
		new Background(this.game, 0, 0, .33, .33, Person.EDULEVEL.low, 'work'),		// this.bgArray[0] == workLow
		new Background(this.game, 1, 0, .33, .33, Person.EDULEVEL.mid, 'work'),		// this.bgArray[1] == workMid
		new Background(this.game, 2, 0, .33, .33, Person.EDULEVEL.high, 'work'),	// this.bgArray[2] == workMid
		new Background(this.game, 0, 1, .33, .33, Person.EDULEVEL.low, 'house'),	// this.bgArray[3] == houseLow
		new Background(this.game, 1, 1, .33, .33, Person.EDULEVEL.mid, 'house'),	// this.bgArray[4] == houseMid
		new Background(this.game, 2, 1, .33, .33, Person.EDULEVEL.high, 'house'),	// this.bgArray[5] == houseMid
		new Background(this.game, 0, 2, .33, .33, '', 'unemployed'),				// this.bgArray[6] == unemployed
	];
	
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
	if (canTransfer(source, destination, group)) {	// Check if they can transfer up
		source.group_manager.transfer(destination.group_manager, group);
		
		if (source.type === 'unemployed' || destination.type === unemployed) {
			var hRatio = util.ratio(A, B, other);
			var vRatio = util.ratio(A, B);
		}
		else {
			var ratio = util.ratio(source.group_manager.numPeople(), destination.group_manager.numPeople(), findOther(source, destination).group_manager.numPeople());
			source.myUpdate(ratio);							// Used for changing background size
			destination.myUpdate(ratio);
		}
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

Background_Manager.prototype.getDimensions = function(background) {

};

Background_Manager.prototype.update = function() {
	/*for (var i in this.bgArray) {
		this.bgArray[i].update();
	}*/
};

module.exports = Background_Manager;