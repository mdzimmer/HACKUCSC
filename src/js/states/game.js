var Background_Manager = require('../entities/background_manager');
var Person = require('../entities/person');
var Group = require('../entities/group');
// var GroupManager = require('../entities/groupManager');
var UIBuilder = require('../entities/uiBuilder');
var HoverMenu = require('../entities/hoverMenu');
var Utils = require('../utils');

var Game = function () {
  this.testentity = null;
  //this.flocks = [];
  this.bg_mg = null;
  // this.selectedGroup = null;
  this.money = null;
  this.moneyVal = 0;
  this.curMoney = 500;
  this.moneyUpdateDelay = 0.001;
  this.moneyIncrementing = false;
  this.happinessVal = 0;
  this.curHappiness = 0;
  this.happinessUpdateDelay = 0.001;
  this.happinessIncrementing = false;
  this.taxTime = 3;
  this.taxMod = {low: 1, mid: 1, high: 1};
  this.minHappiness = 50;
	this.fatiguePerTick = 10;
	// this.moneyChangeFading = false;
	this.moneyChangeFadeDelay = 0.01;
	this.moneyChangeFadeRate = 0.025;
	this.moneyChangeHoldDelay = 1;
	this.migrantDelay = 1;
};

module.exports = Game;

Game.prototype = {

  create: function () {
  	console.log('foo2');
	  // console.log(this);
    this.game.stage.backgroundColor = "#ededed";
    this.menu_bg = this.game.add.image(0, 0, 'menu_bg');  
    var x = (this.game.width / 2) - 100;
    var y = (this.game.height / 2) - 50;

    this.bg_mg = new Background_Manager(this.game, this);
	
    //this.input.onDown.add(this.onInputDown, this);
	
	this.money = this.game.add.text(20, 15, '$0');
	this.money.font = "Roboto";
	this.money.fontSize = 24;
	this.money.fill = '#000000';
	this.money.text = '$0';

	this.moneyChange = this.game.add.text(120, 15, '$0');
	this.moneyChange.font = "Roboto";
	this.moneyChange.fontSize = 24;
	this.moneyChange.fill = '#000000';
	this.moneyChange.text = '+$0';
	this.moneyChange.alpha = 0;

	this.uib = new UIBuilder(this);
	this.bar = this.uib.buildProgressBar("growing", this.game.width / 2, 25, 300, 16, 100 - this.minHappiness);
	//this.bar.addValue(100);
	this.happy = this.game.add.sprite(this.game.width * .29, 25, 'happyface');
	this.happy.anchor.setTo(0.5, 0.5);

  // Tax buttons
  this.redTaxLow   = this.game.add.button(this.bg_mg.bgArray[0].getVarsTrue().center.x - 15, 75, 'taxReduce', this.decTaxLow, this);
  this.textTaxLow  = this.game.add.text(this.bg_mg.bgArray[0].getVarsTrue()[0], 78, '$$');
  this.textTaxLow.font = "Roboto";
  this.textTaxLow.fontSize = 18;
  this.addTaxLow   = this.game.add.button(this.bg_mg.bgArray[0].getVarsTrue().center.x + 15, 75, 'taxAdd', this.incTaxLow, this);
  this.redTaxLow.anchor.setTo(.5, .5);
  this.textTaxLow.anchor.setTo(0, .5);
  this.addTaxLow.anchor.setTo(.5, .5);
  this.redTaxMid   = this.game.add.button(this.bg_mg.bgArray[1].getVarsTrue().center.x - 15, 75, 'taxReduce', this.decTaxMid, this);
  this.textTaxMid  = this.game.add.text(this.bg_mg.bgArray[1].getVarsTrue().center.x, 78, '$$');
  this.textTaxMid.font = "Roboto";
  this.textTaxMid.fontSize = 18;
  this.addTaxMid   = this.game.add.button(this.bg_mg.bgArray[1].getVarsTrue().center.x + 15, 75, 'taxAdd', this.incTaxMid, this);
  this.redTaxMid.anchor.setTo(.5, .5);
  this.textTaxMid.anchor.setTo(0, .5);
  this.addTaxMid.anchor.setTo(.5, .5);
  this.redTaxHigh  = this.game.add.button(this.bg_mg.bgArray[2].getVarsTrue().center.x - 15, 75, 'taxReduce', this.decTaxHigh, this);
  this.textTaxHigh = this.game.add.text(this.bg_mg.bgArray[1].getVarsTrue().center.x, 78, '$$');
  this.textTaxHigh.font = "Roboto";
  this.textTaxHigh.fontSize = 18;
  this.addTaxHigh  = this.game.add.button(this.bg_mg.bgArray[2].getVarsTrue().center.x + 15, 75, 'taxAdd', this.incTaxHigh, this);
  this.redTaxHigh.anchor.setTo(.5, .5);
  this.textTaxHigh.anchor.setTo(0, .5);
  this.addTaxHigh.anchor.setTo(.5, .5);

	this.game.time.events.add(Phaser.Timer.SECOND * this.taxTime, this.collectTax, this);
    this.hm = new HoverMenu(this.game, 200, 200, this);
    // this.hm.anchor.setTo(0.5, 1);
	// this.hm.visible = false;
	this.game.time.events.add(Phaser.Timer.SECOND * this.moneyChangeFadeDelay, this.fadeMoneyChange, this);
	// this.game.time.events.add(Phaser.Timer.SECOND * this.migrantDelay, this.spawnMigrant, this);

	this.game.input.keyboard.onPressCallback = this.spawnMigrantNoRepeat;
  // console.log(this.game.input.keyboard);
	this.game.input.keyboard.state = this;
	this.game.input.keyboard.utils = Utils;
  // this.input.addMoveCallback(this.onMouseMove, this);
  this.personGroup = this.game.add.group();
  this.personGroup.z = 5;
  },
  testFun: function() {
  	// console.log('fun');
  		this.spawnMigrantNoRepeat()
  },
  update: function () {
	// this.bg_mg.update();
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
	  this.setHappiness(happiness);
	  happiness -= this.minHappiness;
	  // console.log(happiness);
	  // console.log(happiness);
    this.redTaxLow.x   = this.bg_mg.bgArray[0].getVarsTrue().center.x - 30;
    this.textTaxLow.x  = this.bg_mg.bgArray[0].getVarsTrue().center.x - 15;
    this.addTaxLow.x   = this.bg_mg.bgArray[0].getVarsTrue().center.x + 30;
    this.redTaxMid.x   = this.bg_mg.bgArray[1].getVarsTrue().center.x - 30;
    this.textTaxMid.x  = this.bg_mg.bgArray[1].getVarsTrue().center.x - 15;
    this.addTaxMid.x   = this.bg_mg.bgArray[1].getVarsTrue().center.x + 30;
    this.redTaxHigh.x  = this.bg_mg.bgArray[2].getVarsTrue().center.x - 30;
    this.textTaxHigh.x = this.bg_mg.bgArray[2].getVarsTrue().center.x - 15;
    this.addTaxHigh.x  = this.bg_mg.bgArray[2].getVarsTrue().center.x + 30;

    if (this.curHappiness < this.minHappiness) {
      this.game.state.start('Game_Over');
  	}
  	// console.log(this.moneyChange.alpha);
  },
  
  // onInputDown: function () {
     // var bg = this.bg_mg.whereClicked();
     // var gm = bg.group_manager;
	   // console.log('mouse', this.input.x, this.input.y, 'bg x-y-width-height', bg.x, bg.y, bg.width, bg.height);
     // console.log('gm', gm.center.x, gm.center.y, gm.width, gm.height);
  // },
  // onMouseMove: function () {
    // var here = this.bg_mg.whereClicked();
    // console.log(this.input.x, this.input.y, here.type, here.incomeLevel, here.width, here.height);
  // },
  spawnMigrant: function () {
  	// var newMigrant = new Person(this.game, this.game.width / 2, this.game.height + 15);
  	var newMigrant = new Person(this.game, this.game.width / 2 + Math.random() * 800 - 400, this.game.height + 15);
  	this.game.add.existing(newMigrant);
  	var bg = this.bg_mg.bgArray[6];
  	bg.group_manager.addPerson(newMigrant);
    this.personGroup.add(newMigrant);
  	this.game.time.events.add(Phaser.Timer.SECOND * this.migrantDelay, this.spawnMigrant, this);
  	// console.log(bg)
  },
  spawnMigrantNoRepeat: function () {
  	// console.log(Qthis);
	   var newMigrant = new Person(this.game, this.game.width / 2 + Math.random() * 800 - 400, this.game.height + 15);
  	this.game.add.existing(newMigrant);
  	// console.log(newMigrant);
  	var bg = this.state.bg_mg.bgArray[6];
  	bg.group_manager.addPerson(newMigrant);

  	// console.log(this.utils.ratio(0, 0, 0, .2));
  },
  collectTax: function () {
	  // console.log('collect tax');
	  var taxes = 0;
	  for (var bg in this.bg_mg.bgArray) {
      var diminishing = false;
      var maxNum = 10000;
      var curNum = 0;
      var dimFactor = 1;
      if (bg == 1 || bg == 2) {
        diminishing = true;
        maxNum = this.bg_mg.bgArray[bg - 1];
      }
      for (var group in this.bg_mg.bgArray[bg].group_manager.members) {
	  		// console.log(this.bg_mg.bgArray[bg].group_manager.members[group], this.bg_mg.bgArray[bg].group_manager.members[group].happinessModifier);
			  for (var person in this.bg_mg.bgArray[bg].group_manager.members[group].members) {
				  if (diminishing) {  
            curNum++;
            if (curNum > maxNum) {
              if (curNum > 10) dimFactor = 0;
              else dimFactor = .1 * (10 - curNum);
            }
          }
          if (this.bg_mg.bgArray[bg].group_manager.background.type == 'work') {
            taxes += this.bg_mg.bgArray[bg].group_manager.members[group].members[person].getTax() * dimFactor;
          }
          else {
            taxes += this.bg_mg.bgArray[bg].group_manager.members[group].members[person].getTax();
          }
				  this.bg_mg.bgArray[bg].group_manager.members[group].members[person].ageTick();
			  }
			  if (this.bg_mg.bgArray[bg].group_manager.background.type == 'work') {
			  	this.bg_mg.bgArray[bg].group_manager.members[group].addFatigue(this.fatiguePerTick);
			  } else {
			  	this.bg_mg.bgArray[bg].group_manager.members[group].addFatigue(-1 * this.fatiguePerTick);
			  }
			  if (this.bg_mg.bgArray[bg].group_manager.members[group]) {
			  	// console.log('a');
			  	// console.log(this.bg_mg.bgArray[bg].group_manager.members[group], this.bg_mg.bgArray[bg].group_manager.members[group].happinessModifier);
			  	this.bg_mg.bgArray[bg].group_manager.members[group].applyHappiness();
			  }
		  }
	  }
	  this.addMoney(taxes);
	  this.moneyChange.text = ((taxes >= 0) ? '+' : '-') + '$' + taxes;
	  this.moneyChange.fill = (taxes >= 0) ? '#16fb04' : '#ff0000';
	  this.moneyChange.alpha = 1;
	  this.moneyChangeHold = true;

	  this.game.time.events.add(Phaser.Timer.SECOND * this.taxTime, this.collectTax, this);
  },
  fadeMoneyChange: function () {
  		// console.log(this.moneyChange.alpha);
  		if (this.moneyChangeHold) {
  			this.moneyChangeHold = false;
  			this.game.time.events.add(Phaser.Timer.SECOND * this.moneyChangeHoldDelay, this.fadeMoneyChange, this);
  		} else {
	  		this.moneyChange.alpha -= this.moneyChangeFadeRate;
	  		this.game.time.events.add(Phaser.Timer.SECOND * this.moneyChangeFadeDelay, this.fadeMoneyChange, this);
	  	}
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
  },
  decTaxLow: function () {
    if (this.taxMod.low == 1) {
      this.taxMod.low = .5;
      this.textTaxLow.text = '$';
    }
    else if (this.taxMod.low == 1.5) {
      this.taxMod.low = 1;
      this.textTaxLow.text = '$$';
    }
  },
  incTaxLow: function () {
    if (this.taxMod.low == .5) {
      this.taxMod.low = 1;
      this.textTaxLow.text = '$$';
    }
    else if (this.taxMod.low == 1) {
      this.taxMod.low = 1.5;
      this.textTaxLow.text = '$$$';
    }
  },
  decTaxMid: function () {
    if (this.taxMod.mid == 1) {
      this.taxMod.mid = .5;
      this.textTaxMid.text = '$';
    }
    else if (this.taxMod.mid == 1.5) {
      this.taxMod.mid = 1;
      this.textTaxMid.text = '$$';
    }
  },
  incTaxMid: function () {
    if (this.taxMod.mid == .5) {
      this.taxMod.mid = 1;
      this.textTaxMid.text = '$$';
    }
    else if (this.taxMod.mid == 1) {
      this.taxMod.mid = 1.5;
      this.textTaxMid.text = '$$$';
    }
  },
  decTaxHigh: function () {
    if (this.taxMod.high == 1) {
      this.taxMod.high = .5;
      this.textTaxHigh.text = '$';
    }
    else if (this.taxMod.high == 1.5) {
      this.taxMod.high = 1;
      this.textTaxHigh.text = '$$';
    }
  },
  incTaxHigh: function () {
    if (this.taxMod.high == .5) {
      this.taxMod.high = 1;
      this.textTaxHigh.text = '$$';
    }
    else if (this.taxMod.high == 1) {
      this.taxMod.high = 1.5;
      this.textTaxHigh.text = '$$$';
    }
  }
};













