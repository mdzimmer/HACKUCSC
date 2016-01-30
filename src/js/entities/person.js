var Person = function (game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'person');
	this.velocity = {x:0, y:0};
	this.width = 10;
	this.height = 10;
	this.speed = 1;
};
Person.prototype = Object.create(Phaser.Sprite.prototype);
Person.prototype.constructor = Person;
Person.prototype.update = function() {
	this.x += this.velocity.x * this.speed;
	this.y += this.velocity.y * this.speed;
};

module.exports = Person;