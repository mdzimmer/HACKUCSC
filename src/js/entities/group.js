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
	
	this.state.input.onDown.add(this.onInputDown, this);
}
Group.prototype.constructor = Group;
Group.prototype.update = function() {
	//update center
	var newX = this.center.x + this.velocity.x * this.speed;
	var newY = this.center.y + this.velocity.y * this.speed;
	this.changeCenter({x : newX, y : newY});
	//console.log(this.center);
	//aim towards center then push
	for (var member in this.members) {
		member = this.members[member];
		//if (member.id == '1') { console.log('1', member.velocity); };
		var velocity = {x:0, y:0};
		var diff = {x:0, y:0};
		/*
		diff.x = centerPoint.x - member.x;
		diff.y = centerPoint.y - member.y;
		*/
		diff.x = this.center.x - member.x;
		diff.y = this.center.y - member.y;
		velocity.x += diff.x;
		velocity.y += diff.y;
		//if (member.id == '1') { console.log('2', member.velocity); };
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
				//if (member.id == '1') { console.log(oDiff, totalDist); };
				velocity.x = -1 * oDiff.x;
				velocity.y = -1 * oDiff.y;
				continue;
				//if (member.id == '1') { console.log('3', member.velocity); };
			}
		}
		//add noise
		/*
		velocity.x += Math.random() * this.noise - this.noise / 2;
		velocity.y += Math.random() * this.noise - this.noise / 2;
		*/
		//set new velocity
		//if (member.id == '1') { console.log(member.velocity); };
		member.velocity = velocity;
		//console.log(velocity);
	}
};
Group.prototype.addMember = function(member) {
	this.members.push(member);
};
Group.prototype.onInputDown = function() {
	if (this.clicked()) {
		if (this.selected) {
			var bg = this.myManager.whereClicked();
			this.myManager.background.bg_mg.sendTo(this.myManager.background, bg, this);
			this.setSelected(false);
		} else {
			this.click();
		}
	}
};
Group.prototype.clicked = function() {
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
		this.setSelected(false);
	} else {
		this.setSelected(true);
	}
};
Group.prototype.move = function() {
	var mouseX = this.game.input.x;
	var mouseY = this.game.input.y;
	this.changeCenter({x : mouseX, y : mouseY});
	this.setSelected(false);
	// console.log({x : mouseX, y : mouseY});s
};
Group.prototype.setSelected = function(newSelected) {
	this.selected = newSelected;
	this.selection.visible = newSelected;
};
Group.prototype.changeCenter = function(newCenter) {
	this.selection.x = newCenter.x;
	this.selection.y = newCenter.y;
	this.center = newCenter;
};
Group.prototype.numPeople = function() {
	return this.members.length;
};
Group.prototype.mouseDown = function() {
	
};
/*
Group.prototype.tryMove = function() {
	if (!this.selected) {
		return;
	}
	var newCenter = {x : this.game.input.x, y : this.game.input.y};
	this.changeCenter(newCenter);
};
*/

module.exports = Group;












