import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Play, X, Grid,
  // Fallback icons 
  Type, MousePointer2, Film, Bot, Mic, Sparkles, Layers,
} from 'lucide-react';

// --- IMAGE IMPORTS ---
// IMPORTANT: Make sure these paths match exactly where your files are relative to this component
import pencilImg from '../assets/pencil.png';
import highlighterImg from '../assets/highlighter.png';
import shapesImg from '../assets/shapes.png';
import noteImg from '../assets/notes.png';
import hyperlinkImg from '../assets/hyperlink.png';
import imagesImg from '../assets/image.png';

// --- CONFIGURATION ---

const SECTIONS = [
  {
    id: 'tools',
    label: 'Tools',
    description: 'Core drawing instruments',
    icon: pencilImg, // Using the imported image variable
    features: [
      { id: 'pencil', label: 'Pencil', icon: pencilImg },
      { id: 'highlighter', label: 'Highlighter', icon: highlighterImg },
      { id: 'shapes', label: 'Shapes', icon: shapesImg },
      // User didn't provide asset for Text, using Lucide fallback
      { id: 'text', label: 'Text', icon: Type }, 
    ]
  },
  {
    id: 'creation',
    label: 'Creation Tools',
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
    label: 'Chatbot',
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

// Helper to flatten features for "All" view
const ALL_FEATURES = SECTIONS
  .filter(s => s.id !== 'all')
  .flatMap(s => s.features);

const HELP_VIDEOS = [
  // --- TOOLS ---
  {
    id: 1,
    title: "Mastering the Pencil",
    featureId: "pencil",
    vimeoId: "76979871", 
    thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop",
    caption: "Adjust stroke width and pressure sensitivity.",
    duration: "2:30"
  },
  {
    id: 2,
    title: "Highlighter Techniques",
    featureId: "highlighter",
    vimeoId: "76979871",
    thumbnail: "https://images.unsplash.com/photo-1503602642458-232111445857?q=80&w=1000&auto=format&fit=crop",
    caption: "Layering colors for emphasis.",
    duration: "1:15"
  },
  {
    id: 3,
    title: "Drawing Shapes",
    featureId: "shapes",
    vimeoId: "76979871",
    thumbnail: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
    caption: "Creating perfect circles and polygons.",
    duration: "3:45"
  },
  {
    id: 4,
    title: "Adding Text",
    featureId: "text",
    vimeoId: "76979871",
    thumbnail: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=1000&auto=format&fit=crop",
    caption: "Font selection and typography settings.",
    duration: "2:00"
  },
  // --- CREATION ---
  {
    id: 5,
    title: "Using Sticky Notes",
    featureId: "note",
    vimeoId: "76979871",
    thumbnail: "https://images.unsplash.com/photo-1531346878377-a51349593da4?q=80&w=1000&auto=format&fit=crop",
    caption: "Organize ideas with colored notes.",
    duration: "1:50"
  },
  {
    id: 6,
    title: "Inserting Hyperlinks",
    featureId: "hyperlink",
    vimeoId: "76979871",
    thumbnail: "https://images.unsplash.com/photo-1555421689-d6847122aa74?q=80&w=1000&auto=format&fit=crop",
    caption: "Linking to external resources.",
    duration: "1:10"
  },
  {
    id: 7,
    title: "Working with Images",
    featureId: "images",
    vimeoId: "76979871",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
    caption: "Upload, crop and resize images.",
    duration: "3:20"
  },
  // --- LAYERS ---
  {
    id: 8,
    title: "Layer Selection",
    featureId: "selection",
    vimeoId: "76979871",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    caption: "Grouping and multi-select strategies.",
    duration: "4:00"
  },
  {
    id: 9,
    title: "Adding Animations",
    featureId: "animations",
    vimeoId: "76979871",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
    caption: "Fade, slide, and bounce effects.",
    duration: "2:45"
  },
  // --- CHATBOT ---
  {
    id: 10,
    title: "Ask Dyno",
    featureId: "ask",
    vimeoId: "76979871",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
    caption: "Generating ideas with Dyno AI.",
    duration: "2:10"
  },
];

// --- COMPONENTS ---

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl overflow-hidden bg-[#18181b] border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-black bg-[#18181b]">
          <h3 className="text-lg font-medium text-white">{video.title}</h3>
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
        <div className="p-6 bg-[#18181b]">
          <p className="text-zinc-400">{video.caption}</p>
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

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setActiveFeature(null); 
  };

  const currentFeatures = activeSection === 'all' 
    ? ALL_FEATURES 
    : SECTIONS.find(s => s.id === activeSection)?.features || [];

  const filteredVideos = useMemo(() => {
    return HELP_VIDEOS.filter((video) => {
      const matchesSearch = 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.caption.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesContext = true;

      if (activeFeature) {
        matchesContext = video.featureId === activeFeature;
      } else if (activeSection !== 'all') {
        const sectionFeatures = SECTIONS.find(s => s.id === activeSection)?.features.map(f => f.id);
        matchesContext = sectionFeatures?.includes(video.featureId);
      }

      return matchesSearch && matchesContext;
    });
  }, [searchQuery, activeFeature, activeSection]);

  // Helper to render either an Image or an SVG Icon
  const renderIcon = (IconSource, className) => {
    if (typeof IconSource === 'string') {
      return <img src={IconSource} alt="icon" className={`${className} object-contain`} />;
    }
    const IconComponent = IconSource;
    return <IconComponent className={className} />;
  };

  return (
    <div className="min-h-screen bg-[#18181b] text-zinc-400 font-sans selection:bg-zinc-700 selection:text-white pb-20">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-zinc-800/20 to-transparent pointer-events-none" />

      <main className="relative max-w-6xl px-6 mx-auto pt-20">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-3xl font-bold text-white tracking-tight"
          >
            How can we help?
          </motion.h1>

          <div className="relative max-w-xl mx-auto group z-20">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-10 pr-4 text-sm text-white transition-all 
                         bg-black/30 border border-white/10 rounded-full 
                         focus:outline-none focus:bg-zinc-900 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600
                         placeholder:text-zinc-600 shadow-xl backdrop-blur-md"
            />
          </div>
        </div>

        {/* --- LEVEL 1: MAIN SECTIONS (Tabs) --- */}
        <div className="flex justify-center mb-10">
          <div className="flex p-1 space-x-1 bg-black/40 backdrop-blur-md rounded-full border border-white/5 overflow-x-auto max-w-full">
            {SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              
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
                    {/* Render Icon (handle string vs component) */}
                    {renderIcon(section.icon, "w-4 h-4")}
                    {section.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- LEVEL 2: SPECIFIC FEATURE ICONS --- */}
        <div className="relative min-h-[100px] mb-12">
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
                const isSelected = activeFeature === feature.id;

                return (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(isSelected ? null : feature.id)}
                    className="group relative flex flex-col items-center gap-3"
                  >
                    {/* Icon Circle */}
                    <div className={`
                      relative flex items-center justify-center w-16 h-16 rounded-2xl border transition-all duration-300
                      ${isSelected 
                        ? 'bg-zinc-800 border-white/20 shadow-lg shadow-black/50 scale-110' 
                        : 'bg-[#18181b] border-white/5 hover:bg-zinc-800 hover:border-white/10'}
                    `}>
                      {isSelected && (
                         <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      )}
                      
                      {/* Render Feature Icon */}
                      {renderIcon(feature.icon, `w-6 h-6 transition-all duration-300 ${isSelected ? 'opacity-100 scale-110' : 'opacity-60 group-hover:opacity-100'}`)}
                    </div>
                    
                    {/* Label */}
                    <span className={`text-xs font-medium transition-colors ${isSelected ? 'text-white' : 'text-zinc-600'}`}>
                      {feature.label}
                    </span>

                    {/* Active Indicator Dot */}
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

        {/* --- CONTENT AREA: VIDEOS --- */}
        <div className="border-t border-white/5 pt-8">
           <div className="flex items-center gap-2 mb-6">
              <span className="text-zinc-500 text-sm">Showing guides for:</span>
              <span className="text-white text-sm font-medium px-3 py-1 bg-zinc-800 rounded-full border border-white/10 flex items-center gap-1">
                {activeFeature 
                  ? currentFeatures.find(f => f.id === activeFeature)?.label 
                  : (activeSection === 'all' ? 'All Features' : SECTIONS.find(s => s.id === activeSection)?.label)}
              </span>
           </div>

           <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode='popLayout'>
              {filteredVideos.map((video) => (
                <motion.div
                  layout
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedVideo(video)}
                  className="cursor-pointer group"
                >
                  <div className="h-full bg-[#18181b] border border-white/5 border-t-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all shadow-xl flex flex-col">
                    
                    {/* THUMBNAIL */}
                    <div className="relative h-44 bg-zinc-900 border-b border-black group overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 box-shadow-lg">
                          <Play size={20} className="text-white fill-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">
                        {video.duration}
                      </div>
                    </div>
                    
                    {/* TEXT */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h4 className="text-zinc-100 font-medium mb-2 group-hover:text-white transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                        {video.caption}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-20 text-zinc-600">
              <p>No guides found matching your selection.</p>
            </div>
          )}
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