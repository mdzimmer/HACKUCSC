var Util = require('../utils');
var Group = require('./group');

var GroupManager = function (game, state) {
	this.game = game;
	this.members = [];
	this.state = state;
};
GroupManager.prototype.constructor = GroupManager;
GroupManager.prototype.update = function() {
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
	//update member velocity
	for (var member in this.members) {
		member = this.members[member];
		var velocity = {x : 0, y : 0};
		// console.log(this.center, member.center);
		var diffX = this.center.x - member.center.x;
		var diffY = this.center.y - member.center.y;
		velocity.x = diffX;
		velocity.y = diffY;
		for (var other in this.members) {
			other = this.members[other];
			if (other === member) {
				continue;
			}
			var oDiffx = other.center.x - member.center.x;
			var oDiffy = other.center.y - member.center.y;
			var hyp = Util.hypotenuse(oDiffx, oDiffy);
			//console.log(hyp);
			if (hyp <= this.minDist) {
				// console.log('b', hyp);
				velocity.x = -1 * oDiffx;
				velocity.y = -1 * oDiffy;
				break;
			} else {
				// console.log('a');
			}
		}
		member.velocity = velocity;
	}
	//update members
	for (member in this.members) {
		this.members[member].update();
	}
};
GroupManager.prototype.transfer = function(otherGM, myMember) {
	var testVals = otherGM.background.getVarsCenter();
	// console.log('transfer to', otherGM.background.type, otherGM.background.incomeLevel, testVals.center.y, testVals.y, testVals.visHeight, testVals.vRatio);
	var index = this.members.indexOf(myMember);
	this.members.splice(index, 1);
	otherGM.addMember(myMember);
};
GroupManager.prototype.addMember = function(member) {
	this.members.push(member);
	member.myManager = this;
	var smaller = (this.width < this.height) ? this.width : this.height;
	this.minDist = smaller / this.members.length;
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











