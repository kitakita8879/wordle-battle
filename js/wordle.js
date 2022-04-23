import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { getDatabase, ref, set, get,update } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

var firebaseConfig = {
    apiKey: "AIzaSyAbBWyUP052BLXtTFAS8boPdphjBDTb6UA",
    authDomain: "ncue-web-wordle-project.firebaseapp.com",
    databaseURL: "https://ncue-web-wordle-project-default-rtdb.firebaseio.com",
    projectId: "ncue-web-wordle-project",
    storageBucket: "ncue-web-wordle-project.appspot.com",
    messagingSenderId: "165117926835",
    appId: "1:165117926835:web:56c3e090f406aa2ad0bfc6",
    measurementId: "G-D8MTTG8H3T"
  };
const app = initializeApp(firebaseConfig);
const firedb = getDatabase(app);

function getRandom(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
};

document.addEventListener("DOMContentLoaded", ()=>{

    //按創建房間按鈕切換至遊戲畫面
    const createBtn = document.getElementById("createRoom");
    createBtn.onclick = ()=>{
        var room_number = getRandom(1000,9999);
        var people_number1 = getRandom(10000,99999);
        var people_number2 = getRandom(10000,99999);

        set(ref(firedb,'room/' + room_number + '/' ),{
            'people1': people_number1,
            'people2': people_number2,
            'number' : '0'
        });

        set(ref(firedb,'game/' + room_number +'/' +people_number1+"/" ),{
            'keyword1': "",
            'keyword2': "",
            'keyword3': "",
            'keyword4': "",
            'keyword5': "",  
            'number': "",    });

        set(ref(firedb,'game/' + room_number +'/' +people_number2+"/" ),{
            'keyword1': "",
            'keyword2': "",
            'keyword3': "",
            'keyword4': "",
            'keyword5': "",  
            'number': "",    });

        update(ref(firedb,'game/' + room_number +'/' ),{
            'win_keyword': "",
            'win_name': ""  });
        
        document.getElementById("container").style.display = '';
        document.getElementById("title_container").style.display = 'none';
    }

    //按問號顯示遊戲規則
    const help_btn = document.getElementById("help").addEventListener(
        "click", ()=>{
            Swal.fire({title: "遊戲說明",
            html: '． 輸入由5個字母組成的單字<br />' + 
            '． 灰色為沒有該字母<br />．黃色為有該字母，但位置不對<br />．綠色為字母和位置皆正確<br />' + 
            '． 雙人對戰時，最快猜中答案者勝利<br />' + 
            '． 困難模式下，任何已揭曉的提示必須在下一個輸入的答案中使用',
            icon:"question",
            color: "#dcdcdc"});
        }
    );

    createSquare1();
    createSquare2();

    //猜測區塊1、2
    function createSquare1(){
        const gameBoard = document.getElementById("player1");

        for (let x = 0; x <30; x++){
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", "square1_" + (x +1));
            gameBoard.appendChild(square);
        }
    }
    function createSquare2(){
        const gameBoard = document.getElementById("player2");

        for (let y = 0; y <30; y++){
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", "square2_" + (y +1));
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



    let guessWords = [[]];
    let availableSpace = 1;
    let word = 'dairy';//答案的單字(測試用)
    let guessedWordCount = 0;
    let guessSucess = false;
    
    //按鍵盤
    const keys = document.querySelectorAll(".keyboard_row button");

    for (let k = 0; k < keys.length; k++) {
        keys[k].onclick = ( {target} ) =>{
            const letter = target.getAttribute("data-key");

            if(!guessSucess){
                if (letter === 'Enter') {//按ENTER
                    handleSubmitWord();
                    return;
                }

                if (letter === 'Del') {//按DEL
                    handleDeleteLetter();
                    return;
                }

                updateGuessWords(letter);
            }
        }       
    }

    function getCurrentWordArr(){
        const numberOfGuessWords = guessWords.length;
        return guessWords[numberOfGuessWords - 1];
    }

    function updateGuessWords(letter){
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);
            //顯示在square1_(左側)
            const availableSpaceEl = document.getElementById("square1_" + String(availableSpace));
            availableSpace = availableSpace +1;
            console.log(availableSpace);

            availableSpaceEl.textContent = letter;
        }
    }
    
    //猜測後的字母顏色
    function getTileColor(letter,index){
        const isCorrectLetter = word.toUpperCase().includes(letter);

        if(!isCorrectLetter){
            return "rgb(58,58,60)";//錯誤字母 灰色
        }

        const letterInThatPosition = word.toUpperCase().charAt(index);
        const isCorrectPosition = (letter === letterInThatPosition);

        if(isCorrectPosition){
            return "rgb(83,141,78)";//正確字母位置 綠色
        }

        return "rgb(181,159,59)";//正確字母 錯誤位置 黃色
    }

    //按ENTER鍵提交答案
    function handleSubmitWord(){
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !==5) {
            Swal.fire({title:"警告",text:"所猜測單字必須由5個字母所組成",icon:"warning",color: "#dcdcdc"});
        }else{
            const currentWord = currentWordArr.join('');

            const firstLetterId = guessedWordCount * 5 + 1;
            const interval = 200;
            currentWordArr.forEach((letter, index) => {
                setTimeout(() =>{
                    const tileColor = getTileColor(letter,index);

                    const letterId = firstLetterId + index;
                    const letterEl= document.getElementById("square1_" + letterId);
                    letterEl.classList.add("animate__flipInX");
                    letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
                },interval * index);
            });
            guessedWordCount +=1;
            guessWords.push([]);

            if(currentWord === word.toUpperCase()){
                Swal.fire({title:"恭喜!",text:"恭喜答對!",icon:"success",color: "#dcdcdc"});
                guessSucess = true;
            }else if(guessWords.length === 7){
                Swal.fire({title:"錯誤",text:`ㄅ歉，你猜錯啦，正確單字為 ${word}。`,icon:"error",color: "#dcdcdc"});
            }    
        }
    }

    //按刪除鍵
    function handleDeleteLetter(){
        if (availableSpace%5 !== 1) {
            const currentWordArr = getCurrentWordArr();
            const removedLetter = currentWordArr.pop();

            guessWords[guessWords.length -1] = currentWordArr;

            const lastLetterEl = document.getElementById("square1_" + String(availableSpace -1));
            lastLetterEl.textContent = '';
            availableSpace = availableSpace -1;
        }
    }
});