var trex, trexRun, ground, groundImage, invisbleGround, cloudImage, count, ob1, ob2, ob3, ob4, ob5, ob6, CloudsGroup, ObstaclesGroup, gameState, PLAY, END, trexCollided, score, gameOver, restart, gameOverImage, restartImage, die, jump, check ;
 
function preload(){
  trexRun=loadAnimation("trex1.png", "trex3.png", "trex4.png" );
  
  groundImage= loadImage("ground2.png");
  
  cloudImage= loadImage("cloud.png")
  
  ob1=loadImage("obstacle1.png")
  ob2=loadImage("obstacle2.png")
  ob3=loadImage("obstacle3.png")
  ob4=loadImage("obstacle4.png")
  ob5=loadImage("obstacle5.png")
  ob6=loadImage("obstacle6.png")
  
  trexCollided=loadImage("trex_collided.png");
  gameOverImage=loadImage("gameOver.png");
  restartImage=loadImage("restart.png");
  
  jump=loadSound("jump.mp3")
  die=loadSound("die.mp3")
  check=loadSound("checkPoint.mp3")
}



function setup() {
  createCanvas(600, 200);
  trex = createSprite(80, 165, 10 , 30);
  trex.addAnimation("t1", trexRun);
  trex.addAnimation("t2", trexCollided);
  trex.setCollider("circle",10,-10,45);
  //trex.debug = true;
  trex.scale = 0.5
  
  ground = createSprite(width/2, height-20, width, 10)
  ground.addImage(groundImage)
  
  invisibleGround = createSprite(width/2, height-18, width, 5);
  
  invisibleGround.visible=false
  
  count=0
  
  CloudsGroup=createGroup();
  ObstaclesGroup=createGroup();
  PLAY=1
  END=0
  gameState=PLAY
  
  score=0
 gameOver = createSprite(300,100);
  restart = createSprite(300,140);
    
gameOver.addImage("gameOver",gameOverImage);
gameOver.scale = 0.5;
restart.addImage("restart",restartImage);
restart.scale = 0.5;

gameOver.visible= false;
restart.visible= false;

}


function draw() {
  background(255);
  drawSprites();
  textSize(18)
  textFont("comic sans ms")
  text("Score:"+score,500, 50);
  if(gameState==PLAY){
  score=score+Math.round(getFrameRate()/60)
  spawnClouds();
  spawnObstacles();
  if((keyDown("space") || keyDown(UP_ARROW))&&trex.y>146){
    trex.velocityY= -12
    jump.play()
  }
  
    
    console.log(trex.y)
  ground.velocityX=-(6+Math.round(score/100))
  if(ground.x<0){
    ground.x=ground.width/2
  }
  if(score%100===0 && score>0){
   check.play(); 
  }
  trex.velocityY = trex.velocityY + 0.8;
  if(ObstaclesGroup.isTouching(trex)){
    die.play();
    gameState=END
  }
    
  }
  else if(gameState===END){
    //set velcity of each game object to 0
    
gameOver.visible= true;
restart.visible= true;
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("t2");
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
    
    //place gameOver and restart icon on the screen

    
    if(mousePressedOver(restart)){
    reset();
  }

  }
  trex.collide(invisibleGround)
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,160,40,10);
    cloud.y = Math.round (random(80,120));
    
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 210;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle =createSprite(600+random(-80,80),163,10,40);
    obstacle.velocityX = -(6+Math.round(score/100));
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(ob1);
        break;
      case 2: obstacle.addImage(ob2); 
        break;
      case 3: obstacle.addImage(ob3); 
        break;
      case 4: obstacle.addImage(ob4); 
        break;
      case 5: obstacle.addImage(ob5);
        break;
      case 6: obstacle.addImage(ob6); 
    }
    //obstacle.setAnimation("obstacle" + rand);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}
function reset(){
score=0
gameState=PLAY;
gameOver.visible= false;
restart.visible= false;
ObstaclesGroup.destroyEach();
CloudsGroup.destroyEach();
trex.changeAnimation("t1");
}