# Expense Management System

## Overview
The Expense Management System is designed to help organizations manage their expenses efficiently. It provides different functionalities for admins, managers, and employees to streamline the expense reporting and approval process.

## Features
- **Admin Role**: Manage users and set approval rules.
- **Manager Role**: Oversee team expenses and approve pending requests.
- **Employee Role**: Submit and track personal expenses.

## Project Structure
```
expense-management-system
├── src
│   ├── roles
│   │   ├── admin
│   │   │   ├── index.js
│   │   │   └── dashboard.js
│   │   ├── manager
│   │   │   ├── index.js
│   │   │   └── approvals.js
│   │   └── employee
│   │       ├── index.js
│   │       └── expenses.js
│   ├── routes
│   │   └── index.js
│   ├── controllers
│   │   └── index.js
│   ├── models
│   │   └── expense.js
│   └── utils
│       └── helpers.js
├── package.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd expense-management-system
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
- Start the application:
  ```
  npm start
  ```
- Access the application in your browser at `http://localhost:3000`.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.