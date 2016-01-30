var Player = require('../entities/player');
var Background_Manager = require('../entities/background_manager');
var Person = require('../entities/person');
var Group = require('../entities/group');
var GroupManager = require('../entities/groupManager');

var Game = function () {
  this.testentity = null;
  this.flocks = [];
  this.bg_mg = null;
  this.selectedGroup = null;
};

module.exports = Game;

Game.prototype = {

  create: function () {
	this.game.stage.backgroundColor = "#ffffff";
	  
    var x = (this.game.width / 2) - 100;
    var y = (this.game.height / 2) - 50;

    this.bg_mg = new Background_Manager(this.game);
    /*
    this.testentity = new Player(this.game, x, y);
    this.testentity.anchor.setTo(0.5, 0.5);
    */
	
    this.input.onDown.add(this.onInputDown, this);
	
    this.gm = groupManager = new GroupManager(this.game, 600, 600, {x : this.game.width / 2, y : this.game.height / 2});
    var testFlock = new Group(this.game, this.game.width / 2 + 100, this.game.height / 2 + 100);
    this.flocks.push(testFlock);
    for (var i = 0; i < 10; i++) {
    	var testPerson = new Person(this.game, this.game.width / 2 + i * 15, this.game.height / 2 + i * 15, i);
    	this.game.add.existing(testPerson);
    	testFlock.addMember(testPerson);
    }
    groupManager.addMember(testFlock);
	testFlock = new Group(this.game, this.game.width / 2 - 100, this.game.height / 2 + 100);
	for (var i = 0; i < 10; i++) {
    	var testPerson = new Person(this.game, this.game.width / 2 + i * 15 - 100, this.game.height / 2 + i * 15 + 100, i);
    	this.game.add.existing(testPerson);
    	testFlock.addMember(testPerson);
    }
	this.flocks.push(testFlock);
    groupManager.addMember(testFlock);
	// console.log(Person.EduLevel.foo);
	// if (myPerson.eduLevel === Person.EduLevel.low) {
	  
	// }
  },

  update: function () {
  this.bg_mg.update();
	this.gm.update();
  },

  onInputDown: function () {
    //this.game.state.start('Menu');
	//console.log(this.game.input.x, this.game.input.y);
	if (this.game.input.activePointer.leftButton.isDown) {
		if (this.selectedGroup) {
			//console.log('a');
			// this.selectedGroup.move();
			// this.selectedGroup = null;
			var bg = this.bg_mg.whereClicked();
			if (this.bg_mg.canTransfer(bg, this.selectedGroup)) {
				this.bg_mg.sendTo(this.selectedGroup.myManager.background, bg, this.selectedGroup);
			}
			this.selectedGroup = null;
		} else {
			//console.log('b');
			for (flock in this.flocks) {
				flock = this.flocks[flock];
				if (flock.clicked()) {
					flock.click();
					this.selectedGroup = flock;
					break;
				}
			}
		}
	}
  }
};
