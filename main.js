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
    x: gameDimensions.width / 2 - 350,
    y: gameDimensions.width / 5,
    rotation: 0,
    speed: 3,
  },
  presentsInAir: [],
  houses: [],
  crashParticles: [],
  tutorialMode: true,
  tutorialModeArrow: {
    x: 0,
    y: 500,
    velocities: {
      x: 0,
      y: -0.4,
    },
  },
}

setTimeout(() => {
  state.tutorialMode = false
}, 6000)

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
  const amountOfPieces = randomBetween(20, 40)
  for (let i = 0; i < amountOfPieces; i++) {
    let energy = randomBetween(10, 20)
    // Surprise the player with a piece of debris flying really high.
    if (randomBetween(0, 10) === 0) {
      energy = randomBetween(30, 40)
    }
    state.crashParticles.push({
      x,
      y: y - 20,
      width: randomBetween(3, 7),
      height: randomBetween(3, 7),
      velocities: {
        x: randomBetween(energy / 3 * -1, energy / 3),
        y: randomBetween(energy * -1, energy),
      },
    })
  }
}

const updateCrashParticles = () => {
  state.crashParticles.forEach(particle => {
    // Gravity.
    particle.velocities.y += 1

    // Slow the horizontal speed down a bit.
    const inertia = 0.05
    if (particle.velocities.x > 0) {
      particle.velocities.x -= inertia
    } else {
      particle.velocities.x += inertia
    }

    // "World" movement.
    particle.x += state.player.speed

    // Move the particle.
    particle.y += particle.velocities.y
    particle.x += particle.velocities.x

    // Garbage collection.
    if (particle.y + particle.height > gameDimensions.height) {
      state.crashParticles = state.crashParticles.filter(p => p !== particle)
    }
  })
}

const processPresents = () => {
  // Remove any presents that are too high up for anything interesting to happen.
  const ceiling = gameDimensions.height - 20
  const presents = state.presentsInAir.filter(p => p.y < ceiling)
  if (presents.length > 0) {
    // console.log(presents)
  }
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

  // Process possible crash particles.
  updateCrashParticles()

  // See where the presents are landing.
  processPresents()

  // Are we in tutorial mode?
  if (state.tutorialMode) {
    updateTutorialArrow()
  }
}

const updateTutorialArrow = () => {
  const topStop = 450
  const bottomStop = 510
  state.tutorialModeArrow.x += state.player.speed
  state.tutorialModeArrow.y += state.tutorialModeArrow.velocities.y
  let dir = ''
  // state.tutorialModeArrow.velocities.y += 0.05 * (state.tutorialModeArrow.y < 400 ? 1 : -1)
  if (state.tutorialModeArrow.velocities.y === -1 || state.tutorialModeArrow.velocities.y === 1) {
    state.tutorialModeArrow.velocities.y = state.tutorialModeArrow.velocities.y * -1
    dir = state.tutorialModeArrow.velocities.y > 0 ? 'down' : 'up'
  }
  if (state.tutorialModeArrow.y < topStop || state.tutorialModeArrow.y > bottomStop) {
    state.tutorialModeArrow.velocities.y = dir === 'down' ? 2 : -2
    // console.log('state.tutorialModeArrow.velocities.y:', state.tutorialModeArrow.velocities.y)
  }
}


const debugWindowElement = document.querySelector('.debugWindow pre')

const updateDebugWindow = (state) => {
  if (!debugWindowElement) {
    return
  }
  document.querySelector('.debugWindow pre').innerHTML = `${JSON.stringify(state, null, 2)}`
}


playground({

  width: gameDimensions.width,
  height: gameDimensions.height,
  scale: 1,

  create: function () {
    images.forEach(imgSlug => {
      this.loadImage(`${imgSlug}.png`)
    })

    const animationDurationInSeconds = 10
    const easing = 'inOutSine'

    // Move the player around a bit.
    const sway = () => {
      const minX = 100
      const minY = 30
      const maxX = (gameDimensions.width / 2) - 100
      const maxY = gameDimensions.height / 3
      this.tween(state.player)
        .to({
          x: randomBetween(minX, maxX),
          y: randomBetween(minY, maxY),
        }, animationDurationInSeconds, easing)
        .to({
          x: randomBetween(minX, maxX),
          y: randomBetween(minY, maxY),
        }, animationDurationInSeconds, easing)
      setTimeout(sway, animationDurationInSeconds * 1000)
    }
    sway()

    // Rotate faster.
    const rotationRange = 0.02
    this.tween(state.player)
      .to({rotation: rotationRange}, animationDurationInSeconds / 10, easing)
      .to({rotation: rotationRange * -1}, animationDurationInSeconds / 10, easing)
      .loop()
  },

  ready: function () {
    // Create our array of houses.
    const amountOfHouses = 4
    for (let i = 0; i < amountOfHouses; i++) {
      state.houses.push({
        x: houseQueueX - (i * this.width / 2),
        happy: false,
      })
    }
  },

  step: function (dt) {
    updateState()
  },

  render: function () {

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
    // @todo Anchor in the middle of the player before rotating.
    this.layer
      .save()
      .rotate(state.player.rotation)
      .drawImage(this.images.player, state.player.x, state.player.y, this.width / 2, 140)
      .restore()

    // Draw crash particles.
    state.crashParticles.forEach(particle => {
      this.layer.fillStyle('#000')
      this.layer.fillRect(particle.x, particle.y, particle.width, particle.height)
    })

    // Draw possible tutorial arrow.
    if (state.tutorialMode) {
      // this.layer.drawImage(this.images.arrow, state.tutorialModeArrow.x, state.tutorialModeArrow.y, 25, 33)
    }

    // Update our debug window.
    updateDebugWindow(state)
  },

  mouseup: function (data) {
    dropPresent()
  },
})
