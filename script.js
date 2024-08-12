const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[lengthNo]");
const pswdDisplay = document.querySelector(".display");
const copybtn = document.querySelector(".copy-btn");
const copymsg = document.querySelector(".tooltip");
const upperrcase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols")
const indicator = document.querySelector(".indicator");
const generatebtn = document.querySelector(".generate-btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbolsArr = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let pswd = "";
let pswdLen = 10;
let checkedCnt = 0;
handleSlider();
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value = pswdLen;
    lengthDisplay.innerText = pswdLen;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomNumber(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}
function generateUppercase(){
    return String.fromCharCode(getRandomNumber(65,91)) ;
}
function generateLowercase(){
    return String.fromCharCode(getRandomNumber(97,123)) ;
}
function generateNumbers(){
    return getRandomNumber(0,9);
}
function generateSymbols(){
    const index = getRandomNumber(0, symbolsArr.length);
    return symbolsArr[index];
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumbers = false;
    let hasSymbols = false;

    if(upperrcase.checked)  hasUpper = true;
    if(lowercase.checked)   hasLower = true;
    if(symbols.checked)    hasSymbols = true;
    if(numbers.checked)   hasNumbers = true;

    if(hasUpper && hasLower && (hasNumbers || hasSymbols)  && pswdLen>=8){
            setIndicator("0f0");
    }else if((hasLower || hasUpper) && (hasSymbols && hasSymbols) && pswdLen>=6){
            setIndicator("ff0");
    }else{
            setIndicator("f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(pswdDisplay.value);
        copymsg.innerText = "copied";
    }
    catch(e){
        copymsg.innerText = "failed";
    }
    copymsg.classList.add("active");

    setTimeout( ()=>{
        copymsg.classList.remove("active");
    },2000);
}

function sufflePswd(Array){
    for(let i=Array.length-1; i>0; i--){
        let j = Math.floor(Math.random()) * i+1;
        const temp = Array[i];
        Array[i] = Array[j];
        Array[j] = temp;
    }
    let str = "";
    Array.forEach((el)=>(str += el));
    return str;
}

function handleCheckboxChange(){
    checkedCnt = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkedCnt++;
        }
    })
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckboxChange);
})

copybtn.addEventListener('click', ()=>{
    if(pswdDisplay.value)
        copyContent();
})

inputSlider.addEventListener('input',(e)=>{
    pswdLen = e.target.value;
    handleSlider();
})

generatebtn.addEventListener('click', ()=>{
    if(checkedCnt == 0)    return;
    if(pswdLen < checkedCnt){
        pswdLen = checkedCnt;
        handleSlider();
    }
    
    pswd = "";
    let funcArr = [];

    if(uppercase.checked)
        funcArr.push(generateUppercase);
    if(lowercase.checked)
        funcArr.push(generateLowercase);
    if(numbers.checked)
        funcArr.push(generateNumbers);
    if(symbols.checked)
        funcArr.push(generateSymbols);

    for(let i=0; i<funcArr.length; i++){
        pswd += funcArr[i]();
    }
    for(let i=0; i<pswdLen-funcArr.length; i++){
        let rndIdx = getRandomNumber(0, funcArr.length);
        pswd += funcArr[rndIdx]();
    }

    pswd = sufflePswd(Array.from(pswd));

    pswdDisplay.value = pswd;

    calcStrength();
})