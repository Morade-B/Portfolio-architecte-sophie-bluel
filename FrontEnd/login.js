// variable projet login 


const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const messageError = document.querySelector(".login p");


   


form.addEventListener("submit", function (event)  {
    event.preventDefault();
    const userEmail = email.value;
    const userPassword = password.value;
    

  
    const login = {
        email: userEmail, password: userPassword,
    }

    const user = JSON.stringify(login);

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: user,
    }).then((response) => {
        if ( response.status !== 200) {
            messageError.textContent = "Votre email ou votre mot de passe est incorrect";
        } else {
            response.json().then((data) => {
                window.sessionStorage.setItem("token", data.token);
                window.location.href = "index.html";
                window.sessionStorage.setItem("loged", true);
              
              
            });
        }
    });

  
});







