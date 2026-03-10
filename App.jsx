import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Home,
  Mail,
  User,
  ExternalLink, 
  Instagram,
  Facebook,
  Linkedin,
  ArrowRight,
  Search,
  Sparkles,
  Music,
  Trophy,
  Gamepad2,
  LayoutGrid,
  X
} from 'lucide-react';

// --- Données du Portfolio ---
const POSTERS_DATA = [
  { id: 1, title: "Neon Nights Festival", category: "Musical event", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800", height: "h-96", date: "2024", client: "L'Aéronef" },
  { id: 2, title: "Abstract Jazz Session", category: "Musical event", image: "https://images.unsplash.com/photo-1514525253361-bee8a487409e?q=80&w=800", height: "h-72", date: "2023", client: "Blue Note" },
  { id: 3, title: "Cyberpunk Cinema", category: "Gaming & esport", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800", height: "h-80", date: "2024", client: "Le Grand Rex" },
  { id: 4, title: "Championship 2024", category: "Sport", image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800", height: "h-[500px]", date: "2024", client: "Nike" },
  { id: 5, title: "Minimalist Expo", category: "Gaming & esport", image: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=800", height: "h-64", date: "2023", client: "MoMA" },
  { id: 6, title: "Midnight Rave", category: "Musical event", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800", height: "h-96", date: "2024", client: "Terminal 1" },
  { id: 7, title: "Urban Marathon", category: "Sport", image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=800", height: "h-80", date: "2023", client: "Adidas" },
  { id: 8, title: "Rock En Seine", category: "Musical event", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800", height: "h-[450px]", date: "2024", client: "Rock En Seine" },
  { id: 9, title: "Indie Game Night", category: "Gaming & esport", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800", height: "h-72", date: "2024", client: "Indie World" },
  { id: 10, title: "Tennis Open", category: "Sport", image: "https://images.unsplash.com/photo-1595435066311-20d046908595?q=80&w=800", height: "h-80", date: "2023", client: "Roland Garros" },
  { id: 11, title: "Global Finals", category: "Gaming & esport", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800", height: "h-96", date: "2024", client: "Riot Games" },
  { id: 12, title: "Classical Echoes", category: "Musical event", image: "https://images.unsplash.com/photo-1520529123414-8f9f92471ee7?q=80&w=800", height: "h-72", date: "2023", client: "Philharmonie" },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [activeTab, setActiveTab] = useState("accueil");
  const [cursorType, setCursorType] = useState('default'); 
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDraggingScroll, setIsDraggingScroll] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const cursorRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const delayedPos = useRef({ x: 0, y: 0 });
  const mainContentRef = useRef(null);
  const scrollBarRef = useRef(null);
  
  const scrollTarget = useRef(0);
  const scrollCurrent = useRef(0);
  const rafId = useRef(null);

  // Configuration du formulaire
  const userEmail = "hello@gabriel.design"; // REMPLACEZ PAR VOTRE GMAIL ICI

  // --- Gestion du Curseur et du Scroll ---
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;

    const handleMouseMoveGlobal = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (isDraggingScroll && scrollBarRef.current && mainContentRef.current) {
        const rect = scrollBarRef.current.getBoundingClientRect();
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        const percentage = y / rect.height;
        const maxScroll = mainContentRef.current.scrollHeight - mainContentRef.current.clientHeight;
        scrollTarget.current = percentage * maxScroll;
      }
    };

    const handleMouseUpGlobal = () => setIsDraggingScroll(false);

    const handleMouseOverGlobal = (e) => {
      if (isMobile) return;
      const target = e.target;
      if (target.closest('.cursor-zoom-in')) {
        setCursorType('zoom');
      } else if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('.scroll-handle')) {
        setCursorType('pointer');
      } else {
        setCursorType('default');
      }
    };

    const animate = () => {
      if (!isMobile) {
        const cursorLerp = 0.2;
        delayedPos.current.x += (mousePos.current.x - delayedPos.current.x) * cursorLerp;
        delayedPos.current.y += (mousePos.current.y - delayedPos.current.y) * cursorLerp;

        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${delayedPos.current.x}px, ${delayedPos.current.y}px, 0)`;
        }
      }

      if (mainContentRef.current && !selectedPoster && activeTab === 'accueil') {
        const scrollLerp = 0.1;
        scrollCurrent.current += (scrollTarget.current - scrollCurrent.current) * scrollLerp;
        
        if (!isMobile) {
          mainContentRef.current.scrollTop = scrollCurrent.current;
        } else {
          scrollCurrent.current = mainContentRef.current.scrollTop;
          scrollTarget.current = mainContentRef.current.scrollTop;
        }

        const maxScroll = mainContentRef.current.scrollHeight - mainContentRef.current.clientHeight;
        if (maxScroll > 0) {
          setScrollProgress(scrollCurrent.current / maxScroll);
        }
      }

      rafId.current = requestAnimationFrame(animate);
    };

    const handleWheel = (e) => {
      if (selectedPoster || activeTab !== 'accueil' || isMobile) return;
      e.preventDefault();
      const maxScroll = mainContentRef.current.scrollHeight - mainContentRef.current.clientHeight;
      scrollTarget.current = Math.min(Math.max(scrollTarget.current + e.deltaY, 0), maxScroll);
    };

    window.addEventListener('mousemove', handleMouseMoveGlobal);
    window.addEventListener('mouseup', handleMouseUpGlobal);
    window.addEventListener('mouseover', handleMouseOverGlobal);
    
    const container = mainContentRef.current;
    if (container && !isMobile) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    rafId.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
      window.removeEventListener('mouseover', handleMouseOverGlobal);
      if (container) container.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(rafId.current);
    };
  }, [selectedPoster, isDraggingScroll, activeTab]);

  const handleScrollBarClick = (e) => {
    if (!scrollBarRef.current || !mainContentRef.current) return;
    const rect = scrollBarRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = y / rect.height;
    const maxScroll = mainContentRef.current.scrollHeight - mainContentRef.current.clientHeight;
    scrollTarget.current = percentage * maxScroll;
    setIsDraggingScroll(true);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nom = formData.get('nom');
    const email = formData.get('email');
    const projet = formData.get('projet');
    
    const subject = encodeURIComponent(`Nouveau Projet - ${nom}`);
    const body = encodeURIComponent(`Nom: ${nom}\nEmail: ${email}\n\nDescription du projet:\n${projet}`);
    
    window.location.href = `mailto:${userEmail}?subject=${subject}&body=${body}`;
  };

  const categoriesList = [
    { name: "Tout", icon: <LayoutGrid size={14} /> },
    { name: "Musical event", icon: <Music size={14} /> },
    { name: "Sport", icon: <Trophy size={14} /> },
    { name: "Gaming & esport", icon: <Gamepad2 size={14} /> }
  ];

  const filteredPosters = useMemo(() => {
    return POSTERS_DATA.filter(poster => activeCategory === "Tout" || poster.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (catName) => {
    if (catName === activeCategory) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(catName);
      scrollTarget.current = 0;
      scrollCurrent.current = 0;
      setScrollProgress(0);
      setIsTransitioning(false);
    }, 300);
  };

  const navItems = [
    { id: 'accueil', icon: <Home size={22} />, label: 'Accueil' },
    { id: 'apropos', icon: <User size={22} />, label: 'À propos' },
    { id: 'contact', icon: <Mail size={22} />, label: 'Contact' },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'apropos':
        return (
          <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 lg:px-24 gap-12 lg:gap-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="relative group perspective-1000 w-full max-w-[450px]">
              <div className="relative z-10 w-full aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl group-hover:rotate-1 group-hover:scale-[1.02]">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800" 
                  alt="Portrait" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/800x1000?text=Gabriel"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-red-600/50 rounded-tl-3xl z-0 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-500"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-white/20 rounded-br-3xl z-0 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
            </div>

            <div className="max-w-xl text-left">
              <span className="text-red-500 font-black uppercase tracking-[0.4em] text-xs mb-6 block">Le Créateur</span>
              <h1 className="text-6xl lg:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-[0.85]">
                Gabriel <br/> <span className="text-neutral-700">Studio</span>
              </h1>
              <p className="text-xl text-neutral-400 italic leading-relaxed mb-8">
                Basé à Paris, j'accompagne les marques audacieuses dans la création d'identités visuelles radicales. Mon approche mêle typographie brutale et esthétique analogique.
              </p>
              <div className="flex gap-12 border-t border-white/10 pt-8">
                <div>
                  <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-2 opacity-50">Expérience</h4>
                  <p className="text-2xl font-black italic">8+ ANS</p>
                </div>
                <div>
                  <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-2 opacity-50">Projets</h4>
                  <p className="text-2xl font-black italic">120+</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="flex items-center justify-center min-h-screen px-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <div className="w-full max-w-xl relative group">
               <div className="cta-border-beam !inset-[-2px] !rounded-[42px] opacity-100"></div>
               <div className="relative z-10 w-full bg-neutral-950/95 backdrop-blur-3xl p-8 md:p-12 rounded-[40px] shadow-2xl overflow-hidden">
                 <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-12 text-center md:text-left">Démarrer une <br/> collaboration.</h1>
                 <form className="space-y-6 text-left" onSubmit={handleContactSubmit}>
                   <input required name="nom" type="text" placeholder="VOTRE NOM" className="w-full bg-transparent border-b border-white/10 py-4 font-black uppercase italic text-sm tracking-widest focus:border-white outline-none transition-all placeholder:text-neutral-700" />
                   <input required name="email" type="email" placeholder="EMAIL" className="w-full bg-transparent border-b border-white/10 py-4 font-black uppercase italic text-sm tracking-widest focus:border-white outline-none transition-all placeholder:text-neutral-700" />
                   <textarea required name="projet" placeholder="PROJET" rows="3" className="w-full bg-transparent border-b border-white/10 py-4 font-black uppercase italic text-sm tracking-widest focus:border-white outline-none transition-all placeholder:text-neutral-700 resize-none"></textarea>
                   <button type="submit" className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase italic tracking-widest mt-8 hover:bg-red-600 hover:text-white transition-all shadow-xl">Envoyer sur Gmail</button>
                 </form>
                 <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-between gap-6">
                   <div>
                      <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1">Email Direct</p>
                      <p className="text-xs font-bold text-white uppercase italic">{userEmail}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1">Location</p>
                      <p className="text-xs font-bold text-white uppercase italic">Paris, FR</p>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        );
      default:
        return (
          <>
            <header className="sticky top-0 bg-neutral-950/40 backdrop-blur-md z-30 px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5">
              <div className="text-left w-full md:w-auto">
                <h2 className="text-2xl font-black tracking-tighter italic uppercase leading-none">Portfolio</h2>
                <p className="text-[9px] text-neutral-500 uppercase tracking-[0.4em] font-black mt-2">Graphisme & Direction Artistique</p>
              </div>

              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 md:pb-0 w-full md:w-auto">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`px-5 py-2.5 rounded-xl font-black transition-all text-[10px] uppercase tracking-widest border whitespace-nowrap flex items-center gap-2
                      ${activeCategory === cat.name 
                        ? 'bg-white text-black border-white shadow-xl shadow-white/5 scale-105' 
                        : 'bg-white/5 text-neutral-400 border-white/5 hover:border-white/20 hover:bg-white/10'}`}
                  >
                    {cat.icon}
                    {cat.name}
                  </button>
                ))}
              </div>
            </header>

            <main className={`px-6 py-12 pb-32 md:pb-12 text-left transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-[0.98] translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
              <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-8 space-y-8">
                {filteredPosters.map((poster, index) => (
                  <div 
                    key={`${activeCategory}-${poster.id}`} 
                    className="relative group break-inside-avoid cursor-zoom-in animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-700 fill-mode-both"
                    style={{ animationDelay: `${(index % 8) * 50}ms` }}
                    onClick={() => setSelectedPoster(poster)}
                  >
                    <div className={`w-full ${poster.height} overflow-hidden rounded-2xl relative bg-neutral-900 border border-white/5 transition-all duration-700 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] group-hover:-translate-y-2 group-hover:border-white/20`}>
                      <img 
                        src={poster.image} 
                        alt={poster.title} 
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/400x600?text=Graphic+Work"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
                        <div className="flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-red-500 mb-2">{poster.category}</p>
                            <h3 className="text-2xl font-black leading-none tracking-tighter italic uppercase">{poster.title}</h3>
                          </div>
                          <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-black transition-all">
                            <ExternalLink size={18} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </>
        );
    }
  };

  return (
    <div className={`h-screen bg-neutral-950 text-white font-sans selection:bg-red-500/30 flex flex-col md:flex-row relative overflow-hidden ${isDraggingScroll ? 'select-none' : ''}`}>
      
      <style>{`
        @keyframes rotate-beam {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .cta-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 200;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease;
        }

        .cta-button {
          position: relative;
          padding: 1.25rem 2.5rem;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(12px);
          color: white;
          border-radius: 1.25rem;
          font-weight: 900;
          text-transform: uppercase;
          font-style: italic;
          letter-spacing: 0.15em;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 15px 40px -10px rgba(0,0,0,0.6);
        }

        .cta-button:hover {
          transform: translateY(-5px) scale(1.03);
          box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.4);
        }

        .cta-border-beam {
          position: absolute;
          inset: -2px;
          z-index: 0;
          border-radius: inherit;
          overflow: hidden;
          pointer-events: none;
        }

        .cta-border-beam::before {
          content: "";
          position: absolute;
          top: -200%;
          left: -200%;
          width: 500%;
          height: 500%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 150deg,
            rgba(239, 68, 68, 1) 180deg,
            rgba(255, 255, 255, 1) 190deg,
            rgba(239, 68, 68, 1) 200deg,
            transparent 230deg,
            transparent 360deg
          );
          animation: rotate-beam 3s linear infinite;
        }

        .cta-border-beam::after {
          content: "";
          position: absolute;
          inset: 3px;
          background: #0a0a0a;
          border-radius: inherit;
          z-index: 1;
        }

        .scrollbar-none::-webkit-scrollbar { display: none; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>

      {/* --- CTA Flottant --- */}
      <div className={`cta-container ${activeTab === 'contact' ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <button 
          onClick={() => { setActiveTab('contact'); setSelectedPoster(null); }}
          className="cta-button group"
        >
          <div className="cta-border-beam"></div>
          <Sparkles size={16} className="relative z-10 text-red-500 group-hover:rotate-[30deg] transition-transform duration-700" />
          <span className="relative z-10">Démarrer un projet</span>
          <div className="relative z-10 overflow-hidden w-4 flex shrink-0">
            <ArrowRight size={16} className="opacity-70 group-hover:translate-x-full transition-transform duration-500 shrink-0" />
            <ArrowRight size={16} className="opacity-100 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 shrink-0 text-red-500" />
          </div>
        </button>
      </div>
      
      {/* --- Scrollbar Personnalisée --- */}
      {activeTab === 'accueil' && !selectedPoster && (
        <div 
          ref={scrollBarRef}
          onMouseDown={handleScrollBarClick}
          className={`fixed right-2 top-1/2 -translate-y-1/2 h-[50vh] w-1.5 bg-white/5 rounded-full z-[60] hidden md:block border border-white/5 transition-all
            ${isDraggingScroll ? 'bg-white/10 w-2.5' : 'hover:bg-white/10 hover:w-2.5'}`}
        >
          <div 
            className="scroll-handle absolute left-0 w-full bg-white/60 rounded-full transition-all duration-75"
            style={{ 
              height: '15%', 
              top: `${scrollProgress * 85}%`,
              backgroundColor: isDraggingScroll ? '#fff' : 'rgba(255,255,255,0.6)',
              boxShadow: isDraggingScroll ? '0 0 15px rgba(255,255,255,0.4)' : 'none'
            }}
          ></div>
        </div>
      )}

      {/* --- Curseur Personnalisé --- */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center overflow-hidden
          ${cursorType === 'zoom' 
            ? 'w-24 h-24 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full' 
            : cursorType === 'pointer'
            ? 'w-10 h-10 bg-red-600 rounded-full'
            : 'w-4 h-4 bg-white rounded-full'}`}
        style={{ 
          marginTop: cursorType === 'zoom' ? '-48px' : cursorType === 'pointer' ? '-20px' : '-8px',
          marginLeft: cursorType === 'zoom' ? '-48px' : cursorType === 'pointer' ? '-20px' : '-8px',
          mixBlendMode: cursorType === 'zoom' ? 'normal' : 'difference',
          transition: 'width 0.4s cubic-bezier(0.23, 1, 0.32, 1), height 0.4s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.4s'
        }}
      >
        {cursorType === 'zoom' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <Search size={20} className="text-white mb-1" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Voir</span>
          </div>
        )}
      </div>

      {/* --- Arrière-plan & Grain --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-neutral-950">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-600/5 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* --- Navigation Sidebar --- */}
      <aside className="hidden md:flex flex-col w-24 h-full bg-white/5 backdrop-blur-2xl border-r border-white/10 items-center py-10 z-50 flex-shrink-0">
        <button 
          onClick={() => { setActiveTab('accueil'); setSelectedPoster(null); scrollTarget.current = 0; }}
          className="mb-14 group transition-transform active:scale-90"
        >
          {/* Logo remplacé par une image */}
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-500 group-hover:bg-red-600 group-hover:rotate-12">
            <img 
              src="https://via.placeholder.com/100x100?text=Logo" 
              alt="Logo" 
              className="w-full h-full object-cover p-1"
            />
          </div>
        </button>

        <nav className="flex flex-col gap-10 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSelectedPoster(null); scrollTarget.current = 0; }}
              className={`p-3.5 rounded-2xl transition-all duration-500
                ${activeTab === item.id 
                  ? 'bg-white text-black shadow-xl scale-110' 
                  : 'text-neutral-500 hover:text-white hover:bg-white/10'}`}
            >
              {item.icon}
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-6 text-neutral-500 mt-auto">
          <button className="hover:text-blue-600 transition-all hover:scale-125"><Facebook size={20} /></button>
          <button className="hover:text-pink-500 transition-all hover:scale-125"><Instagram size={20} /></button>
          <button className="hover:text-white transition-all hover:scale-125"><Linkedin size={20} /></button>
        </div>
      </aside>

      {/* --- Navigation Mobile --- */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-3xl shadow-2xl rounded-[2.5rem] px-8 py-5 border border-white/10 flex items-center gap-12 z-50">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => { setActiveTab(item.id); setSelectedPoster(null); }} className={`transition-transform active:scale-90 ${activeTab === item.id ? 'text-white scale-125' : 'text-neutral-600'}`}>
            {item.icon}
          </button>
        ))}
      </nav>

      <div 
        ref={mainContentRef}
        className="flex-1 h-screen overflow-y-auto relative z-10 scrollbar-none"
      >
        {renderContent()}
      </div>

      {/* --- Modal de Détails --- */}
      {selectedPoster && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedPoster(null)}></div>
          
          <button className="absolute top-8 right-8 text-neutral-500 hover:text-white bg-white/5 p-3 rounded-full transition-all z-[110]" onClick={() => setSelectedPoster(null)}>
            <X size={24} />
          </button>

          <div className="relative w-full max-w-6xl max-h-full overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-500 bg-neutral-900/50 rounded-[2.5rem] border border-white/10">
            <div className="md:w-3/5 h-[40vh] md:h-auto flex items-center justify-center bg-black/40">
              <img 
                src={selectedPoster.image} 
                alt={selectedPoster.title} 
                className="max-h-full w-auto object-contain p-8"
              />
            </div>

            <div className="md:w-2/5 p-10 md:p-16 flex flex-col justify-center text-left">
              <div className="mb-8">
                <div className="inline-block px-4 py-1.5 bg-red-600/10 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-[0.3em] mb-6">
                  {selectedPoster.category}
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[0.85] text-white uppercase italic tracking-tighter">
                  {selectedPoster.title}
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
                <div className="flex flex-col gap-2">
                  <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Client</p>
                  <p className="text-lg font-bold text-white italic uppercase tracking-tight">{selectedPoster.client}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Année</p>
                  <p className="text-lg font-bold text-white italic uppercase tracking-tight">{selectedPoster.date}</p>
                </div>
              </div>

              <p className="text-neutral-400 italic mt-12 text-sm leading-relaxed">
                Une étude graphique explorant la tension entre minimalisme brutaliste et textures organiques. Ce projet vise à redéfinir l'impact visuel à travers le vide et le contraste extrême.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
