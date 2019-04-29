function zegarSzachowy(n, defaultTime) {
    let newGame = true;
    let next = 0;
    const game = document.getElementById('game')
    const button = document.getElementById('button')
    button.onclick = nextPlayer

    let html ='';
    let clocks = [];

    for (let i=0;i<n; i++) {
        let zegar = {
            id: i,
            elapsedTime: defaultTime,
            html: zegarHTML(i, defaultTime)
        }
        clocks.push(zegar);
        html += zegar.html;
    }
    game.innerHTML = html;

    //odpala zegar z id ktory jest w zmiennej next
    //zatrzymuje zegar ktory jest mniejszy o 1 lub w przypadku next=0 koncowy zegar
    function nextPlayer() {
        if(!newGame) {
            next+=1;
            if(next>=clocks.length) {
                next=0;
            }
        }
        console.log('nextPlayer')
        startTime = Date.now();
        (function(nextCopy){
            refreshClockDisplay(nextCopy,238)
        }(next));
       
        newGame = false;

        function refreshClockDisplay(clockId, timeInterval) {
            setTimeout(()=>{
                let finish = false;
                if(clockId!==next) {
                    finish = true;
                }
                let currentTime = Date.now();
                updateClock(clockId, currentTime - startTime)
                
                if(finish) return;
                
                startTime = Date.now();
                
                refreshClockDisplay(clockId, timeInterval)
            }, timeInterval)
        }
    }

    function updateClock(clockId, takenTime) {
        clocks[clockId].elapsedTime -= takenTime
        let clockHTML = document.getElementById(`zegar-${clockId}`)
        let displayHTML = document.getElementById(`display-${clockId}`)
        displayHTML.innerHTML =  clocks[clockId].elapsedTime;
    }
}

function zegarHTML(id, elapsedTime) {
    return `<div class="zegar" id="zegar-${id}">
            <div id="display-${id}" class="display">${elapsedTime}</div>
            <h3>gracz ${id}</h3>
        </div>
    `
}

window.onload = function() {
    zegarSzachowy(3, 30000)
}