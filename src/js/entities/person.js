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
			console.log(this.group.myManager.background.myManager.state.taxMod.low);
			return -10;
		} else if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.mid) {
			return -20;
		} else if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.high) {
			return -30;
		}
	} else if (this.group.myManager.background.type === 'work') {
		if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.low) {
			return 10 * this.group.myManager.background.myManager.state.taxMod.low;
		} else if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.mid) {
			return 20 * this.group.myManager.background.myManager.state.taxMod.mid;
		} else if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.high) {
			return 30 * this.group.myManager.background.myManager.state.taxMod.high;
		}
	}
	return 0;
};

module.exports = Person;