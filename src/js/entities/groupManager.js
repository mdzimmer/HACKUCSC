var GroupManager = function (game) {
	this.game = game;
	this.members = [];
	/*
	Phaser.Sprite.call(this, game, x, y, 'person');
	this.velocity = {x:0, y:0};
	this.width = 10;
	this.height = 10;
	this.speed = .05;
	this.id = id;
	*/
};
GroupManager.prototype.constructor = GroupManager;
GroupManager.prototype.update = function() {
	
	/*
	this.x += this.velocity.x * this.speed;
	this.y += this.velocity.y * this.speed;
	//console.log(this.velocity);
	*/
};
GroupManager.prototype.addMember = function(member) {
	this.members.push(member);
};

module.exports = GroupManager;