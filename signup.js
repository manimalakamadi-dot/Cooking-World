const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("signup-name").value;
    const message = document.getElementById("signup-message");

    message.textContent = "Welcome " + name + "! Signup form is working.";
    message.style.color = "#ffbd36";

    signupForm.reset();
});