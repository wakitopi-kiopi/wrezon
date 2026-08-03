function sendData(){
    const data = document.getElementById("inputBar");

    const extracted = data.value;

    const outPut = document.getElementById("output-Data");

    outPut.textcontent = extracted;

}
function getdata() {
    //let log = document.getElementById("brand-logo");

    //log.classList.add("collapsed");

    const data = document.getElementById("inputData");

    const extractedData = data.value;

    const display = document.getElementById("displayData");

    display.textContent = extractedData;
}

//function dataSearch(){
   // const question = document.getElementById("inputData");

   // const questionData = question.value;

    //fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&titles=${pageTitle}&origin=*`,{
       // method:'GET',
      //  headers:{'content-Type':'Application/json'},
       // body:JSON.stringify({message:questionData})

    //}
   // )

    //.then(data=>{
       // let answer = data.answer;
        //let outout = document.getElementById("displayData");
        //outout.textContent = answer;
       // console.log("answer displayed");
  //  })

    //.catch(error =>{
      //  let outout = document.getElementById("displayData");
       // outout.textContent ="error 101 occured"
       // console.log(error)
    //})


//}

function dataSearch() {
    // 1. Get your display element
    let output = document.getElementById("displayData");

    // 2. Clear it out so you know it's working
    output.textContent = "Fetching from API...";

    // 3. Hit a simple, reliable API (This one gives random advice)
    fetch('https://api.adviceslip.com/advice')
        .then(response => {
            // Unbox the data into a readable JavaScript object
            return response.json();
        })
        .then(data => {
            // The API gives us an object like: { slip: { id: 1, advice: "Text" } }
            // So we grab data.slip.advice
            let apiData = data.slip.advice;

            // 4. Force it onto your screen!
            output.textContent = apiData;
            console.log("Success! Data is on the screen.");
        })
        .catch(error => {
            // If the internet drops or something breaks, show this
            output.textContent = "Error: Could not reach the API.";
            console.error(error);
        });
}
function dataSearch() {
    let output = document.getElementById("displayData");
    output.textContent = "Connecting to fallback API...";

    // A completely open, hyper-reliable test URL
    fetch('https://api.agify.io/?name=bella')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            // This API returns a super clean object: { name: "bella", age: 38, count: 24 }
            let apiData = `API Response: The predicted age for ${data.name} is ${data.age}.`;

            // Force it onto your screen!
            output.textContent = apiData;
            console.log("Success! Fallback data displayed.");
        })
        .catch(error => {
            output.textContent = "Still blocked. Error details: " + error.message;
            console.error("Fetch Error:", error);
        });
}
//function loadUserName(){
    //const userName = "wakitopi";

   // const display = document.getElementById("displayData");
    //display.textContent='well come back,${}';



//}
//loadUserName();


const images = ['android.png','bc1.png','bcgd.png','key.png'];
const imageView = document.getElementById("imageTag");

let countIndex = 0;
function showImage(){
    imageView.src = images[countIndex];
    countIndex +=1;

    if (countIndex === images.length){
        countIndex = 0;
    }
}

showImage();

setInterval(showImage,4800);


const videos = ['android.png', 'bc1.png', 'bcgd.png', 'key.png'];
const videoTag = document.getElementById("video");

//let countIndex = 0;
function showImages() {
    videoTag.src = images[countIndex];
    countIndex += 1;

    if (countIndex === videos.length) {
        countIndex = 0;
    }
}

showImage();

setInterval(showImages, 4000);

const video= ['android.png', 'bc1.png', 'bcgd.png', 'key.png'];
const videosTag = document.getElementById("videos");

//let countIndex = 0;
function showImagesi() {
    videosTag.src = images[countIndex];
    countIndex += 1;

    if (countIndex === videos.length) {
        countIndex = 0;
    }
}

showImage();

setInterval(showImagesi, 4600);