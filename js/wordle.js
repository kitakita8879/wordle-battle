import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { getDatabase, ref,child, set, get,update ,onValue ,off} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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
const rdbRef = ref(getDatabase(app));
var competitorid = 0
var yourid = 0
var word = '' //答案的單字
var room_number = 0
var youtime=1;
var competitortime=1;
var competitorguessWords = [[]];
var competitorkeyword =''

function getRandom(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
};

import {WORDS} from './word.js';

document.addEventListener("DOMContentLoaded", ()=>{

    const connectBtn = document.getElementById("connectRoom");
    connectBtn.onclick = ()=>{

        document.getElementById("container").style.display = 'flex';
        room_number =  parseInt(document.getElementsByClassName('roomId')[0].value);
        //to get roomid is or not created
        //get you id

        const five5  = get(child(rdbRef, `room/${room_number}/`)).then((snapshot) => {
            
            if(snapshot.val()!=null && snapshot.val()!= ''){

                const five3  = get(child(rdbRef, `room/${room_number}/people2/`)).then((snapshot) => {
                        yourid=(snapshot.val())
                        console.log('youdid:'+yourid);
                        });

                        //get competitorid
                const five2 = get(child(rdbRef, `room/${room_number}/people1/`)).then((snapshot) => {
                            //console.log(snapshot.val());
                            competitorid=(snapshot.val())
                            console.log('competitorid:'+competitorid);
                        });
            
                        //get word
                const five52 = get(child(rdbRef, `game/${room_number}/win_keyword/`)).then((snapshot) => {
                                //console.log(snapshot.val());
                                word=snapshot.val()
                                console.log('word:'+word);
                            });
                        //update to start game

                const five4=update(ref(firedb,'room/' + room_number +'/' ),{
                        'number': 1,
                    });
                    //start game and close memu
                    document.getElementById("game").style.display = 'none';
                    document.getElementById("title_container").style.display = 'none';
                    readytime()
            }         
            else {
            Swal.fire({title:"錯誤",text:`沒有找到該房間請重新輸入`,icon:"error",color: "#dcdcdc"});
            }
        });
};

    function readytime(){
        document.getElementById("container").style.display = 'flex';
        let time = 5
        let starttime = 1
        var timeoutID = setTimeout(timeout, 5000);
        var intervalID = setInterval(function() {
            document.getElementsByClassName("room_id_title")[0].innerText = "Ready to start : "+time;
            time = time - 1; 
        }, 1000);
        function timeout(){
                clearInterval(intervalID);
                startGame()
                var startGametime = setInterval(function() {
                    document.getElementsByClassName("room_id_title")[0].innerText = "Start!!!  Time : "+starttime;   
                    document.getElementById("game").style.display = '';
                    document.getElementById("title_container").style.display = 'none';
                    starttime = starttime + 1 ;
    
                }, 1000);
                

            }
        }
    
    //按創建房間按鈕切換至遊戲畫面
    const createBtn = document.getElementById("createRoom");
    createBtn.onclick = ()=>{
        document.getElementById("container").style.display = 'flex';
        room_number = getRandom(1000,9999);
        var people_number1 = getRandom(10000,99999);
        var people_number2 = getRandom(10000,99999);
        word = WORDS[Math.floor(Math.random() * WORDS.length)]//答案的單字
        document.getElementsByClassName("room_id_title")[0].innerText = "   Waiting other people ...\n roomId="+room_number;
        yourid=people_number1
        competitorid = people_number2
        set(ref(firedb,'room/' + room_number + '/' ),{
            'people1': people_number1,
            yourid: 0,
            'people2': people_number2,
            competitorid: 0,
            'number' : 0
        });
        set(ref(firedb,'game/' + room_number +'/' ),{
            'win_keyword': word,
              });
        console.log('youdid:'+yourid);
        console.log('competitorid:'+competitorid);
        console.log('word:'+word);

        document.getElementById("game").style.display = 'none';
        document.getElementById("title_container").style.display = 'none';
        const enter_room = onValue((ref(firedb,'room/'+ room_number +"/" + "number")), snapshot => {   //一直去監聽
                            let test = snapshot.val()
                            console.log(snapshot.val())
                            if (test == 1){
                                readytime()
                                off(enter_room)

                                //update to start game
            }
        });
    };


    //按問號顯示遊戲規則
    const help_btn = document.getElementById("help").addEventListener(
        "click", ()=>{
            Swal.fire({title: "遊戲說明",
            html: '． 輸入由5個字母組成的單字<br />' + 
            '． 灰色為沒有該字母<br />． 黃色為有該字母，但位置不對<br />． 綠色為字母和位置皆正確<br />' + 
            '． 雙人對戰時，最快猜中答案者勝利<br />',
            icon:"question",
            color: "#dcdcdc"});
        }
    );
    
    createSquare1();
    createSquare2();

    function startGame(){

        const two = onValue((ref(firedb,'game/'+ room_number + "/win_name/")), snapshot => {
            console.log(snapshot.val())
            let name = snapshot.val()
            if (name != null){ 
            if (name==competitorid){
                Swal.fire({title:"錯誤",text:`ㄅ歉，對手猜對了，你輸啦，正確單字為 ${word}。`,icon:"error",color: "#dcdcdc"});
            }
            if (name==yourid){
                if(guessWords.length !== 7){
                    Swal.fire({title:"恭喜!",text:"對手先猜錯了 你獲勝了!",icon:"success",color: "#dcdcdc"});

                }
            }
            }
        });
        
        const one = onValue((ref(firedb,`game/${room_number}/${competitorid}/keyword/`)), snapshot => {
            console.log(snapshot.val())
            competitorkeyword = snapshot.val()
            if (competitorkeyword != null && competitorkeyword != '') {
                console.log(competitorkeyword)
                competitorhandleSubmitWord()

            };
        });



    }

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
    //var word = WORDS[Math.floor(Math.random() * WORDS.length)]//答案的單字
    let guessedWordCount = 0;
    let guessSucess = false;
    let nextLetter = 0;//判斷delete
    
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
            nextLetter +=1;
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

    //對手提交答案
    function competitorhandleSubmitWord(){
        for (var i=0 ; i<5; i++){
            const currentWord = competitorkeyword[i]
            console.log(currentWord)
            const tileColor = getTileColor(currentWord,i);
            const letterId = competitortime
            const interval = 200;
            const letterEl= document.getElementById("square2_" + letterId);
            letterEl.textContent = currentWord;
            letterEl.classList.add("animate__flipInX");
            letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
            competitortime +=1;
        }
       

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
            nextLetter = 0;

            set(ref(firedb,'game/' + room_number +'/' +yourid+"/" ),{
                'keyword': currentWord,
                'number': youtime,    });
            youtime = youtime + 1;
            
            
            if(currentWord == word.toUpperCase()){
                update(ref(firedb,'game/' + room_number +'/'),{
                    'win_name' : yourid,
                });
                Swal.fire({title:"恭喜!",text:"恭喜答對 你獲勝了!",icon:"success",color: "#dcdcdc"});
                guessSucess = true;
            }else if(guessWords.length == 7){
                update(ref(firedb,'game/' + room_number +'/'),{
                    'win_name' : competitorid,
                });
                Swal.fire({title:"錯誤",text:`ㄅ歉，你猜錯啦，正確單字為 ${word}。`,icon:"error",color: "#dcdcdc"});
            }    
        }
    }

    //按刪除鍵
    function handleDeleteLetter(){
        if (nextLetter !== 0) {
            const currentWordArr = getCurrentWordArr();
            const removedLetter = currentWordArr.pop();

            guessWords[guessWords.length -1] = currentWordArr;

            const lastLetterEl = document.getElementById("square1_" + String(availableSpace -1));
            lastLetterEl.textContent = '';
            availableSpace = availableSpace -1;
        }
    }
});