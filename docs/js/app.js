import{ctx}from"./engine.js";import{Enemy}from"./Enemy.js";import{Player}from"./Player.js";import{Collectible}from"./Collectible.js";import{Rock}from"./Rock.js";import{Timer}from"./Timer.js";export const app={};app.pauseFlag,app.allEnemies=[],app.allCollectibles=[],app.allRocks=[],app.random_number=function(o,e){return 0===o?Math.floor(Math.random()*(e+1)):o+Math.floor(Math.random()*e)},app.displayPanel=function(o,e,t,r,i){ctx.fillStyle=i,ctx.beginPath(),ctx.moveTo(o,e),ctx.lineTo(o+t,e),ctx.quadraticCurveTo(o+t+10,e,o+t+10,e+10),ctx.lineTo(o+t+10,e+r+10),ctx.quadraticCurveTo(o+t+10,e+r+20,o+t,e+r+20),ctx.lineTo(o,e+r+20),ctx.quadraticCurveTo(o-10,e+r+20,o-10,e+r+10),ctx.lineTo(o-10,e+10),ctx.quadraticCurveTo(o-10,e,o,e),ctx.fill()},app.displayPanelOutline=function(o,e,t,r,i){ctx.lineWidth=5,ctx.strokeStyle=i,ctx.beginPath(),ctx.moveTo(o,e),ctx.lineTo(o+t,e),ctx.quadraticCurveTo(o+t+10,e,o+t+10,e+10),ctx.lineTo(o+t+10,e+r+10),ctx.quadraticCurveTo(o+t+10,e+r+20,o+t,e+r+20),ctx.lineTo(o,e+r+20),ctx.quadraticCurveTo(o-10,e+r+20,o-10,e+r+10),ctx.lineTo(o-10,e+10),ctx.quadraticCurveTo(o-10,e,o,e),ctx.stroke()},app.isRock=function(o,e){var t=[!1,!1,!1,!1];return app.allRocks.forEach((function(r){o-1===r.xCoords.indexOf(r.x)&&e===r.yCoords.indexOf(r.y)&&(t[0]=!0),o+1===r.xCoords.indexOf(r.x)&&e===r.yCoords.indexOf(r.y)&&(t[1]=!0),o===r.xCoords.indexOf(r.x)&&e+1===r.yCoords.indexOf(r.y)&&(t[2]=!0),o===r.xCoords.indexOf(r.x)&&e-1===r.yCoords.indexOf(r.y)&&(t[3]=!0)})),t},app.overlap=function(o,e){if(e>0)for(var t=0;t<e;t++)if(o[e].x===o[t].x&&o[e].y===o[t].y)return!0;return!1},app.isGem=function(o){var e=!1;return app.allCollectibles.forEach((function(t){app.allRocks[o].xCoords.indexOf(app.allRocks[o].x)===t.xCoords.indexOf(t.x)&&app.allRocks[o].yCoords.indexOf(app.allRocks[o].y)===t.yCoords.indexOf(t.y)&&(e=!0)})),e};for(var i=1;i<=3;i++)app.allEnemies.push(new Enemy);for(i=1;i<=2;i++)app.allCollectibles.push(new Collectible);for(i=1;i<=2;i++)app.allRocks.push(new Rock);export const player=new Player;export const timer=new Timer;document.addEventListener("keydown",(function(o){player.handleInput({37:"left",38:"up",39:"right",40:"down",32:"space",13:"return"}[o.keyCode])}));