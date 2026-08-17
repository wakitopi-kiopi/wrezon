import { initMarkdownRendered, renderMarkdown } from "./coderender_engine.js";

initMarkdownRendered()

// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const ismobilePhone = window.matchMedia('(hover:none) and (pointer:coarse)').matches;
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
const wrezonID = document.getElementById('wrezonID');
const wrezonContet = document.getElementById('wrezonContent');

window.auth = auth;
window.provider = provider;
window.signInWithPopup = signInWithPopup;
window.onAuthStateChanged = onAuthStateChanged;





let userWellcome;

let currentUserName = []

function landing_router() {

    // pc.js
    document.addEventListener("DOMContentLoaded", () => {
        
        const loginCheck = document.getElementById('loginCheck');
        let Frame = document.getElementById("Frame");
        let userWellcome = document.getElementById('userWellcome');
        let userName = document.getElementById('userName');
        if(!loginCheck) return;

        // Exit if we are on pc.html or phone.html where these buttons don't exist
        //if (!pcMode && !pMode) return;

        //async function handleAuthAndNavigate(e, targetUrl) {
        async function handleAuthAndNavigate(e) {
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
                loginCheck.remove();
                wrezonContet.remove();
                wrezonID.remove();
                Frame.classList.add('frame');
                Frame.classList.remove('HD');
                if (userWellcome) {
                    userWellcome.classList.add('userWellcome')
                    userName.innerHTML = `${currentUserName || 'User'} `;

                }

                // User is ready -> Navigate now
                //window.location.href = targetUrl;
                return;
                
            }

            // 3. User is NOT authenticated -> Trigger Auth FIRST
            try {
                console.log("Triggering Google Popup...");
                await signInWithPopup(auth, provider);
                loginCheck.remove();
                wrezonContet.remove();
                wrezonID.remove();
                Frame.classList.add('frame');
                Frame.classList.remove('HD');
                if (userWellcome) {
                    userWellcome.classList.add('userWellcome')
                    userName.innerHTML = ` ${currentUserName || 'User'} `;

                }
                
                // 4. Auth SUCCESS -> NOW trigger the page shift sequentially
                console.log("Auth successful!:");
                //window.location.href = targetUrl;

            } catch (error) {
                loginCheck.innerHTML="→ Retry"
                // 5. Auth FAILED or CANCELLED -> Stay on landing page
                console.warn("Sign-in cancelled or failed. Navigation aborted:", error);
            }
        }

        // Attach handlers
        //if (pcMode) {
        //loginCheck.addEventListener("click", (e) => handleAuthAndNavigate(e, "pc.html"));
        loginCheck.addEventListener("click", (e) => handleAuthAndNavigate(e));
        //}

        //if (pMode) {
           // pMode.addEventListener("click", (e) => handleAuthAndNavigate(e, "phone.html"));
        //}
    });
}

// Run router after DOM loads
//document.addEventListener("DOMContentLoaded", landing_router);
landing_router()

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


//if ('serviceWorker' in navigator) {
   
    //navigator.serviceWorker.register('/sw.js')
//    navigator.serviceWorker.register('/sw.js', { type: 'module' })
//        .then(reg => console.log('Service Worker registered'))
//        .catch(err => console.log('Service Worker registration failed:', err));
//}
// Store the deferred event globally or at module level so it isn't missed
// Register Service Worker ONCE and manage update checks


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { type: 'module' })
        .then(reg => {
            console.log('Service Worker registered');
            // Hourly update check using the active registration
            setInterval(() => reg.update(), 3600000);
        })
        .catch(err => console.error('Service Worker registration failed:', err));
}

function appInstallation() {
    const installMenu = document.getElementById('installMenu');
    const installButton = document.getElementById('installButton');
    const cancelButton = document.getElementById('cancelButton');

    if (!installMenu || !installButton || !cancelButton) return;

    let installPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        installPrompt = e;
        installMenu.classList.add('installationMenu');
    });

    installButton.addEventListener('click', () => {
        if (installPrompt) installPrompt.prompt();
    });

    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        installMenu.classList.remove('installationMenu');
    });

    window.addEventListener('appinstalled', () => {
        installPrompt = null;
        installMenu.classList.remove('installationMenu');
    });
}
appInstallation();


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
  

    //document.addEventListener('click',function(e){
    //    wrezonID.classList.add('HD');
    //    wrezonContet.classList.add('HD')
    //})
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

const STATES = {TYPING:'typing',REST:'rest'}
history.replaceState(STATES.REST, "", '/');

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



if (ismobilePhone) {
    collectUserQuestion.addEventListener('click', function (e) {

        inputFrame.classList.add('replaced-frame');
        history.pushState(STATES.TYPING, " ", '/keyboard')
        console.log('state added')
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
    //const inputFrame = document.getElementById('inputFrame'); // Ensure inputFrame exists
    const ismobilePhone = window.matchMedia('(hover:none) and (pointer:coarse)').matches;
    const autoSender = document.getElementById('autosender')

    if(collectUserQuestion == ""){
        sendButton.classList.add('HD')
    }

    if (appName) appName.classList.add("HD"); 
    //function toggleSoftKeyboard() {
       

    //}

    if (ismobilePhone) {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Back button was pressed (page is leaving or hiding)
                collectUserQuestion.blur();  // Force blur
                inputFrame.classList.remove('replaced-frame');
                console.log('Back button detected - forcing reset');
            }
        });
       
        collectUserQuestion.addEventListener('blur', () => {
            history.replaceState(STATES.REST, "", '/nokeyboad');
            inputFrame.classList.remove('replaced-frame');
            console.log('Keyboard closed - input bar reset1 blur');
        });
        collectUserQuestion.addEventListener('focusout', () => {
            history.replaceState(STATES.REST, "", '/nokeyboad');
            inputFrame.classList.remove('replaced-frame');
            console.log('Keyboard closed - input bar reset1 focus out');
        });
        //();
        
        console.log('inputFrame on mobile:', inputFrame);  // Add this
        window.addEventListener('popstate', function (e) {
            history.replaceState(STATES.REST, "", '/nokeyboad');
            console.log('POPSTATE FIRED');
            
           if (e.state === STATES.REST) {
                inputFrame.classList.remove('replaced-frame');
                console.log('i am working')
            }
        });
       
    }
    // -------------------------------------------------------------
    // MICROPHONE CONTROL
    // -------------------------------------------------------------
    function micControl() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        //sendButton.classList.add('HD');
        


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
                textArea.blur(); 
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
            autoSender.classList.add('autosender')
          

            resetSilenceTimer();
        }

        function turnOff() {
            isListening = false;
            clearTimeout(silenceTimeout);
            autoSender.classList.remove('autosender')
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
            searchLone.innerHTML = `<svg style="color:white;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke = "currentColor" stroke - width="2" stroke - linecap="round" stroke - linejoin="round" >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg > `
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
        autoSender.classList.remove('autosender')
        if (ismobilePhone) {

            reducelogo.classList.remove('replaced-frame');
            if (e.currentTarget.classList.contains('HD') || e.currentTarget.disabled) {
                e.preventDefault();
                e.stopImmediatePropagation(); // Kills all other listeners on this SAME element
                return;                       // Completely exits execution
            }
        }


        if (inputFrame) {
            setTimeout(() => { inputFrame.classList.remove('replaced-frame'); }, 200);
        }

        const question = collectUserQuestion.value;
        console.log(currentUserName)

        // CHECK EMPTY TEXT BEFORE HIDING UI
        const emptymessage = document.createElement('div');
        if (!question.trim()) {
            
            emptymessage.classList.add("emptyInput");
            emptymessage.innerHTML = 'I did not get anything..';

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
            //const chat = await fetch("http://localhost:8000/provider_router", {
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
            sendButton.classList.add('PD')
            setTimeout(() => {
                loadingIconContainer.classList.add("PD");
                sendButton.classList.remove('HD');
                mic.classList.remove('HD');
            }, 5000);
        }
        sendButton.classList.remove('search-icon');
        sendButton.classList.add('HD')
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
            //const chat = await fetch("http://localhost:8000/video_search", {
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


                

                const playerWrapper = document.createElement('div');
                let playtutorial = document.createElement('iframe');

                tutorialBar.addEventListener('click', function (e) {
                    e.preventDefault();
                    const cardToPlay = e.target.closest('.card');
                    if (!cardToPlay) return;

                    const video_url = cardToPlay.getAttribute("embed_video_url");
                    const tutorialMark = document.createElement('button');
                    const tutorialcancel = document.createElement('div');
                    const markcounter = document.createElement('div');
                    
                   
                   
                    tutorialcancel.remove();
                    
                    tutorialMark.classList.add('tutorial_mark');
                    tutorialcancel.innerHTML = "×";

                    tutorialcancel.classList.add('tutorialCancel');

                    tutorialcancel.addEventListener('click', function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        playtutorial.innerHTML = "";
                        playerWrapper.remove();
                    })


                    
                    tutorialMark.innerHTML = "▷";
                    displayAnswer.appendChild(tutorialMark)
                    
                    playtutorial.classList.remove('HD')
                    
                   
                    playerWrapper.innerHTML = ""
                    playtutorial.innerHTML = "";
                    playtutorial.classList.add('playTutorial');
                    playerWrapper.classList.add('player-wrapper');
                    playtutorial.src = video_url;
                    playerWrapper.appendChild(playtutorial);
                    playerWrapper.appendChild(tutorialcancel);
                    
                    displayAnswer.appendChild(playerWrapper);
                    playerWrapper.scrollIntoView({ behavior: "smooth", block: "start" })
                    
                    if (ismobilePhone) { setTimeout(() => { tutorialBar.classList.remove('tutorial-bar-add'); }, 500) }
                   
                })

                if (ismobilePhone){
                    playtutorial.addEventListener('click', function () {
                        tutorialBar.classList.remove('tutorial-bar-add');
                    })
                }




            };
            intervalAddVideo();





        } catch (error) {
            console.log("there is no need of a video for this yet", error);

        }
        
    });
};
videoRoute();








