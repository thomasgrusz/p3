import{Resources}from"./resources.js";import{ctx}from"./engine.js";import{app,player}from"./app.js";export class Enemy{constructor(){this.sprite="images/enemy-bug.png",this.minXCoord=-100,this.maxXCoord=505,this.yCoords=[-23,60,143,226,309,392],this.width=101}reset(){this.x=this.minXCoord,this.y=this.yCoords[app.random_number(1,3)],this.speed=app.random_number(100,400),this.collisionFlag=!1}update(s){this.x<this.maxXCoord?this.x=this.x+this.speed*s:this.reset(),!0===this.collisionFlag&&(player.x=player.xOrigin,player.y=player.yOrigin,player.lives--,this.reset())}render(){ctx.drawImage(Resources.get(this.sprite),this.x,this.y)}}