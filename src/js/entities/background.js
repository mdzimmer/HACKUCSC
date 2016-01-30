var Group_Manager = require('./groupManager');


var Background = function (game, baseX, baseY, hRatio, vRatio, income, type) {
    Phaser.Sprite.call(this, game, baseX * hRatio, baseY * vRatio, 'background');
    game.add.existing(this);
    this.hRatio = hRatio;
    this.vRatio = vRatio;
    this.group_manager = Group_Manager()
   	this.type = type;
    this.incomeLevel = income;
};

Background.prototype = Object.create(Phaser.Sprite.prototype);
Background.prototype.constructor = Background;

Background.prototype.addGroup = function(group) {
    this.groups.push(group);
    this.numPeople += group.members.length;
};

Background.prototype.removeGroup = function(group) {
    var index = this.groups.indexOf(group);
    if (index > -1) {
        this.groups.splice(index, 1);
    }
    this.numPeople -= group.members.length;
};

Background.prototype.getVars = function() {
    //return x & y and width & height of visible
    return [this.x, this.y, hRatio * this.game.width, vRatio * this.game.height];
};

Background.prototype.getVarsCenter = function() {
    //return x & y of center and width & height of visible
    var visWidth = x + hRatio * this.game.width;
    var visHeight = y + vRatio * this.game.height;
    return [(this.x + visWidth) / 2, (this.y + visHeight) / 2, visWidth, visHeight];
};

Background.prototype.myUpdate = function(ratio) {

};



module.exports = Background;