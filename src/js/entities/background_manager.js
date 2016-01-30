//Controls background elements

var Background = require('./background');
var Player = require('./player');
var util = require('../utils');

var Background_Manager = function(game) {
	this.game = game;

	//Create array of backgrounds
	var bgArray = [
		new Background(this.game, 0, 0, 'low', 'work'),												// bgArray[0] == workLow
		new Background(this.game, this.game.width / 3, 0, 'mid', 'work'),							// bgArray[1] == workMid
		new Background(this.game, 2 * this.game.width / 3, 0, 'high', 'work'),						// bgArray[2] == workMid
		new Background(this.game, 0, this.game.height / 3, 'low', 'house'),							// bgArray[3] == houseLow
		new Background(this.game, this.game.width / 3, this.game.height / 3, 'mid', 'house'),			// bgArray[4] == houseMid
		new Background(this.game, 2 * this.game.width / 3, this.game.height / 3, 'high', 'house'),	// bgArray[5] == houseMid
		new Background(this.game, 0, 2 * this.game.height / 3, '', 'unemployed'),					// bgArray[6] == unemployed
	];
	
	this.bgNames = {
		workLow    : bgArray[0],
		workMid    : bgArray[1],
		workHigh   : bgArray[2],
		houseLow   : bgArray[3],
		houseMid   : bgArray[4],
		houseHigh  : bgArray[5],
		unemployed : bgArray[6]
	};
	
	for (var i in bgArray) {
		if (bgArray[i].type == 'work') {
			if (bgArray[i].incomeLevel === 'low') {
				bgArray[i].tint = 0xe2402b;
			}
			else if (bgArray[i].incomeLevel === 'mid') {
				bgArray[i].tint = 0x56e22b;
			}
			else if (bgArray[i].incomeLevel === 'high') {
				bgArray[i].tint = 0x2b59e2;
			}
		}
		else if (bgArray[i].type == 'house') {
			if (bgArray[i].incomeLevel === 'low') {
				bgArray[i].tint = 0xe55340;
			}
			else if (bgArray[i].incomeLevel === 'mid') {
				bgArray[i].tint = 0x6ae246;
			}
			else if (bgArray[i].incomeLevel === 'high') {
				bgArray[i].tint = 0x5476dd;
			}
		}
		else { // Unemployed background
			bgArray[i].tint = 0x939393;
		}
	}
};

Background_Manager.prototype.constructor = Background_Manager;


Background_Manager.prototype.changeWork = function(source, destination, group) {
	
	// canTransfer(source, destination, group) Check if they can transfer up
	
	var index = source.groups.indexOf(group);
	if (index > -1) {
    	source.groups.splice(index, 1);
	}
	destination.groups.push(group);
	source.update(); // Used for changing background size
	destination.update();

	
};

Background_Manager.prototype.changeHouse = function(source, destination, group) {

};


module.exports = Background_Manager;