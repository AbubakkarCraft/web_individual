import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signup from './Pages/Signup';
import Signin from './Pages/Signin';
import ForgotPassword from './Pages/ForgotPassword';
import Dashboard from './Pages/Dashboard';
import BookDetails from './Pages/BookDetails';
import Reader from './Pages/Reader';
import Wishlist from './Pages/Wishlist';
import Profile from './Pages/Profile';
import { User as UserIcon, Heart, Book as BookIcon } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const username = localStorage.getItem('username');
  const location = useLocation();
  const isReaderPage = location.pathname.startsWith('/read/');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.reload();
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1115] text-black dark:text-white transition-colors duration-300">
        <Toaster position="top-right" reverseOrder={false} />

        {!isReaderPage && (
          <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 animate-fade-in">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
              <Link to={username ? "/dashboard" : "/"} className="text-2xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <BookIcon size={24} />
                BookHive
              </Link>
              <div className="space-x-4 flex items-center">
                <ThemeToggle />
                {username ? (
                  <>
                    <Link to="/wishlist" className="text-gray-600 hover:text-rose-600 font-medium transition flex items-center gap-1.5">
                      <Heart size={18} />
                      Wishlist
                    </Link>
                    <Link to="/profile" className="text-gray-600 hover:text-indigo-600 font-medium transition flex items-center gap-1.5">
                      <UserIcon size={18} />
                      Profile
                    </Link>
                    <span className="font-medium text-gray-700">Hi, {username}!</span>
                    <button onClick={handleLogout} className="text-gray-600 hover:text-black font-medium transition">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/signin" className="text-gray-600 hover:text-black font-medium transition">Sign In</Link>
                    <Link to="/signup" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}

        <main>
          <Routes>
            <Route path="/" element={
              <div className="text-center py-20 px-4">
                <h1 className="text-5xl font-extrabold text-indigo-900 mb-6">Welcome to BookHive</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                  Discover your next favorite book, build your wishlist, and keep your thoughts organized with personal notes.
                </p>
                {!username && (
                  <Link to="/signup" className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 shadow-xl transition-all hover:scale-105">
                    Join BookHive Now
                  </Link>
                )}
              </div>
            } />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/read/:id" element={<Reader />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
