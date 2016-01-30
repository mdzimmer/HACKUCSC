//controls flocking for a group of person objects
var util = require('../utils');

var Group = function (game) {
	this.game = game;
	this.members = [];
	this.minDist = 50;
}
Group.prototype.constructor = Group;
Group.prototype.update = function() {
	//console.log('update');
	//calculate center point
	var centerPoint = {x:0, y:0};
	for (var member in this.members) {
		centerPoint.x += member.x;
		centerPoint.y += member.y;
	}
	centerPoint.x /= this.members.length;
	centerPoint.y /= this.members.length;
	// aim towards center then push
	for (var member in this.members) {
		var velocity = {x:0, y:0};
		var diff = {x:0, y:0};
		diff.x = centerPoint.x - member.x;
		diff.y = centerPoint.y - member.y;
		velocity.x += diff.x;
		velocity.y += diff.y;
		for (var other in this.members) {
			//ignore self
			if (other === member) {
				continue;
			}
			var oDiff = {x:0, y:0};
			oDiff.x = other.x - member.x;
			oDiff.y = other.y - member.y;
			var totalDist = util.hypotenuse(oDiff.x, oDiff.y);
			if (totalDist <= this.minDist) {
				velocity.x += oDiff.x;
				velocity.y += oDiff.y;
			}
		}
		member.velocity = velocity;
	}
};
Group.prototype.addMember = function(member) {
	this.members.push(member);
};

module.exports = Group;