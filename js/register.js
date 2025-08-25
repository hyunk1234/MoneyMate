import { api } from "./api.js";  

document.getElementById("signup-form").addEventListener("submit", async e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const data = await api("/auth/register", "POST", { name, email, password });
        alert(data.message);
        window.location.href = "login.html";
    } catch (err) {
        alert(err.message);
    }
});
