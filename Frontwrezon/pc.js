import { initMarkdownRendered, renderMarkdown } from "./coderender_engine.js";
//import {livechatsession } from "./micControl.js";
//livechatsession();

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

//let currentUserName = []

const videosender = document.getElementById('videosender');
window.currentUserName = "User";
let jarvis = document.getElementById('jarvis');

function landing_router() {

    // pc.js
    document.addEventListener("DOMContentLoaded", () => {

        const loginCheck = document.getElementById('loginCheck');
        let Frame = document.getElementById("Frame");
        let userWellcome = document.getElementById('userWellcome');
        let userName = document.getElementById('userName');
        if (!loginCheck) return;

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
                    userName.innerHTML = `${window.currentUserName || 'User'} `;

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
                    userName.innerHTML = ` ${window.currentUserName || 'User'} `;

                }

                // 4. Auth SUCCESS -> NOW trigger the page shift sequentially
                console.log("Auth successful!:");
                //window.location.href = targetUrl;

            } catch (error) {
                loginCheck.innerHTML = "→ Retry"
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

export function loadPageContent() {
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
                window.currentUserName = firstUsername;

                //currentUserName.push(firstUsername);
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
let installPrompt = null;

// Catch the event as early as possible in page execution
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPrompt = e;

    // If DOM is already ready, show the menu immediately
    const installMenu = document.getElementById('installMenu');
    if (installMenu) {
        installMenu.classList.add('installationMenu');
    }
});

function appInstallation() {
    const installMenu = document.getElementById('installMenu');
    const installButton = document.getElementById('installButton');
    const cancelButton = document.getElementById('cancelButton');

    if (!installMenu || !installButton || !cancelButton) return;

    // If the event fired before appInstallation() ran, show menu now
    if (installPrompt) {
        installMenu.classList.add('installationMenu');
    }

    installButton.addEventListener('click', async () => {
        if (!installPrompt) return;

        // Hide menu immediately after user clicks
        installMenu.classList.remove('installationMenu');

        // Trigger the browser's native prompt
        installPrompt.prompt();

        // Wait for the user's choice
        const { outcome } = await installPrompt.userChoice;
        console.log(`Install prompt outcome: ${outcome}`);

        // The prompt can only be used once, reset it
        installPrompt = null;
    });

    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        installMenu.classList.remove('installationMenu');
    });

    window.addEventListener('appinstalled', () => {
        installPrompt = null;
        installMenu.classList.remove('installationMenu');
        console.log('PWA was installed successfully!');
    });
}

// Run setup when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', appInstallation);
} else {
    appInstallation();
}


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

        // LIVE MODE OWNS THE SEND BUTTON
        if (window.liveMicActive) {
            sendButton.classList.add("HD");
            mic.classList.remove("HD");

            return;
        }


        e.stopPropagation();
        wrezonID.classList.add('PD');
        wrezonContet.classList.add('HD')


        if (addSendButton.value.trim() === "") {
            sendButton.classList.add("HD");
            //voiceChat.classList.remove('HD');
            mic.classList.remove('HD');
            voiceChat.classList.remove("HD")
            voiceChat.classList.add("search-icon")




        } else {
            sendButton.classList.add('search-icon');
            sendButton.classList.remove("HD")
            //voiceChat.classList.add('HD');
            mic.classList.add('HD');
            voiceChat.classList.add('HD')
            voiceChat.classList.remove("search-icon")





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

//const STATES = { TYPING: 'typing', REST: 'rest' }
//history.replaceState(STATES.REST, "", '/');

function removeOverLays() {
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

window.removeOverLays = removeOverLays;

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
        // history.pushState(STATES.TYPING, " ", '/keyboard')
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

    if (collectUserQuestion == "") {
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
            //history.replaceState(STATES.REST, "", '/nokeyboad');
            inputFrame.classList.remove('replaced-frame');
            console.log('Keyboard closed - input bar reset1 blur');
        });
        collectUserQuestion.addEventListener('focusout', () => {
            //history.replaceState(STATES.REST, "", '/nokeyboad');
            inputFrame.classList.remove('replaced-frame');
            console.log('Keyboard closed - input bar reset1 focus out');
        });
        //();

        console.log('inputFrame on mobile:', inputFrame);  // Add this
        window.addEventListener('popstate', function (e) {
            //history.replaceState(STATES.REST, "", '/nokeyboad');
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
        console.log('mic runing')

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
        const MAX_SILENCE_MS = 4000;


        function turnOn(e) {
            e.stopPropagation();
            dropMic();

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
                collectUserQuestion.blur();
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
                console.log('mic runing')
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

        //recognition.onresult = (event) => {
        //    const text = event.results[0][0].transcript;
        //   collectUserQuestion.value = text;
        //    resetSilenceTimer();
        //};
        // 1. Ensure recognition stays active across long pauses
        recognition.continuous = true;
        recognition.interimResults = true; // Optional: set to false if you only want finalized sentences

        // 2. Updated onresult handler
        recognition.onresult = (event) => {
            let fullTranscript = '';

            // Loop through all result chunks captured during this session
            for (let i = 0; i < event.results.length; i++) {
                fullTranscript += event.results[i][0].transcript;
            }

            // Assign the accumulated text
            collectUserQuestion.value = fullTranscript;


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
    collectUserQuestion.addEventListener('keydown', function (e) {

        if (e.key === 'Enter') {
            e.preventDefault()
            sendButton.click()
            console.log('enter pressed')
        }
    });



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
        const messageWithName = `(User name: ${window.currentUserName}) ${question}`;

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
        const t2 = setTimeout(() => { loadingIconText.textContent = "thinking.."; }, 17000);
        const t3 = setTimeout(() => { loadingIconText.textContent = "more time.."; }, 18000);

        try {
            //const chat = await fetch("https://wrezon.onrender.com/provider_router", {
            const chat = await fetch("http://localhost:8000/provider_router", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: conversationHistory })
            });
            
            const contentType = chat.headers.get("content-type");
            

            // Case 1: JSON response (answer, image_data, etc.)
            if (contentType?.includes("application/json")) {
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
                //setTimeout((e) => { if (ismobilePhone) { mic.pointerdown() } else{mic.click()} }, 500)
                const plainTextAnswer = response.answer.replace(/[*#_`~]/g, '');
                let langcode = response.lang;
                console.log(langcode)




                setTimeout(() => {
                    // 1. Ensure recognition isn't running before attempting to restart
                    if (typeof turnOff === 'function') {
                        turnOff(); // Clean up existing session state if necessary
                    }

                    // 2. Safely start listening or toggle the mic handler directly
                    try {
                        if (typeof handleMicToggle === 'function') {
                            handleMicToggle();
                        } else if (recognition) {
                            recognition.start();
                        }
                    } catch (err) {
                        console.warn("Microphone auto-restart blocked by browser policy:", err);
                    }
                }, 500);
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

            }

            // Case 2: PDF response
            else if (contentType?.includes("application/pdf")) {
                const blob = await chat.blob();
                downloadPDF(blob);
            }

            // Case 3: Unknown
            else {
                throw new Error(`Unknown content type: ${contentType}`);
            }

        

            function downloadPDF(blob) {
                const url = window.URL.createObjectURL(blob);
                const pdfHolder = document.createElement("div");
                const pdfbtn = document.createElement('div');
                const pdf = document.createElement("a");

                pdfHolder.classList.add('pdf-holder');
                pdfbtn.classList.add('pdfbtn')
                pdfbtn.innerHTML = "↓";
                pdfHolder.innerHTML = `
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="#ff4b4b" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9.5 11.5C9.5 12.33 8.83 13 8 13H7V15H5.5V9H8C8.83 9 9.5 9.67 9.5 10.5V11.5ZM14.5 13.5C14.5 14.33 13.83 15 13 15H10.5V9H13C13.83 9 14.5 9.67 14.5 10.5V13.5ZM18.5 10.5H17V11.5H18.5V13H17V15H15.5V9H18.5V10.5ZM7 10.5V11.5H8V10.5H7ZM12 10.5V13.5H13V10.5H12Z"/>
                    </svg>
                `;
                
                
                pdf.href = url;
                pdf.download = "export.pdf";
                pdf.style.display = "none"
                
                pdfHolder.appendChild(pdfbtn);
                pdfHolder.appendChild(pdf);
                displayAnswer.appendChild(pdfHolder);
               
                pdfHolder.addEventListener("click", function (e) {

                    e.stopPropagation();
                    window.open(url, '_blank');
                })
                
                pdfbtn.addEventListener("click", function (e) {
                    e.stopPropagation()
                    
                    pdf.click();
                })

            }
           

            

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




//let collectUserQuestion = document.getElementById("textArea");
let mic = document.getElementById("mic");
let voiceChat = document.getElementById('voiceChat');
let displayAnswer = document.getElementById("displayData");
let livesendButton = document.getElementById('sendBt');
let searchLone = document.getElementById('search-lone');
let appName = document.getElementById("appName");
let bulb = document.getElementById('bulb');
//let ismobilePhone = window.matchMedia('(hover:none) and (pointer:coarse)').matches;
let autoSender = document.getElementById('autosender');



export function livechatsession() {

    if (collectUserQuestion == "") {
        livesendButton.classList.add('HD')
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
    function livemicControl() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        console.log('mic runing');
        //const jarvis = document.getElementById('jarvis')

        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser. Use Google Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = navigator.language || 'en-US';

        let isListening = false;
        let isPaused = false;
        let silenceTimeout = null;
        const MAX_SILENCE_MS = 2000;

        window.isListening = false

        // --- PROGRAMMATIC PAUSE / RESUME ---
        window.pauseMic = function () {
            isPaused = true;
            clearTimeout(silenceTimeout);
            if (bulb) bulb.classList.remove('bulb');
            console.log("Mic paused");
        };

        window.resumeMic = function () {
            isPaused = false;
            if (isListening) {
                if (bulb) bulb.classList.add('bulb');
                resetSilenceTimer();
            }
            console.log("Mic resumed");
        };

        // --- SILENCE ACTION: SENDS TEXT WHILE KEEPING MIC ON ---
        function handleSilenceSend() {
            const currentUserQuestion = collectUserQuestion.value.trim();

            if (currentUserQuestion !== "") {
                // Trigger send without calling recognition.stop()
                // ✅ SAVE THE QUESTION BEFORE ANYTHING ELSE
                window._pendingQuestion = currentUserQuestion;
                DataGetWay();
                videosender.click();
                // Clear input for the next spoken phrase
                collectUserQuestion.value = "";
                //setTimeout(() => { collectUserQuestion.value = ""; },100)

                collectUserQuestion.dispatchEvent(new Event('input', { bubbles: true }));
            }

            // Reset silence timer to listen for the next sentence
            resetSilenceTimer();
        }

        function resetSilenceTimer() {
            clearTimeout(silenceTimeout);
            if (isListening && !isPaused) {
                silenceTimeout = setTimeout(() => {
                    handleSilenceSend();
                }, MAX_SILENCE_MS);
            }
        }

        function MicOn(e) {
            if (e) e.stopPropagation();
            collectUserQuestion.value = "";

            isListening = true;
            window.liveMicActive = true;
            isPaused = false;

            // UI for RECORDING
            mic.classList.remove('HD');
            wrezonID.classList.add('HD');
            wrezonContet.classList.add('HD');
            voiceChat.classList.add('onlive');

            removeOverLays();
            if (bulb) bulb.classList.add('bulb');

            if (searchLone) searchLone.innerHTML = "×";

            if (ismobilePhone) {

                reducelogo.classList.remove('replaced-frame');
                collectUserQuestion.blur();
                if (e && e.currentTarget && (e.currentTarget.classList.contains('HD') || e.currentTarget.disabled)) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
            }


            try {
                recognition.start();
            } catch (err) {
                console.log("Already started or starting:", err);
            }

            setTimeout(() => {
                livesendButton.classList.remove('search-icon');
                livesendButton.classList.add('HD');
            }, 5002);



            resetSilenceTimer();
        }

        // --- TURN OFF: INTENTIONAL MANUAL CLICK ONLY ---
        function MicOff() {
            isListening = false;
            window.liveMicActive = false;
            isPaused = false;
            clearTimeout(silenceTimeout);

            if (autoSender) autoSender.classList.remove('autosender');

            try {
                recognition.stop();
            } catch (e) { }

            if (bulb) bulb.classList.remove('bulb');
            mic.classList.remove('HD');
            voiceChat.classList.remove('onlive')
            //voiceChat.classList.remove('onlive')

            livesendButton.classList.add("HD");
            livesendButton.classList.remove('search-icon');



            if (searchLone) {
                searchLone.innerHTML = `<svg style="color:white;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>`;
            }
        }

        function ToggleMic(e) {
            if (e) {
                console.log('mic runing');
                e.preventDefault();
                e.stopPropagation();
            }

            if (!isListening) {
                MicOn();

                livesendButton.classList.add('HD');
            } else {
                MicOff();
                //livesendButton.classList.add('HD');
            }
        }
        window.startMic = function () {
            MicOn();  // Call without event object
        };

        window.stopMic = function () {
            MicOff();  // Same for stop
        };
        // ✅ EXPOSE GLOBALLY
        window.turnOff = MicOff;
        window.turnOn = MicOn;




        if (ismobilePhone) {
            voiceChat.addEventListener('pointerdown', (e) => {
                e.stopPropagation()
                e.preventDefault()
                //voiceChat.classList.add('onlive');
                //jarvisToggle(); // from jarvis logic

                ToggleMic();
                if (voiceChat && voiceChat.classList.contains('onlive')) {
                    jarvisOn();
                }


            });
        } else {
            voiceChat.addEventListener('click', (e) => {
                e.stopPropagation()
                e.preventDefault()
                //voiceChat.classList.add('onlive');
                //jarvisToggle(); // from jarvis logic
                ToggleMic()
                if (voiceChat && voiceChat.classList.contains('onlive')) {
                    jarvisOn();
                }

            });
        }
        if (searchLone) {
            searchLone.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                collectUserQuestion.value = "";
                turnOff();
                window.livePlayer.stop();
                voiceChat.classList.remove('onlive');

            });
        }


        function dropMic() {
            voiceChat.classList.remove('onlive');

        }
        //dropMic();
        window.dropMic = dropMic;


        // --- CAPTURE SPEECH ---
        recognition.onresult = (event) => {
            if (isPaused) return;

            let fullTranscript = '';

            for (let i = 0; i < event.results.length; i++) {
                fullTranscript += event.results[i][0].transcript;
            }

            collectUserQuestion.value = fullTranscript;
            collectUserQuestion.dispatchEvent(new Event('input', { bubbles: true }));

            resetSilenceTimer();
        };

        // Keep active if Chrome native engine auto-closes during long quiet periods
        recognition.onend = () => {
            if (isListening) {
                setTimeout(() => {
                    try { recognition.start(); } catch (e) { }
                }, 100);
            }
        };

        recognition.onerror = (event) => {
            if (event.error === 'no-speech' && isListening) return;
            console.warn("Speech recognition error:", event.error);
        };
    }

    livemicControl();


    function readTextAloud(plainTextAnswer, langcode = "en-US") {
        const cleantext = cleanTextForSpeech(plainTextAnswer);
        // 1. Check if the browser supports SpeechSynthesis
        if (!('speechSynthesis' in window)) {
            console.warn('Text-to-speech is not supported in this browser.');
            return;
        }

        // 2. Stop any speech that is currently playing
        window.speechSynthesis.cancel();

        // 3. Create a speech utterance object with your text
        const utterance = new SpeechSynthesisUtterance(cleantext);

        // 4. (Optional) Adjust voice settings
        //utterance.rate = 1.4;   // Speed: 0.1 to 10 (1.0 is normal)
        // utterance.pitch = 1.6;  // Pitch: 0 to 2 (1.0 is normal)
        //utterance.volume = 1.7; // Volume: 0 to 1
        //utterance.lang = langcode
        if (ismobilePhone) {
            // Natural mobile TTS tuning
            utterance.rate = 0.8;   // 0.9 - 1.0 works best on Android/iOS
            utterance.pitch = 1.0;  // 1.0 keeps natural human vocal depth
            utterance.volume = 0.7; // Valid spec range is strictly 0.0 to 1.0
        } else {
            // Your preferred PC setup
            utterance.rate = 1.1;
            utterance.pitch = 1.6;
            utterance.volume = 1.7; // Fixed from 1.7 to fit standard API limits
        }


        // ✅ DETECT WHEN TTS FINISHES
        utterance.onend = function () {
            console.log("TTS finished speaking!");
            // Resume mic here
            if (typeof window.resumeMic === 'function') {
                window.resumeMic();
                window.startMic();

            }
        };

        utterance.onerror = function (event) {
            console.warn("TTS error:", event);
            // Still resume mic even if there's an error
            if (typeof window.resumeMic === 'function') {
                window.resumeMic();
                window.startMic();
            }
        }
        // 5. Tell the browser to speak
        window.speechSynthesis.speak(utterance);
    }
    function cleanTextForSpeech(text) {
        if (!text) return "";

        return text
            // 1. Code blocks -> replace with a natural spoken cue
            .replace(/```[\s\S]*?```/g, ' [code snippet omitted] ')
            .replace(/`([^`]+)`/g, '$1') // Inline code: keep inner text

            // 2. Simple LaTeX Math replacements before stripping commands
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 over $2') // \frac{a}{b} -> a over b
            .replace(/\$\$[\s\S]*?\$\$/g, '')                       // Block math remove
            .replace(/\\\[[\s\S]*?\\\]/g, '')
            .replace(/\\(?:[a-zA-Z]+|\S)/g, '')                     // Drop leftover commands

            // 3. Strip remaining $ or \( wrappers
            .replace(/\$([^\$\n]+)\$/g, '$1')
            .replace(/\\\(([\s\S]*?)\\\)/g, '$1')

            // 4. Markdown Links & Images -> Keep only readable text
            .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')               // Drop images completely
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')              // Links -> text only

            // 5. Clean Markdown formatting symbols (Bold, Italic, Strikethrough, Headers, Quotes)
            .replace(/#{1,6}\s?/g, '')
            .replace(/(\*\*|__)(.*?)\1/g, '$2')
            .replace(/(\*|_)(.*?)\1/g, '$2')
            .replace(/~~(.*?)~~/g, '$1')
            .replace(/^\s*>\s?/gm, '')

            // 6. Clean List Items -> replace bullets/numbers with sentence periods so Piper pauses
            .replace(/^\s*[\-\*\+]\s+/gm, '. ')                     // Bullet points -> ". "
            .replace(/^\s*\d+\.\s+/gm, '. ')                       // Numbered list "1. " -> ". "

            // 7. Preserve Natural Spoken Pauses
            .replace(/\n+/g, '. ')                                  // Line breaks become sentence pauses
            .replace(/\.\s*\./g, '.')                               // Fix duplicate periods ".. "
            .replace(/\s+/g, ' ')                                   // Collapse extra spaces
            .trim();
    }
    function injectHmm(cleanText, options = {}) {
        const {
            addHmm = true,        // Master toggle
            hmmProbability = 0.4  // 40% chance to add "Hmm..."
        } = options;

        if (!cleanText) return [];

        // 1. Split into natural sentences
        let sentences = cleanText.split(/(?<=[.!?])\s+/);
        if (sentences.length === 0) return [];

        // 2. Decide and prepend "Hmm..." ONLY to the first sentence
        if (addHmm && Math.random() < hmmProbability) {
            sentences[0] = "hmm... " + sentences[0];
        }
        console.log(sentences)
        return sentences;
    }

    function chunkTextByWords(textToChunk) {
        const cleaned = cleanTextForSpeech(textToChunk);

        const hmminjectedsentences = injectHmm(cleaned, { hmmProbability: 0.2 })
        // const words = hmminjectedsentences.split(/\s+/);
        console.log(cleaned);
        // const chunks = [];

        // for (let i = 0; i < words.length; i += wordsPerChunk) {
        //     chunks.push(words.slice(i, i + wordsPerChunk).join(' '));
        // }

        //return chunks;
        return hmminjectedsentences;
    }

    // 2. ELEVENLABS QUEUE PLAYER CLASS



    class WrezonQueuePlayer {
        constructor() {
            this.queue = [];
            this.isPlaying = false;
            this.audioPlayer = document.getElementById("audio");
            this.liveaudio = document.getElementById('liveaudio');
            this.currentAudioUrl = null;
        }

        speak(rawText, lang = "en-US") {
            // Remove dummy sound - the loading animation provides feedback
            const textChunks = chunkTextByWords(rawText);
            this.addChunks(textChunks);
        }

        addChunks(chunks) {
            this.queue.push(...chunks);
            if (!this.isPlaying) {
                this.processNextChunk();
            }
        }

        async processNextChunk() {
            if (this.queue.length === 0) {
                this.isPlaying = false;
                if (typeof window.resumeMic == 'function') {
                    resumeMic();
                    startMic();
                }


                return;
            }

            this.isPlaying = true;
            if (typeof window.pauseMic == 'function') {
                pauseMic();
                stopMic();
            }

            //resumeMic();
            const currentChunk = this.queue.shift();

            console.log("pulling chunks")

            try {
                //const chat = await fetch("https://wrezon.onrender.com/livechat", {
                const response = await fetch("http://localhost:8000/livechat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "audio/wav"
                    },
                    body: JSON.stringify({
                        text_to_transcribe: currentChunk,
                        pitch: 0.89
                    })
                });

                if (!response.ok) throw new Error("TTS failed");

                //const rawBlob = await response.blob();

                //const audioBlob = new Blob([rawBlob], { type: 'audio/wav' });
                const rawBlob = await response.blob();
                const audioBlob = new Blob([await rawBlob.arrayBuffer()], { type: 'audio/wav' });
                console.log(rawBlob);

                // Clean up old URL
                if (this.currentAudioUrl) {
                    URL.revokeObjectURL(this.currentAudioUrl);
                    this.currentAudioUrl = null;
                }

                const audioUrl = URL.createObjectURL(audioBlob);
                this.currentAudioUrl = audioUrl;

                // UI
                if (this.liveaudio && typeof displayAnswer !== "undefined") {
                    this.liveaudio.classList.remove('PD');
                    this.liveaudio.classList.add('liveaudio');
                    displayAnswer.appendChild(this.liveaudio);
                }

                // Reset and set source
                this.audioPlayer.pause();
                this.audioPlayer.currentTime = 0;
                //pauseMic()
                this.audioPlayer.src = audioUrl;
                this.audioPlayer.load();

                // Wait for load
                await new Promise((resolve) => {
                    if (this.audioPlayer.readyState >= 3) {
                        resolve();
                    } else {
                        this.audioPlayer.addEventListener('canplay', resolve, { once: true });
                    }
                });

                // Set up handlers
                this.audioPlayer.onended = () => {
                    if (this.currentAudioUrl) {
                        URL.revokeObjectURL(this.currentAudioUrl);
                        this.currentAudioUrl = null;
                    }
                    this.processNextChunk();
                };

                this.audioPlayer.onerror = () => {
                    if (this.currentAudioUrl) {
                        URL.revokeObjectURL(this.currentAudioUrl);
                        this.currentAudioUrl = null;
                    }
                    this.processNextChunk();
                };

                await this.audioPlayer.play();

            } catch (error) {
                console.error("Queue error:", error);
                this.processNextChunk();
                resumeMic();
            }
        }

        stop() {
            this.queue = [];
            this.isPlaying = false;
            if (this.audioPlayer) {
                this.audioPlayer.pause();
                if (this.currentAudioUrl) {
                    URL.revokeObjectURL(this.currentAudioUrl);
                    this.currentAudioUrl = null;
                }
                this.audioPlayer.src = "";
            }
        }


    }

    //Initialize player instance (replace with your API key or proxy route)
    //const livePlayer = new WrezonQueuePlayer()
    //window.livePlayer = livePlayer;







    // -------------------------------------------------------------
    // SEND BUTTON / API INTERACTION



    async function DataGetWay(e = null) {// -------------------------------------------------------------
        //window.Getvideo();
        console.log("i am clicked")

        console.log("🔥 SEND FIRED!");


        if (ismobilePhone) {

            reducelogo.classList.remove('replaced-frame');
            if (e && e.currentTarget(e.currentTarget.classList.contains('HD') || e.currentTarget.disabled)) {
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
            console.log("nothing reached here")

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
        //stopMic();

        if (searchLone) searchLone.classList.add('onsearch');
        livesendButton.classList.add("HD");

        //collectUserQuestion.value = ""; // Clear input

        // Add User Question to UI
        const messageWithName = `(User name: ${window.currentUserName}) ${question}`;

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
        collectUserQuestion.value = "";

        try {
            //const chat = await fetch("https://wrezon.onrender.com/live_chat_provider_router", {
            const chat = await fetch("http://localhost:8000/live_chat_provider_router", {
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
            //setTimeout((e) => { if (ismobilePhone) { mic.pointerdown() } else{mic.click()} }, 500)
            const plainTextAnswer = response.answer.replace(/[*#_`~]/g, '');
            let langcode = response.lang;
            console.log(langcode)
            const AIcallSignature = document.createElement('div');
            AIcallSignature.classList.add('AIsignature');
            AIcallSignature.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 24" width="70%" height="70%" fill="none" stroke="currentColor"
                        stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <!-- 1. TELEPHONE ICON -->
                        <g transform="translate(0, 0)">
                            <path
                                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </g>
                    
                        <!-- 2. BIOLOGICAL BRAIN STRUCTURE -->
                        <g transform="translate(26, 0)">
                            <!-- Longitudinal Fissure (Center Line) -->
                            <path d="M13 3.5v15" stroke-width="1.5" />
                    
                            <!-- Outer Cortex Contour (Left & Right Hemispheres) -->
                            <path d="M13 3.5 C9 3.5, 4.5 6, 4.5 10.5 C4.5 13.5, 6 15, 7.5 16.5 C9 18, 11 18.5, 13 18.5" />
                            <path d="M13 3.5 C17 3.5, 21.5 6, 21.5 10.5 C21.5 13.5, 20 15, 18.5 16.5 C17 18, 15 18.5, 13 18.5" />
                    
                            <!-- Left Hemisphere Cortical Gyri & Sulci (Biological Folds) -->
                            <path d="M7 6.5 C8.5 6.5, 9.5 8, 8 9.5 C7 10.5, 6 9.5, 5.5 11" />
                            <path d="M12 6 C10.5 6, 10 7.5, 11 9 C11.8 10, 10 11.5, 8.5 11.5" />
                            <path d="M6 13.5 C7.5 13, 9 14, 10.5 13 C11.5 12.5, 12 13.5, 11 15" />
                            <path d="M7.5 16 C9 15.5, 10 16.5, 11.5 16" />
                    
                            <!-- Right Hemisphere Cortical Gyri & Sulci (Biological Folds) -->
                            <path d="M19 6.5 C17.5 6.5, 16.5 8, 18 9.5 C19 10.5, 20 9.5, 20.5 11" />
                            <path d="M14 6 C15.5 6, 16 7.5, 15 9 C14.2 10, 16 11.5, 17.5 11.5" />
                            <path d="M20 13.5 C18.5 13, 17 14, 15.5 13 C14.5 12.5, 14 13.5, 15 15" />
                            <path d="M18.5 16 C17 15.5, 16 16.5, 14.5 16" />
                    
                            <!-- Cerebellum Structure (Base) -->
                            <path d="M8.5 18.5 C9 20, 10.5 21, 13 21 C15.5 21, 17 20, 17.5 18.5" stroke-width="1.5" />
                            <path d="M10 19.5 C11 20, 12 20, 13 20 C14 20, 15 20, 16 19.5" stroke-width="1.2" />
                        </g>
                    </svg>
                    `;

            displayAnswer.appendChild(AIcallSignature);


            function handleSpeech(rawText, lang = 'en-US') {
                // 1. Chunk the text first
                setTimeout(() => { collectUserQuestion.value = ""; }, 100)

                try {
                    // TRY: Attempt to speak using ElevenLabs
                    console.log("Attempting ElevenLabs playback...");

                    // This will throw an error if API key is invalid, network fails, or quota is exceeded
                    //livePlayer.speak(plainTextAnswer);
                    readTextAloud(plainTextAnswer, langcode)

                } catch (error) {
                    // CATCH: If ElevenLabs fails for ANY reason, run local TTS instead!
                    console.warn("backwrezon failed or was unreachable. Falling back to local TTS:", error);

                    // Call local browser speech synthesis
                    readTextAloud(plainTextAnswer, langcode)
                }
            }
            handleSpeech(plainTextAnswer, langcode)


            setTimeout(() => {
                // 1. Ensure recognition isn't running before attempting to restart
                if (typeof turnOff === 'function') {
                    turnOff(); // Clean up existing session state if necessary
                }

                // 2. Safely start listening or toggle the mic handler directly
                try {
                    if (typeof handleMicToggle === 'function') {
                        handleMicToggle();
                    } else if (recognition) {
                        recognition.start();
                    }
                } catch (err) {
                    console.warn("Microphone auto-restart blocked by browser policy:", err);
                }
            }, 500);
            const countedText = response.answer.split(" ").length;
            if (countedText < 80) {
                displayAnswer.scrollTop = displayAnswer.scrollHeight;
            } else {
                userQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Reset UI for next input
            livesendButton.classList.add('HD');
            if (voiceChat) voiceChat.classList.remove('HD');
            mic.classList.remove('HD');


        } catch (error) {
            clearTimeout(t1);
            clearTimeout(t2);
            loadingIconContainer.classList.add("animationcontainerX");
            loadingIconText.textContent = "connection problem...";
            console.log("Error within query initiation", error);
            livesendButton.classList.add('PD')
            setTimeout(() => {
                loadingIconContainer.classList.add("PD");
                livesendButton.classList.remove('HD');
                mic.classList.remove('HD');
            }, 5000);
        }
        livesendButton.classList.remove('search-icon');
        livesendButton.classList.add('HD')
    };

}


livechatsession();




function loopControler(ms) {
    return new Promise(function (relolve) {
        setTimeout(relolve, ms);
    });
};



async function videoRoute() {
    let videoAnalysisHistory = [];
    const displayAnswer = document.getElementById("displayData");
    const playtutorial = document.getElementById('playtutorial');
    const tutorialBar = document.getElementById("tutorialBar");


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
    const playerWrapper = document.createElement('div');


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

    if (ismobilePhone) {
        playtutorial.addEventListener('click', function () {
            tutorialBar.classList.remove('tutorial-bar-add');
        })
    }




    // APP HEART FUNCTION, REAL TIME DATA TRANSACTION


    send.addEventListener('click', async function (e) {
        e.preventDefault()

        console.log("send fired")
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
            //const chat = await fetch("https://wrezon.onrender.com/video_search", {
            const chat = await fetch("http://localhost:8000/video_search", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: trimedConversationHistory
                })
            });

            const response = await chat.json();
            if (!response.answer && !response.image_urls) {
                return;
            }


            console.log("responce from video route", JSON.stringify(response.answer, null, 2));
            videoAnalysisHistory.push({ role: 'assistant', content: response.answer });

            if (!response.answer) { return };





            const video_data_set = response.answer;
            console.log(video_data_set);



            async function intervalAddVideo() {


                if (!video_data_set || video_data_set.length === 0) {
                    return;
                }


                tutorialFAB.classList.remove('PD')
                tutorialFAB.classList.remove('tutorial-FAB')
                void tutorialFAB.offsetWidth;
                tutorialFAB.classList.add('tutorial-FAB');

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
            };

            if (!response.image_urls) return;
            function Gallery() {
                let urls = response.image_urls
                if (!urls || urls.length === 0) return;  // ← Early exit
                const imagecardholder = document.createElement('div');

                imagecardholder.classList.add('imagecard_holder');
                displayAnswer.appendChild(imagecardholder);
                let imageCancel = document.createElement('div');
                if (ismobilePhone) {
                    imagecardholder.addEventListener('pointerdown', function (e) {
                        e.stopPropagation()
                        e.preventDefault()


                        let extendedcardholder = document.createElement('div');
                        let extendedinnercard = document.createElement('div')
                        let percardUrl = e.target.getAttribute('uniqueUrl');
                        let imageToExtend = document.createElement('img');

                        if (!percardUrl) return;
                        imageToExtend.classList.add('extended-imagecard');
                        extendedcardholder.classList.add('extended-imagecard-holder')
                        extendedinnercard.classList.add('extended-imagecard-holder-innercard')
                        imageCancel.classList.add('tutorialCancel')
                        imageCancel.innerHTML = '×';


                        imageToExtend.src = percardUrl;

                        extendedinnercard.append(imageCancel);
                        extendedinnercard.append(imageToExtend);
                        extendedcardholder.appendChild(extendedinnercard);

                        document.body.appendChild(extendedcardholder)


                        imageCancel.addEventListener('click', function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                            extendedcardholder.innerHTML = "";
                            extendedcardholder.remove();
                        })
                        document.addEventListener('pointerdown', () => {
                            extendedcardholder.innerHTML = "";
                            extendedcardholder.remove();
                        })
                    })

                } else {
                    imagecardholder.addEventListener('click', function (e) {
                        e.stopPropagation()
                        e.preventDefault()

                        let extendedcardholder = document.createElement('div');
                        let extendedinnercard = document.createElement('div')
                        let percardUrl = e.target.getAttribute('uniqueUrl');
                        let imageToExtend = document.createElement('img');

                        if (!percardUrl) return;
                        imageToExtend.classList.add('extended-imagecard');
                        extendedcardholder.classList.add('extended-imagecard-holder')
                        extendedinnercard.classList.add('extended-imagecard-holder-innercard')
                        imageCancel.classList.add('tutorialCancel')
                        imageCancel.innerHTML = '×';


                        imageToExtend.src = percardUrl;

                        extendedinnercard.append(imageCancel);
                        extendedinnercard.append(imageToExtend);
                        extendedcardholder.appendChild(extendedinnercard);

                        document.body.appendChild(extendedcardholder)

                        imageCancel.addEventListener('click', function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                            extendedcardholder.innerHTML = "";
                            extendedcardholder.remove();
                        })

                        document.addEventListener('click', () => {
                            extendedcardholder.innerHTML = "";
                            extendedcardholder.remove();
                        })
                    })




                }
                setTimeout(() => {
                    for (let i = 0; i < urls.length; i++) {
                        console.log(urls[i]);

                        const imagecard = document.createElement('img');
                        imagecard.classList.add('imagecard');
                        imagecard.setAttribute("uniqueUrl", urls[i])



                        imagecardholder.appendChild(imagecard)
                        imagecard.src = urls[i];
                    }
                }, 100);
            }
            setTimeout(() => { Gallery(); }, 5000)








            intervalAddVideo();

        } catch (error) {
            console.log("there is no need of a video for this yet", error);

        }


    });


    videosender.addEventListener('click', async () => {
        console.log("videosender fired")
        const tutorialBar = document.getElementById("tutorialBar");
        let markCounter = document.createElement('div')


        const video_extracted_data_list = []
        const thumbnail_url = []

        const collectUserQuestion = document.getElementById("textArea");
        const question = collectUserQuestion.value;
        //const question = window._pendingQuestion || collectUserQuestion.value;
        const trimedConversationHistory = conversationHistory.slice(-6);    //reduce the conversation history to 5 messages when too log and constans when equal or less than 5

        console.log('trimed', trimedConversationHistory);

        let videoAnalysisHistory = [{ "role": "user", "content": question }];
        // SEND NOW DATA THROUGH A NETWORK TO THE SERVER "API" FOR MODEL TEXT ANSWER GENERATION
        try {
            //const chat = await fetch("https://wrezon.onrender.com/video_search", {
            const chat = await fetch("http://localhost:8000/video_search", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: trimedConversationHistory
                })
            });

            const response = await chat.json();

            if (!response.answer && !response.image_urls) {
                return;
            }

            console.log("responce from video route", JSON.stringify(response.answer, null, 2));
            videoAnalysisHistory.push({ role: 'assistant', content: response.answer });

            if (!response.answer) { return };





            const video_data_set = response.answer;
            console.log(video_data_set);


            async function intervalAddVideo() {
                if (!video_data_set || video_data_set.length === 0) {
                    return;
                }
                tutorialFAB.classList.remove('PD')
                tutorialFAB.classList.remove('tutorial-FAB')
                void tutorialFAB.offsetWidth;
                tutorialFAB.classList.add('tutorial-FAB');


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




            };

            if (!response.image_urls) return;
            function Gallery() {
                let urls = response.image_urls
                if (!urls || urls.length === 0) return;  // ← Early exit
                const imagecardholder = document.createElement('div');

                imagecardholder.classList.add('imagecard_holder');
                displayAnswer.appendChild(imagecardholder);
                let imageCancel = document.createElement('div');
                if (ismobilePhone) {
                    imagecardholder.addEventListener('pointerdown', function (e) {
                        e.stopPropagation()
                        e.preventDefault()


                        let extendedcardholder = document.createElement('div');
                        let extendedinnercard = document.createElement('div')
                        let percardUrl = e.target.getAttribute('uniqueUrl');
                        let imageToExtend = document.createElement('img');

                        if (!percardUrl) return;
                        imageToExtend.classList.add('extended-imagecard');
                        extendedcardholder.classList.add('extended-imagecard-holder')
                        extendedinnercard.classList.add('extended-imagecard-holder-innercard')
                        imageCancel.classList.add('tutorialCancel')
                        imageCancel.innerHTML = '×';


                        imageToExtend.src = percardUrl;

                        extendedinnercard.append(imageCancel);
                        extendedinnercard.append(imageToExtend);
                        extendedcardholder.appendChild(extendedinnercard);

                        document.body.appendChild(extendedcardholder)


                        imageCancel.addEventListener('click', function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                            extendedcardholder.innerHTML = "";
                            extendedcardholder.remove();
                        })
                        document.addEventListener('pointerdown', () => {
                            extendedcardholder.innerHTML = "";
                            extendedcardholder.remove();
                        })
                    })

                } else {
                    imagecardholder.addEventListener('click', function (e) {
                        e.stopPropagation()
                        e.preventDefault()

                        let extendedcardholder = document.createElement('div');
                        let extendedinnercard = document.createElement('div')
                        let percardUrl = e.target.getAttribute('uniqueUrl');
                        let imageToExtend = document.createElement('img');

                        if (!percardUrl) return;
                        imageToExtend.classList.add('extended-imagecard');
                        extendedcardholder.classList.add('extended-imagecard-holder')
                        extendedinnercard.classList.add('extended-imagecard-holder-innercard')
                        imageCancel.classList.add('tutorialCancel')
                        imageCancel.innerHTML = '×';


                        imageToExtend.src = percardUrl;

                        extendedinnercard.append(imageCancel);
                        extendedinnercard.append(imageToExtend);
                        extendedcardholder.appendChild(extendedinnercard);

                        document.body.appendChild(extendedcardholder)

                        imageCancel.addEventListener('click', function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                            extendedcardholder.innerHTML = "";
                            extendedcardholder.remove();
                        })

                        document.addEventListener('click', () => {
                            extendedcardholder.innerHTML = "";
                            extendedcardholder.remove();
                        })
                    })




                }
                setTimeout(() => {
                    for (let i = 0; i < urls.length; i++) {
                        console.log(urls[i]);

                        const imagecard = document.createElement('img');
                        imagecard.classList.add('imagecard');
                        imagecard.setAttribute("uniqueUrl", urls[i])



                        imagecardholder.appendChild(imagecard)
                        imagecard.src = urls[i];
                    }
                }, 100);
            }
            setTimeout(() => { Gallery(); }, 5000)



            intervalAddVideo();





        } catch (error) {
            console.log("there is no need of a video for this yet", error);

        }
    }) // programatic click to triger the video on the screen
    //window.Getvideo = Getvideo;

};
//running at the bottom to fever the execution flow



videoRoute();



/* =========================================================
   JARVIS LIVE ENGINE
   ========================================================= */

const jarvisUniverse = document.querySelector(".jarvis-universe");

const redOrb = document.querySelector(".jarvis-red");
const blueOrb = document.querySelector(".jarvis-blue");

const jarvisTime = document.querySelector("#jarvisTime");


/* ---------------------------------------------------------
   CLOCK
   --------------------------------------------------------- */

function updateJarvisTime() {

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    jarvisTime.textContent =
        `${hours}:${minutes}:${seconds}`;
}

updateJarvisTime();

setInterval(updateJarvisTime, 1000);


/* ---------------------------------------------------------
   RANDOM POSITION INSIDE CIRCLE
   --------------------------------------------------------- */

function moveOrb(orb) {

    const size = jarvisUniverse.clientWidth;

    /*
        Keep the orb away from the border.

        20% - 80% gives the balls room to breathe
        without constantly hitting the edge.
    */

    const x = 20 + Math.random() * 60;
    const y = 20 + Math.random() * 60;

    orb.style.left = `${x}%`;
    orb.style.top = `${y}%`;
}


/* ---------------------------------------------------------
   SEQUENTIAL MOVEMENT
   --------------------------------------------------------- */

function jarvisMovement() {

    // Red moves first
    moveOrb(redOrb);

    setTimeout(() => {

        // Then blue
        moveOrb(blueOrb);

    }, 1500);
}


/* Initial movement */

jarvisMovement();


/*
    Every few seconds the sequence repeats.

    The timeout is intentionally slightly random so
    the animation doesn't feel like a perfect machine.
*/

function nextMovement() {

    const delay =
        3500 + Math.random() * 2500;

    setTimeout(() => {

        jarvisMovement();

        nextMovement();

    }, delay);
}

nextMovement();



if (ismobilePhone) {
    document.addEventListener('pointerdown', (e) => {
        if (e.target.closest('#videosender')) {
            return; // DO NOTHING — JARVIS stays alive
        }
        jarvisOff();
    })
} else {
    document.addEventListener('click', (e) => {
        if (e.target.closest('#videosender')) {
            return; // DO NOTHING — JARVIS stays alive
        }
        jarvisOff();
    })
}


function jarvisOn() {
    //const voiceChat = document.querySelector('#voicechat'); // Your mic/voice button element
    // Only turn Jarvis ON if the voice chat / mic button is currently active

    if (voiceChat && voiceChat.classList.contains('onlive')) {
        jarvis.classList.remove('PD');
        jarvis.classList.add('jarvis-live');
    } else {
        // If mic switch is off, Jarvis must not appear
        jarvisOff();
    }


}

//function jarvisOn() {
//    jarvis.classList.remove('PD')
//    jarvis.classList.add('jarvis-live');
//}

function jarvisOff() {
    jarvis.classList.remove('jarvis-live');
    jarvis.classList.add('PD')
}

//function jarvisToggle() {
//    jarvis.classList.toggle('jarvis-live');
//}

window.jarvisOn = jarvisOn;
window.jarvisOff = jarvisOff;
window.jarvisToggle = jarvisToggle;













