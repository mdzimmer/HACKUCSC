var Player = require('../entities/player');
var Background_Manager = require('../entities/background_manager');
var Person = require('../entities/person');
var Group = require('../entities/group');
var GroupManager = require('../entities/groupManager');
var UIBuilder = require('../entities/uiBuilder');

var Game = function () {
  this.testentity = null;
  //this.flocks = [];
  this.bg_mg = null;
  // this.selectedGroup = null;
  this.money = null;
  this.moneyVal = 0;
  this.curMoney = 0;
  this.moneyUpdateDelay = 0.001;
  this.moneyIncrementing = false;
  this.happinessVal = 0;
  this.curHappiness = 0;
  this.happinessUpdateDelay = 0.001;
  this.happinessIncrementing = false;
  this.taxTime = 3;
  this.minHappiness = 50;
};

module.exports = Game;

Game.prototype = {

  create: function () {
	  // console.log(this);
	this.game.stage.backgroundColor = "#ffffff";
	  
    var x = (this.game.width / 2) - 100;
    var y = (this.game.height / 2) - 50;

    this.bg_mg = new Background_Manager(this.game, this);
	
    this.input.onDown.add(this.onInputDown, this);
	
	this.money = this.game.add.text(10, 10, '$0');
	this.money.font = 'VT323';
	this.money.fontSize = 24;
	this.money.fill = '#ffffff';
    this.money.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
	
	this.uib = new UIBuilder(this);
	this.bar = this.uib.buildProgressBar("growing", this.game.width / 2, 25, 300, 25, 100 - this.minHappiness);
	//this.bar.addValue(100);
	this.happy = this.game.add.sprite(this.game.width * .73, 25, 'happyface');
	this.happy.width = 40;
	this.happy.height = 40;
	this.happy.anchor.setTo(0.5, 0.5);
	
	this.game.time.events.add(Phaser.Timer.SECOND * this.taxTime, this.collectTax, this);
  },

  update: function () {
	this.bg_mg.update();
	//this.gm.update();
	this.uib.render();
	var happiness = 0;
	  for (var bg in this.bg_mg.bgArray) {
		  for (var group in this.bg_mg.bgArray[bg].group_manager.members) {
			  for (var person in this.bg_mg.bgArray[bg].group_manager.members[group].members) {
				  happiness += this.bg_mg.bgArray[bg].group_manager.members[group].members[person].happiness;
			  }
		  }
	  }
	  happiness /= this.bg_mg.numPeople();
	  happiness -= this.minHappiness;
	  // console.log(happiness);
	  // console.log(happiness);
	  this.setHappiness(happiness);
  },

  onInputDown: function () {
	 // console.log(this.game.width, this.game.height);
  },
  collectTax: function () {
	  // console.log('collect tax');
	  var taxes = 0;
	  for (var bg in this.bg_mg.bgArray) {
		  for (var group in this.bg_mg.bgArray[bg].group_manager.members) {
			  for (var person in this.bg_mg.bgArray[bg].group_manager.members[group].members) {
				  taxes += this.bg_mg.bgArray[bg].group_manager.members[group].members[person].getTax();
			  }
		  }
	  }
	  this.addMoney(taxes);
	  this.game.time.events.add(Phaser.Timer.SECOND * this.taxTime, this.collectTax, this);
  },
  setHappiness: function (amt) {
	  this.curHappiness = amt;
	  if (!this.happinessIncrementing) {
		  this.game.time.events.add(Phaser.Timer.SECOND * this.happinessUpdateDelay, this.incrementHappiness, this);
		  this.happinessIncrementing = true;
	  }
  },
  incrementHappiness: function () {
	if (this.happinessVal === this.curHappiness) {
		this.happinessIncrementing = false;
		return;
	}
	if (this.curHappiness > this.happinessVal) {
		this.bar.addValue(1);
		this.happinessVal += 1;
	} else if (this.curHappiness < this.happinessVal) {
		this.bar.addValue(-1);
		this.happinessVal -= 1;
	}
	this.game.time.events.add(Phaser.Timer.SECOND * this.happinessUpdateDelay, this.incrementHappiness, this);
  },
  addMoney: function (amt) {
	  this.curMoney += amt;
	  //this.money.text = '$' + newMoney;
	  if (!this.moneyIncrementing) {
		this.game.time.events.add(Phaser.Timer.SECOND * this.moneyUpdateDelay, this.incrementMoney, this);
		this.moneyIncrementing = true;
	  }
  },
  incrementMoney: function () {
	if (this.moneyVal === this.curMoney) {
		this.moneyIncrementing = false;
		return;
	}
	if (this.curMoney > this.moneyVal) {
		this.moneyVal += 1;
	} else if (this.curMoney < this.moneyVal) {
		this.moneyVal -= 1;
	}
	this.money.text = '$' + this.moneyVal;
	this.game.time.events.add(Phaser.Timer.SECOND * this.moneyUpdateDelay, this.incrementMoney, this);
  }
};













