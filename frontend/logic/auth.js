document.addEventListener("DOMContentLoaded", function () {
  const authForm = document.getElementById("authForm");
  const registerLink = document.getElementById("registerLink");

  let users = JSON.parse(localStorage.getItem("users")) || [];

  authForm?.addEventListener("submit", function (event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username.length < 5) {
      alert("Der Benutzername muss mindestens 5 Zeichen lang sein.");
      return;
    }

    if (password.length < 5) {
      alert("Das Passwort muss mindestens 5 Zeichen lang sein.");
      return;
    }

    const existingUser = users.find((user) => user.username === username);

    if (document.querySelector("h1").textContent === "Registrierung") {
      if (existingUser) {
        alert("Benutzername ist bereits vergeben.");
        return;
      }
      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registrierung erfolgreich! Bitte loggen Sie sich ein.");
      usernameInput.value = "";
      passwordInput.value = "";
      switchToLogin();
    } else {
      if (!existingUser || existingUser.password !== password) {
        alert("Ungültige Anmeldedaten.");
        return;
      }
      alert("Login erfolgreich!");
      localStorage.setItem("loggedInUser", JSON.stringify(existingUser));
      window.location.href = "../index.html";
    }
  });

  registerLink?.addEventListener("click", function (event) {
    event.preventDefault();
    switchFormMode();
  });

  function switchFormMode() {
    const formTitle = document.querySelector("h1");
    const submitButton = authForm.querySelector("button");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    usernameInput.value = "";
    passwordInput.value = "";

    if (formTitle.textContent === "Login") {
      formTitle.textContent = "Registrierung";
      submitButton.textContent = "Registrieren";
      registerLink.textContent = "Zurück zum Login";
    } else {
      switchToLogin();
    }
  }

  function switchToLogin() {
    const formTitle = document.querySelector("h1");
    const submitButton = authForm.querySelector("button");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    usernameInput.value = "";
    passwordInput.value = "";

    formTitle.textContent = "Login";
    submitButton.textContent = "Einloggen";
    registerLink.textContent = "Jetzt registrieren";
  }
});