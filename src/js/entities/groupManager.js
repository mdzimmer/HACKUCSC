var Util = require('../utils');
var Group = require('./group');

var GroupManager = function (game, state) {
	this.game = game;
	this.members = [];
	this.state = state;
	this.splitChance = 0.1;
	this.maxSize = 2;
	this.margin = 50;
	this.width = 0;
	this.height = 0;
	this.center = {x : 0, y : 0};
};
GroupManager.prototype.constructor = GroupManager;
GroupManager.prototype.update = function() {
	// this.updateVars();
	// console.log(this.members);
	// console.log(this.center);
	//update bounds
	if (this.background) {
		var vars = this.background.getVarsTrue();
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
	//update members
	for (member in this.members) {
		this.members[member].update();
	}
};
GroupManager.prototype.updateVars = function() {
	var vars = this.background.getVarsTrue();
	this.width = vars.width;
	this.height = vars.height;
	this.center = vars.center;
	// console.log(this.background.type, this.background.incomeLevel, vars.width, vars.height, vars.center.x, vars.center.y);
	var leftBound = this.center.x - this.width / 2;
	var rightBound = this.center.x + this.width / 2;
	var upperBound = this.center.y - this.height / 2;
	var lowerBound = this.center.y + this.height / 2;

	// var myBG = this.background;
	// console.log(myBG.type, myBG.incomeLevel, leftBound, rightBound, upperBound, lowerBound)

	for (var member in this.members) {
		member = this.members[member];
		if (member.center.x - this.margin <= leftBound || member.center.x + this.margin >= rightBound || member.center.y - this.margin <= upperBound || member.center.y + this.margin >= lowerBound) {
			// console.log('person', member.center, leftBound, rightBound, upperBound, lowerBound);
			// console.log('group manager', this.center, this.width, this.height);
			member.center.x = this.center.x - this.width / 2 + this.margin + (this.width - this.margin * 2) * Math.random();
			member.center.y = this.center.y - this.height / 2 + this.margin + (this.height - this.margin * 2) * Math.random();
		}
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
	member.center.x = this.center.x - this.width / 2 + this.margin + (this.width - this.margin * 2) * Math.random();
	member.center.y = this.center.y - this.height / 2 + this.margin + (this.height - this.margin * 2) * Math.random();
};
GroupManager.prototype.addPerson = function(newPerson) {
	if (this.members.length == 0) {
		// console.log(this.center);
		this.addMember(new Group(this.game, this.center.x, this.center.y, this.state), true);
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











