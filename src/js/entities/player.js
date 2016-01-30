var Player = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'testsprite');
    game.add.existing(this);
	this.speed = 0.1;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

/**
 * Automatically called by World.update
 */
Player.prototype.update = function() {
	//this.x += this.velocity;
};

module.exports = Player;
