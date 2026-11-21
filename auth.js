(function () {
    // Ingelogd? Dan mag je door.
    if (localStorage.getItem("thuisinventaris-ingelogd")) {
        return;
    }

    // Wel een account in deze browser, maar niet ingelogd: naar inloggen.
    // Nog geen account: naar registreren.
    const heeftAccount = localStorage.getItem("thuisinventaris-user");

    window.location.replace(heeftAccount ? "login.html" : "register.html");
})();
