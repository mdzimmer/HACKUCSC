var Preloader = function (game) {
  this.asset = null;
  this.ready = false;
};

module.exports = Preloader;

Preloader.prototype = {

  preload: function () {
    this.asset = this.add.sprite(320, 240, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('testsprite', 'assets/test.png');
    this.load.image('menu_bg', 'assets/menu_bg.png');
    this.load.image('background', 'assets/sectorBG.png')
    this.load.image('person', 'assets/person.png');
    this.load.image('selection', 'assets/selection.png');
    this.load.image('book', 'assets/book.png');
    this.load.image('young', 'assets/young.png');
    this.load.image('adult', 'assets/adult.png');
    this.load.image('old', 'assets/old.png');
    this.load.image('taxReduce', 'assets/taxReduce.png');
    this.load.image('taxAdd', 'assets/taxAdd.png');
    this.load.image('lock', 'assets/lock.png');
    this.load.atlasJSONHash('chevrons', 'assets/chevrons.png', 'assets/chevrons.json');
    this.load.atlasJSONHash('ages', 'assets/ages.png', 'assets/ages.json');
    this.load.image('happyface', 'assets/happyface_better.png');
    this.load.image('bordered', 'assets/bordered.png');
    this.load.image('low_dollar', 'assets/low_dollar.png');
    this.load.image('med_dollar', 'assets/med_dollar.png');
    this.load.image('high_dollar', 'assets/high_dollar.png');
    this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  },

  create: function () {
    this.asset.cropEnabled = false;
  },

  update: function () {
    if (!!this.ready) {
      this.game.state.start('Game');
    }
  },

  onLoadComplete: function () {
    this.ready = true;
  }
};
