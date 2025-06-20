
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="font-bold text-xl">Gurukul</span>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering India with AI-powered personal guruji assistance for mental health, nutrition, career guidance, and more.
            </p>
            <p className="text-gray-500 text-xs italic">
              AI for India 🇮🇳
            </p>
          </div>

          {/* AI Gurujis */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">AI Gurujis</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/therapist" className="hover:text-primary transition-colors">Mental Health Guru</Link></li>
              <li><Link to="/dietician" className="hover:text-primary transition-colors">Nutrition Guru</Link></li>
              <li><Link to="/career" className="hover:text-primary transition-colors">Career Guru</Link></li>
              <li><Link to="/priya" className="hover:text-primary transition-colors">Priya Didi</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/guru-dakshina" className="hover:text-primary transition-colors">Guru Dakshina</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/support" className="hover:text-primary transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">hello@gurukul.ai</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+91 12345 67890</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Bengaluru, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>for India</span>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © 2024 Gurukul AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
