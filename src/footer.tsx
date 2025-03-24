import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <span>Made with</span>
          <Heart className="h-4 w-4 fill-red-500 text-red-500 animate-pulse" />
          <span>by</span>
          <a
            href="https://www.yogimasaji.live/"
            className="relative font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500 transition-all duration-300 hover:from-indigo-500 hover:to-rose-500"
          >
            Yogi Masaji
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
