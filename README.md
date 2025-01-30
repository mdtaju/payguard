# PayGuard

![PayGuard Banner](https://raw.githubusercontent.com/mdtaju/payguard/main/public/banner.png)

*A secure and efficient payment management and verification system.*

## 🚀 Overview
PayGuard is a full-stack payment management system designed for secure transactions, user authentication, document management, and payment tracking. It features a highly secure authentication system, an intuitive admin dashboard, and smooth API integrations for seamless payment operations.

## ✨ Features
- 🔐 **Secure role-based authentication** with Supabase
- 💳 **Payment gateway integration** with Stripe
- 📂 **Document upload and download** using Supabase Storage
- 🛠️ **Admin controls** to update payment and document status
- 🖼️ **Profile picture upload** with cropping functionality
- 🔔 **Notification system** with pagination and read status
- 🔄 **Secure API handling** with JWT and MongoDB
- 📱 **Fully responsive** and cross-browser compatible
- 🛠️ **Type-safe, clean, and readable code** with TypeScript

## 🛠️ Tech Stack
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Ant Design (antd)
- **Backend:** Next.js API routes, Supabase, MongoDB (Mongoose), JWT
- **Payment:** Stripe
- **Storage:** Supabase Storage

## 🌐 Live Demo
🔗 [Live Project]([(https://payguard.vercel.app/)](https://payguard.vercel.app/))  

### 🧑‍💻 Demo Credentials
#### Admin:
- **Email:** `admin@payguard.com`
- **Password:** `admin123`

#### User:
- **Email:** `user@payguard.com`
- **Password:** `user123`

## 🛠️ Installation Guide
### 📌 Prerequisites
Ensure you have the following installed:
- Node.js (LTS version recommended)
- npm or yarn
- MongoDB (local or cloud instance)
- Supabase account
- Stripe account

### 🔧 Setup
1. **Clone the repository**
   ```sh
   git clone [(https://github.com/mdtaju/payguard.git)](https://github.com/mdtaju/payguard.git)
   cd payguard
   ```
2. **Install dependencies**
   ```sh
   npm install  # or yarn install
   ```
3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the required environment variables:
   ```sh
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   DATABASE_URL=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   STRIPE_SECRET_KEY=your-stripe-secret-key
   ```
4. **Run the development server**
   ```sh
   npm run dev  # or yarn dev
   ```
5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

Ensure you set the same environment variables in your deployment settings.

## 📄 License
This project is open-source

## 🤝 Contributing
Contributions are welcome! Please fork the repo, create a new branch, and submit a pull request.

---
Made with ❤️ by [Md. Tajuuddin Tareq](https://www.linkedin.com/in/mdtajuuddintarek/)

