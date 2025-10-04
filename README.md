# 💰 Expense Tracker Application

A full-stack expense tracking application built with React.js and Node.js, featuring user authentication, expense/income management, data visualization, and PostgreSQL database integration.

![Expense Tracker](https://img.shields.io/badge/Status-Active-green)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Cloud-blue)

## 🚀 Features

### 📊 **Dashboard Analytics**
- Real-time financial overview with balance, income, and expenses
- Interactive charts using Recharts library
- Monthly and yearly expense/income trends
- Category-wise expense breakdown
- Recent transactions display

### 💳 **Income Management**
- Add, view, and delete income sources
- Categorize income with custom icons
- Download income data as Excel files
- Income trend visualization

### 💸 **Expense Management**
- Track expenses by categories
- Visual expense analytics
- Delete and manage expense records
- Export expense data to Excel

### 🔐 **User Authentication**
- Secure user registration and login
- JWT-based authentication
- Protected routes and API endpoints
- User profile management

### 📱 **Responsive Design**
- Mobile-first responsive design
- TailwindCSS for modern UI
- Interactive components and animations
- Toast notifications for user feedback

## 🛠️ Technology Stack

### **Frontend**
- **React.js 19.0.0** - Modern UI library
- **Vite** - Fast build tool and dev server
- **TailwindCSS 4.1.3** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Recharts** - Data visualization charts
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **React Icons** - Icon library
- **Moment.js** - Date manipulation

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web framework
- **PostgreSQL** - Relational database (Neon.tech cloud)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Multer** - File upload handling
- **XLSX** - Excel file generation

### **Database**
- **PostgreSQL** hosted on Neon.tech
- Automatic table creation and migration
- User-specific data isolation
- Optimized queries for performance

## 📁 Project Structure

```
expensetracker/
├── backend/                    # Node.js backend
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── incomeController.js
│   │   ├── expenseController.js
│   │   └── dashboardController.js
│   ├── middleware/            # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/               # Database models
│   │   ├── User.js
│   │   ├── Income.js
│   │   └── Expense.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── dashboardRoutes.js
│   ├── uploads/              # File uploads
│   ├── .env                  # Environment variables
│   ├── server.js             # Main server file
│   └── package.json
├── frontend/expense-tracker/   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Cards/
│   │   │   ├── Charts/
│   │   │   ├── Dashboard/
│   │   │   ├── Expense/
│   │   │   ├── Income/
│   │   │   ├── Inputs/
│   │   │   ├── layouts/
│   │   │   └── Modal/
│   │   ├── context/          # React context
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Page components
│   │   │   ├── Auth/
│   │   │   └── Dashboard/
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
├── README.md
└── start-clean.bat           # Quick start script
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhisheksingh4513/Expense-Tracker-Application.git
   cd Expense-Tracker-Application
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   # PostgreSQL Database Configuration (Neon.tech)
   DATABASE_URL=your_postgresql_connection_string
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   
   # Server Configuration
   PORT=8000
   
   # Client Configuration
   CLIENT_URL=http://localhost:5173
   
   # Environment
   NODE_ENV=development
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend/expense-tracker
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:8000
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend/expense-tracker
   npm start
   # Application runs on http://localhost:5173
   ```

3. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/getUser` - Get user profile
- `PUT /api/v1/auth/update-profile` - Update user profile

### Income Endpoints
- `POST /api/v1/income/add` - Add new income
- `GET /api/v1/income/get` - Get user's income records
- `DELETE /api/v1/income/:id` - Delete income record
- `GET /api/v1/income/downloadexcel` - Download income data as Excel

### Expense Endpoints
- `POST /api/v1/expense/add` - Add new expense
- `GET /api/v1/expense/get` - Get user's expense records
- `DELETE /api/v1/expense/:id` - Delete expense record
- `GET /api/v1/expense/downloadexcel` - Download expense data as Excel

### Dashboard Endpoints
- `GET /api/v1/dashboard` - Get dashboard data
- `GET /api/v1/dashboard/analytics` - Get analytics data

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security
- **User Authorization** - Users can only access their own data
- **Input Validation** - Server-side validation for all inputs
- **CORS Configuration** - Proper cross-origin resource sharing setup

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile phones
- Different screen orientations

## 🎨 UI/UX Features

- **Modern Design** - Clean and intuitive interface
- **Dark/Light Mode** - User preference support
- **Interactive Charts** - Hover effects and animations
- **Toast Notifications** - Real-time feedback
- **Loading States** - Better user experience
- **Form Validation** - Client-side and server-side validation

## 🔧 Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Building for Production

1. **Build Frontend**
   ```bash
   cd frontend/expense-tracker
   npm run build
   ```

2. **Serve Backend**
   ```bash
   cd backend
   npm start
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your DATABASE_URL in .env file
   - Check if PostgreSQL service is running
   - Ensure network connectivity to Neon.tech

2. **CORS Issues**
   - Check CLIENT_URL in backend .env
   - Verify frontend is running on correct port

3. **Authentication Problems**
   - Clear browser cookies and localStorage
   - Check JWT_SECRET in .env file
   - Verify token expiration

4. **Build Errors**
   - Delete node_modules and package-lock.json
   - Run `npm install` again
   - Check Node.js version compatibility

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abhishek Singh**
- GitHub: [@abhisheksingh4513](https://github.com/abhisheksingh4513)
- Email: abhisheksingh4513@example.com

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Neon.tech for PostgreSQL cloud hosting
- Recharts for beautiful data visualizations
- All open-source contributors

## 📊 Project Status

- ✅ User Authentication
- ✅ Income Management
- ✅ Expense Management
- ✅ Dashboard Analytics
- ✅ Data Visualization
- ✅ Excel Export
- ✅ Responsive Design
- ✅ PostgreSQL Integration
- ✅ Security Implementation

---

**⭐ Star this repository if you found it helpful!**