import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { 
  Search, Play, X, ExternalLink, Sparkles, Grid,
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
    label: 'All',
    icon: Grid,
    features: [] 
  }
];

const ALL_FEATURES = SECTIONS
  .filter(s => s.id !== 'all')
  .flatMap(s => s.features);

const HELP_VIDEOS = [
  { id: 1, title: "Mastering the Pencil", featureId: "pencil", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop", caption: "Adjust stroke width and pressure sensitivity for professional sketches.", duration: "2:30" },
  { id: 2, title: "Highlighter Techniques", featureId: "highlighter", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1503602642458-232111445857?q=80&w=1000&auto=format&fit=crop", caption: "Layering colors for emphasis and shading.", duration: "1:15" },
  { id: 3, title: "Drawing Perfect Shapes", featureId: "shapes", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop", caption: "Creating perfect circles, polygons and snapping grids.", duration: "3:45" },
  { id: 4, title: "Typography Mastery", featureId: "text", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=1000&auto=format&fit=crop", caption: "Font selection, spacing and typography settings.", duration: "2:00" },
  { id: 5, title: "Using Sticky Notes", featureId: "note", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1531346878377-a51349593da4?q=80&w=1000&auto=format&fit=crop", caption: "Organize ideas with colored notes and tags.", duration: "1:50" },
  { id: 6, title: "Inserting Hyperlinks", featureId: "hyperlink", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1555421689-d6847122aa74?q=80&w=1000&auto=format&fit=crop", caption: "Linking to external resources and internal pages.", duration: "1:10" },
  { id: 7, title: "Working with Images", featureId: "images", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop", caption: "Upload, crop, mask and resize images easily.", duration: "3:20" },
  { id: 8, title: "Smart Selection", featureId: "selection", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", caption: "Grouping and multi-select strategies for complex art.", duration: "4:00" },
  { id: 9, title: "Motion & Animation", featureId: "animations", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop", caption: "Add life with fade, slide, and bounce effects.", duration: "2:45" },
  { id: 10, title: "Ask Dyno AI", featureId: "ask", vimeoId: "76979871", thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop", caption: "Generating ideas and fixing text with Dyno AI.", duration: "2:10" },
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
  const [activeSection, setActiveSection] = useState('all'); 
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
      
      {/* --- FLOATING HEADER WITH GREEN SPOTLIGHT --- */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div 
          onMouseMove={handleMouseMove}
          className="relative w-full max-w-5xl bg-[#18181b] border border-white/5 rounded-full shadow-2xl px-8 py-3 flex items-center justify-between overflow-hidden group"
        >
          
          {/* MOVING SPOTLIGHT EFFECT */}
          <motion.div
            className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  400px circle at ${mouseX}px ${mouseY}px,
                  rgba(16, 185, 129, 0.15),
                  transparent 80%
                )
              `,
            }}
          />

          {/* BRANDING SECTION */}
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative hover:scale-105 transition-transform duration-300">
               <img src={logoImg} alt="Logo" className="relative w-12 h-12 object-contain drop-shadow-lg" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase leading-none mb-1">
                Help Center
              </span>
              <h1 style={{ fontFamily: "'Potta One', system-ui" }} className="text-2xl text-white tracking-wide uppercase leading-none mt-0.5">
                Happy<span className="text-emerald-500">Dyno</span>
              </h1>
            </div>
          </div>
          
          {/* ACTION BUTTON */}
          <a 
            href="https://app.happydyno.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative z-10 group flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-extrabold rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.5)] active:scale-95 border-t border-white/20"
          >
            <span>OPEN APP</span>
            <ExternalLink size={16} strokeWidth={3} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </nav>

      <main className="relative max-w-7xl px-6 mx-auto pt-40">
        
        {/* --- SEARCH (PILL SHAPE + DEPTH EFFECT) --- */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-2xl group z-20">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-4 pl-14 pr-6 text-base text-white transition-all 
                         bg-[#18181b] border border-white/5 rounded-full 
                         focus:outline-none focus:bg-[#18181b] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50
                         placeholder:text-zinc-600 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border-t-white/10 border-b-black/50"
            />
          </div>
        </div>

        {/* --- LEVEL 1: MAIN SECTIONS (DEPTH DESIGN) --- */}
        <div className="relative z-10">
          <div className="flex justify-center mb-10">
            {/* Tabs Container with Depth */}
            <div className="flex p-1.5 space-x-1 bg-[#18181b] rounded-full border border-white/5 shadow-2xl overflow-x-auto max-w-full">
              {SECTIONS.map((section) => {
                const isActive = activeSection === section.id && searchQuery === '';
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`
                      relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                      ${isActive ? 'text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-section-tab"
                        className="absolute inset-0 bg-zinc-800 rounded-full border-t border-white/10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {renderIcon(section.icon, "w-4 h-4")}
                      {section.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- LEVEL 2: SUB SELECTION (ROUNDED ICONS + DEPTH) --- */}
          <div className="relative min-h-[80px] mb-12">
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-wrap justify-center gap-4"
              >
                {currentFeatures.map((feature) => {
                  const isSelected = activeFeature === feature.id && searchQuery === '';
                  return (
                    <button
                      key={feature.id}
                      onClick={() => handleFeatureChange(feature.id)}
                      className="group relative flex flex-col items-center gap-3"
                    >
                      {/* ROUNDED CIRCLE with Depth Style */}
                      <div className={`
                        relative flex items-center justify-center w-16 h-16 rounded-full border transition-all duration-300
                        ${isSelected 
                          ? 'bg-zinc-800 border-white/20 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] scale-110' 
                          : 'bg-[#18181b] border-white/5 hover:bg-zinc-800 hover:border-white/10 shadow-lg'}
                      `}>
                         {isSelected && (
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                         )}
                         {renderIcon(feature.icon, `w-6 h-6 transition-all duration-300 ${isSelected ? 'opacity-100 scale-110 drop-shadow-md' : 'opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0'}`)}
                      </div>
                      
                      <span className={`text-xs font-medium transition-colors ${isSelected ? 'text-white' : 'text-zinc-600'}`}>
                        {feature.label}
                      </span>
                      
                      {isSelected && (
                        <motion.div 
                          layoutId="active-dot"
                          className="absolute -bottom-2 w-1 h-1 bg-white rounded-full box-content border-2 border-[#18181b]"
                        />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* --- CONTENT AREA: VIDEOS --- */}
        <div className="border-t border-white/5 pt-10">
           <div className="flex items-center gap-2 mb-8">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                {searchQuery ? 'Searching:' : 'Watching:'}
              </span>
              <span className="text-white text-xs font-bold uppercase tracking-widest px-3 py-1 bg-zinc-800/80 rounded-full border border-white/10 flex items-center gap-1 shadow-lg">
                {getDisplayLabel()}
              </span>
           </div>

           <AnimatePresence mode='wait'>
             {filteredVideos.length > 0 ? (
                <motion.div 
                  layout
                  key={activeSection + activeFeature + searchQuery}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  
                  {/* --- HERO VIDEO HIGHLIGHT (Depth Style) --- */}
                  {heroVideo && (
                    <motion.div 
                      layoutId={`video-${heroVideo.id}`}
                      onClick={() => setSelectedVideo(heroVideo)}
                      className="group relative w-full h-[350px] md:h-[500px] bg-[#18181b] rounded-3xl overflow-hidden cursor-pointer border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-500"
                    >
                      <img 
                        src={heroVideo.thumbnail} 
                        alt={heroVideo.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                      
                      <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                           <span className="bg-emerald-500 text-black text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-lg">
                            <Sparkles size={10} fill="black" /> Featured
                          </span>
                          <span className="text-zinc-300 text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur border border-white/10 px-2 py-1 rounded-full">
                            {heroVideo.duration}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-5xl font-black text-white mb-4 leading-tight group-hover:text-emerald-300 transition-colors">
                          {heroVideo.title}
                        </h2>
                        <p className="text-zinc-300 text-sm md:text-lg line-clamp-2 mb-8 max-w-xl font-medium">
                          {heroVideo.caption}
                        </p>
                        
                        <div className="inline-flex items-center gap-3 text-white font-bold group-hover:translate-x-2 transition-transform bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 group-hover:bg-white group-hover:text-black">
                           <Play size={18} className="fill-current" />
                           <span>Watch Guide</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* --- REMAINING GRID (Depth Style) --- */}
                  {gridVideos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {gridVideos.map((video) => (
                        <motion.div
                          layout
                          key={video.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ y: -8 }}
                          onClick={() => setSelectedVideo(video)}
                          className="cursor-pointer group relative bg-[#18181b] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all shadow-xl"
                        >
                          <div className="relative aspect-video overflow-hidden border-b border-black">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title} 
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                            />
                            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 z-10">
                              {video.duration}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
                               <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
                                  <Play size={20} className="fill-white text-white ml-1" />
                               </div>
                            </div>
                          </div>
                          
                          <div className="p-5">
                            <h4 className="text-zinc-100 font-bold mb-2 group-hover:text-white line-clamp-1">
                              {video.title}
                            </h4>
                            <p className="text-zinc-500 text-xs font-medium leading-relaxed line-clamp-2">
                              {video.caption}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
             ) : (
                <div className="text-center py-24">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-900/50 mb-6 border border-zinc-800">
                    <Search className="w-8 h-8 text-zinc-600" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">No guides found</h3>
                  <p className="text-zinc-500">Try adjusting your search terms.</p>
                </div>
             )}
           </AnimatePresence>
        </div>
      </main>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}