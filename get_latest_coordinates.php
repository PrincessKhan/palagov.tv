<?php
// Database configuration
$servername = "localhost";
$username = "twinlizzie";
$password = "";
$dbname = "notes_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to select the most recent set of coordinates
$sql = "SELECT note_coordinates FROM notes ORDER BY created_at DESC LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Fetch the result row
    $row = $result->fetch_assoc();
    // Return the coordinates as JSON
    echo json_encode(["coordinates" => json_decode($row["note_coordinates"])]);
} else {
    // If no coordinates found, return an empty array
    echo json_encode(["coordinates" => []]);
}

// Close connection
$conn->close();
?>

