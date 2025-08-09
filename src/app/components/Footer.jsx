export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-8 mt-12 shadow-2xl border-t border-purple-500/20 backdrop-blur-lg">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left side - Branding */}
          <div className="flex items-center gap-3">
            
            <div>
              <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
                BlogSpace
              </div>
              <div className="text-xs text-purple-300">
                Share your thoughts with the world
              </div>
            </div>
          </div>

          {/* Center - Copyright */}
          <div className="text-center">
            <div className="text-sm text-purple-200">
              &copy; {new Date().getFullYear()} BlogSpace. All rights reserved.
            </div>
            <div className="text-xs text-purple-300 mt-1">
              Made with ❤️ for passionate writers
            </div>
          </div>

          {/* Right side - Social/Links */}
          <div className="flex items-center gap-4">
            <div className="text-xs text-purple-300">Connect with us</div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                <span className="text-xs">✨</span>
              </div>
              <div className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                <span className="text-xs">📝</span>
              </div>
              <div className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer">
                <span className="text-xs">💭</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
