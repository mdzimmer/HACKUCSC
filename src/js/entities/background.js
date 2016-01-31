var Group_Manager = require('./groupManager');
var Person = require('./person');

var Background = function (game, income, type, state) {
    Phaser.Sprite.call(this, game, 0, 0, 'background');
    game.add.existing(this);
    this.group_manager = new Group_Manager(this.game, state);
	this.group_manager.background = this;
   	this.type = type;
    this.incomeLevel = income;
	this.state = state;
    this.anchor.setTo(0.5, 0.5);
};

Background.prototype = Object.create(Phaser.Sprite.prototype);
Background.prototype.constructor = Background;

Background.prototype.getVarsTrue = function() {
    return {width : this.width, height : this.height, center : {x : this.x, y : this.y}};
};

Background.prototype.numPeople = function() {
    return this.group_manager.numPeople();
};

Background.prototype.updateVars = function(vars) {
    // console.log(vars);
    // console.log(this.type, this.incomeLevel, vars.width, vars.height, vars.center);
    this.x = vars.center.x
    this.y = vars.center.y + this.myManager.border;
    this.width = vars.width;
    this.height = vars.height;
    this.group_manager.updateVars();
};

Background.prototype.update = function() {
    this.group_manager.update();
};



module.exports = Background;