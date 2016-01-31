var Person = function (game, x, y, id) {
	Phaser.Sprite.call(this, game, x, y, 'person');
	this.velocity = {x:0, y:0};
	this.width = 10;
	this.height = 10;
	this.speed = .05;
	this.id = id;
	this.eduLevel = Person.EDULEVEL.unemployed;
	this.happiness = 100;
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
//TODO adjust tax by tax rate and happiness
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

module.exports = Person;