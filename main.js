const images = [
  'arrow',
  'background',
  'fence',
  'heartSpeechBubble',
  'house',
  'moon',
  'player',
  'present1',
  'skySlice',
]

playground({

  width: 640,
  height: 480,
  scale: 2,

  create: function() {
    images.forEach(imgSlug => {
      this.loadImage(`${imgSlug}.png`)
    })
  },

  ready: function() {
  },

  resize: function() {
  },

  step: function(dt) {
  },

  render: function() {
  },

  keydown: function(data) {
  },

  keyup: function(data) {
  },

  mousedown: function(data) {
  },

  mouseup: function(data) {
  },

  mousemove: function(data) {
  },

  touchstart: function(data) {
  },

  touchend: function(data) {
  },

  touchmove: function(data) {
  },

  gamepaddown: function(data) {
  },

  gamepadup: function(data) {
  },

  gamepadmove: function(data) {
  }

})
