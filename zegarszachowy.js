function zegarSzachowy(n, defaultTime, addedTime, warningTime) {
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
            clocks[next].elapsedTime += addedTime
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
                let updateData = updateClock(clockId, currentTime - startTime)

                let playerResult = document.getElementById(`result-${clockId}`)

                if(updateData.lost) {
                    playerResult.innerHTML = "przegrales:( Koniec gry"
                    return;
                }

                if(updateData.warning) {
                    
                    playerResult.innerHTML = `Masz mniej niz ${warningTime}. zaraz przegrasz!!!`
                } else {
                    playerResult.innerHTML = ``
                }
                
                if(finish) return;
                
                startTime = Date.now();
                
                refreshClockDisplay(clockId, timeInterval)
            }, timeInterval)
        }
    }

    //zwraca true jesli przegralismy; false jesli zostal nam jakis czas
    function updateClock(clockId, takenTime) {
        let ret = {
            lost: false,
            warning: false
        }
        clocks[clockId].elapsedTime -= takenTime
        
        let clockHTML = document.getElementById(`zegar-${clockId}`)
        let displayHTML = document.getElementById(`display-${clockId}`)
        if (clocks[clockId].elapsedTime <= 0) {
            displayHTML.innerHTML = 0
            ret.lost = true
            return ret
        }
        
        ret.warning = clocks[clockId].elapsedTime <= warningTime

        displayHTML.innerHTML =  clocks[clockId].elapsedTime
        return ret
    }

    window.addEventListener('keyup', function(keyupEvent){
        if(keyupEvent.keyCode === 32) {
            nextPlayer()
        } 
    })
}

function zegarHTML(id, elapsedTime) {
    return `<div class="zegar" id="zegar-${id}">
            <div id="display-${id}" class="display">${elapsedTime}</div>
            <h3 id="gracz-${id}">gracz ${id}</h3>
            <div id="result-${id}"></div>
        </div>
    `
}

window.onload = function() {
    zegarSzachowy(3, 5000,2000,2000)
}

