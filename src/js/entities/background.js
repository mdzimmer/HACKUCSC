var Group_Manager = require('./groupManager');


var Background = function (game, baseX, baseY, hRatio, vRatio, income, type, state) {
    Phaser.Sprite.call(this, game, baseX * hRatio * game.width, baseY * vRatio * game.height, 'background');
    game.add.existing(this);
    this.hRatio = hRatio;
    this.vRatio = vRatio;
    this.newHRatio = hRatio;
    this.newVRatio = vRatio;
    this.group_manager = new Group_Manager(this.game, state);
	this.group_manager.background = this;
   	this.type = type;
    this.incomeLevel = income;
	this.state = state
};

Background.prototype = Object.create(Phaser.Sprite.prototype);
Background.prototype.constructor = Background;

Background.prototype.getVars = function() {
    //return x & y and width & height of visible
    return [this.x, this.y, this.hRatio * this.game.width, this.vRatio * this.game.height];
};

Background.prototype.getVarsCenter = function() {
    // //return x & y of center and width & height of visible
    var visWidth = this.hRatio * this.game.width;
    var visHeight = this.vRatio * this.game.height;
    return {width : visWidth, height : visHeight, center : {x : this.x + visWidth / 2, y : this.y + visHeight / 2}};
};

Background.prototype.update = function() {
    if (this.hRatio !== this.newHRatio) {
        if (this.hRatio + .1 < this.newHRatio) this.hRatio += .1;
        else if (this.hRatio - .1 > this.newHRatio) this.hRatio -= .1;
        else this.hRatio = this.newHRatio;
    }
    if (this.vRatio !== this.newVRatio) {
        if (this.vRatio + .1 < this.newVRatio) this.vRatio += .1;
        else if (this.vRatio - .1 > this.newVRatio) this.vRatio -= .1;
        else this.vRatio = this.newVRatio;
    }
	this.group_manager.update();
};



module.exports = Background;