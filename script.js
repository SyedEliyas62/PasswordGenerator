const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-password-display]");
const copyMsg = document.querySelector("[data-copying-msg]");
const copyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector("[data-generate-button]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|\\:;"\'<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 1;
handleSlider();
setIndicator("#ccc")

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%" 
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
    return getRndInteger(0, 10);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randomNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randomNum);
}

function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach(el => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach(checkbox => {
        if (checkbox.checked) {
            checkCount++;
        }
    });
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});


copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

generateButton.addEventListener('click', () => {
    if (checkCount <= 0) return;

    if (passwordLength <= checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    let funArr = [];

    if (uppercaseCheck.checked) funArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funArr.push(generateLowerCase);
    if (numbersCheck.checked) funArr.push(getRandomNumber);
    if (symbolsCheck.checked) funArr.push(generateSymbol);

    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }

    for (let i = funArr.length; i < passwordLength; i++) {
        let randIndex = getRndInteger(0, funArr.length);
        password += funArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
});
