var HoverMenu = function (game, x, y, state) {
	Phaser.Sprite.call(this, game, x, y, 'bordered');
	game.add.existing(this);
	this.x = x;
	this.y = y;
    this.groupSelected = null;
	this.width = 256;
	this.height = 128;
    this.staticWidth = 256;
    this.staticHeight = 128;
    this.changeWidth = 224;
    this.changeHeight = 64;
    this.state = state;
	
	this.staticText = this.game.add.group();
	this.changeText = this.game.add.group();
    this.visible = false;

    this.chevron = this.game.add.sprite(this.x, this.y, 'chevrons');
    this.chevron.anchor.setTo(0.5, 0.5);
    this.chevron.frame = 3;
    this.chevron.y -= this.height;
    this.chevron.x += 25;
    
    // this.state.input.addMoveCallback(this.onInputMove, this);
	
	this.people = this.game.add.text(10, 10, 'People: 0');
	this.people.font = 'Roboto';
	this.people.fontSize = 18;
	this.people.fill = '#000000';
	
	this.education = this.game.add.text(10, 10, 'Education: Low');
	this.education.font = 'Roboto';
	this.education.fontSize = 18;
	this.education.fill = '#000000';
	
	this.happiness = this.game.add.text(10, 10, 'Happiness: %100');
	this.happiness.font = 'Roboto';
	this.happiness.fontSize = 18;
	this.happiness.fill = '#000000';
	
	this.fatigue = this.game.add.text(10, 10, 'Fatigue: %0');
	this.fatigue.font = 'Roboto';
	this.fatigue.fontSize = 18;
	this.fatigue.fill = '#000000';
	
    this.income = this.game.add.text(10, 10, 'Income: $0');
	this.income.font = 'Roboto';
	this.income.fontSize = 18;
	this.income.fill = '#000000';
    
	this.staticText.add(this.people);
	this.staticText.add(this.education);
    this.education.y += 22 * 1;
	this.staticText.add(this.happiness);
    this.happiness.y += 22 * 2;
	this.staticText.add(this.fatigue);
    this.fatigue.y += 22 * 3;
	this.staticText.add(this.income);
    this.income.y += 22 * 4;
    this.staticText.add(this.chevron);
    this.staticText.visible = false;
    this.staticText.x = this.x;
    this.staticText.y = this.y;
	
	this.happinessChange = this.game.add.text(10, 10, 'Happiness =');
	this.happinessChange.font = 'Roboto';
	this.happinessChange.fontSize = 18;
	this.happinessChange.fill = '#000000';
	
	this.incomeChange = this.game.add.text(10, 10, 'Income =');
	this.incomeChange.font = 'Roboto';
	this.incomeChange.fontSize = 18;
	this.incomeChange.fill = '#000000';
    
    this.changeText.add(this.happinessChange);
    this.changeText.add(this.incomeChange);
    this.incomeChange.y += 22 * 1;
    this.changeText.visible = false;
    this.changeText.x = this.x;
    this.changeText.y = this.y;
};
HoverMenu.prototype = Object.create(Phaser.Sprite.prototype);
HoverMenu.prototype.constructor = HoverMenu;
HoverMenu.prototype.update = function() {
	
};
//people, education, happiness, fatigue, income
HoverMenu.prototype.showStatic = function(state, x, y, over) {
    x -= this.width / 2;
    y -= this.height;
	this.people.text = 'People: ' + state.people;
    this.education.text = 'Education: ' + state.education;
    this.happiness.text = 'Happiness: %' + state.happiness;
    this.fatigue.text = 'Fatigue: %' + state.fatigue;
    this.income.text = 'Income: $' + state.income;
    var happinessModifier = state.happinessModifier;
    if (happinessModifier == -3) {
        this.chevron.frame = 0;
    } else if (happinessModifier == -2) {
        this.chevron.frame = 1;
    } else if (happinessModifier == -1) {
        this.chevron.frame = 2;
    } else if (happinessModifier == 0) {
        this.chevron.frame = 3;
    } else if (happinessModifier == 1) {
        this.chevron.frame = 4;
    } else if (happinessModifier == 2) {
        this.chevron.frame = 5;
    } else if (happinessModifier == 3) {
        this.chevron.frame = 6;
    }
    this.staticText.visible = true;
    this.visible = true;
    this.width = this.staticWidth;
    this.height = this.staticHeight;
    this.x = x;
    this.y = y;
    this.staticText.x = x;
    this.staticText.y = y;
    this.adjustStatic(over);
};
//happinessChange, incomeChange
HoverMenu.prototype.showChange = function(can, state, x, y) {
    if (!can) {
        return;
    }
	this.happinessChange.text = 'Happiness change: ' + state.happinessChange;
    this.incomeChange.text = 'Income change: ' + state.incomeChange;
    this.changeText.visible = true;
    this.visible = true;
    this.width = this.changeWidth;
    this.height = this.changeHeight;
    y -= this.height;
    this.x = x;
    this.y = y;
    this.changeText.x = x;
    this.changeText.y = y;
    this.adjustChange();
};
HoverMenu.prototype.adjustStatic = function(over) {
    var maxWidth = this.game.width;
    var maxHeight = this.game.height;
    if (this.y - this.height <= 0) { // over top of screen
        this.y += over;
        this.y += this.height;
        this.staticText.y = this.y;
        this.changeText.y = this.y;
    }
    if (this.x - this.width / 2 < 0) { // over left of screen
        this.x += this.width / 2;
        this.staticText.x = this.x;
        this.changeText.x = this.x;
    } else if (this.x + this.width / 2 > maxWidth) { // over right of screen
        this.x -= this.width / 2;
        this.staticText.x = this.x;
        this.changeText.x = this.x;
    }
};
HoverMenu.prototype.adjustChange = function() {
    var maxWidth = this.game.width;
    var maxHeight = this.game.height;
    if (this.y - this.height <= 0) { // over top of screen
        this.y += this.height;
        this.staticText.y = this.y;
        this.changeText.y = this.y;
    }
    if (this.x + this.width > maxWidth) { // over right of screen
        this.x -= this.width;
        this.staticText.x = this.x;
        this.changeText.x = this.x;
    }
};
HoverMenu.prototype.hide = function() {
	this.staticText.visible = false;
    this.changeText.visible = false;
    this.visible = false;
};
// HoverMenu.prototype.onInputMove = function() {
  // console.log('move');
  
// };

module.exports = HoverMenu;


















