import { Shield, Settings, Bot } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <Bot className="text-white" size={16} />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">AI Twin</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="text-green-500" size={16} />
            <span>Private & Secure</span>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
