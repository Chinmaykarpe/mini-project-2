<?php
// Set headers for CORS (Cross-Origin Resource Sharing)
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
    // Get the raw POST data from the request body (JSON sent by JavaScript's fetch).
    $json_data = file_get_contents("php://input");
    // Decode the JSON string into a PHP associative array.
    $data = json_decode($json_data, true);

    // Sanitize and validate essential input data.
    // real_escape_string helps prevent SQL injection.
    $customer_name = isset($data['customerName']) ? $conn->real_escape_string($data['customerName']) : '';
    $order_type = isset($data['orderType']) ? $conn->real_escape_string($data['orderType']) : '';
    $payment_method = isset($data['paymentMethod']) ? $conn->real_escape_string($data['paymentMethod']) : '';
    // Cast total_amount to float for database consistency.
    $total_amount = isset($data['totalAmount']) ? (float)$data['totalAmount'] : 0.00;
    // Encode the 'cart' array back into a JSON string to store in the 'cart_items' column.
    // This allows you to store complex cart data in a single text column.
    $cart_items = isset($data['cart']) ? json_encode($data['cart']) : '[]';

    // Basic server-side validation: ensure essential fields are not empty or invalid
    if (empty($customer_name) || empty($order_type) || empty($payment_method) || $total_amount <= 0) {
        echo json_encode(["success" => false, "message" => "Missing or invalid required order details."]);
        exit();
    }

    // Handle optional fields: table_number and delivery_address
    // If they are empty or not provided, set them to null for the database.
    $table_number = isset($data['tableNumber']) && $data['tableNumber'] !== '' ? $conn->real_escape_string($data['tableNumber']) : null;
    $delivery_address = isset($data['deliveryAddress']) && $data['deliveryAddress'] !== '' ? $conn->real_escape_string($data['deliveryAddress']) : null;

    // Prepare an SQL INSERT statement for the 'orders' table.
    // Using prepared statements for security.
    // NOW() is a MySQL function to get the current timestamp.
    $stmt = $conn->prepare("INSERT INTO orders (customer_name, order_type, table_number, delivery_address, payment_method, cart_items, total_amount, order_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");

    // Bind parameters to the prepared statement.
    // "ssssssd" specifies the data types: 6 strings, then 1 double (for total_amount).
    $stmt->bind_param("ssssssd", $customer_name, $order_type, $table_number, $delivery_address, $payment_method, $cart_items, $total_amount);

    // Execute the prepared statement
    if ($stmt->execute()) {
        // If execution is successful, return a JSON success message along with the new order ID.
        $order_id = $conn->insert_id; // Get the ID of the newly inserted order row
        echo json_encode(["success" => true, "message" => "Order placed successfully!", "orderId" => $order_id]);
    } else {
        // If execution fails, return a JSON error message with details
        echo json_encode(["success" => false, "message" => "Error placing order: " . $stmt->error]);
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
