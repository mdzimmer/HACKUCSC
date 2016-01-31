var Person = function (game, x, y, id) {
	Phaser.Sprite.call(this, game, x, y, 'ages');
	this.frame = 2;
	this.velocity = {x:0, y:0};
	//this.width = 10;
	//this.height = 10;
	this.speed = .05;
	this.id = id;
	this.eduLevel = Person.EDULEVEL.unemployed;
	this.happiness = 70;
    this.fatigue = 0;
    this.happinessModifier = 0;
    this.age = Person.AGE.young;
    this.turnCount = 0;
    this.ageThreshold = 5;
};
Person.prototype = Object.create(Phaser.Sprite.prototype);
Person.prototype.constructor = Person;

Person.EDULEVEL = {
	unemployed : -1,
	low  : 0,
	mid  : 1,
	high : 2
};

Person.INCOMES = {
	low : 10,
	mid : 20,
	high : 30
};

Person.AGE = {
	young : 0,
	adult : 1,
	old : 2
};

Person.prototype.update = function() {
	this.x += this.velocity.x * this.speed;
	this.y += this.velocity.y * this.speed;
	//console.log(this.velocity);
};

Person.prototype.ageTick = function() {
	// this.turnCount += 1;
	// if (this.turnCount >= this.ageThreshold) {
	// 	// console.log('happy birthday');
	// 	if (this.age == 0) {
	// 		this.age = Person.AGE.adult;
	// 		this.frame = 3;
	// 	} else if (this.age == 1) {
	// 		this.age = Person.AGE.old;
	// 		this.frame = 1;
	// 	} else if (this.age == 2) {

	// 	}
	// }
};

Person.prototype.getTax = function() {
	// console.log('get tax', this.group.myManager.background.type);
	if (this.group.myManager.background.type === 'house') {
		if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.low) {
			// console.log(this.group.myManager.background.myManager.state.taxMod.low);
			return -1 * Person.INCOMES.low;
		} else if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.mid) {
			return -2 * Person.INCOMES.mid;
		} else if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.high) {
			return -3 * Person.INCOMES.high;
		}
	} else if (this.group.myManager.background.type === 'work') {
		if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.low) {
			return Person.INCOMES.low * this.group.myManager.background.myManager.state.taxMod.low;
		} else if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.mid) {
			return Person.INCOMES.mid * this.group.myManager.background.myManager.state.taxMod.mid;
		} else if (this.group.myManager.background.incomeLevel === Person.EDULEVEL.high) {
			return Person.INCOMES.high * this.group.myManager.background.myManager.state.taxMod.high;
		}
	}
	return 0;
};

module.exports = Person;