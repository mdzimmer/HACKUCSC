
var Background = function (game, x, y, income, type) {
    Phaser.Sprite.call(this, game, x, y, 'background');
    game.add.existing(this);
    this.numPeople = 0;
   	this.groups = [];
   	this.type = type;
    this.incomeLevel = null;
    if (income === 'low') {
    	this.incomeLevel = 'low';
    }
    else if (income === 'mid') {
    	this.incomeLevel = 'mid';
    }
    else if (income === 'high') {
    	this.incomeLevel = 'high';
    }
};

Background.prototype = Object.create(Phaser.Sprite.prototype);
Background.prototype.constructor = Background;

Background.prototype.update = function() {
};

module.exports = Background;