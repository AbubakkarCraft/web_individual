import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:bg-[#21262d] dark:text-gray-400 dark:hover:text-amber-400 dark:hover:bg-[#30363d] transition-all relative overflow-hidden group border border-transparent dark:border-[#30363d]"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className={`transition-transform duration-500 flex items-center justify-center ${theme === 'dark' ? 'rotate-[360deg]' : 'rotate-0'}`}>
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </div>

            <div className="absolute inset-0 bg-white/10 dark:bg-black/10 opacity-0 group-active:opacity-100 transition-opacity"></div>
        </button>
    );
};

export default ThemeToggle;
