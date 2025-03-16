document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const todoList = document.getElementById('todo-list');
    const addTodoForm = document.getElementById('add-todo-form');
    const editTodoForm = document.getElementById('edit-todo-form');
    const addTodoModal = document.getElementById('add-todo-modal');
    const editTodoModal = document.getElementById('edit-todo-modal');
    const closeAddModalBtn = document.getElementById('close-add-modal');
    const closeEditModalBtn = document.getElementById('close-edit-modal');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const statusFilter = document.getElementsByName('status-filter');
    const priorityFilter = document.getElementsByName('priority-filter');
    
    // Load todos on page load
    loadTodos();
    
    // Event Listeners
    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', function() {
            addTodoModal.classList.add('show');
        });
    }
    
    if (closeAddModalBtn) {
        closeAddModalBtn.addEventListener('click', function() {
            addTodoModal.classList.remove('show');
            addTodoForm.reset();
        });
    }
    
    if (closeEditModalBtn) {
        closeEditModalBtn.addEventListener('click', function() {
            editTodoModal.classList.remove('show');
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === addTodoModal) {
            addTodoModal.classList.remove('show');
            addTodoForm.reset();
        }
        if (event.target === editTodoModal) {
            editTodoModal.classList.remove('show');
        }
    });
    
    // Add Todo Form Submit
    if (addTodoForm) {
        addTodoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(addTodoForm);
            formData.append('action', 'add');
            
            fetch('api/todos.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    addTodoModal.classList.remove('show');
                    addTodoForm.reset();
                    loadTodos();
                    showNotification('Todo added successfully!', 'success');
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred. Please try again.', 'error');
            });
        });
    }
    
    // Edit Todo Form Submit
    if (editTodoForm) {
        editTodoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(editTodoForm);
            formData.append('action', 'update');
            
            fetch('api/todos.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    editTodoModal.classList.remove('show');
                    loadTodos();
                    showNotification('Todo updated successfully!', 'success');
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred. Please try again.', 'error');
            });
        });
    }
    
    // Filter event listeners
    if (statusFilter.length > 0) {
        for (let i = 0; i < statusFilter.length; i++) {
            statusFilter[i].addEventListener('change', function() {
                loadTodos();
            });
        }
    }
    
    if (priorityFilter.length > 0) {
        for (let i = 0; i < priorityFilter.length; i++) {
            priorityFilter[i].addEventListener('change', function() {
                loadTodos();
            });
        }
    }
    
    // Load Todos Function
    function loadTodos() {
        // Get selected filters
        let statusValue = '';
        let priorityValue = '';
        
        if (statusFilter.length > 0) {
            for (let i = 0; i < statusFilter.length; i++) {
                if (statusFilter[i].checked && statusFilter[i].value !== 'all') {
                    statusValue = statusFilter[i].value;
                    break;
                }
            }
        }
        
        if (priorityFilter.length > 0) {
            for (let i = 0; i < priorityFilter.length; i++) {
                if (priorityFilter[i].checked && priorityFilter[i].value !== 'all') {
                    priorityValue = priorityFilter[i].value;
                    break;
                }
            }
        }
        
        // Build query string
        let queryString = '';
        if (statusValue) {
            queryString += `status=${statusValue}`;
        }
        
        if (priorityValue) {
            if (queryString) {
                queryString += `&priority=${priorityValue}`;
            } else {
                queryString += `priority=${priorityValue}`;
            }
        }
        
        // Fetch todos
        fetch(`api/todos.php${queryString ? '?' + queryString : ''}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    renderTodos(data.todos);
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred while loading todos.', 'error');
            });
    }
    
    // Render Todos Function
    function renderTodos(todos) {
        if (!todoList) return;
        
        todoList.innerHTML = '';
        
        if (todos.length === 0) {
            todoList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>No todos found</h3>
                    <p>Add a new todo to get started!</p>
                    <button class="btn btn-primary" id="empty-add-todo-btn">Add Todo</button>
                </div>
            `;
            
            const emptyAddTodoBtn = document.getElementById('empty-add-todo-btn');
            if (emptyAddTodoBtn) {
                emptyAddTodoBtn.addEventListener('click', function() {
                    addTodoModal.classList.add('show');
                });
            }
            
            return;
        }
        
        todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${todo.status} ${todo.priority}-priority`;
            
            const dueDate = todo.due_date ? new Date(todo.due_date).toLocaleDateString() : 'No due date';
            
            todoItem.innerHTML = `
                <div class="todo-content">
                    <h3 class="todo-title">${todo.title}</h3>
                    <p class="todo-description">${todo.description || ''}</p>
                    <div class="todo-details">
                        <div class="todo-priority">
                            <span class="priority-indicator priority-${todo.priority}"></span>
                            <span>${capitalizeFirstLetter(todo.priority)} Priority</span>
                        </div>
                        <div class="todo-status">
                            <i class="fas fa-circle-notch"></i>
                            <span>${formatStatus(todo.status)}</span>
                        </div>
                        <div class="todo-due-date">
                            <i class="far fa-calendar-alt"></i>
                            <span>${dueDate}</span>
                        </div>
                    </div>
                </div>
                <div class="todo-actions">
                    ${todo.status !== 'completed' ? 
                        `<button class="action-btn complete" data-id="${todo.id}" title="Mark as Completed">
                            <i class="fas fa-check-circle"></i>
                        </button>` : 
                        `<button class="action-btn pending" data-id="${todo.id}" title="Mark as Pending">
                            <i class="fas fa-undo"></i>
                        </button>`
                    }
                    <button class="action-btn edit" data-id="${todo.id}" title="Edit Todo">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" data-id="${todo.id}" title="Delete Todo">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            
            todoList.appendChild(todoItem);
            
            // Add event listeners to action buttons
            const completeBtn = todoItem.querySelector('.action-btn.complete');
            const pendingBtn = todoItem.querySelector('.action-btn.pending');
            const editBtn = todoItem.querySelector('.action-btn.edit');
            const deleteBtn = todoItem.querySelector('.action-btn.delete');
            
            if (completeBtn) {
                completeBtn.addEventListener('click', function() {
                    updateTodoStatus(this.dataset.id, 'completed');
                });
            }
            
            if (pendingBtn) {
                pendingBtn.addEventListener('click', function() {
                    updateTodoStatus(this.dataset.id, 'pending');
                });
            }
            
            if (editBtn) {
                editBtn.addEventListener('click', function() {
                    openEditModal(todo);
                });
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    deleteTodo(this.dataset.id);
                });
            }
        });
    }
    
    // Update Todo Status
    function updateTodoStatus(todoId, status) {
        const formData = new FormData();
        formData.append('action', 'update_status');
        formData.append('todo_id', todoId);
        formData.append('status', status);
        
        fetch('api/todos.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                loadTodos();
                showNotification(`Todo marked as ${formatStatus(status)}!`, 'success');
            } else {
                showNotification(data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again.', 'error');
        });
    }
    
    // Delete Todo
    function deleteTodo(todoId) {
        if (confirm('Are you sure you want to delete this todo?')) {
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('todo_id', todoId);
            
            fetch('api/todos.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    loadTodos();
                    showNotification('Todo deleted successfully!', 'success');
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred. Please try again.', 'error');
            });
        }
    }
    
    // Open Edit Modal
    function openEditModal(todo) {
        if (!editTodoForm) return;
        
        document.getElementById('edit-todo-id').value = todo.id;
        document.getElementById('edit-title').value = todo.title;
        document.getElementById('edit-description').value = todo.description || '';
        document.getElementById('edit-status').value = todo.status;
        document.getElementById('edit-priority').value = todo.priority;
        document.getElementById('edit-due-date').value = todo.due_date || '';
        
        editTodoModal.classList.add('show');
    }
    
    // Helper Functions
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    function formatStatus(status) {
        if (status === 'in_progress') {
            return 'In Progress';
        }
        return capitalizeFirstLetter(status);
    }
    
    // Show Notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide and remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}); 