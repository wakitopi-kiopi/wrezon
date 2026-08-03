//const container=document.getElementById("notes");
//container.textContent="hey wrezon";

function getdata(){
    let log = document.getElementById("brand-logo");

    log.classList.add("collapsed");

    const data = document.getElementById("inputData");

    const extractedData = data.value;

    const display = document.getElementById("displayData");

    display.textContent=extractedData;
}

function addBox(){
    const text = "i am";

    let bigBox = document.getElementById("displayData");

    let newBox = document.createElement("div");

    newBox.classList.add("display-card");

    bigBox.appendChild(newBox);
    
    newBox.textContent =text;
}
