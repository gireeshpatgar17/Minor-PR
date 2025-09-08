// auth.js
// Handles registration and login with smooth toast notifications

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Registration form
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Registered successfully! Redirecting to login...", "success");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    });
}

// Login form
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Login successful! Redirecting to dashboard...", "success");
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);
    });
}
