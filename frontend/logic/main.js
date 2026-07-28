document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("salaryForm");
  const resultContainer = document.getElementById("resultsContainer");
  const clearDataBtn = document.getElementById("clearData");
  const compareButton = document.getElementById("compareButton");
  const resetButton = document.getElementById("resetButton");
  function addInputValidation() {
    const monatslohnInput = document.getElementById("monatslohn");
    const alterInput = document.getElementById("alter");
    const kinderInput = document.getElementById("anzahlKinder");
    const freiwilligePKInput = document.getElementById("freiwilligePK");
    const abrechnungsdatumInput = document.getElementById("abrechnungsdatum");

    function validateMonatslohn() {
      const value = parseFloat(monatslohnInput.value);
      const errorElement = document.getElementById("monatslohn-error");
      if (!value || value <= 0) {
        errorElement.textContent =
          "Bitte geben Sie einen gültigen Monatslohn grösser als 0 ein!";
      } else {
        errorElement.textContent = "";
      }
    }

    function validateAlter() {
      const value = parseInt(alterInput.value, 10);
      const errorElement = document.getElementById("alter-error");
      if (!value || value <= 0) {
        errorElement.textContent =
          "Bitte geben Sie ein gültiges Alter grösser als 0 ein!";
      } else {
        errorElement.textContent = "";
      }
    }

    function validateKinder() {
      const value = parseInt(kinderInput.value, 10);
      const errorElement = document.getElementById("anzahlKinder-error");
      if (value < 0 || isNaN(value)) {
        errorElement.textContent =
          "Bitte geben Sie eine gültige Anzahl der Kinder ein!";
      } else {
        errorElement.textContent = "";
      }
    }

    function validateFreiwilligePK() {
      const value = parseFloat(freiwilligePKInput.value);
      const errorElement = document.getElementById("freiwilligePK-error");
      if (value < 0 || value > 15 || isNaN(value)) {
        errorElement.textContent =
          "Bitte geben Sie einen Prozentsatz zwischen 0 und 15 für die freiwillige PK-Abgabe ein!";
      } else {
        errorElement.textContent = "";
      }
    }

    function validateAbrechnungsdatum() {
      const value = abrechnungsdatumInput.value;
      const errorElement = document.getElementById("abrechnungsdatum-error");
      if (!value) {
        errorElement.textContent = "Bitte geben Sie ein gültiges Datum ein!";
      } else {
        errorElement.textContent = "";
      }
    }

    monatslohnInput?.addEventListener("input", validateMonatslohn);
    alterInput?.addEventListener("input", validateAlter);
    kinderInput?.addEventListener("input", validateKinder);
    freiwilligePKInput?.addEventListener("input", validateFreiwilligePK);
    abrechnungsdatumInput?.addEventListener("input", validateAbrechnungsdatum);
  }

  addInputValidation();

  function getPkPercentageByAge(alter) {
    if (alter >= 25 && alter <= 34) return 0.07;
    if (alter >= 35 && alter <= 44) return 0.1;
    if (alter >= 45 && alter <= 54) return 0.15;
    if (alter >= 55 && alter <= 65) return 0.18;
    return 0;
  }

  compareButton?.addEventListener("click", compareRecords);
  resetButton?.addEventListener("click", resetComparison);

  function compareRecords() {
    const selectedRecords = document.querySelectorAll(
      ".compare-checkbox:checked"
    );
    const comparisonTable = document.getElementById("comparison-result");
    const comparisonSection = document.getElementById("comparison-table");

    comparisonTable.innerHTML = `
        <tr>
            <th>Lohnabrechnung</th>
            <th>Monat</th>
            <th>Jahr</th>
            <th>Betrag</th>
        </tr>
    `;

    if (selectedRecords.length === 0) {
      alert("Bitte wählen Sie mindestens eine Lohnabrechnung aus!");
      return;
    }

    selectedRecords.forEach((record) => {
      const index = record.dataset.index;
      const data = lohnabrechnungen[index];
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>Lohnabrechnung vom ${data.abrechnungsdatum}</td>
            <td>${new Date(data.abrechnungsdatum).toLocaleString("de-DE", {
              month: "long",
            })}</td>
            <td>${new Date(data.abrechnungsdatum).getFullYear()}</td>
            <td>${data.nettolohn.toFixed(2)} CHF</td>
        `;
      comparisonTable.appendChild(row);
    });

    comparisonSection.style.display = "block";
  }

  function resetComparison() {
    document
      .querySelectorAll(".compare-checkbox")
      .forEach((checkbox) => (checkbox.checked = false));
    document.getElementById("comparison-table").style.display = "none";
  }

  function getLoggedInUserId() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    return loggedInUser ? loggedInUser.username : null;
  }

  function getUserLohnabrechnungen() {
    const userId = getLoggedInUserId();
    if (!userId) {
      alert("Bitte loggen Sie sich ein, um Ihre Lohnabrechnungen zu sehen.");
      window.location.href = "auth.html";
      return [];
    }

    const allLohnabrechnungen =
      JSON.parse(localStorage.getItem("lohnabrechnungen")) || {};
    return allLohnabrechnungen[userId] || [];
  }

  clearDataBtn?.addEventListener("click", function () {
    localStorage.removeItem("lohnabrechnungen");

    const form = document.getElementById("salaryForm");
    form?.reset();

    const resultContainer = document.getElementById("resultsContainer");
    if (resultContainer) {
      resultContainer.innerHTML = "<p>Keine Lohnabrechnungen vorhanden.</p>";
    }

    lohnabrechnungen = [];
    alert("Alle Lohnabbrechunungen wurden gelöscht!");
  });

  function saveUserLohnabrechnungen(lohnabrechnungen) {
    const userId = getLoggedInUserId();
    if (!userId) {
      alert(
        "Bitte loggen Sie sich ein, um Ihre Lohnabrechnungen zu speichern."
      );
      window.location.href = "auth.html";
      return;
    }

    const allLohnabrechnungen =
      JSON.parse(localStorage.getItem("lohnabrechnungen")) || {};
    allLohnabrechnungen[userId] = lohnabrechnungen;
    localStorage.setItem(
      "lohnabrechnungen",
      JSON.stringify(allLohnabrechnungen)
    );
  }

  let lohnabrechnungen = getUserLohnabrechnungen();

  form?.addEventListener("submit", function (event) {
    event.preventDefault();

    const role = document.getElementById("role").value;
    const monatslohn = parseFloat(document.getElementById("monatslohn").value);
    const alter = parseInt(document.getElementById("alter").value, 10);
    const freiwilligePKProzent =
      parseFloat(document.getElementById("freiwilligePK").value) || 0;
    const anzahlKinder = parseInt(
      document.getElementById("anzahlKinder").value,
      10
    );
    const abrechnungsdatum = document.getElementById("abrechnungsdatum").value;

    if (!monatslohn || monatslohn <= 0) {
      document.getElementById("monatslohn-error").textContent =
        "Bitte geben Sie einen gültigen Monatslohn größer als 0 ein!";
      return;
    } else {
      document.getElementById("monatslohn-error").textContent = "";
    }

    if (!alter || alter <= 0) {
      document.getElementById("alter-error").textContent =
        "Bitte geben Sie ein gültiges Alter größer als 0 ein!";
      return;
    } else {
      document.getElementById("alter-error").textContent = "";
    }

    if (anzahlKinder < 0 || isNaN(anzahlKinder)) {
      document.getElementById("anzahlKinder-error").textContent =
        "Bitte geben Sie eine gültige Anzahl der Kinder ein!";
      return;
    } else {
      document.getElementById("anzahlKinder-error").textContent = "";
    }

    if (
      freiwilligePKProzent < 0 ||
      freiwilligePKProzent > 15 ||
      isNaN(freiwilligePKProzent)
    ) {
      document.getElementById("freiwilligePK-error").textContent =
        "Bitte geben Sie einen Prozentsatz zwischen 0 und 15 für die freiwillige PK-Abgabe ein!";
      return;
    } else {
      document.getElementById("freiwilligePK-error").textContent = "";
    }

    if (!abrechnungsdatum) {
      document.getElementById("abrechnungsdatum-error").textContent =
        "Bitte geben Sie ein gültiges Datum ein!";
      return;
    } else {
      document.getElementById("abrechnungsdatum-error").textContent = "";
    }
    const pkProzent = getPkPercentageByAge(alter);
    const kinderzulagen = anzahlKinder * 250;
    const freiwilligePK = monatslohn * (freiwilligePKProzent / 100);
    const bruttolohn = monatslohn + kinderzulagen;
    const ahv = monatslohn * 0.053;
    const alv = monatslohn * 0.011;
    const pk = monatslohn * pkProzent;
    const bu = role === "arbeitgeber" ? monatslohn * 0.005 : 0;
    const nbu = role === "arbeitnehmer" ? monatslohn * 0.005 : 0;
    const abzuege = ahv + alv + pk + bu + nbu + freiwilligePK;
    const nettolohn = bruttolohn - abzuege;

    const daten = {
      role,
      alter,
      pkProzent,
      freiwilligePKProzent,
      freiwilligePK,
      monatslohn,
      kinderzulagen,
      anzahlKinder,
      abrechnungsdatum,
      bruttolohn,
      ahv,
      alv,
      pk,
      bu,
      nbu,
      abzuege,
      nettolohn,
    };
    lohnabrechnungen.push(daten);

    saveUserLohnabrechnungen(lohnabrechnungen);
    form.reset();
    alert("Lohnabrechnung gespeichert!");
    renderLohnabrechnungen();
  });

  if (resultContainer) {
    let editMode = false;

    function renderLohnabrechnungen() {
      if (lohnabrechnungen.length > 0) {
        resultContainer.innerHTML = lohnabrechnungen
          .map(
            (data, index) => `
            <div class="card mt-3 p-3 position-relative">
              <h5>Lohnabrechnung vom ${data.abrechnungsdatum}</h5>
              <table class="table">
                <tr><td>Rolle</td><td>${data.role}</td></tr>
                <tr><td>Alter</td><td>${data.alter}</td></tr>
                <tr><td>Monatslohn</td><td>${data.monatslohn.toFixed(
                  2
                )} CHF</td><td>Der feste Lohn, den der Mitarbeiter monatlich erhält.</td></tr>
                <tr><td>Kinderzulagen</td><td>${data.kinderzulagen.toFixed(
                  2
                )} CHF</td><td>250 CHF Zuschlag für jedes anspruchsberechtigte Kind des Mitarbeiters.</td></tr>
                <tr><td>Bruttolohn</td><td>${data.bruttolohn.toFixed(
                  2
                )} CHF</td><td>Die Summe aus Monatslohn und Kinderzulagen vor Abzügen.</td></tr>
                <tr><td>AHV (5.3%)</td><td>${data.ahv.toFixed(
                  2
                )} CHF</td><td>Abzug für die Alters- und Hinterlassenenversicherung.</td></tr>
                <tr><td>ALV (1.1%)</td><td>${data.alv.toFixed(
                  2
                )} CHF</td><td>Abzug für die Arbeitslosenversicherung.</td></tr>
                <tr><td>PK (${(data.pkProzent * 100).toFixed(
                  1
                )}%)</td><td>${data.pk.toFixed(
              2
            )} CHF</td><td>Abzug für die Pensionskasse (berufliche Vorsorge).</td></tr>
                <tr><td>Freiwillige PK-Abgabe (${
                  data.freiwilligePKProzent
                }% des Monatslohns)</td> <td>${data.freiwilligePK.toFixed(
              2
            )} CHF</td>
                <td>Zusätzliche Abgabe für die Pensionskasse.</td></tr>
                ${
                  data.role === "arbeitgeber"
                    ? `<tr><td>BU (0.5%)</td><td>${data.bu.toFixed(
                        2
                      )} CHF</td><td>Abzug für die Berufsunfallversicherung.</td></tr>`
                    : ""
                }
                ${
                  data.role === "arbeitnehmer"
                    ? `<tr><td>NBU (0.5%)</td><td>${data.nbu.toFixed(
                        2
                      )} CHF</td><td>Abzug für die Nichtberufsunfallversicherung.</td></tr>`
                    : ""
                }
                <tr>
                <td>Abzüge</td><td>${data.abzuege.toFixed(
                  2
                )} CHF</td><td>Die Summe aller Abzüge.</td></tr>
                <tr><td><b>Nettolohn</b></td><td><b>${data.nettolohn.toFixed(
                  2
                )} CHF</b></td><td>Der verbleibende Betrag nach allen Abzügen.</td></tr>
              </table>
              ${
                editMode
                  ? `<button class="btn btn-danger position-absolute bottom-0 end-0 m-3 delete-lohnabrechnung" data-index="${index}">X</button>`
                  : `<input type="checkbox" class="compare-checkbox" data-index="${index}" />`
              }
            </div>
          `
          )
          .join("");
      } else {
        resultContainer.innerHTML = "<p>Keine Lohnabrechnungen vorhanden.</p>";
      }
    }

    renderLohnabrechnungen();

    const editModeBtn = document.getElementById("editMode");
    editModeBtn?.addEventListener("click", function () {
      editMode = !editMode;
      renderLohnabrechnungen();
      editModeBtn.textContent = editMode ? "Bearbeiten beenden" : "Bearbeiten";
    });

    resultContainer.addEventListener("click", function (event) {
      const target = event.target;

      if (target.classList.contains("delete-lohnabrechnung")) {
        const index = parseInt(target.dataset.index, 10);
        lohnabrechnungen.splice(index, 1);
        saveUserLohnabrechnungen(lohnabrechnungen);
        renderLohnabrechnungen();
      }
    });

    const exportCSV = document.getElementById("exportCSV");
    const exportPDF = document.getElementById("exportPDF");

    exportCSV?.addEventListener("click", function () {
      if (lohnabrechnungen.length === 0) {
        alert("Keine Lohnabrechnungen vorhanden, um als CSV zu exportieren!");
        return;
      }

      const rows = [];

      lohnabrechnungen.forEach((data) => {
        rows.push([
          `Lohnabrechnung vom ${data.abrechnungsdatum}`,
          "betrag",
          "erklärung",
        ]);
        rows.push(["Rolle", data.role, ""]);
        rows.push([
          "Monatslohn",
          data.monatslohn.toFixed(2),
          "Der feste Lohn, den der Mitarbeiter monatlich erhält.",
        ]);
        rows.push([
          "Kinderzulagen",
          data.kinderzulagen.toFixed(2),
          "250 CHF Zuschlag für jedes anspruchsberechtigte Kind des Mitarbeiters.",
        ]);
        rows.push([
          "Bruttolohn",
          data.bruttolohn.toFixed(2),
          "Die Summe aus Monatslohn und Kinderzulagen vor Abzügen.",
        ]);
        rows.push([
          "AHV (5.3%)",
          data.ahv.toFixed(2),
          "Abzug für die Alters- und Hinterlassenenversicherung.",
        ]);
        rows.push([
          "ALV (1.1%)",
          data.alv.toFixed(2),
          "Abzug für die Arbeitslosenversicherung.",
        ]);
        rows.push([
          `PK (${(data.pkProzent * 100).toFixed(1)}%)`,
          data.pk.toFixed(2),
          "Abzug für die Pensionskasse (berufliche Vorsorge).",
        ]);
        rows.push([
          "Freiwillige PK-Abgabe",
          data.freiwilligePK.toFixed(2),
          `Zusätzliche freiwillige PK-Abgabe (${data.freiwilligePKProzent}% des Monatslohns).`,
        ]);
        if (data.role === "arbeitgeber")
          rows.push([
            "BU (0.5%)",
            data.bu.toFixed(2),
            "Abzug für die Berufsunfallversicherung",
          ]);
        if (data.role === "arbeitnehmer")
          rows.push([
            "NBU (0.5%)",
            data.nbu.toFixed(2),
            "Abzug für die Nichtberufsunfallversicherung",
          ]);
        rows.push([
          "Abzüge",
          data.abzuege.toFixed(2),
          "Die Summe aller Abzüge.",
        ]);
        rows.push([
          "Nettolohn",
          data.nettolohn.toFixed(2),
          "Der verbleibende Betrag nach allen Abzügen.",
        ]);
        rows.push(["", "", ""]);
      });

      let csvContent = "\uFEFF";
      csvContent += rows.map((row) => row.join(";")).join("\n");

      const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "lohnabrechnungen.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    exportPDF?.addEventListener("click", function () {
      if (lohnabrechnungen.length === 0) {
        alert("Keine Lohnabrechnungen vorhanden, um als PDF zu exportieren!");
        return;
      }

      const { jsPDF } = window.jspdf;

      const doc = new jsPDF();
      let yOffset = 10;

      lohnabrechnungen.forEach((data) => {
        doc.text(`Lohnabrechnung vom ${data.abrechnungsdatum}`, 10, yOffset);
        yOffset += 10;

        const tableData = [
          [
            "Monatslohn",
            `${data.monatslohn.toFixed(2)} CHF`,
            "Der feste Lohn, den der Mitarbeiter monatlich erhält.",
          ],
          [
            "Kinderzulagen",
            `${data.kinderzulagen.toFixed(2)} CHF`,
            "250 CHF Zuschlag für jedes anspruchsberechtigte Kind des Mitarbeiters.",
          ],
          [
            "Bruttolohn",
            `${data.bruttolohn.toFixed(2)} CHF`,
            "Die Summe aus Monatslohn und Kinderzulagen vor Abzügen.",
          ],
          [
            "AHV (5.3%)",
            `${data.ahv.toFixed(2)} CHF`,
            "Abzug für die Alters- und Hinterlassenenversicherung.",
          ],
          [
            "ALV (1.1%)",
            `${data.alv.toFixed(2)} CHF`,
            "Abzug für die Arbeitslosenversicherung.",
          ],
          [
            `PK (${(data.pkProzent * 100).toFixed(1)}%)`,
            `${data.pk.toFixed(2)} CHF`,
            "Abzug für die Pensionskasse (berufliche Vorsorge).",
          ],
          [
            "Freiwillige PK-Abgabe",
            `${data.freiwilligePK.toFixed(2)} CHF`,
            `Zusätzliche freiwillige PK-Abgabe (${data.freiwilligePKProzent}% des Monatslohns).`,
          ],
        ];

        if (data.role === "arbeitgeber")
          tableData.push([
            "BU (0.5%)",
            `${data.bu.toFixed(2)} CHF`,
            "Abzug für die Berufsunfallversicherung.",
          ]);
        if (data.role === "arbeitnehmer")
          tableData.push([
            "NBU (0.5%)",
            `${data.nbu.toFixed(2)} CHF`,
            "Abzug für die Nichtberufsunfallversicherung.",
          ]);

        tableData.push([
          "Abzüge",
          `${data.abzuege.toFixed(2)} CHF`,
          "Die Summe aller Abzüge.",
        ]),
          tableData.push([
            "Nettolohn",
            `${data.nettolohn.toFixed(2)} CHF`,
            "Der verbleibende Betrag nach allen Abzügen.",
          ]),
          doc.autoTable({
            head: [["Kategorie", "Betrag", "Erklärung"]],
            body: tableData,
            startY: yOffset,
          });

        yOffset = doc.previousAutoTable.finalY + 10;
      });

      doc.save("lohnabrechnungen.pdf");
    });
  }
});