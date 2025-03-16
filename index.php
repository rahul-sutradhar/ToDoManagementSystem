<?php
require_once 'config/db_connect.php';

// Check if user is logged in
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("location: auth/login.php");
    exit;
}

$username = $_SESSION["username"];
$user_id = $_SESSION["id"];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo Management System</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1><i class="fas fa-check-circle"></i> Todo Management System</h1>
            <div class="user-info">
                <span class="username">Welcome, <?php echo htmlspecialchars($username); ?>!</span>
                <a href="auth/logout.php" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </div>
        </header>
        
        <div class="todo-container">
            <aside class="sidebar">
                <h3>Filters</h3>
                
                <div class="filter-section">
                    <h4>Status</h4>
                    <div class="filter-options">
                        <div class="filter-option">
                            <input type="radio" id="status-all" name="status-filter" value="all" checked>
                            <label for="status-all">All</label>
                        </div>
                        <div class="filter-option">
                            <input type="radio" id="status-pending" name="status-filter" value="pending">
                            <label for="status-pending">Pending</label>
                        </div>
                        <div class="filter-option">
                            <input type="radio" id="status-in-progress" name="status-filter" value="in_progress">
                            <label for="status-in-progress">In Progress</label>
                        </div>
                        <div class="filter-option">
                            <input type="radio" id="status-completed" name="status-filter" value="completed">
                            <label for="status-completed">Completed</label>
                        </div>
                    </div>
                </div>
                
                <div class="filter-section">
                    <h4>Priority</h4>
                    <div class="filter-options">
                        <div class="filter-option">
                            <input type="radio" id="priority-all" name="priority-filter" value="all" checked>
                            <label for="priority-all">All</label>
                        </div>
                        <div class="filter-option">
                            <input type="radio" id="priority-high" name="priority-filter" value="high">
                            <label for="priority-high">High</label>
                        </div>
                        <div class="filter-option">
                            <input type="radio" id="priority-medium" name="priority-filter" value="medium">
                            <label for="priority-medium">Medium</label>
                        </div>
                        <div class="filter-option">
                            <input type="radio" id="priority-low" name="priority-filter" value="low">
                            <label for="priority-low">Low</label>
                        </div>
                    </div>
                </div>
                
                <button id="add-todo-btn" class="btn btn-primary add-todo-btn">
                    <i class="fas fa-plus"></i> Add New Todo
                </button>
            </aside>
            
            <main class="main-content">
                <div class="todo-header">
                    <h2>My Todos</h2>
                </div>
                
                <div id="todo-list" class="todo-list">
                    <!-- Todo items will be loaded here via JavaScript -->
                </div>
            </main>
        </div>
    </div>
    
    <!-- Add Todo Modal -->
    <div id="add-todo-modal" class="modal">
        <div class="modal-content">
            <button id="close-add-modal" class="close-modal">&times;</button>
            <div class="modal-header">
                <h3><i class="fas fa-plus-circle"></i> Add New Todo</h3>
            </div>
            <form id="add-todo-form">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" name="title" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" class="form-control" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="priority">Priority</label>
                    <select id="priority" name="priority" class="form-control">
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="due-date">Due Date</label>
                    <input type="date" id="due-date" name="due_date" class="form-control">
                </div>
                <div class="modal-footer">
                    <button type="button" id="cancel-add" class="btn btn-secondary">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Todo</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Edit Todo Modal -->
    <div id="edit-todo-modal" class="modal">
        <div class="modal-content">
            <button id="close-edit-modal" class="close-modal">&times;</button>
            <div class="modal-header">
                <h3><i class="fas fa-edit"></i> Edit Todo</h3>
            </div>
            <form id="edit-todo-form">
                <input type="hidden" id="edit-todo-id" name="todo_id">
                <div class="form-group">
                    <label for="edit-title">Title</label>
                    <input type="text" id="edit-title" name="title" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="edit-description">Description</label>
                    <textarea id="edit-description" name="description" class="form-control" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="edit-status">Status</label>
                    <select id="edit-status" name="status" class="form-control">
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-priority">Priority</label>
                    <select id="edit-priority" name="priority" class="form-control">
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-due-date">Due Date</label>
                    <input type="date" id="edit-due-date" name="due_date" class="form-control">
                </div>
                <div class="modal-footer">
                    <button type="button" id="cancel-edit" class="btn btn-secondary">Cancel</button>
                    <button type="submit" class="btn btn-warning">Update Todo</button>
                </div>
            </form>
        </div>
    </div>
    
    <script src="js/script.js"></script>
    <script>
        // Additional inline script for cancel buttons
        document.getElementById('cancel-add').addEventListener('click', function() {
            document.getElementById('add-todo-modal').classList.remove('show');
            document.getElementById('add-todo-form').reset();
        });
        
        document.getElementById('cancel-edit').addEventListener('click', function() {
            document.getElementById('edit-todo-modal').classList.remove('show');
        });
    </script>
</body>
</html> 