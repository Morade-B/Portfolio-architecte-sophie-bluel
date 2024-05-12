// variable projet login 


const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const messageError = document.querySelector(".login p");

form.addEventListener("submit", function (event)  {
    event.preventDefault();
    const userEmail = email.value;
    const userPassword = password.value;
    

    if (!userEmail || !userPassword) {
        messageError.textContent = "Votre email ou votre mot de passe est incorrect";

    }
    

    const login = {
        email: userEmail, password: userPassword,
    };

    const user = JSON.stringify(login);

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: user,
    });

});








