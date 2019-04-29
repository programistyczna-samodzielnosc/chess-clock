let howManyClocks = 3;
let startTimeHours = 0;
let startTimeMinutes = 0;
let startTimeSeconds = 30;
let timeAdded = 2 * 1000; 

function zegarSzachowy(n, defaultTime) {
    let newGame = true;
    let nextClock = 0;
    const game = document.getElementById('game')
    let gameStopped = false;
    
    const btnPlay = document.getElementById('btnPlay')
    btnPlay.onclick = nextPlayer
    
    const btnReset = document.getElementById('btnReset')    
    btnReset.onclick = () => location.reload();

    const btnPause = document.getElementById('btnPause')    
    btnPause.onclick = pauseTheGame;
  
    let html = '';
          
    let clocks = [];

    for (let i = 0; i < n; i++) {
        let zegar = {
            id: i,
            elapsedTime: defaultTime,
            html: zegarHTML(i, defaultTime),
            gameLosted: () => showGameOver('Gracz ' + (i + 1))
        }
        clocks.push(zegar);
        html += zegar.html;
    }
    game.innerHTML = html;
  
    let previousClock = clocks.length - 1
    
    function showGameOver(playerName)
    {
        document.getElementById('allClockButtons').classList.add('invisible')
        document.getElementById('gameOverDiv').classList.remove('invisible')
        document.getElementById('gameOverDiv').innerHTML = playerName + ", YOU LOST, LOOSER!!!"
    }

    //odpala zegar z id ktory jest w zmiennej next
    //zatrzymuje zegar ktory jest mniejszy o 1 lub w przypadku next=0 koncowy zegar
    function nextPlayer() {
        if(!newGame && !gameStopped) {
            nextClock++;
            if(nextClock >= clocks.length) {
                nextClock = 0;
            }           
            previousClock++;
            if(previousClock >= clocks.length) {
                previousClock = 0;
            }                     
        }
        clocks[previousClock].elapsedTime += timeAdded;
      
        if (gameStopped) 
          gameStopped = false;
          
      
        console.log('nextPlayer')
        let startTime = Date.now();
        (function(nextCopy){
            refreshClockDisplay(nextCopy,75)
        }(nextClock));
       
        newGame = false;

        function refreshClockDisplay(clockId, timeInterval) {
            setTimeout(()=>{
                if (gameStopped) {
                  return;
                }                  
              
                let finish = false;
                if(clockId!==nextClock) {
                    finish = true;
                }
                let currentTime = Date.now();
                updateClock(previousClock, clockId, currentTime - startTime)
                
                if(finish) return;
                
                startTime = Date.now();
                
                refreshClockDisplay(clockId, timeInterval)
            }, timeInterval)
        }
    }

    function updateClock(previousClockId, clockId, takenTime) {
        if (clocks[clockId].elapsedTime <= takenTime){
          clocks[clockId].gameLosted()
          return                     
        }
   
      
        clocks[clockId].elapsedTime -= takenTime
        let clockHTML = document.getElementById(`zegar-${clockId}`)
        let displayHTML = document.getElementById(`display-${clockId}`)
        
        let newClassName = displayHTML.className
        newClassName = newClassName.replace(" inactive", " active")
        if (isLastSecondsTime(clocks[clockId].elapsedTime)) {
            if (!newClassName.includes(" lastSecondsClock"))
              newClassName += " lastSecondsClock";
        } else {
          newClassName = newClassName.replace(" lastSecondsClock", "")         
        }
        displayHTML.className = newClassName
        displayHTML.innerHTML = getTimeTextFromMiliseconds(clocks[clockId].elapsedTime)
      
        let previousDisplayHTML = document.getElementById(`display-${previousClockId}`)
        previousDisplayHTML.className = previousDisplayHTML.className.replace(" active", " inactive")
        previousDisplayHTML.className = previousDisplayHTML.className.replace(" lastSecondsClock", "") 
    }
  
    function pauseTheGame() {
      gameStopped = true;
    }
}

function zegarHTML(id, elapsedTime) {
    return `<div class="zegar" id="zegar-${id}">
              <div id="display-${id}" class="display inactive">${getTimeTextFromMiliseconds(elapsedTime)}</div>
              <div id="playerName-${id}" class="playerName">Gracz ${id+1}</div>
            </div>`
}


function getTimeTextFromMiliseconds(miliseconds)
{
	//3600000 ms = 1 hour
	let hours = 0;
	while (miliseconds >= 3600000)
	{
		miliseconds -= 3600000;
		hours++;
	}
	if (hours < 10)
	{
		hours = '0' + hours;
	}
	
	//60000 ms = 1 minute
	let minutes = 0;
    while (miliseconds >= 60000)
	{
		miliseconds -= 60000;
		minutes++;
	}
	if (minutes < 10)
	{
		minutes = '0' + minutes;
	}
	
	//1000 ms = 1 second
	let seconds = 0;
    while (miliseconds >= 1000)
	{
		miliseconds -= 1000;
		seconds++;
	}
	if (seconds < 10)
	{
		seconds = '0' + seconds;
	}
	
	//100 ms = 1/10 second
	let seconds_tenth = 0;
    while (miliseconds >= 100)
	{
		miliseconds -= 100;
		seconds_tenth++;
	}
	
	return hours + ":" + minutes + ":" + seconds + ":" + seconds_tenth;
}

function isLastSecondsTime(miliseconds)
{
    return miliseconds < 10 * 1000;
}

function getDefaultTime()
{
  return startTimeHours * 3600 * 1000 + startTimeMinutes * 60 * 1000 + startTimeSeconds * 1000;
}

window.onload = function() {
    zegarSzachowy(howManyClocks, getDefaultTime());
}

document.onkeydown = function (e) {
    let spacebar = 32;
    if (e.keyCode == spacebar) {
        document.getElementById("btnPlay").click();
    }
};