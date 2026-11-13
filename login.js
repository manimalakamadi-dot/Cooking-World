const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const message = document.getElementById("login-message");

    message.textContent = "Login page is working!";
    message.style.color = "#ffbd36";
});