document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addTodoForm = document.getElementById('add-todo-form');
    const editTodoForm = document.getElementById('edit-todo-form');
    const addTodoModal = document.getElementById('add-todo-modal');
    const editTodoModal = document.getElementById('edit-todo-modal');
    const closeAddModalBtn = document.getElementById('close-add-modal');
    const closeEditModalBtn = document.getElementById('close-edit-modal');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const cancelAddBtn = document.getElementById('cancel-add');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const statusFilter = document.getElementsByName('status-filter');
    const priorityFilter = document.getElementsByName('priority-filter');
    
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
    
    if (cancelAddBtn) {
        cancelAddBtn.addEventListener('click', function() {
            addTodoModal.classList.remove('show');
            addTodoForm.reset();
        });
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
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
    
    // Demo functionality for action buttons
    const setupDemoActionButtons = () => {
        // Complete buttons
        const completeButtons = document.querySelectorAll('.action-btn.complete');
        completeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const todoItem = this.closest('.todo-item');
                todoItem.classList.remove('pending', 'in-progress');
                todoItem.classList.add('completed');
                
                // Change button to undo button
                const actionBtns = todoItem.querySelector('.todo-actions');
                actionBtns.innerHTML = `
                    <button class="action-btn pending" title="Mark as Pending">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="action-btn edit" title="Edit Todo">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Delete Todo">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                
                // Update status text
                const statusText = todoItem.querySelector('.todo-status span');
                statusText.textContent = 'Completed';
                
                // Setup new buttons
                setupDemoActionButtons();
            });
        });
        
        // Pending buttons (undo)
        const pendingButtons = document.querySelectorAll('.action-btn.pending');
        pendingButtons.forEach(button => {
            button.addEventListener('click', function() {
                const todoItem = this.closest('.todo-item');
                todoItem.classList.remove('completed', 'in-progress');
                todoItem.classList.add('pending');
                
                // Change button to complete button
                const actionBtns = todoItem.querySelector('.todo-actions');
                actionBtns.innerHTML = `
                    <button class="action-btn complete" title="Mark as Completed">
                        <i class="fas fa-check-circle"></i>
                    </button>
                    <button class="action-btn edit" title="Edit Todo">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Delete Todo">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                
                // Update status text
                const statusText = todoItem.querySelector('.todo-status span');
                statusText.textContent = 'Pending';
                
                // Setup new buttons
                setupDemoActionButtons();
            });
        });
        
        // Edit buttons
        const editButtons = document.querySelectorAll('.action-btn.edit');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const todoItem = this.closest('.todo-item');
                const title = todoItem.querySelector('.todo-title').textContent;
                const description = todoItem.querySelector('.todo-description').textContent;
                const priorityText = todoItem.querySelector('.todo-priority span:last-child').textContent;
                const statusText = todoItem.querySelector('.todo-status span').textContent;
                const dueDateText = todoItem.querySelector('.todo-due-date span').textContent;
                
                // Set form values
                document.getElementById('edit-title').value = title;
                document.getElementById('edit-description').value = description;
                
                // Set priority
                let priority = 'medium';
                if (priorityText.includes('High')) {
                    priority = 'high';
                } else if (priorityText.includes('Low')) {
                    priority = 'low';
                }
                document.getElementById('edit-priority').value = priority;
                
                // Set status
                let status = 'pending';
                if (statusText.includes('Completed')) {
                    status = 'completed';
                } else if (statusText.includes('In Progress')) {
                    status = 'in_progress';
                }
                document.getElementById('edit-status').value = status;
                
                // Set due date (convert from MM/DD/YYYY to YYYY-MM-DD)
                if (dueDateText !== 'No due date') {
                    const dateParts = dueDateText.split('/');
                    const formattedDate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
                    document.getElementById('edit-due-date').value = formattedDate;
                } else {
                    document.getElementById('edit-due-date').value = '';
                }
                
                // Show modal
                editTodoModal.classList.add('show');
            });
        });
        
        // Delete buttons
        const deleteButtons = document.querySelectorAll('.action-btn.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const todoItem = this.closest('.todo-item');
                
                // Simple confirmation for demo
                if (confirm('Are you sure you want to delete this todo?')) {
                    todoItem.style.opacity = '0';
                    setTimeout(() => {
                        todoItem.remove();
                    }, 300);
                }
            });
        });
    };
    
    // Setup demo action buttons
    setupDemoActionButtons();
    
    // Add Todo Form Submit (Demo)
    if (addTodoForm) {
        addTodoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const priority = document.getElementById('priority').value;
            const dueDate = document.getElementById('due-date').value;
            
            // Create new todo item
            const todoList = document.getElementById('todo-list');
            const newTodoItem = document.createElement('div');
            newTodoItem.className = `todo-item pending ${priority}-priority`;
            
            // Format date for display (YYYY-MM-DD to MM/DD/YYYY)
            let formattedDate = 'No due date';
            if (dueDate) {
                const dateParts = dueDate.split('-');
                formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
            }
            
            newTodoItem.innerHTML = `
                <div class="todo-content">
                    <h3 class="todo-title">${title}</h3>
                    <p class="todo-description">${description || ''}</p>
                    <div class="todo-details">
                        <div class="todo-priority">
                            <span class="priority-indicator priority-${priority}"></span>
                            <span>${capitalizeFirstLetter(priority)} Priority</span>
                        </div>
                        <div class="todo-status">
                            <i class="fas fa-circle-notch"></i>
                            <span>Pending</span>
                        </div>
                        <div class="todo-due-date">
                            <i class="far fa-calendar-alt"></i>
                            <span>${formattedDate}</span>
                        </div>
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="action-btn complete" title="Mark as Completed">
                        <i class="fas fa-check-circle"></i>
                    </button>
                    <button class="action-btn edit" title="Edit Todo">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Delete Todo">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            
            // Add to the beginning of the list
            todoList.insertBefore(newTodoItem, todoList.firstChild);
            
            // Reset form and close modal
            addTodoForm.reset();
            addTodoModal.classList.remove('show');
            
            // Setup action buttons for the new todo
            setupDemoActionButtons();
            
            // Show success message
            showNotification('Todo added successfully!', 'success');
        });
    }
    
    // Edit Todo Form Submit (Demo)
    if (editTodoForm) {
        editTodoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('edit-title').value;
            const description = document.getElementById('edit-description').value;
            const status = document.getElementById('edit-status').value;
            const priority = document.getElementById('edit-priority').value;
            const dueDate = document.getElementById('edit-due-date').value;
            
            // For demo purposes, we'll just update the first todo item
            const todoItem = document.querySelector('.todo-item');
            
            // Update classes
            todoItem.className = `todo-item ${status} ${priority}-priority`;
            
            // Update title and description
            todoItem.querySelector('.todo-title').textContent = title;
            todoItem.querySelector('.todo-description').textContent = description || '';
            
            // Update priority
            const priorityIndicator = todoItem.querySelector('.priority-indicator');
            priorityIndicator.className = `priority-indicator priority-${priority}`;
            todoItem.querySelector('.todo-priority span:last-child').textContent = `${capitalizeFirstLetter(priority)} Priority`;
            
            // Update status
            todoItem.querySelector('.todo-status span').textContent = formatStatus(status);
            
            // Update due date
            let formattedDate = 'No due date';
            if (dueDate) {
                const dateParts = dueDate.split('-');
                formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
            }
            todoItem.querySelector('.todo-due-date span').textContent = formattedDate;
            
            // Update action buttons based on status
            const actionBtns = todoItem.querySelector('.todo-actions');
            if (status === 'completed') {
                actionBtns.innerHTML = `
                    <button class="action-btn pending" title="Mark as Pending">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="action-btn edit" title="Edit Todo">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Delete Todo">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
            } else {
                actionBtns.innerHTML = `
                    <button class="action-btn complete" title="Mark as Completed">
                        <i class="fas fa-check-circle"></i>
                    </button>
                    <button class="action-btn edit" title="Edit Todo">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Delete Todo">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
            }
            
            // Close modal
            editTodoModal.classList.remove('show');
            
            // Setup action buttons
            setupDemoActionButtons();
            
            // Show success message
            showNotification('Todo updated successfully!', 'success');
        });
    }
    
    // Filter functionality (Demo)
    if (statusFilter.length > 0 || priorityFilter.length > 0) {
        const applyFilters = () => {
            let selectedStatus = 'all';
            let selectedPriority = 'all';
            
            // Get selected status
            for (let i = 0; i < statusFilter.length; i++) {
                if (statusFilter[i].checked) {
                    selectedStatus = statusFilter[i].value;
                    break;
                }
            }
            
            // Get selected priority
            for (let i = 0; i < priorityFilter.length; i++) {
                if (priorityFilter[i].checked) {
                    selectedPriority = priorityFilter[i].value;
                    break;
                }
            }
            
            // Apply filters
            const todoItems = document.querySelectorAll('.todo-item');
            todoItems.forEach(item => {
                let showItem = true;
                
                // Check status filter
                if (selectedStatus !== 'all') {
                    if (!item.classList.contains(selectedStatus)) {
                        showItem = false;
                    }
                }
                
                // Check priority filter
                if (selectedPriority !== 'all') {
                    if (!item.classList.contains(`${selectedPriority}-priority`)) {
                        showItem = false;
                    }
                }
                
                // Show or hide item
                item.style.display = showItem ? 'flex' : 'none';
            });
        };
        
        // Add event listeners to filters
        for (let i = 0; i < statusFilter.length; i++) {
            statusFilter[i].addEventListener('change', applyFilters);
        }
        
        for (let i = 0; i < priorityFilter.length; i++) {
            priorityFilter[i].addEventListener('change', applyFilters);
        }
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
    
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide and remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}); 