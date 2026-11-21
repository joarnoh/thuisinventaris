
<?php

session_start();

require "database.php";

// Controleren of het formulier is verzonden
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Ongeldige aanvraag.");
}

// Gegevens ophalen
$username = trim($_POST["username"] ?? "");
$password = $_POST["password"] ?? "";

// Controleren of beide velden zijn ingevuld
if ($username === "" || $password === "") {
    die("Vul je gebruikersnaam en wachtwoord in.");
}

// Gebruiker zoeken in de database
$sql = "SELECT id, username, password FROM gebruikers WHERE username = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$username]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Wachtwoord controleren
if ($user && password_verify($password, $user["password"])) {

    // Gebruiker onthouden in de sessie
    session_regenerate_id(true);
    $_SESSION["user_id"] = $user["id"];
    $_SESSION["username"] = $user["username"];

    // Naar de homepage
    header("Location: index.php");
    exit;

} else {
    echo "Gebruikersnaam of wachtwoord is onjuist.";
}

?>
