var Util = require('../utils');
var Group = require('./group');

var GroupManager = function (game, state) {
	this.game = game;
	this.members = [];
	this.state = state;
	this.splitChance = 0.1;
	this.maxSize = 8;
	this.margin = 50;
};
GroupManager.prototype.constructor = GroupManager;
GroupManager.prototype.update = function() {
	// console.log(this.members);
	// console.log(this.center);
	//update bounds
	if (this.background) {
		var vars = this.background.getVarsCenter();
		this.width = vars.width;
		this.height = vars.height;
		this.center = vars.center;
		// console.log(vars);
	} else {
		return;
	}
	//update inter-group movement
	// console.log(Math.random());
	var largest = null;
	var largestSize = 0;
	for (var member in this.members) {
		member = this.members[member];
		var size = member.numPeople();
		if (size >= largestSize) {
			largestSize = size;
			largest = member;
		}
	}
	if (largestSize >= this.maxSize) {
		// console.log('split');
		var newGroup = new Group(this.game, this.center.x, this.center.y, this.state);
		this.addMember(newGroup);
		for (var i = 0; i < largestSize / 2; i++) {
			this.transferPeople(largest, newGroup, largest.members[0]);
		}
	}
	//update member velocity
	// for (var member in this.members) {
	// 	member = this.members[member];
	// 	var velocity = {x : 0, y : 0};
	// 	// console.log(this.center, member.center);
	// 	var diffX = this.center.x - member.center.x;
	// 	var diffY = this.center.y - member.center.y;
	// 	velocity.x = diffX;
	// 	velocity.y = diffY;
	// 	for (var other in this.members) {
	// 		other = this.members[other];
	// 		if (other === member) {
	// 			continue;
	// 		}
	// 		var oDiffx = other.center.x - member.center.x;
	// 		var oDiffy = other.center.y - member.center.y;
	// 		var hyp = Util.hypotenuse(oDiffx, oDiffy);
	// 		//console.log(hyp);
	// 		if (hyp <= this.minDist) {
	// 			// console.log('b', hyp);
	// 			velocity.x = -1 * oDiffx;
	// 			velocity.y = -1 * oDiffy;
	// 			// console.log(velocity);
	// 			if (velocity.x <= 0 && velocity.y <= 0) {
	// 				// console.log('c3');
	// 				// velocity.x = 10 * Math.random - 5;
	// 				// velocity.y = 10 * Math.random - 5;
	// 				member.center.x += 50 * Math.random() - 25;
	// 				member.center.y += 50 * Math.random() - 25;
	// 			}
	// 			break;
	// 		} else {
	// 			// console.log('a');
	// 		}
	// 	}
	// 	member.velocity = velocity;
	// }
	//update members
	for (member in this.members) {
		this.members[member].update();
	}
};
GroupManager.prototype.transfer = function(otherGM, myMember) {
	// var testVals = otherGM.background.getVarsCenter();
	// console.log('transfer to', otherGM.background.type, otherGM.background.incomeLevel, testVals.center.y, testVals.y, testVals.visHeight, testVals.vRatio);
	var index = this.members.indexOf(myMember);
	this.members.splice(index, 1);
	otherGM.addMember(myMember);
};
GroupManager.prototype.transferPeople = function(source, destination, tPerson) {
	var index = source.members.indexOf(tPerson);
	source.members.splice(index, 1);
	destination.addMember(tPerson);
};
GroupManager.prototype.addMember = function(member) {
	this.members.push(member);
	member.myManager = this;
	member.center.x = this.center.x - this.width / 2 + this.margin + (this.width - this.margin) * Math.random();
	member.center.y = this.center.y - this.height / 2 + this.margin + (this.height - this.margin) * Math.random();
	// var smaller = (this.width < this.height) ? this.width : this.height;
	// this.minDist = smaller / this.members.length;
	// this.minDist = smaller / 2;
	// console.log(this.minDist);
	// console.log(this.minDist);
};
GroupManager.prototype.addPerson = function(newPerson) {
	if (this.members.length == 0) {
		// console.log(this.center);
		this.addMember(new Group(this.game, this.center.x, this.center.y, this.state));
		// console.log('new group');
	}
	this.members[0].addMember(newPerson);
};
GroupManager.prototype.numPeople = function() {
	var count = 0;
	for (var member in this.members) {
		member = this.members[member];
		count += member.numPeople();
	}
	return count;
};

module.exports = GroupManager;











