
const submit = document.getElementById("submit")
submit.addEventListener("click",async function(event){
    event.preventDefault();
    console.log("submition function on initialization")
    
        

    const userName = document.getElementById("name").value
    const userPassword = document.getElementById("password").value
    const userCountry = document.getElementById("country").value
    const userPhoneLine = document.getElementById("phone").value

    try{
        const adduser = await fetch("http://localhost:8000/userLogin",{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name:userName,
                passcode:userPassword,
                country:userCountry,
                userLine:userPhoneLine
            })
        });

        const feedback = await adduser.json();
        console.log("feedback from server:", JSON.stringify(feedback,null,2)); 

    }catch(error){
        console.log("error status response:",error);
    

    }


    
})

const acountTrugger = document.getElementById("createAcount");
const form = document.getElementById("acountForm");
const backtologin = document.getElementById("backHome")

acountTrugger.addEventListener('click',function(e){
    console.log("function for acount creation initialized")
    e.stopPropagation();
    form.classList.remove("HD");
    
});
backtologin.addEventListener('click',function(e){
    e.stopPropagation()
    form.classList.add("HD")
})


const password = document.getElementById("newPassword");
const confirmedpassword = document.getElementById("confirmedPassword");
const finishButton = document.getElementById("finishButton");
const errorMessage = document.getElementById("errorMessage");


finishButton.addEventListener('click',function(){
    console.log("confirm initialized")
    passwordvalue = password.value;
    confirmedvalue =confirmedpassword.value;
    const erromessase =["make sure the passwords matches"]
    
    if(passwordvalue !== confirmedvalue){
        confirmedpassword.classList.add("error");
        errorMessage.classList.add("acountplaceholder_under_error");

        errorMessage.textContent=erromessase;

    

    }else{
        confirmedpassword.classList.remove("error");
    }
});

function userAcount(){
    console.log("userAcount running");
    
    const finishButton = document.getElementById("finishButton");

    finishButton.addEventListener('click',async function(e){
        e.preventDefault()
        const name = document.getElementById("name").value;
        const DoB = document.getElementById("DOB").value;
        const phoneNumber = document.getElementById("phoneNumber").value;
        const email = document.getElementById("email").value;
        const gendervalue = document.querySelector('input[name="gender"]:checked');
        if (gendervalue) {
            gender = gendervalue.value;
            console.log(gender)
        }
        const confirmedPassword = document.getElementById("confirmedPassword").value;
        console.log("userAcount function  running");
        try{
            const sendUser = await fetch("http://localhost:8000/user_acount_registration",{
                'method':'POST',
                'headers': {'Content-Type':'application/json'},
                'body':JSON.stringify({
                    name:name,
                    DoB:DoB,
                    phoneNumber: Number(phoneNumber),
                    email: email,
                    gender: gender,
                    confirmedPassword: confirmedPassword,

                })
            });
            saveduser =  await sendUser.json();
            console.log('successfully saved',JSON.stringify(saveduser,null,2));

            const toptext = document.getElementById("toptext");
            toptext.textContent = JSON.stringify(saveduser.name);
            e.preventDefault()




                              
        }catch(error){
            console.log("error within client or server",error)

        }
    })

}

userAcount();