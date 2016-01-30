/*
var util = require('utils');

class group {
	var members = [];
	//var normSpeed = 5;
	var minDist = 50;
	constructor () {
	}
	function addMember(member) {
		members.push(member);
	}
	function updateMembers() {
		//calculate center point
		var centerPoint = {x:0, y:0};
		for (var member in members) {
			centerPoint.x += member.x;
			centerPoint.y += member.y;
		}
		centerPoint.x /= members.length;
		centerPoint.y /= members.length;
		// aim towards center then push
		for (var member in members) {
			var velocity = {x:0, y:0};
			var diff = {x:0, y:0};
			diff.x = centerPoint.x - member.x;
			diff.y = centerPoint.y - member.y;
			velocity.x += diff.x;
			velocity.y += diff.y;
			for (var other in members) {
				//ignore self
				if (other === member) {
					continue;
				}
				var oDiff = {x:0, y:0};
				oDiff.x = other.x - member.x;
				oDiff.y = other.y - member.y;
				var totalDist = util.hypotenuse(oDiff.x, oDiff.y);
				if (totalDist <= minDist) {
					velocity.x += oDiff.x;
					velocity.y += oDiff.y;
				}
			}
			member.velocity = velocity;
		}
	}
}
*/