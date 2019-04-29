function zegarSzachowy(n, defaultTime, addedTime, warningTime) {
    let newGame = true;
    let next = 0;
    const game = document.getElementById('game')
    const button = document.getElementById('button')
    button.onclick = nextPlayer

    let playersLeft = n

    let html ='';
    let clocks = [];

    for (let i=0;i<n; i++) {
        let zegar = {
            id: i,
            elapsedTime: defaultTime,
            html: zegarHTML(i, defaultTime),
            lost: false
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
        
        
        if(clocks[next].lost) {
            return nextPlayer()
        }

        if(playersLeft===1) {
            let resultInfo = document.getElementById(`result-${next}`)
            resultInfo.innerHTML = 'wygrales !!!'
            return
        }
        
        startTime = Date.now();
        (function(nextCopy){
            refreshClockDisplay(nextCopy,0)
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
                    clocks[clockId].lost = true;
                    playerResult.innerHTML = "przegrales:( Koniec gry"
                    playersLeft--
                    
                    return nextPlayer()
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
            displayHTML.innerHTML = formatTime(0)
            ret.lost = true
            return ret
        }
        
        ret.warning = clocks[clockId].elapsedTime <= warningTime

        displayHTML.innerHTML =  formatTime(clocks[clockId].elapsedTime)
        return ret
    }

    window.addEventListener('keyup', function(keyupEvent){
        if(keyupEvent.keyCode === 32) {
            nextPlayer()
        } 
    })
}

function formatTime(timeInMS) {
    //godz:min:sek:dzies
    const GODZINA = 1000 * 60 * 60
    const MINUTA = 1000 * 60
    const SEKUNDA = 1000
    const DZIESIETNA = 100

    let godzina = Math.floor(timeInMS / GODZINA)
    timeInMS -= godzina * GODZINA;

    let minuta = Math.floor(timeInMS/ MINUTA)
    timeInMS -= minuta * MINUTA;

    let sekunda = Math.floor(timeInMS/ SEKUNDA)
    timeInMS -= sekunda * SEKUNDA;

    let dziesietna = Math.floor(timeInMS/ DZIESIETNA)
    timeInMS -= dziesietna * DZIESIETNA;


    return `${paddingZeros(godzina)}:${paddingZeros(minuta)}:${paddingZeros(sekunda)}:${paddingZeros(dziesietna)}`
}

function paddingZeros(liczba) {
    if (liczba < 10) {
        return `0${liczba}`
    }
    return liczba
}

function zegarHTML(id, elapsedTime) {
    return `<div class="zegar" id="zegar-${id}">
            <div id="display-${id}" class="display">${formatTime(elapsedTime)}</div>
            <h3 id="gracz-${id}">gracz ${id}</h3>
            <div id="result-${id}"></div>
        </div>
    `
}

window.onload = function() {
    zegarSzachowy(4, 2000,2000,2000)
}

