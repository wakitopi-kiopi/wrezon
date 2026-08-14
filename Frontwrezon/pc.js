import { initMarkdownRendered, renderMarkdown } from "./coderender_engine.js";

initMarkdownRendered()

// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA2-yAsjvuwo4sOMz_VLT6rtYhq8jUsYO8",
    authDomain: "wrezona-2509e.firebaseapp.com",
    projectId: "wrezona-2509e",
    storageBucket: "wrezona-2509e.firebasestorage.app",
    messagingSenderId: "675141662820",
    appId: "1:675141662820:web:e065be8ccf136e877e8771",
    measurementId: "G-KGVYJKXPSQ",
    
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

window.auth = auth;
window.provider = provider;
window.signInWithPopup = signInWithPopup;
window.onAuthStateChanged = onAuthStateChanged;


let userWellcome;


function landing_router() {

    // pc.js
    document.addEventListener("DOMContentLoaded", () => {
        const pcMode = document.getElementById("pcMode");
        const pMode = document.getElementById("mobileMode");

        // Exit if we are on pc.html or phone.html where these buttons don't exist
        if (!pcMode && !pMode) return;

        async function handleAuthAndNavigate(e, targetUrl) {
            // 1. Stop default link behavior completely
            e.preventDefault();
            e.stopPropagation();

            const auth = window.auth;
            const provider = window.provider;
            const signInWithPopup = window.signInWithPopup;

            if (!auth) {
                console.error("Firebase auth instance is missing on window.");
                return;
            }

            // 2. Check if user is already authenticated
            if (auth.currentUser) {
                // User is ready -> Navigate now
                window.location.href = targetUrl;
                return;
            }

            // 3. User is NOT authenticated -> Trigger Auth FIRST
            try {
                console.log("Triggering Google Popup...");
                await signInWithPopup(auth, provider);
               
                // 4. Auth SUCCESS -> NOW trigger the page shift sequentially
                console.log("Auth successful! Navigating to:", targetUrl);
                window.location.href = targetUrl;

            } catch (error) {
                // 5. Auth FAILED or CANCELLED -> Stay on landing page
                console.warn("Sign-in cancelled or failed. Navigation aborted:", error);
            }
        }

        // Attach handlers
        if (pcMode) {
            pcMode.addEventListener("click", (e) => handleAuthAndNavigate(e, "pc.html"));
        }

        if (pMode) {
            pMode.addEventListener("click", (e) => handleAuthAndNavigate(e, "phone.html"));
        }
    });
}

// Run router after DOM loads
//document.addEventListener("DOMContentLoaded", landing_router);
landing_router()
let currentUserName = []
function loadPageContent(){
    function getFirstName(user) {
        if (!user || !user.displayName) return "User";
        return user.displayName.trim().split(" ")[0];
    }
    document.addEventListener("DOMContentLoaded", () => {
        let userWellcome = document.getElementById('userWellcome');
        let userName = document.getElementById('userName');
        
        const onAuthStateChanged = window.onAuthStateChanged;
        onAuthStateChanged(window.auth, (user) => {
            if (user) {
                const firstUsername = getFirstName(user)
                currentUserName.push(firstUsername);
                // 🔍 PRINT EVERYTHING TO THE CONSOLE TO SEE ALL AVAILABLE PROPERTIES
                console.log("Logged in Firebase User Object:", user);

                // Access standard properties directly on `user`
                const name = user.displayName;
                const email = user.email;
                const photo = user.photoURL;
                const uid = user.uid;

                if (userWellcome) {
                    
                    userName.innerHTML = ` ${firstUsername || 'User'} `;
                }
            } else {
                console.log("No user signed in.");
            }
        });
    });
}

loadPageContent();


function Tab() {
    const menu = document.getElementById("tabBar");
    const menubar = document.createElement("div");
    menubar.classList.add("menu-tab");
    menu.appendChild(menubar);

};
const wrezonID = document.getElementById('wrezonID');
const wrezonContet = document.getElementById('wrezonContent');
function addsendbutton() {
    const addSendButton = document.getElementById("textArea");
    const sendButton = document.getElementById('sendBt');
    const mic = document.getElementById("mic");
    const voiceChat = document.getElementById('voiceChat');
  

    document.addEventListener('click',function(e){
        wrezonID.classList.add('HD');
        wrezonContet.classList.add('HD')
    })
    addSendButton.addEventListener('input', function (e) {

        e.stopPropagation();
        wrezonID.classList.add('PD');
        wrezonContet.classList.add('HD')
        if (addSendButton.value.trim() === "") {
            sendButton.classList.add("HD");
            //voiceChat.classList.remove('HD');
            mic.classList.remove('HD');
            



        } else {
            sendButton.classList.add('search-icon');
            sendButton.classList.remove("HD")
            //voiceChat.classList.add('HD');
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

const removelogo1 = document.getElementById("logo1");
const removelogo2 = document.getElementById("logo2");

function removeOverLays(){
    moveFAB.classList.add("FAB2");
    let userWellcome = document.getElementById('userWellcome');

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
    
    

}
reducelogo.addEventListener('click', function add() {
    removeOverLays();

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

function userInputInteractionControl() {
    let collectUserQuestion = document.getElementById("textArea");

    const mic = document.getElementById("mic");
    const voiceChat = document.getElementById('voiceChat');
    const displayAnswer = document.getElementById("displayData");
    const sendButton = document.getElementById('sendBt'); // Explicit send button handle
    const searchLone = document.getElementById('search-lone');
    const appName = document.getElementById("appName");
    const bulb = document.getElementById('bulb');
    const inputFrame = document.getElementById('inputFrame'); // Ensure inputFrame exists
    const ismobilePhone = window.matchMedia('(hover:none) and (pointer:coarse)').matches;


    

    if (appName) appName.classList.add("HD"); 
    let isNavigatingBack = false;

    if (ismobilePhone && collectUserQuestion) {
        // 1. When input is focused (keyboard pops up)
        collectUserQuestion.addEventListener('focus', () => {
            // If we are currently handling a back navigation, ignore focus!
            if (isNavigatingBack) return;

            if (!window.history.state || !window.history.state.keyboardOpen) {
                window.history.pushState({ keyboardOpen: true }, '');
            }
        });

        // 2. Handle the Back button / Screen edge swipe
        window.addEventListener('popstate', (e) => {
            isNavigatingBack = true; // Lock focus listeners temporarily

            // Force soft keyboard down
            if (document.activeElement) {
                document.activeElement.blur();
                ``}

            // Wait 300ms for mobile keyboard collapse animation to finish completely
            setTimeout(() => {
                if (reducelogo) {
                    reducelogo.classList.remove('replaced-frame');
                }
                if (inputFrame) {
                    inputFrame.classList.remove('replaced-frame');
                }

                isNavigatingBack = false; // Unlock focus listeners
            }, 300);
        });
    }

    

    // Do your custom logic here
    // e.g., close modals, go back a state, etc.

    // If you want to prevent going back:
    // e.preventDefault(); // (doesn't work with popstate)
    

    // -------------------------------------------------------------
    // MICROPHONE CONTROL
    // -------------------------------------------------------------
    function micControl() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        sendButton.classList.add('HD');


        sendButton.addEventListener('click', (e) => {
            // 1. Guard check: Is the button hidden or disabled?
            if (e.currentTarget.classList.contains('HD') || e.currentTarget.disabled) {
                e.preventDefault();
                e.stopImmediatePropagation(); // Kills all other listeners on this SAME element
                return;                       // Completely exits execution
            }

            // 2. Normal send logic below...
            console.log("Valid click processed!");
        });
        
        

        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser. Use Google Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = navigator.language || 'en-US';

        let isListening = false;
        let silenceTimeout = null;
        const MAX_SILENCE_MS = 5000;
        

        function turnOn(e) {
            
            isListening = true;

            // UI for RECORDING
            mic.classList.remove('HD');
            wrezonID.classList.add('HD');
            wrezonContet.classList.add('HD')
            removeOverLays();
            if (bulb) bulb.classList.add('bulb');

           

            if (searchLone) searchLone.innerHTML = "×";

            if (ismobilePhone) {

                reducelogo.classList.remove('replaced-frame');
                if (e.currentTarget.classList.contains('HD') || e.currentTarget.disabled) {
                    e.preventDefault();
                    e.stopImmediatePropagation(); // Kills all other listeners on this SAME element
                    return;                       // Completely exits execution
                }
            }
            

            try {
                recognition.start();
            } catch (err) {
                console.log("Already started or starting:", err);
            }
            setTimeout(() => {
                sendButton.classList.add('search-icon');
                sendButton.classList.remove('HD');
            }, 500)

            resetSilenceTimer();
        }

        function turnOff() {
            isListening = false;
            clearTimeout(silenceTimeout);

            try {
                recognition.stop();
            } catch (e) { }

            if (bulb) bulb.classList.remove('bulb');
            mic.classList.remove('HD');
            searchLone.innerHTML = ""

            const currentUserQuestion = collectUserQuestion.value.trim();

            if (currentUserQuestion !== "") {
                sendButton.classList.remove("HD");
                sendButton.classList.add('search-icon');

                // 300ms delay to prevent mobile speech hardware lockup
                setTimeout(() => {
                    sendButton.click();
                }, 300);
            } else {
                sendButton.classList.add("HD");
                sendButton.classList.remove('search-icon');
                if (searchLone) {
                    searchLone.innerHTML = "";
                    searchLone.classList.remove('onsearch');
                    searchLone.classList.add('PD');
                }
            }
        }

        function resetSilenceTimer() {
            clearTimeout(silenceTimeout);
            silenceTimeout = setTimeout(() => {
                turnOff();
            }, MAX_SILENCE_MS);
        }

        function handleMicToggle(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation(); // STOPS EVENT BLEEDING TO SEND BUTTON
            }

            if (!isListening) {
                turnOn(e);
                sendButton.classList.add('PD')
            } else {
                turnOff();
            }
        }

        // Attach SINGLE event listener based on device type
        if (ismobilePhone) {
            
            mic.addEventListener('pointerdown', handleMicToggle);
        } else {
            mic.addEventListener('click', handleMicToggle);
        }

        if (searchLone) {
            searchLone.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                collectUserQuestion.value = "";
                turnOff();
            });
        }

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            collectUserQuestion.value = text;
            resetSilenceTimer();
        };

        recognition.onend = () => {
            if (isListening) {
                setTimeout(() => {
                    try { recognition.start(); } catch (e) { }
                }, 100);
            }
        };
    }

    micControl();

    // -------------------------------------------------------------
    // SEND BUTTON / API INTERACTION
    // -------------------------------------------------------------
    sendButton.addEventListener('click', async function (e) {
        console.log("i am clicked")
        e.stopPropagation();
        e.preventDefault();
        console.log("🔥 SEND FIRED!");
        console.log("Clicked Element (e.target):", e.target);
        console.log("Current Element (e.currentTarget):", e.currentTarget);
        console.trace();

        if (inputFrame) {
            setTimeout(() => { inputFrame.classList.remove('replaced-frame'); }, 200);
        }

        const question = collectUserQuestion.value;
        console.log(currentUserName)

        // CHECK EMPTY TEXT BEFORE HIDING UI
        const emptymessage = document.createElement('div');
        if (!question.trim()) {
            
            emptymessage.classList.add("emptyInput");
            emptymessage.innerHTML = 'You did not type anything..';

            displayAnswer.appendChild(emptymessage);
            emptymessage.scrollIntoView({ behavior: "smooth", block: "end" });
             // Clean break, UI state stays intact!
            console.log('here')
            setTimeout(() => {
                emptymessage.classList.add('PD');

            }, 1800);
            return;

        }
       
        if (searchLone) searchLone.classList.add('onsearch');
        sendButton.classList.add("HD");

        collectUserQuestion.value = ""; // Clear input

        // Add User Question to UI
        const messageWithName = `(User name: ${currentUserName[0]}) ${question}`;

        conversationHistory.push({
            role: 'user',
            content: messageWithName  // ← Name is now in the query
        });
        //conversationHistory.push({ role: 'user', content: question });
        const userQuestion = document.createElement("pre");
        userQuestion.classList.add("user_input_display");
        userQuestion.textContent = question;
        displayAnswer.appendChild(userQuestion);

        // Loading Animation Setup
        const loadingIconContainer = document.createElement('div');
        loadingIconContainer.classList.add("animationcontainer");

        displayAnswer.appendChild(loadingIconContainer);
        displayAnswer.scrollTop = displayAnswer.scrollHeight;

        const loadingIcon = document.createElement("div");
        loadingIcon.classList.add("loadAnimation");
        loadingIconContainer.appendChild(loadingIcon);

        const loadingIconText = document.createElement("div");
        loadingIconText.classList.add("loadingText");
        loadingIconContainer.appendChild(loadingIconText);

        loadingIconText.innerText = 'Wrezoning...';

        const t1 = setTimeout(() => { loadingIconText.textContent = "Orchestrating.."; }, 9000);
        const t2 = setTimeout(() => { loadingIconText.textContent = "taking longer 🌩️.."; }, 17000);

        try {
            const chat = await fetch("https://wrezon.onrender.com/provider_router", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: conversationHistory })
            });

            const response = await chat.json();

            clearTimeout(t1);
            clearTimeout(t2);
            loadingIconContainer.remove();

            conversationHistory.push({ role: 'assistant', content: response.answer });

            const formatedData = renderMarkdown(response.answer);
            const newTextBox = document.createElement('div');
            newTextBox.classList.add("message_display");
            newTextBox.innerHTML = formatedData;

            displayAnswer.appendChild(newTextBox);

            const countedText = response.answer.split(" ").length;
            if (countedText < 80) {
                displayAnswer.scrollTop = displayAnswer.scrollHeight;
            } else {
                userQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Reset UI for next input
            sendButton.classList.add('HD');
            if (voiceChat) voiceChat.classList.remove('HD');
            mic.classList.remove('HD');

        } catch (error) {
            clearTimeout(t1);
            clearTimeout(t2);
            loadingIconContainer.classList.add("animationcontainerX");
            loadingIconText.textContent = "connection problem...";
            console.log("Error within query initiation", error);

            setTimeout(() => {
                loadingIconContainer.classList.add("PD");
                sendButton.classList.remove('HD');
                mic.classList.remove('HD');
            }, 5000);
        }
    });
}

userInputInteractionControl();

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








