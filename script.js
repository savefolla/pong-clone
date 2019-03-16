// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine
});

let score = 0;
let shouldScore = false;

boxesOptions = {
  label: 'box',
  restitution: 1,
  friction: 0,
  frictionAir: 0,
  frictionStatic: 0,
  inertia: Infinity
};
var box = Bodies.rectangle(400, 200, 40, 40, boxesOptions);
Matter.Body.setAngularVelocity(box, .2);

edgesOptions = {
  isStatic: true,
  label: 'edge'
};
var ground = Bodies.rectangle(400, 610, 810, 60, edgesOptions);
var ceiling = Bodies.rectangle(400, -10, 810, 60, edgesOptions);
var left = Bodies.rectangle(-10, 300, 60, 600, {
  ...edgesOptions,
  label: 'left'
});
var right = Bodies.rectangle(810, 300, 60, 600, {
  ...edgesOptions,
  label: 'right'
});

const player = Bodies.rectangle(40, 100, 20, 100, {
  ...edgesOptions,
  label: 'player'
});

// add all of the bodies to the world
World.add(engine.world, [
  box,
  player,
  ground,
  ceiling,
  left,
  right
]);

engine.world.gravity = {x: 0, y: 0};

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

const direction = Math.random() < 0.5 ? -1 : 1;
Matter.Body.applyForce(box, { x: 0, y: 0 }, { x: direction * .01, y: direction * .01 });

document.addEventListener('keypress', e => {
  if (e.code === 'KeyS' && player.position.y !== 530) {
    Matter.Body.setPosition(player, {x: 40, y: player.position.y + 10})
  }
  if (e.code === 'KeyW' && player.position.y !== 70) {
    Matter.Body.setPosition(player, {x: 40, y: player.position.y - 10})
  }
});

Matter.Events.on(engine, 'collisionStart', function(event) {
  const leftBoxCollision = ['left', 'box'];
  const rightBoxCollision = ['right', 'box'];
  const playerBoxCollision = ['player', 'box'];
  if (playerBoxCollision.includes(event.pairs[0].bodyA.label) && playerBoxCollision.includes(event.pairs[0].bodyB.label)) {
    shouldScore = true;
  }
  if (shouldScore && leftBoxCollision.includes(event.pairs[0].bodyA.label) && leftBoxCollision.includes(event.pairs[0].bodyB.label)) {
    --score;
    shouldScore = false;
  }
  if (shouldScore && rightBoxCollision.includes(event.pairs[0].bodyA.label) && rightBoxCollision.includes(event.pairs[0].bodyB.label)) {
    ++score;
  }
  document.querySelector('#score').innerHTML = score;
});
