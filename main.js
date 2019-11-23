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

const gameDimensions = {
  width: 1024,
  height: 768,
}

const state = {
  world: {
    background: {
      imageWidth: 4734,
      tileWidth: gameDimensions.width,
      x: gameDimensions.width * -1
    },
  },
  player: {
    x: 0,
    y: 0,
    speed: 3,
  },
  presentsInAir: [],
  houses: [],
}

const houseQueueX = state.houses.length * -1

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
  // Presents go down.
  state.presentsInAir.forEach(present => {
    present.y += present.velocities.y
  })

  // World moves.
  state.world.background.x += state.player.speed / 2 // "Parallax" effect is achieved with this, because the houses will move at the speed of the player.
  if (state.world.background.x > gameDimensions.width / state.world.background.imageWidth) {
    state.world.background.x = gameDimensions.width * -1
  }

  // Move houses.
  state.houses.forEach(house => {
    house.x += state.player.speed

    // Move house to the "beginning"? Recycling! :)
    if (house.x > gameDimensions.width) {
      house.x = gameDimensions.width * -1
    }
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
    // Create our array of houses.
    const amountOfHouses = 4
    for (let i = 0; i < amountOfHouses; i++) {
      state.houses.push({
        x: houseQueueX - (i * this.width / 2),
        happy: false,
      })
    }
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

    // Draw the background.
    this.layer.drawImage(this.images.background, state.world.background.x, 640, this.width * 2, 150)

    // Draw presents in the air.
    // @todo

    // Draw houses.
    state.houses.forEach(house => {
      this.layer.drawImage(this.images.house, house.x, 580, this.width / 5, 190)
    })
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
