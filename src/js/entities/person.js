var Person = function (game, x, y, id) {
	Phaser.Sprite.call(this, game, x, y, 'person');
	this.velocity = {x:0, y:0};
	this.width = 10;
	this.height = 10;
	this.speed = .05;
	this.id = id;
	this.eduLevel = Person.EDULEVEL.unemployed;
	this.happiness = 100;
    this.fatigue = 0;
    this.happinessModifier = 0;
    this.fatigue = 0;
};
Person.prototype = Object.create(Phaser.Sprite.prototype);
Person.prototype.constructor = Person;

Person.EDULEVEL = {
	unemployed : -1,
	low  : 0,
	mid  : 1,
	high : 2
};

Person.prototype.update = function() {
	this.x += this.velocity.x * this.speed;
	this.y += this.velocity.y * this.speed;
	//console.log(this.velocity);
};

Person.prototype.getTax = function() {
	// console.log('get tax', this.group.myManager.background.type);
	if (this.group.myManager.background.type === 'house') {
		if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.low) {
			return -1;
		} else if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.mid) {
			return -2;
		} else if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.high) {
			return -3;
		}
	} else if (this.group.myManager.background.type === 'work') {
		if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.low) {
			return 1;
		} else if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.mid) {
			return 2;
		} else if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.high) {
			return 3;
		}
	}
	return 0;
};

Person.prototype.addFatigue = function(amt) {
	this.fatigue += amt;
	if (this.fatigue >= 100) {
		var newBG = this.group.myManager.background.myManager.backgroundBy('house', this.group.myManager.background.incomeLevel);
		if (!newBG) {
			console.log('ERROR');
			return;
		}
		
	}
}

module.exports = Person;