<?php

require "database.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Gegevens ophalen
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    $password_repeat = $_POST['password_repeat'];

    $password_hint = trim($_POST['password_hint'] ?? "");

    $first_name = trim($_POST['first_name']);
    $prefix = trim($_POST['prefix'] ?? "");
    $last_name = trim($_POST['last_name']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone'] ?? "");
    $birthdate = $_POST['birthdate'];

    // Wachtwoorden controleren
    if ($password !== $password_repeat) {
        die("De wachtwoorden komen niet overeen.");
    }

    // Wachtwoord veilig versleutelen (hashen)
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Gebruiker opslaan
    $sql = "INSERT INTO gebruikers
    (username, password, password_hint, first_name, prefix,
    last_name, email, phone, birthdate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    try {

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            $username,
            $hashed_password,
            $password_hint,
            $first_name,
            $prefix,
            $last_name,
            $email,
            $phone,
            $birthdate
        ]);

        echo "<h1>Account succesvol aangemaakt!</h1>";
        echo '<a href="login.html">Ga naar inloggen</a>';

    } catch (PDOException $e) {
        echo "Registreren mislukt. Controleer of je gebruikersnaam of e-mailadres al bestaat.";
    }

} else {
    echo "Ongeldige aanvraag.";
}

?>
