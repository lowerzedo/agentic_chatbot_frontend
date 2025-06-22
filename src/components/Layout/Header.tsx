import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Settings, Upload } from "lucide-react";

const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Chat", icon: MessageCircle },
    { path: "/upload", label: "Upload", icon: Upload },
    { path: "/admin", label: "Admin", icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                University Chatbot
              </h1>
            </div>
          </div>

          <nav className="flex space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === path
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
