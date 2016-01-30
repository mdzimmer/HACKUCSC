var Group_Manager = require('./groupManager');


var Background = function (game, baseX, baseY, hRatio, vRatio, income, type) {
    Phaser.Sprite.call(this, game, baseX * hRatio * game.width, baseY * vRatio * game.height, 'background');
    game.add.existing(this);
    this.hRatio = hRatio;
    this.vRatio = vRatio;
    this.group_manager = new Group_Manager(this.game)
   	this.type = type;
    this.incomeLevel = income;
};

Background.prototype = Object.create(Phaser.Sprite.prototype);
Background.prototype.constructor = Background;

Background.prototype.getVars = function() {
    //return x & y and width & height of visible
    return [this.x, this.y, this.hRatio * this.game.width, this.vRatio * this.game.height];
};

Background.prototype.getVarsCenter = function() {
    // //return x & y of center and width & height of visible
    var visWidth = x + this.hRatio * this.game.width;
    var visHeight = y + this.vRatio * this.game.height;
    return [(this.x + visWidth) / 2, (this.y + visHeight) / 2, visWidth, visHeight];
};

Background.prototype.update = function(ratio) {
    if (this.)
};



module.exports = Background;