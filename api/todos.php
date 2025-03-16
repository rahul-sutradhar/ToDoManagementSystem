<?php
require_once '../config/db_connect.php';

// Check if user is logged in
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("location: ../auth/login.php");
    exit;
}

$user_id = $_SESSION["id"];
$response = array();

// Get all todos for the logged-in user
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $status_filter = isset($_GET['status']) ? $_GET['status'] : '';
    $priority_filter = isset($_GET['priority']) ? $_GET['priority'] : '';
    
    $sql = "SELECT * FROM todos WHERE user_id = ?";
    $params = array($user_id);
    $types = "i";
    
    if (!empty($status_filter)) {
        $sql .= " AND status = ?";
        $params[] = $status_filter;
        $types .= "s";
    }
    
    if (!empty($priority_filter)) {
        $sql .= " AND priority = ?";
        $params[] = $priority_filter;
        $types .= "s";
    }
    
    $sql .= " ORDER BY 
              CASE 
                WHEN priority = 'high' THEN 1 
                WHEN priority = 'medium' THEN 2 
                WHEN priority = 'low' THEN 3 
              END, 
              CASE 
                WHEN status = 'in_progress' THEN 1 
                WHEN status = 'pending' THEN 2 
                WHEN status = 'completed' THEN 3 
              END, 
              due_date ASC";
    
    if ($stmt = $conn->prepare($sql)) {
        if (count($params) > 0) {
            $stmt->bind_param($types, ...$params);
        }
        
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $todos = array();
            
            while ($row = $result->fetch_assoc()) {
                $todos[] = $row;
            }
            
            $response["status"] = "success";
            $response["todos"] = $todos;
        } else {
            $response["status"] = "error";
            $response["message"] = "Error executing query: " . $conn->error;
        }
        
        $stmt->close();
    } else {
        $response["status"] = "error";
        $response["message"] = "Error preparing statement: " . $conn->error;
    }
}

// Add a new todo
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["action"]) && $_POST["action"] == "add") {
    $title = trim($_POST["title"]);
    $description = trim($_POST["description"]);
    $priority = trim($_POST["priority"]);
    $due_date = !empty($_POST["due_date"]) ? trim($_POST["due_date"]) : NULL;
    
    if (empty($title)) {
        $response["status"] = "error";
        $response["message"] = "Title cannot be empty";
    } else {
        $sql = "INSERT INTO todos (user_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)";
        
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("issss", $user_id, $title, $description, $priority, $due_date);
            
            if ($stmt->execute()) {
                $response["status"] = "success";
                $response["message"] = "Todo added successfully";
                $response["todo_id"] = $conn->insert_id;
            } else {
                $response["status"] = "error";
                $response["message"] = "Error adding todo: " . $conn->error;
            }
            
            $stmt->close();
        } else {
            $response["status"] = "error";
            $response["message"] = "Error preparing statement: " . $conn->error;
        }
    }
}

// Update a todo
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["action"]) && $_POST["action"] == "update") {
    $todo_id = $_POST["todo_id"];
    $title = trim($_POST["title"]);
    $description = trim($_POST["description"]);
    $status = trim($_POST["status"]);
    $priority = trim($_POST["priority"]);
    $due_date = !empty($_POST["due_date"]) ? trim($_POST["due_date"]) : NULL;
    
    if (empty($title)) {
        $response["status"] = "error";
        $response["message"] = "Title cannot be empty";
    } else {
        // First check if the todo belongs to the logged-in user
        $check_sql = "SELECT id FROM todos WHERE id = ? AND user_id = ?";
        
        if ($check_stmt = $conn->prepare($check_sql)) {
            $check_stmt->bind_param("ii", $todo_id, $user_id);
            $check_stmt->execute();
            $check_stmt->store_result();
            
            if ($check_stmt->num_rows == 1) {
                $check_stmt->close();
                
                $sql = "UPDATE todos SET title = ?, description = ?, status = ?, priority = ?, due_date = ? WHERE id = ? AND user_id = ?";
                
                if ($stmt = $conn->prepare($sql)) {
                    $stmt->bind_param("sssssii", $title, $description, $status, $priority, $due_date, $todo_id, $user_id);
                    
                    if ($stmt->execute()) {
                        $response["status"] = "success";
                        $response["message"] = "Todo updated successfully";
                    } else {
                        $response["status"] = "error";
                        $response["message"] = "Error updating todo: " . $conn->error;
                    }
                    
                    $stmt->close();
                } else {
                    $response["status"] = "error";
                    $response["message"] = "Error preparing statement: " . $conn->error;
                }
            } else {
                $response["status"] = "error";
                $response["message"] = "You don't have permission to update this todo";
                $check_stmt->close();
            }
        } else {
            $response["status"] = "error";
            $response["message"] = "Error preparing statement: " . $conn->error;
        }
    }
}

// Delete a todo
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["action"]) && $_POST["action"] == "delete") {
    $todo_id = $_POST["todo_id"];
    
    // First check if the todo belongs to the logged-in user
    $check_sql = "SELECT id FROM todos WHERE id = ? AND user_id = ?";
    
    if ($check_stmt = $conn->prepare($check_sql)) {
        $check_stmt->bind_param("ii", $todo_id, $user_id);
        $check_stmt->execute();
        $check_stmt->store_result();
        
        if ($check_stmt->num_rows == 1) {
            $check_stmt->close();
            
            $sql = "DELETE FROM todos WHERE id = ? AND user_id = ?";
            
            if ($stmt = $conn->prepare($sql)) {
                $stmt->bind_param("ii", $todo_id, $user_id);
                
                if ($stmt->execute()) {
                    $response["status"] = "success";
                    $response["message"] = "Todo deleted successfully";
                } else {
                    $response["status"] = "error";
                    $response["message"] = "Error deleting todo: " . $conn->error;
                }
                
                $stmt->close();
            } else {
                $response["status"] = "error";
                $response["message"] = "Error preparing statement: " . $conn->error;
            }
        } else {
            $response["status"] = "error";
            $response["message"] = "You don't have permission to delete this todo";
            $check_stmt->close();
        }
    } else {
        $response["status"] = "error";
        $response["message"] = "Error preparing statement: " . $conn->error;
    }
}

// Update todo status
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["action"]) && $_POST["action"] == "update_status") {
    $todo_id = $_POST["todo_id"];
    $status = trim($_POST["status"]);
    
    // First check if the todo belongs to the logged-in user
    $check_sql = "SELECT id FROM todos WHERE id = ? AND user_id = ?";
    
    if ($check_stmt = $conn->prepare($check_sql)) {
        $check_stmt->bind_param("ii", $todo_id, $user_id);
        $check_stmt->execute();
        $check_stmt->store_result();
        
        if ($check_stmt->num_rows == 1) {
            $check_stmt->close();
            
            $sql = "UPDATE todos SET status = ? WHERE id = ? AND user_id = ?";
            
            if ($stmt = $conn->prepare($sql)) {
                $stmt->bind_param("sii", $status, $todo_id, $user_id);
                
                if ($stmt->execute()) {
                    $response["status"] = "success";
                    $response["message"] = "Todo status updated successfully";
                } else {
                    $response["status"] = "error";
                    $response["message"] = "Error updating todo status: " . $conn->error;
                }
                
                $stmt->close();
            } else {
                $response["status"] = "error";
                $response["message"] = "Error preparing statement: " . $conn->error;
            }
        } else {
            $response["status"] = "error";
            $response["message"] = "You don't have permission to update this todo";
            $check_stmt->close();
        }
    } else {
        $response["status"] = "error";
        $response["message"] = "Error preparing statement: " . $conn->error;
    }
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?> 