var Game_Over = function () {
  this.text = null;
  this.textSmall = null;
};

module.exports = Game_Over;

Game_Over.prototype = {

  create: function () {
    var x = this.game.width / 2;
    var y = this.game.height / 2;

    var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
    var smallStyle = { font: '35px "Lucida Console"', fill: "#ffffff", align: "center" };

    this.text = this.add.text(x - 300, y - 200, "Game Over", style);
    this.textSmall = this.add.text(x - 300, y - 100, "your happiness went under 50%\n" + "click to continue", smallStyle);
    this.game.time.events.add(Phaser.Timer.SECOND * 3, this.doThing, this);
  },

  update: function () {

  },

  doThing: function() {
    this.input.onDown.add(this.onDown, this);
  },

  onDown: function () {
    this.game.state.start(playerState.currentLevel);
  }
};