<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
$config = require 'config.php';
$servername = $config['servername'];
$username = $config['username'];
$password = $config['password'];
$dbname = $config['dbname'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["coordinates"])) {
    // Get the coordinates data from the form
    $coordinates = $_POST["coordinates"];

    // Convert the coordinates array to JSON format
    $note_coordinates = json_encode($coordinates);

    // Prepare SQL statement to insert coordinates into database
    $stmt = $conn->prepare("INSERT INTO notes (note_coordinates) VALUES (?)");
    $stmt->bind_param("s", $note_coordinates);

    // Execute SQL statement
    if ($stmt->execute() === TRUE) {
        echo "Coordinates inserted successfully!";
    } else {
        echo "Error inserting coordinates: " . $stmt->error;
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
} else {
    echo "Coordinates data not provided.";
}
?>
