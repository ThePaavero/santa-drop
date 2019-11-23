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

const state = {
  world: {
    x: 0,
  },
  player: {
    x: 0,
    y: 0,
  },
  presentsInAir: [],
  houses: [],
}

const dropPresent = () => {
  state.presentsInAir.push({
    x: state.player.x,
    y: state.player.y,
    velocities: {
      x: 0,
      y: 3,
    },
  })
}

const updateState = () => {
  state.presentsInAir.forEach(present => {
    present.y += present.velocities.y
  })
}

playground({

  width: 1024,
  height: 768,
  scale: 1,

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
    updateState()
  },

  render: function() {
    this.layer.clear("#000")

    // Draw the sky.
    this.layer.drawImage(this.images.skySlice, 0, 0, this.width, this.height)

    // Draw presents in the air.
    // @todo
  },

  keydown: function(data) {
  },

  keyup: function(data) {
  },

  mousedown: function(data) {
  },

  mouseup: function(data) {
    dropPresent()
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
