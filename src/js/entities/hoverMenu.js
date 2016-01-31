var HoverMenu = function (game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'bordered');
	game.add.existing(this);
	this.x = x;
	this.y = y;
	this.width = 265;
	this.height = 125;
    this.staticWidth = 265;
    this.staticHeight = 125;
    this.changeWidth = 150;
    this.changeHeight = 85;
	
	this.staticText = this.game.add.group();
	this.changeText = this.game.add.group();
	
	this.people = this.game.add.text(10, 10, 'People 0');
	this.people.font = 'VT323';
	this.people.fontSize = 24;
	this.people.fill = '#000000';
	
	this.education = this.game.add.text(10, 10, 'Education Low');
	this.education.font = 'VT323';
	this.education.fontSize = 24;
	this.education.fill = '#000000';
	
	this.happiness = this.game.add.text(10, 10, 'Happiness %100');
	this.happiness.font = 'VT323';
	this.happiness.fontSize = 24;
	this.happiness.fill = '#000000';
	
	this.fatigue = this.game.add.text(10, 10, 'Fatigue %0');
	this.fatigue.font = 'VT323';
	this.fatigue.fontSize = 24;
	this.fatigue.fill = '#000000';
	
    this.income = this.game.add.text(10, 10, 'Income $0');
	this.income.font = 'VT323';
	this.income.fontSize = 24;
	this.income.fill = '#000000';
    
	this.staticText.add(this.people);
	this.staticText.add(this.education);
    this.education.y += 20 * 1;
	this.staticText.add(this.happiness);
    this.happiness.y += 20 * 2;
	this.staticText.add(this.fatigue);
    this.fatigue.y += 20 * 3;
	this.staticText.add(this.income);
    this.income.y += 20 * 4;
    this.staticText.visible = true;
    this.staticText.x = this.x;
    this.staticText.y = this.y;
    this.changeText.x = this.x;
    this.changeText.y = this.y;
	
	this.happinessEffect = this.game.add.text(10, 10, 'Happiness =');
	this.happinessEffect.font = 'VT323';
	this.happinessEffect.fontSize = 24;
	this.happinessEffect.fill = '#000000';
	
	this.incomeEffect = this.game.add.text(10, 10, 'Income =');
	this.incomeEffect.font = 'VT323';
	this.incomeEffect.fontSize = 24;
	this.incomeEffect.fill = '#000000';
    
    this.changeText.add(this.happinessEffect);
    this.changeText.add(this.incomeEffect);
    this.incomeEffect.y += 20 * 1;
    this.changeText.visible = false;
};
HoverMenu.prototype = Object.create(Phaser.Sprite.prototype);
HoverMenu.prototype.constructor = HoverMenu;
HoverMenu.prototype.update = function() {
	
};
//people, education, happiness, fatigue, income
HoverMenu.prototype.showStatic = function(state) {
	this.people.text = 'People ' + state.people;
    this.education.text = 'Education ' + state.education;
    this.happiness.text = 'Happiness %' + state.happiness;
    this.fatigue.text = 'Fatigue %' + state.fatigue;
    this.income.text = 'Income $' + state.income;
    this.staticText.visible = true;
};
//happinessEffect, incomeEffect
HoverMenu.prototype.showChange = function(state) {
	this.happinessEffect.text = 'Happiness =' + state.happinessEffect;
    this.incomeEffect.text = 'Income ' + state.incomeEffect;
    this.changeText.visible = true;
};
HoverMenu.prototype.hide = function() {
	this.staticText.visible = false;
    this.changeText.visible = false;
    this.visible = false;
};

module.exports = HoverMenu;


















