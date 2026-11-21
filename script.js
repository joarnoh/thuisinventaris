// ==========================================
// THUISINVENTARIS - SCRIPT.JS
// ==========================================

// Gegevens ophalen uit localStorage
function haalLocatiesOp() {
    return JSON.parse(localStorage.getItem("thuisinventaris-locaties")) || [];
}

function haalSpullenOp() {
    return JSON.parse(localStorage.getItem("thuisinventaris-spullen")) || [];
}

// Gegevens opslaan
function slaLocatiesOp(locaties) {
    localStorage.setItem("thuisinventaris-locaties", JSON.stringify(locaties));
}

function slaSpullenOp(spullen) {
    localStorage.setItem("thuisinventaris-spullen", JSON.stringify(spullen));
}

// Unieke ID maken
function maakID() {
    return Date.now().toString() + Math.random().toString(16).slice(2);
}


// ==========================================
// LOCATIES WEERGEVEN
// ==========================================

function toonLocaties() {
    const overzicht = document.getElementById("locaties-overzicht");

    if (!overzicht) return;

    const locaties = haalLocatiesOp();

    overzicht.innerHTML = "";

    if (locaties.length === 0) {
        overzicht.textContent = "Je hebt nog geen locaties aangemaakt.";
        return;
    }

    locaties.forEach(locatie => {
        const kaart = document.createElement("div");
        kaart.className = "w3-container w3-white w3-card w3-border w3-round-large w3-padding w3-margin-bottom";

        const titel = document.createElement("h3");
        titel.textContent = locatie.naam;

        const beschrijving = document.createElement("p");
        beschrijving.textContent = locatie.beschrijving || "Geen beschrijving";

        const verwijderen = document.createElement("button");
        verwijderen.className = "w3-button w3-red w3-round-large";
        verwijderen.textContent = "Verwijderen";

        verwijderen.addEventListener("click", function () {
            verwijderLocatie(locatie.id);
        });

        kaart.append(titel, beschrijving, verwijderen);
        overzicht.appendChild(kaart);
    });
}


// ==========================================
// LOCATIE VERWIJDEREN
// ==========================================

function verwijderLocatie(id) {
    const locaties = haalLocatiesOp();
    const spullen = haalSpullenOp();

    const locatie = locaties.find(item => item.id === id);

    if (!locatie) return;

    // Controleren of er nog spullen op deze locatie staan
    const gekoppeldeSpullen = spullen.filter(
        spul => spul.opbergplek === locatie.naam
    );

    if (gekoppeldeSpullen.length > 0) {
        alert("Deze locatie kan niet verwijderd worden. Er staan nog spullen op deze locatie.");
        return;
    }

    if (!confirm("Weet je zeker dat je deze locatie wilt verwijderen?")) {
        return;
    }

    const nieuweLocaties = locaties.filter(item => item.id !== id);

    slaLocatiesOp(nieuweLocaties);

    toonLocaties();
    vulLocatieKeuze();
}


// ==========================================
// SPULLEN WEERGEVEN
// ==========================================

function toonSpullen() {
    const overzicht = document.getElementById("spullen-overzicht");

    if (!overzicht) return;

    const spullen = haalSpullenOp();
    const zoekveld = document.getElementById("zoek-spul");
    const filter = document.getElementById("filter-categorie");

    const zoekterm = zoekveld ? zoekveld.value.toLowerCase() : "";
    const categorie = filter ? filter.value : "";

    overzicht.innerHTML = "";

    const gefilterdeSpullen = spullen.filter(spul => {
        const naamPast = spul.naam.toLowerCase().includes(zoekterm);
        const categoriePast = categorie === "" || spul.categorie === categorie;

        return naamPast && categoriePast;
    });

    if (gefilterdeSpullen.length === 0) {
        overzicht.textContent = "Geen spullen gevonden.";
        return;
    }

    gefilterdeSpullen.forEach(spul => {
        const kaart = document.createElement("div");
        kaart.className = "w3-inventory-card w3-card w3-white w3-round-large";

        const info = document.createElement("div");
        info.className = "w3-inventory-info";

        const titel = document.createElement("h3");
        titel.textContent = spul.naam;

        const locatie = document.createElement("p");
        locatie.textContent = "Locatie: " + spul.opbergplek;

        const categorieTekst = document.createElement("p");
        categorieTekst.textContent = "Categorie: " + spul.categorie;

        const beschrijving = document.createElement("p");
        beschrijving.textContent = spul.beschrijving || "";

        const verwijderen = document.createElement("button");
        verwijderen.className = "w3-button w3-red w3-round-large";
        verwijderen.textContent = "Verwijderen";

        verwijderen.addEventListener("click", function () {
            verwijderSpul(spul.id);
        });

        info.append(titel, locatie, categorieTekst, beschrijving, verwijderen);
        kaart.appendChild(info);

        overzicht.appendChild(kaart);
    });
}


function toonRecenteSpullen() {
    const overzicht = document.getElementById("recent-overzicht");

    if (!overzicht) return;

    const spullen = haalSpullenOp();

    // Laat de nieuwste drie voorwerpen zien
    const recent = spullen.slice(-3).reverse();

    overzicht.innerHTML = "";

    // Wanneer er nog geen spullen zijn
    if (recent.length === 0) {
        overzicht.innerHTML = `
            <div class="w3-container w3-white w3-border w3-round-large w3-padding-32 w3-empty-state">
                <div class="w3-xxlarge">⌂</div>
                <h3>Je hebt nog geen voorwerpen</h3>
                <p>
                    Maak eerst een locatie aan bij Locaties
                    en voeg daarna je eerste voorwerp toe.
                </p>
                <a href="locaties.html"
                   class="w3-button w3-brown w3-round-large">
                    + Locatie aanmaken
                </a>
                <a href="toevoegen.html"
                   class="w3-button w3-border w3-round-large">
                    Voorwerp toevoegen
                </a>
            </div>
        `;
        return;
    }

    // Voorwerpen weergeven
    recent.forEach(spul => {
        const kaart = document.createElement("div");
        kaart.className = "w3-inventory-card w3-card w3-white w3-round-large";

        const info = document.createElement("div");
        info.className = "w3-inventory-info";

        const titel = document.createElement("h3");
        titel.textContent = spul.naam;

        const locatie = document.createElement("p");
        locatie.textContent = "Locatie: " + spul.opbergplek;

        const categorie = document.createElement("p");
        categorie.textContent = "Categorie: " + spul.categorie;

        info.append(titel, locatie, categorie);
        kaart.appendChild(info);
        overzicht.appendChild(kaart);
    });

        const link = document.createElement("a");
        link.href = "inventaris.html";
        link.className = "w3-button w3-brown w3-round-large w3-margin-top";
        link.textContent = "Bekijk alle spullen";

    overzicht.appendChild(link);
}


// ==========================================
// SPUL VERWIJDEREN
// ==========================================

function verwijderSpul(id) {
    if (!confirm("Weet je zeker dat je dit voorwerp wilt verwijderen?")) {
        return;
    }

    const spullen = haalSpullenOp();

    const nieuweSpullen = spullen.filter(spul => spul.id !== id);

    slaSpullenOp(nieuweSpullen);

    toonSpullen();
}


// ==========================================
// LOCATIES IN HET KEUZEMENU
// ==========================================

function vulLocatieKeuze() {
    const keuze = document.getElementById("opbergplek");

    if (!keuze) return;

    const huidigeKeuze = keuze.value;
    const locaties = haalLocatiesOp();

    keuze.innerHTML = "";

    const standaard = document.createElement("option");
    standaard.value = "";
    standaard.textContent = "Kies een locatie";
    keuze.appendChild(standaard);

    locaties.forEach(locatie => {
        const optie = document.createElement("option");
        optie.value = locatie.naam;
        optie.textContent = locatie.naam;

        keuze.appendChild(optie);
    });

    keuze.value = huidigeKeuze;
}


// ==========================================
// NIEUWE LOCATIE OPSLAAN
// ==========================================

const locatieForm = document.getElementById("locatie-form");

if (locatieForm) {
    locatieForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const naam = document.getElementById("locatie-naam").value.trim();
        const type = document.getElementById("locatie-type").value;
        const beschrijving = document.getElementById("locatie-beschrijving").value.trim();
        const ruimte = document.getElementById("locatie-ruimte").value.trim();

        if (!naam) {
            alert("Vul een locatienaam in.");
            return;
        }

        const locaties = haalLocatiesOp();

        const bestaatAl = locaties.some(
            locatie => locatie.naam.toLowerCase() === naam.toLowerCase()
        );

        if (bestaatAl) {
            alert("Deze locatie bestaat al.");
            return;
        }

        locaties.push({
            id: maakID(),
            naam: naam,
            type: type,
            beschrijving: beschrijving,
            ruimte: ruimte
        });

        slaLocatiesOp(locaties);

        alert("Locatie opgeslagen!");

        window.location.href = "locaties.html";
    });
}


// ==========================================
// NIEUW SPUL OPSLAAN
// ==========================================

const spulForm = document.getElementById("spul-form");

if (spulForm) {
    spulForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const naam = document.getElementById("naam").value.trim();
        const opbergplek = document.getElementById("opbergplek").value;
        const categorie = document.getElementById("categorie").value;
        const beschrijving = document.getElementById("beschrijving").value.trim();

        if (!naam || !opbergplek || !categorie) {
            alert("Vul alle verplichte velden in.");
            return;
        }

        const spullen = haalSpullenOp();

        spullen.push({
            id: maakID(),
            naam: naam,
            opbergplek: opbergplek,
            categorie: categorie,
            beschrijving: beschrijving
        });

        slaSpullenOp(spullen);

        alert("Voorwerp opgeslagen!");

        window.location.href = "inventaris.html";
    });
}


// ==========================================
// ZOEKEN EN FILTEREN
// ==========================================

const zoekveld = document.getElementById("zoek-spul");
const categorieFilter = document.getElementById("filter-categorie");

if (zoekveld) {
    zoekveld.addEventListener("input", toonSpullen);
}

if (categorieFilter) {
    categorieFilter.addEventListener("change", toonSpullen);
}


// ==========================================
// PAGINA LADEN
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    toonLocaties();
    toonSpullen();
    toonRecenteSpullen();
    vulLocatieKeuze();
});

// ==========================================
// UITLOGGEN
// ==========================================

const uitloggenKnop = document.getElementById("uitloggen-knop");

if (uitloggenKnop) {
    uitloggenKnop.addEventListener("click", function () {

        const bevestiging = confirm("Weet je zeker dat je wilt uitloggen?");

        if (bevestiging) {
            localStorage.removeItem("thuisinventaris-ingelogd");

            window.location.href = "login.html";
        }

    });
}

const logoutBtn = document.getElementById('logoutBtn');
const logoutModal = document.getElementById('logoutModal');
const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');

function openLogoutModal() {
  logoutModal.classList.add('is-open');
}

function closeLogoutModal() {
  logoutModal.classList.remove('is-open');
}

if (logoutBtn && logoutModal) {
  logoutBtn.addEventListener('click', openLogoutModal);
  cancelLogoutBtn.addEventListener('click', closeLogoutModal);

  logoutModal.addEventListener('click', (event) => {
    if (event.target === logoutModal) {
      closeLogoutModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && logoutModal.classList.contains('is-open')) {
      closeLogoutModal();
    }
  });

  confirmLogoutBtn.addEventListener('click', () => {
    closeLogoutModal();
    // Zet hier je eigen uitlog-functie of doorverwijzing neer:
    // window.location.href = 'login.html';
    alert('Je bent uitgelogd.');
  });
}