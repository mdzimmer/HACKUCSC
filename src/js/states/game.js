var Player = require('../entities/player');
var Person = require('../entities/person');
var Group = require('../entities/group');
var GroupManager = require('../entities/groupManager');

var Game = function () {
  this.testentity = null;
  this.flocks = [];
};

module.exports = Game;

Game.prototype = {

  create: function () {
	this.game.stage.backgroundColor = "#ffffff";
	  
    var x = (this.game.width / 2) - 100;
    var y = (this.game.height / 2) - 50;

    this.testentity = new Player(this.game, x, y);
    this.testentity.anchor.setTo(0.5, 0.5);

    this.input.onDown.add(this.onInputDown, this);
	
	var testFlock = new Group(this.game, this.game.width / 2 + 100, this.game.height / 2 + 100);
	this.flocks.push(testFlock);
	
	for (var i = 0; i < 10; i++) {
		var testPerson = new Person(this.game, this.game.width/2 + i * 15, this.game.height/2 + i * 15, i);
		this.game.add.existing(testPerson);
		testFlock.addMember(testPerson);
	}
	var groupManager = new GroupManager(this.game);
	groupManager.addMember(testFlock);
  },

  update: function () {
    var x, y, cx, cy, dx, dy, angle, scale;

    x = this.input.position.x;
    y = this.input.position.y;
    cx = this.world.centerX;
    cy = this.world.centerY;

    angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
    this.testentity.angle = angle;

    dx = x - cx;
    dy = y - cy;
    scale = Math.sqrt(dx * dx + dy * dy) / 100;

    this.testentity.scale.x = scale * 0.6;
    this.testentity.scale.y = scale * 0.6;
	
	this.flocks[0].update();
  },

  onInputDown: function () {
    //this.game.state.start('Menu');
	//console.log(this.game.input.x, this.game.input.y);
	if (this.game.input.activePointer.leftButton.isDown) {
		this.flocks[0].click();
	}
  }
};
