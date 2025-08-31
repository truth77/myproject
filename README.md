# Ark Network Academy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![GitHub Issues](https://img.shields.io/github/issues/raunofreiberg/blackford.svg)](https://github.com/raunofreiberg/blackford/issues)

A modern, full-stack web application for spiritual growth and community building, featuring interactive Bible study tools, prayer networks, and faith-based courses.

## ✨ Features

- **Interactive 3D Service Cards** - Beautiful, responsive cards for easy navigation
- **User Authentication** - Secure login with JWT and OAuth integration
- **Subscription Management** - Premium content access control
- **Responsive Design** - Works seamlessly on all devices
- **Modern UI/UX** - Clean, intuitive interface with smooth animations

## 🚀 Tech Stack

### Frontend
- React 18+ with Hooks
- React Router 6 for navigation
- Context API for state management
- Styled Components & CSS Modules
- Responsive Design with Flexbox/Grid
- Interactive 3D card animations

### Backend
- Node.js & Express
- PostgreSQL with Knex.js
- JWT Authentication
- RESTful API
- File upload handling

### DevOps
- Docker & Docker Compose
- Nginx reverse proxy
- Environment-based configuration
- CI/CD ready

## 🛠️ Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm or yarn
- Docker (optional)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ark-network-academy.git
   cd ark-network-academy
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

4. **Database setup**
   ```bash
   # Create database
   createdb ark_network
   
   # Run migrations
   npx knex migrate:latest
   
   # Seed database (optional)
   npx knex seed:run
   ```

5. **Start development servers**
   ```bash
   # Start backend server
   npm run dev:server
   
   # In a new terminal, start frontend
   cd client
   npm start
   ```

## 🐳 Docker Setup

1. **Set environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Build and start containers**
   ```bash
   docker-compose up --build
   ```

3. **Apply database migrations**
   ```bash
   docker-compose exec server npx knex migrate:latest
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🚀 Production Deployment

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgres://postgres:postgres@db:5432/ark_network

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d

# OAuth (optional)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AWS S3 (for file uploads, optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_bucket_name
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for spiritual growth and community building
- Inspired by the need for accessible faith-based education
- Special thanks to all contributors who help improve this project