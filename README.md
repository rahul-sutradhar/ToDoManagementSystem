# Todo Management System

A fully functional to-do management system built with PHP and JavaScript. This application allows users to create, manage, and track their tasks with an attractive and user-friendly interface.

## Features

- User authentication (register, login, logout)
- User-specific todo lists
- Create, read, update, and delete todos
- Filter todos by status (pending, in progress, completed)
- Filter todos by priority (high, medium, low)
- Set due dates for todos
- Responsive design for mobile and desktop

## GitHub Pages Demo

A static demo of the application interface is available on GitHub Pages. This demo showcases the UI and basic functionality of the Todo Management System without requiring a PHP server or database.

**Demo URL:** https://rahul-sutradhar.github.io/todo-management-system/

The GitHub Pages demo includes:
- Interactive UI demonstration
- Sample todo items
- Working filters
- Add/Edit/Delete functionality (client-side only)
- Responsive design showcase

Note that the GitHub Pages demo is for demonstration purposes only and does not save data permanently as it lacks the backend functionality.

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache, Nginx, etc.)
- Modern web browser

## Installation

1. Clone or download this repository to your web server's document root (e.g., htdocs for XAMPP)
2. Make sure your web server and MySQL are running
3. Access the application through your web browser (e.g., http://localhost/To-Do%20Management%20System/)
4. The system will automatically create the necessary database and tables on first run

## Database Setup

The application will automatically set up the database and required tables when you first access it. The database configuration is located in `config/database.php`. If you need to modify the database connection settings, you can edit this file.

Default database settings:
- Host: localhost
- Username: root
- Password: (empty)
- Database name: todo_management

## Usage

1. Register a new account
2. Log in with your credentials
3. Add new todos using the "Add New Todo" button
4. View, edit, and delete your todos
5. Filter todos by status or priority using the sidebar filters
6. Mark todos as completed or pending using the action buttons

## File Structure

```
├── api/
│   └── todos.php           # API endpoints for todo operations
├── auth/
│   ├── login.php           # User login page
│   ├── logout.php          # User logout functionality
│   └── register.php        # User registration page
├── config/
│   ├── database.php        # Database setup and initialization
│   └── db_connect.php      # Database connection file
├── css/
│   └── style.css           # Application styles
├── github-pages/           # GitHub Pages demo files
│   ├── images/             # Screenshot images for demo
│   ├── script.js           # Demo JavaScript functionality
│   └── style.css           # Demo styles
├── js/
│   └── script.js           # Application JavaScript functionality
├── index.html              # GitHub Pages demo page
├── index.php               # Main application page
└── README.md               # This file
```

## Setting Up GitHub Pages

To deploy the demo interface to GitHub Pages:

1. Push this repository to your GitHub account
2. Go to your repository settings
3. Scroll down to the GitHub Pages section
4. Select the main branch as the source
5. Click Save
6. Your demo will be available at https://yourusername.github.io/todo-management-system/

## Security

- Passwords are hashed using PHP's password_hash() function
- Prepared statements are used for all database queries to prevent SQL injection
- Input validation is performed on both client and server sides
- User-specific todo lists ensure users can only access their own todos

## License

This project is open-source and available for personal and commercial use. 
