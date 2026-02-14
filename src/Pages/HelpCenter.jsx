import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Bg from './Background'; 
import { 
  Home, ExternalLink,
  History, Bot,
  LogIn, CirclePlus, LayoutDashboard, PanelRight,
} from "lucide-react";
// 1. Standard Dark Pill
const DepthPill = ({ children, className = "", onClick, href }) => {
  const Component = href ? motion.a : motion.div;
  const props = href ? { href, target: "_blank", rel: "noopener noreferrer" } : { onClick };

  return (
    <Component
      {...props}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative flex items-center justify-center
        bg-[#27272a]/90 backdrop-blur-md
        border-t border-white/10 
        border-b border-black 
        shadow-lg shadow-black/50
        rounded-full px-4 md:px-6 py-3
        text-zinc-400 hover:text-white transition-colors duration-300
        cursor-pointer select-none whitespace-nowrap
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

// 2. Electric Lime Pill
const ActionPill = ({ children, className = "", onClick, href }) => {
  const Component = href ? motion.a : motion.div;
  const props = href ? { href, target: "_blank", rel: "noopener noreferrer" } : { onClick };

  return (
    <Component
      {...props}
      whileHover={{ scale: 1.05, y: -2, boxShadow: "0px 10px 20px rgba(190, 242, 100, 0.2)" }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative flex items-center justify-center
        bg-[#bef264] 
        text-zinc-900 font-bold tracking-wide
        border-t border-white/40 
        border-b border-lime-900/40
        shadow-[0_4px_15px_rgba(0,0,0,0.3)]
        rounded-full px-5 md:px-6 py-3
        cursor-pointer select-none whitespace-nowrap
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

const VideoCard = ({ vimeoId, title, index }) => {
  return (
    <motion.div
      id={`video-${vimeoId}`}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring", bounce: 0.3 }}
      className="w-full max-w-4xl mx-auto mb-12 md:mb-16 px-2 md:px-0"
    >
      <div className="
        group relative overflow-hidden rounded-[2.5rem]
        bg-[#27272a]
        border-t border-white/10 border-b border-black
        shadow-2xl shadow-black/80
        p-3 md:p-4
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-shadow duration-500
      ">
        <div className="
          relative w-full aspect-video 
          rounded-[2rem] overflow-hidden 
          bg-black/50 
          shadow-inner border border-black/20
        ">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
          ></iframe>
        </div>

        <div className="px-4 pt-5 pb-3 flex items-center justify-between">
          <h3 className="text-white font-medium text-lg md:text-2xl tracking-wide font-sans truncate pr-4">
            {title}
          </h3>
          <div className="hidden md:block w-12 h-1 bg-zinc-700 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
};

const IconPill = ({ children, onClick, label, className = "" }) => {
  const newLabel = label.split('|')[1].trim();
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative group
        flex items-center justify-center
        w-12 h-12 md:w-16 md:h-16
        bg-[#27272a]/90 backdrop-blur-md mt-10 md:mt-0
        border-t border-white/10
        border-b border-black
        shadow-lg shadow-black/50
        rounded-full
        text-zinc-400 hover:text-white
        transition-all duration-300
        cursor-pointer select-none
        ${className}
      `}
    >
      {children}

      {/* Tooltip */}
      <span
        className="
          absolute -bottom-9
          px-3 py-1.5
          text-xs md:text-sm
          bg-[#18181b]
          border border-white/10
          text-white
          rounded-full
          opacity-0 translate-y-2
          group-hover:opacity-100
          group-hover:translate-y-0
          transition-all duration-300
          whitespace-nowrap
          pointer-events-none
          shadow-md shadow-black/40
        "
      >
        {newLabel}
      </span>
    </motion.div>
  );
};


export default function VideoFeed() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);
  
  const scrollToVideo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

  const videos = [
    { id: "1162830684", title: "Welcome to Happy Dyno | Login", icon: LogIn },
    { id: "1162830764", title: "Let's create a new project!! | New project", icon: CirclePlus },
    { id: "1162924210", title: "Time travel using timeline | Timeline", icon: History },
    { id: "1164906487", title: "Project Control Made Easy | Project management page", icon: LayoutDashboard },
    { id: "1164906394", title: "Your Space for Notes, Hyperlinks & Images | Right panel", icon: PanelRight },
    { id: "1164917351", title: "FlyTo Your Answers with Dyno | Chatbot", icon: Bot },
  ];

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans text-zinc-400 bg-[#18181b]">
      
      <div className="fixed inset-0 z-0">
         <Bg />
      </div>

      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:py-6"
      >
        {/* LAYOUT CHANGE: Flex Wrap 
            - Mobile: justify-between puts Logo left, Button right.
            - Search: Forced to next line via 'order-3' and 'w-full'.
        */}
        <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-4 md:gap-5">
          
          {/* 1. Left: Home + Logo (Order 1) */}
          <DepthPill href="https://app.happydyno.com" className="order-1 w-auto hover:bg-[#3f3f46]">
            <Home size={22} className="mr-2 md:mr-3 text-zinc-500 group-hover:text-white transition-colors mt-1" />
            <span className="text-sm md:text-xl text-white pt-1 tracking-widest" style={{ fontFamily: '"Potta One", cursive' }}>
              Happy Dyno
            </span>
          </DepthPill>

          {/* 2. Middle: Search Bar (Order 3 on Mobile = New Row) */}
          <div className="order-3 md:order-2 w-full md:max-w-xl group z-50">
            <motion.input 
              whileFocus={{ scale: 1.01 }}
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-12 pr-6 py-3.5
                bg-[#27272a]/90 backdrop-blur-md
                rounded-full
                text-white placeholder-zinc-500 text-base md:text-lg
                border-t border-white/10 border-b border-black
                focus:outline-none focus:bg-[#3f3f46] focus:border-white/20
                shadow-lg shadow-black/30 transition-all duration-300
              "
            />
          </div>

          {/* 3. Right: Open App (Order 2 on Mobile = Top Row Right) */}
          <ActionPill href="https://app.happydyno.com" className="order-2 md:order-3 w-auto group">
            <span className="mr-2 text-xs md:text-base">OPEN APP</span>
            <ExternalLink size={16} className="text-zinc-900" />
          </ActionPill>

        </div>
      </motion.header>

      {/* ADJUSTED PADDING: 
          - Mobile Header is now shorter (2 rows), so changed pt to 'pt-48' (12rem)
          - Desktop stays around 'pt-40'
      */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-20 mt-32 flex flex-wrap justify-center gap-5 px-4"
      >
        {videos.map((video, i) => {
          const Icon = video.icon;

          return (
            <IconPill
              key={video.id}
              label={video.title}
              onClick={() => scrollToVideo(`video-${video.id}`)}
            >
              <Icon size={26} /> {/* 👈 bigger icon now */}
            </IconPill>
          );
        })}
      </motion.div>

      <main className="relative z-10 pt-10 md:pt-10 pb-20 px-4 flex flex-col items-center min-h-screen">
        
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => (
            <VideoCard 
              key={video.id} 
              index={index} 
              vimeoId={video.id} 
              title={video.title} 
            />
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center mt-10 text-xl font-light text-zinc-600"
          >
            No videos found.
          </motion.div>
        )}
        
      </main>
    </div>
  );
}