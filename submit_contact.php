<?php
// Set headers to allow cross-origin requests, which is necessary for
// your JavaScript frontend (running on localhost) to communicate with
// this PHP backend script.
header('Content-Type: application/json'); // Respond with JSON format
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin (e.g., your local HTML file)
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // Specify allowed HTTP methods
header('Access-Control-Allow-Headers: Content-Type'); // Allow the Content-Type header

// Database connection details
// IMPORTANT: Ensure these match your XAMPP MySQL setup.
// 'localhost' is typically correct.
// 'root' is the default username for XAMPP MySQL.
// '' (empty string) is the default password for XAMPP MySQL.
// 'coffee_shop_db' should match the exact name of the database you created in phpMyAdmin.
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "coffee_shop_db"; // <<< MAKE SURE THIS MATCHES YOUR DATABASE NAME EXACTLY

// Establish a new database connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the database connection was successful
if ($conn->connect_error) {
    // If connection fails, return a JSON error message and exit
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Check if the incoming request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the raw POST data from the request body.
    // This is how you receive JSON data sent by JavaScript's fetch() method.
    $json_data = file_get_contents("php://input");
    // Decode the JSON string into a PHP associative array.
    $data = json_decode($json_data, true);

    // Sanitize and validate input data.
    // real_escape_string helps prevent SQL injection by escaping special characters.
    $name = isset($data['name']) ? $conn->real_escape_string($data['name']) : '';
    $email = isset($data['email']) ? $conn->real_escape_string($data['email']) : '';
    $message = isset($data['message']) ? $conn->real_escape_string($data['message']) : '';

    // Basic server-side validation: ensure essential fields are not empty
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit();
    }

    // Prepare an SQL INSERT statement using a prepared statement.
    // Prepared statements are a crucial security measure against SQL injection.
    // '?' are placeholders for the values to be inserted.
    $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, message, submission_timestamp) VALUES (?, ?, ?, NOW())");

    // Check if the statement preparation was successful
    if ($stmt === false) {
        echo json_encode(["success" => false, "message" => "Failed to prepare statement: " . $conn->error]);
        exit();
    }

    // Bind parameters to the prepared statement.
    // "sss" indicates that the three parameters are all strings.
    // The variables ($name, $email, $message) are passed by reference.
    $stmt->bind_param("sss", $name, $email, $message);

    // Execute the prepared statement
    if ($stmt->execute()) {
        // If execution is successful, return a JSON success message
        echo json_encode(["success" => true, "message" => "Message sent successfully!"]);
    } else {
        // If execution fails, return a JSON error message with details
        echo json_encode(["success" => false, "message" => "Error executing statement: " . $stmt->error]);
    }

    // Close the prepared statement
    $stmt->close();
} else {
    // If the request method is not POST, return an error message
    echo json_encode(["success" => false, "message" => "Invalid request method. Only POST requests are allowed for this endpoint."]);
}

// Close the database connection
$conn->close();
?>
