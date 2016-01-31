var Menu = function () {
  this.text = null;
};

module.exports = Menu;

Menu.prototype = {

  create: function () {
    var x = this.game.width / 2;
    var y = this.game.height / 2;

    var style = { font: "Roboto", fontSize: 64, fill: "#000000", align: "center" };

    this.text = this.add.text(x, y, "Click to Start", style);
    this.text.anchor.setTo(.5, .5);
    this.input.onDown.add(this.onDown, this);
  },

  update: function () {
  },

  onDown: function () {
    this.game.state.start(playerState.currentLevel);
  }
};
