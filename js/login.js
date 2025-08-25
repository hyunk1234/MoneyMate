import { api } from "./api.js";  

document.getElementById("signin-form").addEventListener("submit", async e => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password-field").value;

    try {
        const data = await api("/auth/login", "POST", { email, password });
        localStorage.setItem("token", data.access_token);
        window.location.href = "dashboard.html";
    } catch (err) {
        alert(err.message);
    }
});
