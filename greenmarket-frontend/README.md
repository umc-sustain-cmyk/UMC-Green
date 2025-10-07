# GreenMarket Frontend

A React.js frontend application for the GreenMarket sustainable community marketplace.

## 🌱 About

GreenMarket is a sustainable community marketplace that connects eco-conscious consumers with local farmers, artisans, and businesses committed to environmental responsibility.

## 🚀 Features

- **User Authentication** - Secure login/registration system
- **Product Marketplace** - Browse and search sustainable products
- **Seller Dashboard** - Manage products and track sales
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Clean, green-themed interface with smooth animations
- **Real-time Updates** - Dynamic product filtering and search

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
│   └── ItemCard.jsx    # Product display card
├── pages/              # Main application pages
│   ├── Home.jsx        # Homepage
│   ├── Marketplace.jsx # Product marketplace
│   ├── Login.jsx       # User login
│   ├── Register.jsx    # User registration
│   ├── Dashboard.jsx   # User/seller dashboard
│   ├── AddItem.jsx     # Add new product
│   ├── About.jsx       # About us page
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
- `GET /api/items` - Fetch products
- `POST /api/items` - Create new product
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
- User role management (buyer/seller)

### Product Management
- Product listing with images
- Category filtering
- Price range filtering
- Search functionality
- Organic product badges

### User Dashboard
- Personal statistics
- Recent activity tracking
- Quick action buttons
- Environmental impact metrics

### Seller Features
- Add new products
- Inventory management
- Sales tracking
- Earnings overview

## 🌍 Environmental Focus

The design emphasizes sustainability through:
- Green color scheme
- Eco-friendly messaging
- Carbon footprint tracking
- Local business promotion
- Organic product highlighting

## 🔮 Future Enhancements

- Shopping cart functionality
- Payment integration
- Real-time messaging
- Advanced analytics
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