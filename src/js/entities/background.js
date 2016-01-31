var Group_Manager = require('./groupManager');
var Person = require('./person');

// var Background = function (game, baseX, baseY, hRatio, vRatio, income, type, state) {
var Background = function (game, income, type, state) {
    // Phaser.Sprite.call(this, game, (baseX * hRatio * game.width), (baseY * vRatio * game.height) + 100, 'background');
    Phaser.Sprite.call(this, game, 0, 0, 'background');
    game.add.existing(this);
    // this.baseX = baseX;
    // this.baseY = baseY;
    // this.hRatio = hRatio;
    // this.vRatio = vRatio;
    // this.width = hRatio * game.width;
    // this.height = vRatio * game.height;
    // this.newHRatio = hRatio;
    // this.newVRatio = vRatio;
    // this.minRatio = .1;
    this.group_manager = new Group_Manager(this.game, state);
	this.group_manager.background = this;
   	this.type = type;
    this.incomeLevel = income;
	this.state = state
};

Background.prototype = Object.create(Phaser.Sprite.prototype);
Background.prototype.constructor = Background;

// Background.prototype.getVars = function() {
//     //return x & y and width & height of visible
//     return [this.x, this.y, this.hRatio * (this.game.width), this.vRatio * (this.game.height - this.myManager.border)];
// };

// Background.prototype.getVarsCenter = function() {
//     // //return x & y of center and width & height of visible
//     var visWidth = this.hRatio * (this.game.width);
//     var visHeight = this.vRatio * (this.game.height - this.myManager.border);
//     return {width : visWidth, height : visHeight, center : {x : this.x + visWidth / 2, y : this.y + visHeight / 2}};
// };

Background.prototype.getVarsTrue = function() {
    return {width : this.width. height : this.height, center : {x : this.x + this.width / 2, y : this.y + this.width / 2}};
};

Background.prototype.numPeople = function() {
    // var num = this.group_manager.numPeople();
    // if (num === 0) return 1;
    // else return num;
    return this.group_manager.numPeople();
};

Background.prototype.updateVars = function(vars) {
    // console.log(this.type, this.incomeLevel);
    // console.log(this.type, this.incomeLevel, vars)
    this.x = vars.center.x - vars.width / 2;
    this.y = vars.center.y - vars.height / 2 + this.myManager.border;
    this.width = vars.width;
    this.height = vars.height;
    this.group_manager.updateVars();
};

Background.prototype.update = function() {
	// if (this.newHRatio < this.minRatio) this.newHRatio = this.minRatio;
 //    if (this.newVRatio < this.minRatio) this.newVRatio = this.minRatio;
 //    if (this.hRatio !== this.newHRatio) {
 //        if (this.hRatio + .01 < this.newHRatio) this.hRatio += .01;
 //        else if (this.hRatio - .01 > this.newHRatio) this.hRatio -= .01;
 //        else this.hRatio = this.newHRatio;
 //    }
 //    if (this.vRatio !== this.newVRatio) {
 //        if (this.vRatio + .01 < this.newVRatio) this.vRatio += .01;
 //        else if (this.vRatio - .01 > this.newVRatio) this.vRatio -= .01;
 //        else this.vRatio = this.newVRatio;
 //    }
 //    if (this.type === 'unemployed')
 //        this.hRatio = 1;
    this.group_manager.update();
};



module.exports = Background;