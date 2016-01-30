//controls flocking for a group of person objects
var util = require('../utils');

var Group = function (game, centerX, centerY) {
	this.game = game;
	this.members = [];
	this.minDist = 20;
	//this.noise = 10;
	this.center = {x : centerX, y : centerY};
}
Group.prototype.constructor = Group;
Group.prototype.update = function() {
	//console.log('update');
	//calculate center point
	/*
	var centerPoint = {x:0, y:0};
	for (var member in this.members) {
		member = this.members[member];
		centerPoint.x += member.x;
		centerPoint.y += member.y;
	}
	centerPoint.x /= this.members.length;
	centerPoint.y /= this.members.length;
	*/
	// aim towards center then push
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

module.exports = Group;