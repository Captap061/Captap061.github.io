const jsform = document.querySelector(".js-form"),
    nameInput = jsform.querySelector("input"),
    myName = document.querySelector(".js-name"),
    USER_LS = "currentUser",
    SHOWING_ON = "showing";

function saveName(text){
    localStorage.setItem(USER_LS, text);
}    

function handleSubmit(event) {
    event.preventDefault(); 
    const currentValue = nameInput.value;
    paintname(currentValue);
    saveName(currentValue);
}

function askForName() {
    jsform.classList.add(SHOWING_ON);
    jsform.addEventListener("submit", handleSubmit);
}

function paintname(text) {
    jsform.classList.remove(SHOWING_ON);
    myName.classList.add(SHOWING_ON);
    myName.innerText = `Hello ${text}`;
}

function loadName() {
    const currentUser = localStorage.getItem(USER_LS);
    if(currentUser === null) {
        askForName();
    } else {
        paintname(currentUser);
    }
}

function init() {
    loadName();
}

init()