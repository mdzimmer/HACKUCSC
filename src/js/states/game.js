var Player = require('../entities/player');
var Background_Manager = require('../entities/background_manager');
var Person = require('../entities/person');
var Group = require('../entities/group');
var GroupManager = require('../entities/groupManager');
var UIBuilder = require('../entities/uiBuilder');
var HoverMenu = require('../entities/hoverMenu');

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
  this.taxMod = {low: 1, mid: 1, high: 1};
  this.minHappiness = 50;
	this.fatiguePerTick = 1;
};

module.exports = Game;

Game.prototype = {

  create: function () {
  	// console.log('fooff');
	  // console.log(this);
	this.game.stage.backgroundColor = "#ffffff";
	  
    var x = (this.game.width / 2) - 100;
    var y = (this.game.height / 2) - 50;

    this.bg_mg = new Background_Manager(this.game, this);
	
    this.input.onDown.add(this.onInputDown, this);
	
	this.money = this.game.add.text(10, 10, '$0');
	this.money.font = 'VT323';
	this.money.fontSize = 24;
	this.money.fill = '#000000';
	this.uib = new UIBuilder(this);
	this.bar = this.uib.buildProgressBar("growing", this.game.width / 2, 25, 300, 25, 100 - this.minHappiness);
	//this.bar.addValue(100);
	this.happy = this.game.add.sprite(this.game.width * .73, 25, 'happyface');
	this.happy.width = 40;
	this.happy.height = 40;
	this.happy.anchor.setTo(0.5, 0.5);

  // Tax buttons
  this.redTaxLow   = this.game.add.button(this.bg_mg.bgArray[0].getVarsCenter().center.x - 15, 75, 'taxReduce', this.decTaxLow, this);
  this.textTaxLow  = this.game.add.text(this.bg_mg.bgArray[0].getVarsCenter().center.x, 55, 'Med');
  this.addTaxLow   = this.game.add.button(this.bg_mg.bgArray[0].getVarsCenter().center.x + 15, 75, 'taxAdd', this.incTaxLow, this);
  this.redTaxLow.anchor.setTo(.5, .5);
  this.textTaxLow.anchor.setTo(.5, .5);
  this.addTaxLow.anchor.setTo(.5, .5);
  this.redTaxMid   = this.game.add.button(this.bg_mg.bgArray[1].getVarsCenter().center.x - 15, 75, 'taxReduce', this.decTaxMid, this);
  this.textTaxMid  = this.game.add.text(this.bg_mg.bgArray[1].getVarsCenter().center.x, 55, 'Med');
  this.addTaxMid   = this.game.add.button(this.bg_mg.bgArray[1].getVarsCenter().center.x + 15, 75, 'taxAdd', this.incTaxMid, this);
  this.redTaxMid.anchor.setTo(.5, .5);
  this.textTaxMid.anchor.setTo(.5, .5);
  this.addTaxMid.anchor.setTo(.5, .5);
  this.redTaxHigh  = this.game.add.button(this.bg_mg.bgArray[2].getVarsCenter().center.x - 15, 75, 'taxReduce', this.decTaxHigh, this);
  this.textTaxHigh = this.game.add.text(this.bg_mg.bgArray[1].getVarsCenter().center.x, 55, 'Med');
  this.addTaxHigh  = this.game.add.button(this.bg_mg.bgArray[2].getVarsCenter().center.x + 15, 75, 'taxAdd', this.incTaxHigh, this);
  this.redTaxHigh.anchor.setTo(.5, .5);
  this.textTaxHigh.anchor.setTo(.5, .5);
  this.addTaxHigh.anchor.setTo(.5, .5);

	this.game.time.events.add(Phaser.Timer.SECOND * this.taxTime, this.collectTax, this);
    this.hm = new HoverMenu(this.game, 200, 200, this);
    // this.hm.anchor.setTo(0.5, 1);
	// this.hm.visible = false;
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
    this.redTaxLow.x   = this.bg_mg.bgArray[0].getVarsCenter().center.x - 15;
    this.textTaxLow.x  = this.bg_mg.bgArray[0].getVarsCenter().center.x;
    this.addTaxLow.x   = this.bg_mg.bgArray[0].getVarsCenter().center.x + 15;
    this.redTaxMid.x   = this.bg_mg.bgArray[1].getVarsCenter().center.x - 15;
    this.textTaxMid.x  = this.bg_mg.bgArray[1].getVarsCenter().center.x;
    this.addTaxMid.x   = this.bg_mg.bgArray[1].getVarsCenter().center.x + 15;
    this.redTaxHigh.x  = this.bg_mg.bgArray[2].getVarsCenter().center.x - 15;
    this.textTaxHigh.x = this.bg_mg.bgArray[2].getVarsCenter().center.x;
    this.addTaxHigh.x  = this.bg_mg.bgArray[2].getVarsCenter().center.x + 15;
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
				  this.bg_mg.bgArray[bg].group_manager.members[group].members[person].ageTick();
			  }
			  if (this.bg_mg.bgArray[bg].group_manager.background.type == 'work') {
			  	this.bg_mg.bgArray[bg].group_manager.members[group].addFatigue(this.fatiguePerTick);
			  } else {
			  	this.bg_mg.bgArray[bg].group_manager.members[group].addFatigue(-1 * this.fatiguePerTick);
			  }
			  if (this.bg_mg.bgArray[bg].group_manager.members[group]) {
			  	this.bg_mg.bgArray[bg].group_manager.members[group].applyHappiness();
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
		this.moneyVal += 5;
	} else if (this.curMoney < this.moneyVal) {
		this.moneyVal -= 5;
	}
	this.money.text = '$' + this.moneyVal;
	this.game.time.events.add(Phaser.Timer.SECOND * this.moneyUpdateDelay, this.incrementMoney, this);
  },
  decTaxLow: function () {
    if (this.taxMod.low == 1) {
      this.taxMod.low = .5;
      this.textTaxLow.text = 'Low';
    }
    else if (this.taxMod.low == 1.5) {
      this.taxMod.low = 1;
      this.textTaxLow.text = 'Med';
    }
  },
  incTaxLow: function () {
    if (this.taxMod.low == .5) {
      this.taxMod.low = 1;
      this.textTaxLow.text = 'Med';
    }
    else if (this.taxMod.low == 1) {
      this.taxMod.low = 1.5;
      this.textTaxLow.text = 'High';
    }
  },
  decTaxMid: function () {
    if (this.taxMod.mid == 1) {
      this.taxMod.mid = .5;
      this.textTaxMid.text = 'Low';
    }
    else if (this.taxMod.mid == 1.5) {
      this.taxMod.mid = 1;
      this.textTaxMid.text = 'Med';
    }
  },
  incTaxMid: function () {
    if (this.taxMod.mid == .5) {
      this.taxMod.mid = 1;
      this.textTaxMid.text = 'Med';
    }
    else if (this.taxMod.mid == 1) {
      this.taxMod.mid = 1.5;
      this.textTaxMid.text = 'High';
    }
  },
  decTaxHigh: function () {
    if (this.taxMod.high == 1) {
      this.taxMod.high = .5;
      this.textTaxHigh.text = 'Low';
    }
    else if (this.taxMod.high == 1.5) {
      this.taxMod.high = 1;
      this.textTaxHigh.text = 'Med';
    }
  },
  incTaxHigh: function () {
    if (this.taxMod.high == .5) {
      this.taxMod.high = 1;
      this.textTaxHigh.text = 'Med';
    }
    else if (this.taxMod.high == 1) {
      this.taxMod.high = 1.5;
      this.textTaxHigh.text = 'High';
    }
  }
};













