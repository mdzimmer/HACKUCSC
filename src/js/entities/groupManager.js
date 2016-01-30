var Util = require('../utils');

var GroupManager = function (game) {
	this.game = game;
	this.members = [];
	/*
	this.bound = {
		upper : center.y - height / 2,
		lower : center.y + height / 2,
		left : center.x - width / 2,
		right : center.x + width / 2
	};
	this.width = width;
	this.height = height;
	this.center = center;
	this.minDist = width / 2;
	*/
	/*
	Phaser.Sprite.call(this, game, x, y, 'person');
	this.velocity = {x:0, y:0};
	this.width = 10;
	this.height = 10;
	this.speed = .05;
	this.id = id;
	*/
};
GroupManager.prototype.constructor = GroupManager;
GroupManager.prototype.update = function() {
	//update bounds
	if (this.background) {
		var vars = this.background.getVarsCenter();
		this.width = vars.width;
		this.height = vars.height;
		this.center = vars.center;
	} else {
		return;
	}
	//update member velocity
	for (var member in this.members) {
		member = this.members[member];
		var velocity = {x : 0, y : 0};
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
	if (!(myMember in this.members)) {
		console.log('ERROR', myMember, 'not in', this);
		return;
	}
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
GroupManager.prototype.numPeople = function() {
	var count = 0;
	for (var member in this.members) {
		member = this.members[member];
		count += member.numPeople();
	}
};

module.exports = GroupManager;