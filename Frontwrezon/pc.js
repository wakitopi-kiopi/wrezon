import { initMarkdownRendered, renderMarkdown } from "./coderender_engine.js";


initMarkdownRendered()

function Tab() {
    const menu = document.getElementById("tabBar");
    const menubar = document.createElement("div");
    menubar.classList.add("menu-tab");
    menu.appendChild(menubar);

};
function addsendbutton() {
    const addSendButton = document.getElementById("textArea");
    const sendButton = document.getElementById('sendBt');
    const mic = document.getElementById("mic");
    const voiceChat = document.getElementById('voiceChat');

    addSendButton.addEventListener('input', function (e) {

        e.stopPropagation();
        if (addSendButton.value.trim() === "") {
            sendButton.classList.add("HD");
            voiceChat.classList.remove('HD');
            mic.classList.remove('HD');



        } else {
            sendButton.classList.add('search-icon');
            sendButton.classList.remove("HD")
            voiceChat.classList.add('HD');
            mic.classList.add('HD');


        }


    });
}
addsendbutton()

const button = document.getElementById("btn");
const display = document.getElementById("menu");



button.addEventListener('click', function (e) {
    e.stopPropagation();
    display.classList.toggle("slide-menu");

});

display.addEventListener('click', function (e) {
    e.stopPropagation();

});

document.addEventListener('click', function (e) {

    display.classList.remove("slide-menu");
})
//ADD REMOVE LOGO
const reducelogo = document.getElementById("Frame");
const nextlogo = document.getElementById("logo-container");
const moveFAB = document.getElementById("btn");
const mainlogo = document.getElementById("mainLogo");


const rLogo = document.getElementById("r-logo");
const dLogo = document.getElementById("d-logo");
const blogo = document.getElementById("b-logo");
const blogoDown = document.getElementById("b1-logo");
const userWellcome = document.getElementById("userWellcome");
const removelogo1 = document.getElementById("logo1");
const removelogo2 = document.getElementById("logo2");

reducelogo.addEventListener('click', function add() {
    moveFAB.classList.add("FAB2");

    nextlogo.classList.replace("logo-container", "containerTop-logo");

    mainlogo.classList.add("reduced_logo");
    rLogo.classList.add("T_r-logo");
    dLogo.classList.add("T_d-logo");
    blogo.classList.add("T_b-logo");
    blogoDown.classList.add("T_b-logo");



    //DISPLAY WREZON NAME WHEN THE LOGO GOES TO TOP CORNER BY CLICK
    const appName = document.getElementById("appName");
    appName.innerHTML = "wrezon"
    userWellcome.classList.add("HD");
});

const send = document.getElementById("sendBt");
const onsearchmask = document.createElement('button')

//CONVERSATION HISTORY AND SYSTEM PROMPT


//MOBILE KEYBOARD TOGGLE UP AND DOWN
// interactive-widget=overlays-content, this saves to let the key board to not push the page up and let the page be in place, allways in html 

const inputFrame = document.getElementById("Frame");
const collectUserQuestion = document.getElementById("textArea");


const ismobilePhone = window.matchMedia('(hover:none) and (pointer:coarse)').matches;
if (ismobilePhone) {
    collectUserQuestion.addEventListener('click', function (e) {

        inputFrame.classList.add('replaced-frame');
        //inputFrame.addEventListener('click',(e)=>{e.stopPropagation();})
        //collectUserQuestion.addEventListener('pointerdown',(e)=>{e.stopPropagation();})
    })
    document.addEventListener('click', (e) => { if (!inputFrame.contains(e.target)) { inputFrame.classList.remove('replaced-frame') } })
}
// APP HEART FUNCTION, REAL TIME DATA TRANSACTION
let conversationHistory = [];
send.addEventListener('click', async function (e) {
    e.stopPropagation();
    e.preventDefault();
    setTimeout((e) => { inputFrame.classList.remove('replaced-frame') }, 200)

    const mic = document.getElementById("mic");
    const voiceChat = document.getElementById('voiceChat');

    const displayAnswer = document.getElementById("displayData")
    const collectUserQuestion = document.getElementById("textArea");
    const sendButton = document.getElementById('sendBt');
    const question = collectUserQuestion.value;
    const appName = document.getElementById("appName");
    appName.classList.add("HD")

    sendButton.classList.add("HD");
    onsearchmask.classList.add("send-icon");
    //CHECK THE TEXT AREA NOT EMPTY TO AVOID SENDING A USELESS REQUET TO THE MODEL
    if (!question.trim()) {
        const emptymessage = document.createElement('div');
        emptymessage.classList.add("emptyInput");
        emptymessage.innerHTML = 'You did not type anything..';

        displayAnswer.appendChild(emptymessage);
        emptymessage.scrollIntoView({ behavior: "smooth", block: "end" })

        return;// key point to break the function execution, as there is no loop to call a break

    };
    collectUserQuestion.value = ""; //let the textarea become empty after the response has come
    console.log("chat function initialized")
    let waiting = 'Wrezoning...'
    let failed = "connection problem..."

    conversationHistory.push({ role: 'user', content: question });
    // USER QUETION DISPLAY TO THE DATA DISPLAY PART
    const userQuestion = document.createElement("pre");
    userQuestion.classList.add("user_input_display");
    userQuestion.textContent = question
    displayAnswer.appendChild(userQuestion)

    let wordCount = 0
    //LOADING ANIMATION PART
    const loadingIconContainer = document.createElement('div');
    loadingIconContainer.classList.add("animationcontainer")

    displayAnswer.appendChild(loadingIconContainer);
    displayAnswer.scrollTop = displayAnswer.scrollHeight;

    const loadingIcon = document.createElement("div");
    loadingIcon.classList.add("loadAnimation");
    loadingIconContainer.appendChild(loadingIcon);

    const loadingIconText = document.createElement("div");
    loadingIcon.classList.add("loadingText");

    loadingIconContainer.appendChild(loadingIconText)
    loadingIcon.textContent = '~'

    loadingIconText.innerText = waiting
    setTimeout(function () {
        loadingIconText.textContent = "Orchastrating.."
    }, 9000)
    setTimeout(function () {
        loadingIconText.textContent = "taking longer 🌩️.."
    }, 7000)
    setTimeout(function () {
        loadingIconContainer.textContent = ""
    }, 70000)

    // SEND NOW DATA THROUGH A NETWORK TO THE SERVER "API" FOR MODEL TEXT ANSWER GENERATION
    try {
        const chat = await fetch("https://wrezon.onrender.com/provider_router", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: conversationHistory
            })
        });

        const response = await chat.json();
        console.log("response from wrezon AI", JSON.stringify(response, null, 2))


        loadingIconContainer.remove()//remove the icon login when the answer arives
        //let the conversation be held as we go
        conversationHistory.push({ role: 'assistant', content: response.answer })

        // CLEAN THE TEXT FROM UNNECESSARY ASTERISKS AND BOLD THE MAIN POINTS
        function formatText(rawResponse) {
            if (!rawResponse) { return; }

            let formatedText = rawResponse
            formatedText = formatedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            formatedText = formatedText.replace(/\*(.*?)\*/g, "<em>$1</em>");
            formatedText = formatedText.replace(/\n/g, "<br>");

            return formatedText;

        };
        // to access the formatedtext safely i need to consider assigning it to a new variable
        // this is because  when called it returns a string i need to use
        // the function call is where i put the data to be processed inside the functiion which it is carried by the parameter i set
        //const formatedData = formatText(response.answer);

        const formatedData = renderMarkdown(response.answer)

        const newTextBox = document.createElement('div');
        newTextBox.classList.add("message_display");
        newTextBox.innerHTML = formatedData;



        displayAnswer.appendChild(newTextBox);
        //displayAnswer.scrollTop = displayAnswer.scrollHeight;

        //the logic to let the twxt slid a bit to top when the text contained is long enough
        const textToCount = response.answer;
        const countedText = textToCount.split(" ").length;


        wordCount += countedText;

        if (countedText < 80) {
            displayAnswer.scrollTop = displayAnswer.scrollHeight;

        } else {
            userQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' })
            wordCount += countedText;

            if (countedText < 80) {
                displayAnswer.scrollTop = displayAnswer.scrollHeight;

            } else {
                userQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' })
                function consentDisplay() {
                    const consent = document.createElement('div');
                    consent.classList.add("consent");
                    newTextBox.appendChild(consent);
                    const consentMark = document.getElementById('mark');
                    consentMark.classList.add('consentMark');
                    consentMark.innerHTML = "wrezon is AI powered diverify the response";


                    setTimeout(function () {
                        consentMark.innerHTML = "";
                    }, 5000)
                };

                consentDisplay()

            }
        };

        
        sendButton.classList.add('HD')
        voiceChat.classList.remove('HD');
        mic.classList.remove('HD');
    } catch (error) {

        loadingIconContainer.classList.add("animationcontainerX")
        loadingIconText.textContent = failed;
        console.log("error within query initiation", error);

        function removeText() {
            loadingIconContainer.classList.add("PD")

        }
        setTimeout(removeText, 5000)
    }

});

function loopControler(ms) {
    return new Promise(function (relolve) {
        setTimeout(relolve, ms);
    });
};
async function videoRoute() {
    let videoAnalysisHistory = [];
    const displayAnswer = document.getElementById("displayData");
    const playtutorial = document.getElementById('playtutorial');


    const tutorialFAB = document.getElementById('tutorial-FAB'); // not yet added into action untill the videos come
    tutorialFAB.addEventListener('click', function (e) {
        e.stopPropagation();
        tutorialBar.classList.toggle('tutorial-bar-add');
    })

    tutorialBar.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    document.addEventListener('pointerdown', function (e) {
        if (!tutorialBar.contains(e.target) && !tutorialFAB.contains(e.target)) {
            tutorialBar.classList.remove("tutorial-bar-add");
            tutorialBar.classList.add("tutorial-bar");
        }
    });

    if (window.matchMedia('(hover:hover)').matches) {
        setTimeout(function () {
            tutorialBar.addEventListener('pointerleave', function (e) {
                e.stopPropagation();
                e.preventDefault();
                tutorialBar.classList.remove('tutorial-bar-add');

            });

        }, 700)

    };




    // APP HEART FUNCTION, REAL TIME DATA TRANSACTION
    send.addEventListener('click', async function (e) {
        e.preventDefault()
        const tutorialBar = document.getElementById("tutorialBar");
        let markCounter = document.createElement('div')


        const video_extracted_data_list = []
        const thumbnail_url = []

        const collectUserQuestion = document.getElementById("textArea");
        const question = collectUserQuestion.value;
        const trimedConversationHistory = conversationHistory.slice(-6);    //reduce the conversation history to 5 messages when too log and constans when equal or less than 5


        let videoAnalysisHistory = [{ "role": "user", "content": question }];
        // SEND NOW DATA THROUGH A NETWORK TO THE SERVER "API" FOR MODEL TEXT ANSWER GENERATION
        try {
            const chat = await fetch("https://wrezon.onrender.com/video_search", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: trimedConversationHistory
                })
            });

            const response = await chat.json();
            console.log("responce from video route", JSON.stringify(response.answer, null, 2));
            videoAnalysisHistory.push({ role: 'assistant', content: response.answer });

            if (!response.answer) { return };


            tutorialFAB.classList.remove('PD')
            tutorialFAB.classList.remove('tutorial-FAB')
            void tutorialFAB.offsetWidth;
            tutorialFAB.classList.add('tutorial-FAB');


            const video_data_set = response.answer;
            console.log(video_data_set);

            async function intervalAddVideo() {
                for (const item of video_data_set) {
                    const thumbnail_url = item.video_thumbnail_url
                    const embed_url = item.video_embed_url

                    const addTutorialCard = document.createElement('div');
                    addTutorialCard.classList.add("card");
                    addTutorialCard.setAttribute("embed_video_url", embed_url)
                    const innerCard = document.createElement('img')
                    innerCard.classList.add('inner_card');
                    addTutorialCard.appendChild(innerCard);
                    addTutorialCard.scrollIntoView({ behavior: 'instant', block: 'nearest' })
                    innerCard.src = thumbnail_url;
                    innerCard.alt = 'video image thumbnail'

                    tutorialBar.appendChild(addTutorialCard);
                    await loopControler(1000)


                };
                const DupResponseBreak = document.createElement('div');  //dup = dual pane response, a pair of video and text 
                DupResponseBreak.classList.add('consent_on_dup');

                tutorialBar.appendChild(DupResponseBreak)
                DupResponseBreak.scrollIntoView({ behavior: "smooth", block: "end" })



                tutorialBar.addEventListener('click', function (e) {
                    e.preventDefault();
                    const cardToPlay = e.target.closest('.card');
                    if (!cardToPlay) return;
                    const video_url = cardToPlay.getAttribute("embed_video_url");
                    const tutorialMark = document.createElement('button');

                    const markcounter = document.createElement('div');
                    const playerWrapper = document.createElement('div');

                    tutorialMark.classList.add('tutorial_mark');
                    tutorialMark.innerHTML = "▷";
                    displayAnswer.appendChild(tutorialMark)

                    playtutorial.classList.remove('HD')
                    playtutorial.classList.add('playTutorial');

                    playtutorial.innerHTML = ""
                    playtutorial.src = video_url;




                    displayAnswer.appendChild(playtutorial);
                    playtutorial.scrollIntoView({ behavior: "smooth", block: "start" })
                })




            };
            intervalAddVideo();



        } catch (error) {
            console.log("there is no need of a video for this yet", error);

        }
    });
};
videoRoute();

// make the promo do nothing when clicked , instead
//const promo = document.getElementById("promo");
//promo.addEventListener('click',function(e){
//    e.stopPropagation();
//});
// make the  menu disappear when the empty space is clicked
//document.addEventListener('click',function(){
//   promo.classList.add("HD")
//});

// definitions of IDs in use down
//const images = ['android.png', 'bc1.png', 'bcgd.png', 'key.png'];
//const imgText = ["💥good morning","🌤️are you good","i am wrezon","do it"];
//const nextBtn = document.getElementById("rbt");
//const backbtn = document.getElementById("lbt");

//const imageDisplay = document.getElementById("img1");
//const textDisplay = document.getElementById("imgtxt1");

// auto loop through images
//let currentIndex = 0;
//function displayImg(){

//    imageDisplay.src = images[currentIndex];
//    textDisplay.textContent=imgText[currentIndex];
//    currentIndex  +=1;

//    if (currentIndex === images.length){
//        currentIndex = 0;
//    }
//    else if (currentIndex > 1){
//      //  backbtn.classList.remove("HD");
//    }
//}
//displayImg();

//setInterval(displayImg,4800);

// next button
//nextBtn.addEventListener('click',function(){
//    imageDisplay.src = images[currentIndex];
//    textDisplay.textContent = imgText[currentIndex];
//    currentIndex += 1;

//    if (currentIndex === images.length) {
//        currentIndex = 0;
//    }

//});

//back button
//backbtn.addEventListener('click', function () {
//    imageDisplay.src = images[currentIndex];
//    textDisplay.textContent = imgText[currentIndex];
//    currentIndex -= 1;
//    if (currentIndex === 0) {
//        backbtn.classList.add("HD");

//    }


//});



//const videoData = ['vid1.mp4','vid2.mp4'];

//const videoClass = document.querySelectorAll(".promo-video");

//videoClass.forEach(function(Box,){

//    let currentVideoIndex = 0;

//    function videoDisplay() {
//        Box.src = videoData[currentVideoIndex];


//        Box.play().catch(err => console.log("waiting for user interaction"));

//        currentVideoIndex += 1;

//        if (currentVideoIndex === videoData.length) {
//            currentVideoIndex = 0;
//        }

//    };
//    videoDisplay();

//    setInterval(videoDisplay, 10000);


//});


//// admin page fire function . 20hrs of struggle finaly mapped out. 


function ADMIN() {
    const adminsite = document.getElementById("adminpage");
    const adbutton = document.getElementById("ADbutton");
    const adback = document.getElementById("adBackButton");
    console.log('function is runing')

    adbutton.addEventListener('click', function () {
        adminsite.classList.remove("adminHD")
        console.log('function step 2 runing ...')
    })

    adback.addEventListener('click', function (e) {
        e.stopPropagation();
        adminsite.classList.add("adminHD")
    });

}
ADMIN();

function adwork() {
    console.log("adwork initialized")
    const psBtn = document.getElementById("vPush");
    const datadisplay = document.getElementById("promo");


    psBtn.addEventListener('click', function () {







        const names = [];
        const vDescription = [];
        const collectednames = document.getElementById("vName").value;
        let clearnedNames = collectednames.split(',').map(item => item.trim());
        names.push(...clearnedNames);



        const collectedDescription = document.getElementById("vDescription").value;
        let clearnedDescription = collectedDescription.split(",").map(item => item.trim());
        vDescription.push(...clearnedDescription);




        console.log(names);
        console.log(vDescription);
        const newvideo = document.createElement("div");
        newvideo.className = "promo-video";
        datadisplay.appendChild(newvideo);

        console.log('addition step initialized!...');




    });


}
adwork();

function sendFile() {
    const addbutton = document.getElementById('addButton');
    const addFile = document.getElementById('files');
    const files_display = document.getElementById('files_display');

    addbutton.addEventListener('click', function (e) {
        addFile.click();



    })

}
sendFile()