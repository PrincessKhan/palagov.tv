<?php
// Database connection setup
$config = require 'config.php';
$servername = $config['servername'];
$username = $config['username'];
$password = $config['password'];
//$dbname = $config['dbname'];

$conn = new mysqli($servername, $username, $password, "analytics_db");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the real IP address of the client (even behind Cloudflare)
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'];

// Sanitize input
$page_id = isset($_POST['page_id']) ? $_POST['page_id'] : null;

if ($page_id) {
    // Check if the page has already been viewed by this IP
    $stmt = $conn->prepare("SELECT * FROM page_view_logs WHERE page_id = ? AND ip = ?");
    $stmt->bind_param("is", $page_id, $ip);
    $stmt->execute();
    $result = $stmt->get_result();

    // If the IP hasn't viewed this page, insert a new view record
    if ($result->num_rows === 0) {
        $stmt = $conn->prepare("INSERT INTO page_view_logs (page_id, ip) VALUES (?, ?)");
        $stmt->bind_param("is", $page_id, $ip);
        $stmt->execute();
    }

    // Get the total view count for the page
    $stmt = $conn->prepare("SELECT COUNT(*) AS view_count FROM page_view_logs WHERE page_id = ?");
    $stmt->bind_param("i", $page_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    // Output the view count
    echo $row['view_count'];
} else {
    echo "Invalid page ID.";
}

$conn->close();
?>
