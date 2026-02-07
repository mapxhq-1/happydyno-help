import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { 
  Search, Play, X, ExternalLink, Sparkles, Grid, 
  ChevronRight, LayoutGrid, Zap,
  // Fallback icons 
  Type, MousePointer2, Film, Bot, Mic, Layers,
} from 'lucide-react';

// --- IMAGE IMPORTS ---
import pencilImg from '../assets/pencil.png';
import highlighterImg from '../assets/highlighter.png';
import shapesImg from '../assets/shapes.png';
import noteImg from '../assets/notes.png';
import hyperlinkImg from '../assets/hyperlink.png';
import imagesImg from '../assets/image.png';
import logoImg from '../assets/logo.png'; 

// --- CONFIGURATION ---
const SECTIONS = [
  {
    id: 'tools',
    label: 'Tools',
    description: 'Core drawing instruments',
    icon: pencilImg, 
    features: [
      { id: 'pencil', label: 'Pencil', icon: pencilImg },
      { id: 'highlighter', label: 'Highlighter', icon: highlighterImg },
      { id: 'shapes', label: 'Shapes', icon: shapesImg },
      { id: 'text', label: 'Text', icon: Type }, 
    ]
  },
  {
    id: 'creation',
    label: 'Creation',
    description: 'Rich media and notes',
    icon: noteImg,
    features: [
      { id: 'note', label: 'Notes', icon: noteImg },
      { id: 'hyperlink', label: 'Hyperlink', icon: hyperlinkImg },
      { id: 'images', label: 'Images', icon: imagesImg },
    ]
  },
  {
    id: 'layers',
    label: 'Layers',
    description: 'Depth and motion',
    icon: Layers,
    features: [
      { id: 'selection', label: 'Selection', icon: MousePointer2 },
      { id: 'animations', label: 'Animations', icon: Film }, 
    ]
  },
  {
    id: 'chatbot',
    label: 'AI Chat',
    description: 'AI Assistance',
    icon: Bot,
    features: [
      { id: 'ask', label: 'Ask Dyno', icon: Sparkles },
      { id: 'voice', label: 'Voice Note', icon: Mic },
    ]
  },{
    id: 'all',
    label: 'All Features',
    icon: Grid,
    features: [] 
  }
];

const ALL_FEATURES = SECTIONS
  .filter(s => s.id !== 'all')
  .flatMap(s => s.features);

const HELP_VIDEOS = [
  { id: 1, title: "Mastering the Pencil", featureId: "pencil", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop", caption: "Adjust stroke width and pressure sensitivity.", duration: "2:30" },
  { id: 2, title: "Highlighter Techniques", featureId: "highlighter", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1503602642458-232111445857?q=80&w=1000&auto=format&fit=crop", caption: "Layering colors for emphasis.", duration: "1:15" },
  { id: 3, title: "Drawing Perfect Shapes", featureId: "shapes", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop", caption: "Creating perfect circles and polygons.", duration: "3:45" },
  { id: 4, title: "Typography Mastery", featureId: "text", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=1000&auto=format&fit=crop", caption: "Font settings.", duration: "2:00" },
  { id: 5, title: "Using Sticky Notes", featureId: "note", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1531346878377-a51349593da4?q=80&w=1000&auto=format&fit=crop", caption: "Organize ideas with colored notes.", duration: "1:50" },
  { id: 6, title: "Inserting Hyperlinks", featureId: "hyperlink", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1555421689-d6847122aa74?q=80&w=1000&auto=format&fit=crop", caption: "Linking to external resources.", duration: "1:10" },
  { id: 7, title: "Working with Images", featureId: "images", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop", caption: "Upload, crop, mask and resize images.", duration: "3:20" },
  { id: 8, title: "Smart Selection", featureId: "selection", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", caption: "Grouping strategies.", duration: "4:00" },
  { id: 9, title: "Motion & Animation", featureId: "animations", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop", caption: "Add life with fade and slide effects.", duration: "2:45" },
  { id: 10, title: "Ask Dyno AI", featureId: "ask", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop", caption: "Generating ideas with Dyno AI.", duration: "2:10" },
];

// --- COMPONENTS ---

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl overflow-hidden bg-[#18181b] border border-zinc-700 rounded-3xl shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#18181b]">
          <h3 className="text-lg font-bold text-white tracking-wide">{video.title}</h3>
          <button onClick={onClose} className="p-2 transition-colors rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="relative pt-[56.25%] bg-black">
          <iframe
            src={`https://player.vimeo.com/video/${video.vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={video.title}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default function HelpCenter() {
  // --- DEFAULT SET TO 'tools' ---
  const [activeSection, setActiveSection] = useState('tools'); 
  const [activeFeature, setActiveFeature] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // --- MOUSE TRACKING FOR HEADER ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // --- INTERACTION LOGIC ---
  const handleSectionChange = (sectionId) => {
    setSearchQuery(''); 
    setActiveSection(sectionId);
    setActiveFeature(null); 
  };

  const handleFeatureChange = (featureId) => {
    setSearchQuery('');
    setActiveFeature(featureId === activeFeature ? null : featureId);
  }

  const currentFeatures = activeSection === 'all' 
    ? ALL_FEATURES 
    : SECTIONS.find(s => s.id === activeSection)?.features || [];

  const filteredVideos = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      return HELP_VIDEOS.filter((video) => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.caption.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return HELP_VIDEOS.filter((video) => {
      let matchesContext = true;
      if (activeFeature) {
        matchesContext = video.featureId === activeFeature;
      } else if (activeSection !== 'all') {
        const sectionFeatures = SECTIONS.find(s => s.id === activeSection)?.features.map(f => f.id);
        matchesContext = sectionFeatures?.includes(video.featureId);
      }
      return matchesContext;
    });
  }, [searchQuery, activeFeature, activeSection]);

  const heroVideo = filteredVideos.length > 0 ? filteredVideos[0] : null;
  const gridVideos = filteredVideos.length > 0 ? filteredVideos.slice(1) : [];
  
  const getDisplayLabel = () => {
    if (searchQuery.trim().length > 0) return `Results for "${searchQuery}"`;
    if (activeFeature) return currentFeatures.find(f => f.id === activeFeature)?.label;
    if (activeSection !== 'all') return SECTIONS.find(s => s.id === activeSection)?.label;
    return 'All Guides';
  };

  const renderIcon = (IconSource, className) => {
    if (typeof IconSource === 'string') {
      return <img src={IconSource} alt="icon" className={`${className} object-contain`} />;
    }
    const IconComponent = IconSource;
    return <IconComponent className={className} />;
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 pb-20">
      
      {/* --- FLOATING HEADER --- */}
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <div 
          onMouseMove={handleMouseMove}
          className="relative w-full max-w-7xl bg-[#18181b]/90 backdrop-blur-xl border border-white/5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] px-6 py-3 flex items-center justify-between overflow-hidden group"
        >
          {/* SPOTLIGHT */}
          <motion.div
            className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  400px circle at ${mouseX}px ${mouseY}px,
                  rgba(16, 185, 129, 0.1),
                  transparent 80%
                )
              `,
            }}
          />

          {/* BRAND */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative hover:scale-105 transition-transform duration-300">
               <img src={logoImg} alt="Logo" className="relative w-10 h-10 object-contain drop-shadow-lg" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase leading-none mb-0.5">Help Center</span>
              <h1 style={{ fontFamily: "'Potta One', system-ui" }} className="text-xl text-white tracking-wide uppercase leading-none">
                Happy<span className="text-emerald-500">Dyno</span>
              </h1>
            </div>
          </div>
          
          {/* BUTTON */}
          <a 
            href="https://app.happydyno.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative z-10 group flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.5)] active:scale-95 border-t border-white/20"
          >
            <span>OPEN APP</span>
            <ExternalLink size={14} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </nav>

      {/* --- MAIN LAYOUT: SPLIT VIEW --- */}
      <div className="relative max-w-7xl mx-auto pt-28 px-4 flex flex-col lg:flex-row gap-8">
        
        {/* === LEFT SIDEBAR: CONTROLS === */}
        {/* Extended Height: h-fit but min-height to look substantial */}
        <aside className="w-full lg:w-80 lg:sticky lg:top-28 flex flex-col gap-5 h-fit">
          
          {/* CONTROL PANEL CARD WITH DEPTH */}
          <div className="bg-[#18181b] border border-white/5 rounded-[2rem] p-5 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
            
            {/* Top Shine */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* SEARCH (PILL + INSET DEPTH) */}
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3.5 pl-12 pr-4 text-sm text-white transition-all 
                           bg-[#0c0c0e] border border-white/5 rounded-full 
                           focus:outline-none focus:bg-black focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/30
                           placeholder:text-zinc-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
              />
            </div>
            
            {/* VERTICAL TABS */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest opacity-70">
                <LayoutGrid size={10} /> Categories
              </div>

              {SECTIONS.map((section) => {
                const isActive = activeSection === section.id && searchQuery === '';
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`
                      relative flex items-center justify-between w-full px-4 py-3.5 rounded-full text-sm font-medium transition-all duration-300
                      ${isActive 
                        ? 'bg-zinc-800 text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-t border-white/10' 
                        : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300 border border-transparent'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                         w-8 h-8 rounded-full flex items-center justify-center border transition-all
                         ${isActive ? 'bg-zinc-700 border-emerald-500/30 shadow-inner' : 'bg-black/20 border-white/5'}
                      `}>
                         {renderIcon(section.icon, "w-4 h-4 opacity-90")}
                      </div>
                      <span className="tracking-wide">{section.label}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />}
                  </button>
                );
              })}
            </div>

            {/* SEPARATOR */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            {/* SUB FEATURES GRID */}
            <div>
              <div className="flex items-center gap-2 px-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3 opacity-70">
                 <Grid size={10} /> {SECTIONS.find(s => s.id === activeSection)?.label || 'Features'}
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                <AnimatePresence mode='popLayout'>
                  {currentFeatures.map((feature) => {
                    const isSelected = activeFeature === feature.id && searchQuery === '';
                    return (
                      <motion.button
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={feature.id}
                        onClick={() => handleFeatureChange(feature.id)}
                        className="group relative flex flex-col items-center gap-1"
                        title={feature.label}
                      >
                        {/* ICON CIRCLE WITH DEPTH */}
                        <div className={`
                          relative flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300
                          ${isSelected 
                            ? 'bg-zinc-800 border-emerald-500/40 shadow-[0_4px_10px_rgba(0,0,0,0.5)] scale-105' 
                            : 'bg-[#121214] border-white/5 hover:bg-zinc-800 hover:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'}
                        `}>
                           {renderIcon(feature.icon, `w-5 h-5 transition-all duration-300 ${isSelected ? 'opacity-100 scale-110' : 'opacity-40 group-hover:opacity-100 grayscale group-hover:grayscale-0'}`)}
                        </div>
                        {isSelected && (
                           <div className="absolute -bottom-1 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981]" />
                        )}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Decorations for Depth */}
             <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </aside>

        {/* === RIGHT MAIN CONTENT: VIDEOS === */}
        <section className="flex-1 min-w-0 pb-20">
           {/* Breadcrumb / Label */}
           <div className="flex items-center gap-2 mb-6 ml-2">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                {searchQuery ? 'Searching:' : 'Viewing:'}
              </span>
              <span className="text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-[#18181b] rounded-full border border-white/10 flex items-center gap-1 shadow-lg">
                {getDisplayLabel()}
                <ChevronRight size={10} className="text-zinc-600" />
                <span className="text-emerald-400">{filteredVideos.length} Guides</span>
              </span>
           </div>

           <AnimatePresence mode='wait'>
             {filteredVideos.length > 0 ? (
                <motion.div 
                  layout
                  key={activeSection + activeFeature + searchQuery}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  
                  {/* --- HERO VIDEO HIGHLIGHT (Depth Style) --- */}
                  {heroVideo && (
                    <motion.div 
                      layoutId={`video-${heroVideo.id}`}
                      onClick={() => setSelectedVideo(heroVideo)}
                      className="group relative w-full h-[350px] lg:h-[420px] bg-[#18181b] rounded-[2rem] overflow-hidden cursor-pointer border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-500"
                    >
                      <img 
                        src={heroVideo.thumbnail} 
                        alt={heroVideo.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                      
                      <div className="absolute bottom-0 left-0 p-8 w-full max-w-3xl">
                        <div className="flex items-center gap-3 mb-3">
                           <span className="bg-emerald-500 text-black text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-lg">
                            <Sparkles size={10} fill="black" /> Featured
                          </span>
                          <span className="text-zinc-300 text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur border border-white/10 px-2 py-1 rounded-full">
                            {heroVideo.duration}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight group-hover:text-emerald-300 transition-colors">
                          {heroVideo.title}
                        </h2>
                        <p className="text-zinc-300 text-sm md:text-base line-clamp-2 mb-6 max-w-xl font-medium">
                          {heroVideo.caption}
                        </p>
                        
                        <div className="inline-flex items-center gap-3 text-white font-bold group-hover:translate-x-2 transition-transform bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 group-hover:bg-white group-hover:text-black text-xs md:text-sm">
                           <Play size={16} className="fill-current" />
                           <span>Watch Guide</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* --- REMAINING GRID (Depth Style) --- */}
                  {gridVideos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gridVideos.map((video) => (
                        <motion.div
                          layout
                          key={video.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ y: -4 }}
                          onClick={() => setSelectedVideo(video)}
                          className="cursor-pointer group relative bg-[#18181b] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all shadow-lg flex flex-col md:flex-row h-auto md:h-32"
                        >
                          <div className="relative w-full md:w-40 aspect-video md:aspect-auto overflow-hidden border-b md:border-b-0 md:border-r border-black/50">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title} 
                              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
                               <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
                                  <Play size={12} className="fill-white text-white ml-0.5" />
                               </div>
                            </div>
                          </div>
                          
                          <div className="p-4 flex flex-col justify-center">
                            <h4 className="text-zinc-100 font-bold mb-1 group-hover:text-white line-clamp-1 text-sm">
                              {video.title}
                            </h4>
                            <p className="text-zinc-500 text-xs font-medium leading-relaxed line-clamp-2">
                              {video.caption}
                            </p>
                            <div className="mt-2 hidden md:flex items-center gap-2">
                              <span className="text-[10px] text-zinc-600 border border-zinc-800 px-1.5 rounded bg-black/20">{video.duration}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
             ) : (
                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900/50 mb-3 border border-zinc-800">
                    <Search className="w-5 h-5 text-zinc-600" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">No guides found</h3>
                  <p className="text-zinc-500 text-xs">Try adjusting your search terms.</p>
                </div>
             )}
           </AnimatePresence>
        </section>

      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}