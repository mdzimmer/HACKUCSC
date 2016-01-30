var Person = function (game, x, y, id) {
	Phaser.Sprite.call(this, game, x, y, 'person');
	this.velocity = {x:0, y:0};
	this.width = 10;
	this.height = 10;
	this.speed = .05;
	this.id = id;
	this.eduLevel = Person.EDULEVEL.unemployed;
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

module.exports = Person;