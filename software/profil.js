document.addEventListener("DOMContentLoaded", function () {
  const profilForm = document.getElementById("profilForm");
  const profilAnzeigen = document.getElementById("profilAnzeigen");
  const bearbeitenButton = document.getElementById("bearbeitenButton");
  const signOutButton = document.getElementById("signOutButton");

  signOutButton?.addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    alert("Sie wurden erfolgreich abgemeldet.");

    window.location.href = "auth.html";
  });

  const inputs = profilForm?.querySelectorAll("input");
  const anzeigenFelder = {
    vorname: document.getElementById("anzeigeVorname"),
    personalnummer: document.getElementById("anzeigePersonalnummer"),
    name: document.getElementById("anzeigeName"),
    wohnort: document.getElementById("anzeigeWohnort"),
    arbeit: document.getElementById("anzeigeArbeit"),
    arbeitsplatz: document.getElementById("anzeigeArbeitsplatz"),
  };

  function validateProfilInputs() {
    let isValid = true;

    inputs?.forEach((input) => {
      if (input.id === "personalnummer") {
        const value = parseInt(input.value, 10);
        if (isNaN(value) || value < 0) {
          input.classList.add("is-invalid");
          isValid = false;
          alert("Die Personalnummer muss 0 oder eine positive Zahl sein!");
        } else {
          input.classList.remove("is-invalid");
          input.classList.add("is-valid");
        }
      } else if (input.value.trim() === "") {
        input.classList.add("is-invalid");
        isValid = false;
      } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
      }
    });

    return isValid;
  }

  function getLoggedInUserId() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    return loggedInUser ? loggedInUser.username : null;
  }

  function profilAnzeigenModus() {
    const userId = getLoggedInUserId();
    if (!userId) {
      alert("Bitte loggen Sie sich ein, um Ihr Profil zu sehen.");
      window.location.href = "auth.html";
      return;
    }

    const savedProfiles = JSON.parse(localStorage.getItem("profiles")) || {};
    const userProfile = savedProfiles[userId] || {};

    for (const key in anzeigenFelder) {
      if (anzeigenFelder[key]) {
        anzeigenFelder[key].textContent = userProfile[key] || "Nicht angegeben";
      }
    }
    profilForm?.classList.add("d-none");
    profilAnzeigen?.classList.remove("d-none");
  }

  function profilBearbeitenModus() {
    const userId = getLoggedInUserId();
    if (!userId) {
      alert("Bitte loggen Sie sich ein, um Ihr Profil zu bearbeiten.");
      window.location.href = "auth.html";
      return;
    }

    const savedProfiles = JSON.parse(localStorage.getItem("profiles")) || {};
    const userProfile = savedProfiles[userId] || {};

    inputs?.forEach((input) => {
      input.value = userProfile[input.id] || "";
      input.classList.remove("is-valid", "is-invalid");
    });
    profilForm?.classList.remove("d-none");
    profilAnzeigen?.classList.add("d-none");
  }

  bearbeitenButton?.addEventListener("click", profilBearbeitenModus);

  profilForm?.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateProfilInputs()) {
      alert("Bitte füllen Sie alle Felder korrekt aus!");
      return;
    }

    const userId = getLoggedInUserId();
    if (!userId) {
      alert("Bitte loggen Sie sich ein, um Ihr Profil zu speichern.");
      window.location.href = "auth.html";
      return;
    }

    const profileData = {};
    inputs?.forEach((input) => {
      profileData[input.id] = input.value;
    });

    const savedProfiles = JSON.parse(localStorage.getItem("profiles")) || {};
    savedProfiles[userId] = profileData;
    localStorage.setItem("profiles", JSON.stringify(savedProfiles));

    alert("Profil gespeichert!");
    profilAnzeigenModus();
  });

  profilAnzeigenModus();
});