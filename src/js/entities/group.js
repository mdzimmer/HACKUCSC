//controls flocking for a group of person objects
var util = require('../utils');

var Group = function (game, centerX, centerY, state) {
	this.game = game;
	this.members = [];
	this.minDist = 20;
	//this.noise = 10;
	this.center = {x : centerX, y : centerY};
	this.clickDist = 50;
	this.selected = false;
	this.selection = this.game.add.sprite(this.center.x, this.center.y, 'selection');
	this.selection.anchor.setTo(0.5, 0.5);
	this.selection.width = 100;
	this.selection.height = 100;
	this.selection.visible = false;
	this.velocity = {x : 0, y : 0};
	this.speed = .05;
	this.state = state;
	this.book = this.game.add.sprite(this.center.x, this.center.y, 'book');
	this.book.anchor.setTo(0.5, 0.5);
	this.book.width = 25;
	this.book.height = 25;
	this.book.visible = false;
	this.learningTime = .01;
    this.hover = false;
    this.lock = this.game.add.sprite(this.center.x, this.center.y, 'lock');
	this.lock.anchor.setTo(0.5, 0.5);
	this.lock.width = 25;
	this.lock.height = 35;
	this.lock.visible = false;
	this.lockTime = 5;
	this.happinessModifier = 0;
	this.selecionWeight = 1;
	this.minSelectionSize = 10;
	
	this.state.input.onDown.add(this.onInputDown, this);
    this.state.input.addMoveCallback(this.onMove, this);
}
Group.prototype.constructor = Group;
Group.prototype.update = function() {
	// console.log(this.center);
	//update center
	var newX = this.center.x + this.velocity.x * this.speed;
	var newY = this.center.y + this.velocity.y * this.speed;
	this.changeCenter({x : newX, y : newY});
	for (var member in this.members) {
		member = this.members[member];
		var velocity = {x:0, y:0};
		var diff = {x:0, y:0};
		diff.x = this.center.x - member.x;
		diff.y = this.center.y - member.y;
		velocity.x += diff.x;
		velocity.y += diff.y;
		for (var other in this.members) {
			other = this.members[other];
			//ignore self
			if (other === member) {
				continue;
			}
			var oDiff = {x:0, y:0};
			oDiff.x = other.x - member.x;
			oDiff.y = other.y - member.y;
			var totalDist = util.hypotenuse(oDiff.x, oDiff.y);
			if (totalDist <= this.minDist) {
				velocity.x = -1 * oDiff.x;
				velocity.y = -1 * oDiff.y;
				// velocity.x -= oDiff.x;
				// velocity.y -= oDiff.y;
				break;
			}
		}
		// if (util.hypotenuse(velocity.x, velocity.y) < this.minVelocity) {
			// velocity.x = velocity.y = 0;
		// }
		member.velocity = velocity;
	}
	// var furthest = 0;
	// for (var member in this.members) {
	// 	member = this.members[member];
	// 	var dist = util.hypotenuse(this.center.x - member.x, this.center.y - member.y));
	// 	if (dist > furthest) {
	// 		furthest = dist;
	// 	}
	// }
	// var newSelectionSize = furthest * this.selectionWeight;
	// if (newSelectionSize <= this.minSelectionSize) {
	// 	console.log('a');
	// 	newSelectionSize = this.minSelectionSize;
	// }
	// this.selection.width = newSelectionSize;
	// this.selection.height = newSelectionSize;
};
Group.prototype.addMember = function(member) {
	this.members.push(member);
	member.group = this;
};
Group.prototype.onInputDown = function() {
	// console.log('a');
	if (this.selected) {
		// console.log('c');
		// console.log(this.myManager, this.myManager.background);
		var bg = this.myManager.background.myManager.whereClicked();
		// console.log(bg);
		this.myManager.background.myManager.sendTo(this.myManager.background, bg, this);
		this.setSelected(false);
	} else if (this.clicked()) {
		this.click();
	}
};
Group.prototype.startEducation = function() {
	this.learning = false;
	this.book.visible = true;
	this.state.game.time.events.add(Phaser.Timer.SECOND * this.learningTime, this.endEducation, this);
};
Group.prototype.endEducation = function() {
	for (var member in this.members) {
		this.members[member].eduLevel += 1;
	}
	this.learning = false;
	this.book.visible = false;
};
Group.prototype.clicked = function() {
    if (this.members.length == 0) {
        return false;
    }
	var mouseX = this.game.input.x;
	var mouseY = this.game.input.y;
	var diffX = mouseX - this.center.x;
	var diffY = mouseY - this.center.y;
	var totalDiff = util.hypotenuse(diffX, diffY);
	if (totalDiff <= this.clickDist) {
		return true;
	}
	return false;
};
Group.prototype.click = function() {
	if (this.selected) {
        // this.state.hm.groupSelected = false;
		this.setSelected(false);
	} else if (!this.locked) {
        // this.state.hm.groupSelected = true;
		this.setSelected(true);
	}
};
Group.prototype.setSelected = function(newSelected) {
	this.selected = newSelected;
	this.selection.visible = newSelected;
    if (newSelected == true) {
        this.state.hm.groupSelected = this;
    } else {
        if (this.state.hm.groupSelected == this) {
            this.state.hm.groupSelected = null;
        }
    }
};
Group.prototype.changeCenter = function(newCenter) {
	this.selection.x = newCenter.x;
	this.selection.y = newCenter.y;
	this.book.x = newCenter.x;
	this.book.y = newCenter.y;
	this.lock.x = newCenter.x;
	this.lock.y = newCenter.y;
	this.center = newCenter;
};
Group.prototype.numPeople = function() {
	return this.members.length;
};
Group.prototype.lowestEducation = function() {
    var lowest = 3;
    for (var member in this.members) {
        member = this.members[member];
        if (member.eduLevel < lowest) {
            lowest = member.eduLevel;
        }
    }
    return lowest;
};
Group.prototype.averageHappiness = function() {
    var happiness = 0;
    for (var member in this.members) {
        member = this.members[member];
        happiness += member.happiness;
    }
    happiness /= this.members.length;
    return happiness;
};
Group.prototype.averageFatigue = function() {
    var fatigue = 0;
    for (var member in this.members) {
        member = this.members[member];
        fatigue += member.fatigue;
    }
    fatigue /= this.members.length;
    return fatigue;
};
Group.prototype.income = function() {
    var income = 0;
    for (var member in this.members) {
        member = this.members[member];
        income += member.getTax();
    }
    return income;
};
// Group.prototype.happinessChange = function() {
    
// };
// Group.prototype.incomeChange = function() {
    
// };
// Group.prototype.mouseDown = function() {
	
// };
Group.prototype.onMove = function() {
    if (this.members.length == 0) {
        return;
    }
	var mouseX = this.game.input.x;
	var mouseY = this.game.input.y;
    var dist = util.hypotenuse(this.center.x - mouseX, this.center.y - mouseY);
    if (dist <= this.clickDist) {
        if (!this.state.hm.groupSelected || this.state.hm.groupSelected == this) {
            // console.log('a');
            // console.log(this.happinessModifier);
            this.state.hm.showStatic({people : this.numPeople(), education : this.lowestEducation(), happiness : this.averageHappiness(), fatigue : this.averageFatigue(), income : this.income(), happinessModifier : this.happinessModifier}, this.center.x, this.center.y - 50, 100);
            this.hover = true;
        }
    } else {
        if (this.hover) {
            this.hover = false;
            this.state.hm.hide();
        }
        if (this.state.hm.groupSelected == this && this.myManager.background.myManager.whereClicked() != this.myManager.background
            && this.myManager.background.myManager.canTransfer(this.myManager.background, this.myManager.background.myManager.whereClicked(), this)) {
            // console.log('a');
            var bgManager = this.myManager.background.myManager
            var transferType = bgManager.transferType(this.myManager.background, bgManager.whereClicked(), this);
            this.state.hm.showChange(transferType.can, {happinessChange : transferType.happinessChange, incomeChange : transferType.incomeChange}, mouseX, mouseY);
        } else {
            // console.log('b');
            this.state.hm.hide();
        }
    }
};
// Group.prototype.happinessModifier = function() {
//     return this.happinessModifier;
// };
Group.prototype.applyHappiness = function() {
	var flag = false;
	for (var member in this.members) {
		member = this.members[member];
		console.log(member.happiness, this.happinessModifier);
		member.happiness += this.happinessModifier;
		// member.happiness -= 50;
		if (member.happiness > 100) {
			member.happiness = 100;
		} else if (member.happiness <= 0) {
			member.happiness = 0;
			flag = true;
		}
	}
	if (flag) {
		this.getOutOfTown();
	}
};
Group.prototype.addFatigue = function(amt) {
	// console.log(amt);
	if (this.members[0].fatigue <= 0 && amt <= 0) {
		return;
	}
	var flag = false;
	for (var member in this.members) {
		this.members[member].fatigue += amt;
		if (this.members[member].fatigue >= 100) {
			flag = true;
		}
	}
	if (flag) {
		// console.log(this);
		this.getOutOfTown();
		//console.log('fatigue too dam high');
	}
};
Group.prototype.getOutOfTown = function() {
	var newBG = this.myManager.background.myManager.backgroundBy('house', this.myManager.background.incomeLevel);
	if (!newBG) {
		console.log('ERROR');
		return;
	}
	this.myManager.background.myManager.sendTo(this.myManager.background, newBG, this);
	this.lockIt();
}
Group.prototype.lockIt = function() {
    this.locked = true;
    this.lock.visible = true;
	this.state.game.time.events.add(Phaser.Timer.SECOND * this.lockTime, this.endLock, this);
};
Group.prototype.endLock = function() {
    this.locked = false;
    this.lock.visible = false;
};

module.exports = Group;












