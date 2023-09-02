
const loginForm = document.getElementById('login-input');
const submitButton = document.getElementById('submit');
const loginErrorMsg = document.getElementById("login-error-msg");

submitButton.addEventListener('click', function Sub(e){
    e.preventDefault();
    const username = loginForm.username.value;
        const password = loginForm.password.value;
        console.log(password);
        if(username === 'admin' && password === 'password') {
            window.location.href="Punch.html";
        }
        else {
            loginErrorMsg.style.opacity = 1;
        }
})