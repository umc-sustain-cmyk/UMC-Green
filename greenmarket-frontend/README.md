# GreenMarket Frontend

A React.js frontend application for GreenMarket - an on-campus donation and item-sharing system for students and faculty.

## 🎁 About

GreenMarket is a campus donation board where UMN Crookston students and faculty can donate and share items with the campus community. Reduce waste, help classmates, and build a stronger community through sustainable item sharing.

## 🚀 Features

- **User Authentication** - Secure login/registration for campus community members
- **Donation Board** - Browse and search donated items from students and faculty
- **Personal Dashboard** - Manage your donations and requests
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Clean UI** - Simple, user-friendly interface for easy sharing
- **Real-time Updates** - Dynamic item filtering and search

## 🛠️ Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Modern CSS** - Custom CSS with CSS variables

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   ├── Footer.jsx      # Site footer
│   └── ItemCard.jsx    # Donation item display card
├── pages/              # Main application pages
│   ├── Home.jsx        # Homepage
│   ├── Marketplace.jsx # Donation board / item listings
│   ├── Login.jsx       # User login
│   ├── Register.jsx    # User registration
│   ├── Dashboard.jsx   # User dashboard for donations
│   ├── AddItem.jsx     # Create new donation listing
│   ├── About.jsx       # About the platform
│   └── Contact.jsx     # Contact page
├── context/            # React context providers
│   └── AuthContext.js  # Authentication context
├── App.jsx             # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## 🎨 Design System

### Color Palette
- Primary Green: `#4a7c4a`
- Light Green: `#6eb36e`
- Dark Green: `#2d5a2d`
- Accent Green: `#8bc34a`
- Background: `#f8fdf8`

### Components
- Cards with hover effects
- Consistent button styles
- Form elements with validation
- Responsive grid layouts
- Loading animations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd greenmarket-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 API Integration

The frontend is designed to work with the GreenMarket Node.js backend API. Key endpoints include:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/items` - Fetch donation items
- `POST /api/items` - Create new donation
- `GET /api/user/profile` - Get user profile

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎯 Key Features

### Authentication System
- Secure login/registration
- JWT token management
- Protected routes
- User role management (donor/recipient)
- **Auto-prompt Authentication**: Pop-up appears after 5 seconds with countdown notification

### Item Donation Management
- Donation item listing with images
- Category filtering
- Search functionality
- Condition rating (new, like-new, good, fair, poor)

### User Dashboard
- Personal donation statistics
- Recent activity tracking
- Quick action buttons
- Community impact metrics

### Donation Features
- Post donated items
- Item management
- Browse available donations
- Reserve items

## 🌍 Sustainability Focus

The design emphasizes community and waste reduction through:
- Green color scheme
- Donation-focused messaging
- Community impact tracking
- Campus-based sharing
- Item reuse highlighting

## 🔮 Future Enhancements

- In-app messaging between donors and recipients
- Real-time notifications for reservations
- Advanced analytics dashboard
- Mobile app version
- PWA capabilities

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Lucide React for beautiful icons
- Vite for the excellent build tool
- The sustainable development community for inspiration

---

**Built with 💚 for a sustainable future**