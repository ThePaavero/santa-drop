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
  crashParticles: [],
}

const houseQueueX = state.houses.length * -1

const dropPresent = () => {
  state.presentsInAir.push({
    x: state.player.x + 450,
    y: state.player.y + 40,
    velocities: {
      x: 0,
      y: 3,
    },
  })
}

const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const blowUpPresent = (x, y) => {
  const amountOfPieces = randomBetween(10, 20)
  for (let i = 0; i < amountOfPieces; i++) {
    state.crashParticles.push({
      x,
      y: y - 20,
      width: randomBetween(3, 7),
      height: randomBetween(3, 7),
      velocities: {
        x: randomBetween(-30, 30),
        y: randomBetween(-20, -60),
      },
    })
  }
}

const updateCrashParticles = () => {
  state.crashParticles.forEach(particle => {
    // Gravity.
    particle.velocities.y += 1

    if (particle.velocities.x > 0) {
      particle.velocities.x -= 1
    } else {
      particle.velocities.x += 1
    }

    particle.y += particle.velocities.y
    particle.x += particle.velocities.x

    // Garbage collection.
    if (particle.y + particle.height > gameDimensions.height) {
      state.crashParticles = state.crashParticles.filter(p => p !== particle)
    }
  })
}

const updateState = () => {

  // Presents go down.
  state.presentsInAir.forEach(present => {
    present.y += present.velocities.y
    present.x += present.velocities.x
    present.velocities.y += 0.2
    present.velocities.x += 0.03

    // Remove if it's hit the floor.
    if (present.y > gameDimensions.height) {
      // Make a "splash" first.
      blowUpPresent(present.x, present.y)
      // Then, delete it from our array.
      state.presentsInAir = state.presentsInAir.filter(p => p !== present)
    }
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
      house.happy = false
    }
  })

  // Move the player.
  state.player.x = (gameDimensions.width / 2) - (270)
  state.player.y = 80

  // Process possible crash particles.
  updateCrashParticles()
}

const updateDebugWindow = (state) => {
  document.querySelector('.debugWindow pre').innerHTML = `${JSON.stringify(state, null, 2)}`
}


playground({

  width: gameDimensions.width,
  height: gameDimensions.height,
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

  step: function(dt) {
    updateState()
  },

  render: function() {

    // Clear the canvas.
    this.layer.clear("#000")

    // Draw the sky.
    this.layer.drawImage(this.images.skySlice, 0, 0, this.width, this.height)

    // Draw the background.
    this.layer.drawImage(this.images.background, state.world.background.x, 640, this.width * 2, 150)

    // Draw presents in the air.
    state.presentsInAir.forEach(present => {
      this.layer.drawImage(this.images.present1, present.x, present.y, 20, 20)
    })

    // Draw houses.
    state.houses.forEach(house => {
      this.layer.drawImage(this.images.house, house.x, 580, this.width / 5, 190)
    })

    // Draw the player.
    this.layer.drawImage(this.images.player, state.player.x, state.player.y, this.width / 2, 140)

    // Draw crash particles.
    state.crashParticles.forEach(particle => {
      this.layer.fillStyle('#000')
      this.layer.fillRect(particle.x, particle.y, particle.width, particle.height)
    })

    // Update our debug window.
    updateDebugWindow(state)
  },

  mouseup: function(data) {
    dropPresent()
  },
})
