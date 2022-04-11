document.addEventListener("DOMContentLoaded", ()=>{
    createSquare1();
    createSquare2();
    function createSquare1(){
        const gameBoard = document.getElementById("player1");

        for (let index = 0; index <30; index++){
            let square = document.createElement("div");
            square.classList.add("square");
            square.setAttribute("id", index +1);
            gameBoard.appendChild(square);
        }
    }
    function createSquare2(){
        const gameBoard = document.getElementById("player2");

        for (let index = 0; index <30; index++){
            let square = document.createElement("div");
            square.classList.add("square");
            square.setAttribute("id", index +1);
            gameBoard.appendChild(square);
        }
    }

    //鍵盤設置
    const keyboard=[
        ['Q','W','E','R','T','Y','U','I','O','P'],
        ['A','S','D','F','G','H','J','K','L'],
        ['Enter','Z','X','C','V','B','N','M','Del'],
    ]
    var kb = document.getElementById('keyboard_container')

    for(let i =0;i < keyboard.length; i++){
        var keyboard_row = document.createElement('div');
        keyboard_row.classList.add('keyboard_row');
        for(let j=0;j< keyboard[i].length;j++){
            let keyEl = document.createElement('button');
            keyEl.setAttribute('data-key',keyboard[i][j]);
            keyEl.textContent = keyboard[i][j];
            keyboard_row.appendChild(keyEl);
        }
        kb.appendChild(keyboard_row);
    }
});