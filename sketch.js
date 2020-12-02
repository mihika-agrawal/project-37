var dog;
var dogImage;
var hdogImage;
var foodobj;
var database;
var feedDog;
var addFood;
var foods;
var fedTime;
var lastfed;
var foodstock;
var gameState;
var bedroom,washroom,garden;
var readState;

function preload()
{
  dogImage= loadImage("images/dogImg.png");
  hdogImage= loadImage("images/dogImg1.png");
  bedroom= loadImage("images/Bed Room.png");
  washroom= loadImage("image/Wash Room.png");
  garden= loadImage("image/Garden.png");
}

function setup() {
  database=firebase.database();
	createCanvas(1200, 800);
  
  dog = createSprite(250,250,20,20);
  dog.addImage(dogImage);
  dog.scale=0.2;

  foodobj= new Food();

  foodstock= database.ref('Food');
  foodstock.on("value",readstock); 

  readState= database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val()
  });

  feedDog= createButton("Feed The Dog");
  feedDog.position(700,95);
  feedDog.mousePressed(feed);

  addFood= createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods)
}


function draw() {  
 background(46,139,87);
 foodobj.display();

  fill(0);
text("food left:" + foods ,250,30);

fedTime=database.ref('feedTime');
fedTime.on("value",function(data){
lastfed=data.val();
})

fill(255,255,254);
textSize(15);
if(lastfed>=12){
  text("Last Fed= "+lastfed%12+"PM",350,30);
 
} else if(lastfed==0){
  text("Last Fed= 12 AM",350,30)
}else {
  text("Last Fed= "+lastfed+"AM",350,30);
}

if(gameState!="Hungry"){
  feedDog.hide();
  addFood.hide();
  dog.remove();
}else{
feedDog.show();
addFood.show();
dog.addImage(dogImage);
}

currentTime=hour();
if(currentTime==(lastfed+1)){
update("Playing");
foodobj.garden();
}else if(currentTime==(lastfed+2)){
  update("Sleeping");
  foodobj.bedroom();
}else if(currentTime>(lastfed+2)&&currentTime<=(lastfed+4)){
  update("Bathing");
  foodobj.washroom();
}else{
  update("Hungry");
  foodobj.display();
}

drawSprites();
}

function readstock(data){
  foods=data.val();
 foodobj.updateFoodStock(foods)
}


function feed(){
dog.addImage(hdogImage);

foodobj.updateFoodStock(foodobj.getFoodStock()-1)
database.ref('/').update({
Food:foodobj.getFoodStock(),
feedTime:hour()
})
}

function addFoods(){
foods++
database.ref('/').update({
  Food:foods
});
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}


  


