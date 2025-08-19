"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import MomentumLogo from "../components/momentum-logo"
// Eliminar la importación de MomentumLogoHot

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showSignup, setShowSignup] = useState(false)
  const [signupAnimating, setSignupAnimating] = useState(false)
  const [showMainContent, setShowMainContent] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [showHighlights, setShowHighlights] = useState(false)
  const [showOrangeText, setShowOrangeText] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [cursorScale, setCursorScale] = useState(1)
  const [cursorText, setCursorText] = useState("")
  const [isHovering, setIsHovering] = useState(false)
  const [cursorColor, setCursorColor] = useState("bg-orange-600")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    language: "en",
  })
  
  // Estado para controlar la transición a Weekly Builds
  const [showWeeklyBuilds, setShowWeeklyBuilds] = useState(false)
  const [logoTransitioned, setLogoTransitioned] = useState(false)
  const [showWeeklyBuildsContent, setShowWeeklyBuildsContent] = useState(false)
  const [isExitingWeeklyBuilds, setIsExitingWeeklyBuilds] = useState(false)
  
  // Estados para la animación de inicio
  const [introStage, setIntroStage] = useState(0) // 0: negro, 1: naranja, 2: muelle, 3: cambio fondo
  const [introTextComplete, setIntroTextComplete] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const textElementsRef = useRef<(HTMLDivElement | null)[]>([])

  const fullText = "It started with one bold email between founders; today it's the newsletter powering those who build the future."

  // Detectar si estamos en el cliente
  useEffect(() => {
    setIsClient(true)
    // Pequeña pausa antes de iniciar la animación
    setTimeout(() => {
      setIntroTextComplete(true)
    }, 100)
  }, [])

  // Estado inicial para evitar hidratación
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Animación de inicio con logo en posición final
  useEffect(() => {
    if (!mounted) return

    // Pausa inicial después de que el cliente esté listo
    setTimeout(() => {
      // Pausa después de mostrar el logo
      setTimeout(() => {
        setIntroStage(1) // Cambiar a naranja
        setTimeout(() => {
          setIntroStage(2) // Animación de muelle
          setTimeout(() => {
            setIntroStage(3) // Cambio de fondo
            setTimeout(() => {
              setShowMainContent(true) // Terminar animación y mostrar contenido principal
            }, 1500) // Más tiempo para que el cambio de fondo se complete
          }, 800)
        }, 1000)
      }, 1000)
    }, 600) // Un poco más de tiempo para asegurar que el cliente esté completamente listo
  }, [isClient])

  // Advanced cursor tracking with momentum
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Solo inicializar en el cliente
    if (mounted) {
      setCurrentTime(new Date())
      const timer = setInterval(() => {
        setCurrentTime(new Date())
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [mounted])



  // Simple hover effects without magnetism
  const handleSimpleHover = useCallback((text: string = "", color: string = "bg-orange-400") => {
    setCursorColor(color)
    setCursorText(text)
    setIsHovering(true)
  }, [])

  const handleSimpleLeave = useCallback(() => {
    setCursorColor("bg-orange-600")
    setCursorText("")
    setIsHovering(false)
  }, [])

  const formatTime = (date: Date) => {
    const timeString = date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    return timeString
  }

  const formatTimeWithHighlight = (date: Date) => {
    const timeString = formatTime(date)
    const parts = timeString.split(':')
    
    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part === '11' ? (
              <span style={{ color: '#FAF5EB' }}>{part}</span>
            ) : (
              part
            )}
            {index < parts.length - 1 && ':'}
          </span>
        ))}
      </>
    )
  }

  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase()
  }

  const formatDateWithHighlight = (date: Date) => {
    const dateString = formatDate(date)
    const day = date.getDate().toString()
    
    if (day === '11') {
      // Replace the day number with highlighted version
      const parts = dateString.split(' ')
      return (
        <>
          {parts.map((part, index) => (
            <span key={index}>
              {part === '11' || part === '11,' ? (
                <span style={{ color: '#4B0A23' }}>{part}</span>
              ) : (
                part
              )}
              {index < parts.length - 1 && ' '}
            </span>
          ))}
        </>
      )
    }
    
    return dateString
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setShowSignup(false)
    setFormData({ name: "", email: "", language: "en" })
  }

  const renderTypedText = (text: string) => {
    const words = text.split(" ")

    return words.map((word, index) => {
      const cleanWord = word.replace(/[;,.]/g, "")
      const punctuation = word.match(/[;,.]/)?.[0] || ""

      // Si showOrangeText está activo, todo el texto se pone naranja
      if (showOrangeText) {
        return (
          <span key={index} className="text-orange-400 font-inter transition-all duration-500">
            {word}
            {index < words.length - 1 && " "}
          </span>
        )
      }

      if ((cleanWord === "founders" || cleanWord === "newsletter") && showHighlights) {
        return (
          <span key={index}>
            <span 
              className="font-newsreader italic text-orange-600 text-3xl transition-all duration-700 ease-out transform hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
                textShadow: "0 0 20px rgba(255, 87, 51, 0.3)"
              }}
            >
              {cleanWord}
            </span>
            {punctuation && <span className="text-white font-inter">{punctuation}</span>}
            {index < words.length - 1 && " "}
          </span>
        )
      }

      return (
        <span key={index} className="text-white font-inter">
          {word}
          {index < words.length - 1 && " "}
        </span>
      )
    })
  }



  // Pantalla principal con animación integrada
  return (
    <div 
      ref={containerRef} 
      className={`w-full relative transition-all duration-1000 ease-in-out cursor-auto ${
        showWeeklyBuildsContent ? 'min-h-screen overflow-y-auto' : 'h-screen overflow-hidden'
      }`}
      style={{
        backgroundColor: mounted && introStage === 3 ? '#4B0A23' : '#000000',
        transition: 'background-color 1s ease-in-out'
      }}
    >
      {/* Eliminado MomentumLogoHot */}







        












              {/* Logo único que hace la animación y luego permanece */}
        <div 
          className={`${logoTransitioned ? 'fixed' : 'absolute'} inset-0 flex items-center justify-center z-20`}
          style={{
            transform: logoTransitioned ? 'translateY(calc(55vh - 10px))' : 'translateY(0)',
            transition: 'transform 1.2s ease-in-out'
          }}
        >
          <div className="text-center animate-scale-in">
            <div className="flex justify-center items-center mb-8">
              <img 
                                   src={mounted && introStage === 0 ? "/Bombeta_intro.svg" : "/Bombeta_white.svg"}
                alt="Bombeta" 
                className="w-[500px] h-auto cursor-pointer transition-all duration-1000 ease-in-out"
                onMouseEnter={() => handleSimpleHover("Bombeta", "bg-orange-400")}
                onMouseLeave={handleSimpleLeave}
                style={{
                  transform: mounted && introStage === 2 ? 'scale(1.05)' : logoTransitioned ? 'scale(0.4)' : 'scale(1)',
                  transition: introStage === 2 ? 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : logoTransitioned ? 'transform 1.2s ease-in-out' : 'all 1s ease-in-out',
                  opacity: mounted ? 1 : 0
                }}
              />
            </div>

                                <div
            className="font-inter text-2xl leading-relaxed max-w-3xl mx-auto mb-8"
            style={{ 
              color: 'rgba(254, 70, 41, 0.9)',
              opacity: showMainContent && !showWeeklyBuilds ? 1 : 0,
              visibility: showMainContent && !showWeeklyBuilds ? 'visible' : 'hidden',
              transition: 'opacity 0.8s ease-out, visibility 0s, transform 0.8s ease-out',
              transform: showMainContent && !showWeeklyBuilds ? 'translateY(0)' : 'translateY(15px)'
            }}
          >
          <div>
            Empowering <span 
              className="font-newsreader italic text-3xl transition-all duration-300 cursor-pointer"
              style={{ color: '#FE4629' }}
              onMouseEnter={() => handleSimpleHover("Founders", "bg-orange-400")}
              onMouseLeave={handleSimpleLeave}
            >
              founders
            </span>{" "}<span className="font-inter text-2xl" style={{ color: 'rgba(254, 70, 41, 0.9)' }}>to build the future</span>
          </div>
        </div>

        <button
          onClick={() => setShowSignup(true)}
          className="px-12 py-4 font-inter text-lg font-semibold rounded-lg animate-fade-in-up"
          style={{ 
            backgroundColor: '#FE4629',
            color: '#4B0A23',
            border: '2px solid #FE4629',
            opacity: showMainContent && !showWeeklyBuilds ? 1 : 0,
            visibility: showMainContent && !showWeeklyBuilds ? 'visible' : 'hidden',
            transition: 'all 0.3s ease, opacity 0.8s ease-out 0.2s, visibility 0s, transform 0.8s ease-out 0.2s',
            transform: showMainContent && !showWeeklyBuilds ? 'translateY(0)' : 'translateY(15px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#FE4629';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FE4629';
            e.currentTarget.style.color = '#4B0A23';
          }}
        >
          Secure My Spot Now
        </button>

                {/* Schedule info */}
        <div
          className="font-inter text-sm mt-4 animate-fade-in-up"
          style={{ 
            color: 'rgba(254, 70, 41, 0.7)',
            opacity: showMainContent && !showWeeklyBuilds ? 1 : 0,
            visibility: showMainContent && !showWeeklyBuilds ? 'visible' : 'hidden',
            transition: 'opacity 0.8s ease-out 0.4s, visibility 0s, transform 0.8s ease-out 0.4s',
            transform: showMainContent && !showWeeklyBuilds ? 'translateY(0)' : 'translateY(15px)'
          }}
        >
          Every Tuesday <span style={{ color: '#FAF5EB' }}>11</span>:00 am
        </div>
        </div>
      </div>

                 {/* Newsletter Header */}
           <div
             className="fixed top-4 left-0 w-full z-30"
             style={{
               opacity: showMainContent && !showWeeklyBuilds ? 1 : 0,
               visibility: showMainContent && !showWeeklyBuilds ? 'visible' : 'hidden',
               transition: 'opacity 0.8s ease-out 0.1s, visibility 0s, transform 0.8s ease-out 0.1s',
               transform: showMainContent && !showWeeklyBuilds ? 'translateY(0)' : 'translateY(-20px)',
               height: '60px'
             }}
           >


             {/* Center - Newsletter Brand */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
               <div className="text-center">
                 <span className="font-inter text-sm font-normal text-[#FE4629]/60 tracking-wider uppercase">The</span>
                 <div className="font-inter text-xl font-bold text-[#FE4629] tracking-wider mt-1">NEWSLETTER</div>
               </div>
             </div>

                          {/* Left - The Weekly Builds Button */}
             <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
               <button
                 onClick={() => {
                   setShowWeeklyBuilds(true);
                   // Transición del logo después de que el contenido se desvanezca
                   setTimeout(() => {
                     setLogoTransitioned(true);
                     // Mostrar el contenido de Weekly Builds después de que el logo se posicione
                     setTimeout(() => {
                       setShowWeeklyBuildsContent(true);
                     }, 1200); // Delay para que coincida con la duración de la transición del logo
                   }, 800); // Delay para que coincida con la duración de las transiciones
                 }}
                 className="px-6 py-2 font-inter text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer"
                 style={{ 
                   backgroundColor: 'transparent',
                   color: '#FE4629',
                   border: '2px solid #FE4629'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.backgroundColor = '#FE4629';
                   e.currentTarget.style.color = '#4B0A23';
                   handleSimpleHover("The Weekly Builds", "bg-orange-400");
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.backgroundColor = 'transparent';
                   e.currentTarget.style.color = '#FE4629';
                   handleSimpleLeave();
                 }}
               >
                 THE WEEKLY BUILDS
               </button>
             </div>
           </div>

           {/* Footer */}
           <div
             className="fixed bottom-4 left-0 w-full z-30"
             style={{
               opacity: showMainContent && !showWeeklyBuilds ? 1 : 0,
               visibility: showMainContent && !showWeeklyBuilds ? 'visible' : 'hidden',
               transition: 'opacity 0.8s ease-out 0.1s, visibility 0s, transform 0.8s ease-out 0.1s',
               transform: showMainContent && !showWeeklyBuilds ? 'translateY(0)' : 'translateY(-20px)'
             }}
           >
             {/* Right - Live Time */}
             <div className="absolute bottom-0 right-8">
               <span 
                 className="font-inter text-base font-normal text-[#FE4629] font-mono"
               >
                 {currentTime ? formatTimeWithHighlight(currentTime) : '--:--:--'}
               </span>
             </div>
           </div>



      {/* Enhanced Signup Modal */}
      {showSignup && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 cursor-auto ${signupAnimating ? 'animate-fade-out' : 'animate-fade-in'}`} style={{ backgroundColor: '#4B0A23' }}>
          <div className={`border rounded-2xl p-8 max-w-md w-full mx-4 relative ${signupAnimating ? 'animate-scale-out-modal' : 'animate-scale-in-modal'}`} style={{ backgroundColor: '#4B0A23', borderColor: 'rgba(254, 70, 41, 0.2)', boxShadow: '0 25px 50px -12px rgba(254, 70, 41, 0.1)' }}>
            <button
              onClick={() => {
                setSignupAnimating(true)
                setTimeout(() => {
                  setShowSignup(false)
                  setSignupAnimating(false)
                }, 300)
              }}
              className="absolute top-4 right-4 text-2xl transition-all duration-300 hover:rotate-180 hover:scale-125"
              style={{ color: 'rgba(254, 70, 41, 0.6)' }}
            >
              ×
            </button>

            <h2 className="font-inter text-2xl mb-2 text-center animate-slide-up flex items-center justify-center gap-2" style={{ color: '#FE4629' }}>
              Join <img src="/Bombeta_white.svg" alt="Bombeta" className="h-8 w-auto" />
            </h2>

            <p className="font-inter text-sm mb-6 text-center animate-slide-up" style={{animationDelay: "0.1s", color: 'rgba(254, 70, 41, 0.7)' }}>
              Get exclusive insights delivered weekly
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="animate-slide-up" style={{animationDelay: "0.2s"}}>
                <label className="block font-inter text-sm mb-2" style={{ color: 'rgba(254, 70, 41, 0.8)' }}>Name</label>
                                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 font-inter rounded-lg focus:outline-none transition-all duration-300 placeholder-muted"
                    style={{ 
                      backgroundColor: 'rgba(254, 70, 41, 0.05)', 
                      border: '1px solid rgba(254, 70, 41, 0.2)', 
                      color: '#FE4629'
                    }}
                    placeholder="Your name"
                    required
                  />
              </div>

              <div className="animate-slide-up" style={{animationDelay: "0.3s"}}>
                <label className="block font-inter text-sm mb-2" style={{ color: 'rgba(254, 70, 41, 0.8)' }}>Email</label>
                                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 font-inter rounded-lg focus:outline-none transition-all duration-300 placeholder-muted"
                    style={{ 
                      backgroundColor: 'rgba(254, 70, 41, 0.05)', 
                      border: '1px solid rgba(254, 70, 41, 0.2)', 
                      color: '#FE4629'
                    }}
                    placeholder="your@email.com"
                    required
                  />
              </div>

              <div className="animate-slide-up" style={{animationDelay: "0.4s"}}>
                <label className="block font-inter text-sm mb-2" style={{ color: 'rgba(254, 70, 41, 0.8)' }}>Language</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, language: "en" })}
                    className="px-4 py-3 border rounded-lg transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: formData.language === "en" ? '#FE4629' : 'rgba(254, 70, 41, 0.2)',
                      backgroundColor: formData.language === "en" ? 'rgba(254, 70, 41, 0.1)' : 'rgba(254, 70, 41, 0.05)',
                      color: '#FE4629'
                    }}
                  >
                    <span className="font-inter text-sm">English</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, language: "es" })}
                    className="px-4 py-3 border rounded-lg transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: formData.language === "es" ? '#FE4629' : 'rgba(254, 70, 41, 0.2)',
                      backgroundColor: formData.language === "es" ? 'rgba(254, 70, 41, 0.1)' : 'rgba(254, 70, 41, 0.05)',
                      color: '#FE4629'
                    }}
                  >
                    <span className="font-inter text-sm">Español</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 font-inter font-semibold rounded-lg mt-6 animate-slide-up"
                style={{
                  animationDelay: "0.5s",
                  backgroundColor: '#FE4629',
                  color: '#4B0A23',
                  border: '1px solid #FE4629',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#FE4629';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FE4629';
                  e.currentTarget.style.color = '#4B0A23';
                }}
              >
                Join Bombeta
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Weekly Builds Content */}
      {showWeeklyBuildsContent && (
        <>
          {/* Weekly Builds Header */}
          <div className={`fixed top-4 left-0 w-full z-40 ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ height: '60px', animationDelay: isExitingWeeklyBuilds ? '0.1s' : '0.1s' }}>
            {/* Left - Join Newsletter Button */}
            <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
              <button
                onClick={() => setShowSignup(true)}
                className={`px-6 py-2 font-inter text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`}
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#FAF5EB',
                  border: '2px solid rgba(250,245,235,0.25)',
                  animationDelay: isExitingWeeklyBuilds ? '0.2s' : '0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAF5EB';
                  e.currentTarget.style.color = '#4B0A23';
                  handleSimpleHover("Join the Club", "bg-orange-400");
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#FAF5EB';
                  handleSimpleLeave();
                }}
              >
                JOIN THE CLUB
              </button>
            </div>

            {/* Center - Weekly Builds Brand */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className={`text-center ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '0.3s' : '0.3s' }}>
                <span className="font-inter text-sm font-normal text-[#FE4629]/60 tracking-wider uppercase">The</span>
                <div className="font-inter text-xl font-bold text-[#FE4629] tracking-wider mt-1">WEEKLY BUILDS</div>
              </div>
            </div>

            {/* Right - The Newsletter Button */}
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
              <button
                onClick={() => {
                  setIsExitingWeeklyBuilds(true);
                  setTimeout(() => {
                    setShowWeeklyBuildsContent(false);
                    setTimeout(() => {
                      setLogoTransitioned(false);
                      setTimeout(() => {
                        setShowWeeklyBuilds(false);
                        setIsExitingWeeklyBuilds(false);
                      }, 1200);
                    }, 300);
                  }, 1200); // Más tiempo para que se complete la animación de fade-out
                }}
                className={`px-6 py-2 font-inter text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`}
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#FAF5EB',
                  border: '2px solid rgba(250,245,235,0.25)',
                  animationDelay: isExitingWeeklyBuilds ? '0.4s' : '0.4s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAF5EB';
                  e.currentTarget.style.color = '#4B0A23';
                  handleSimpleHover("The Newsletter", "bg-orange-400");
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#FAF5EB';
                  handleSimpleLeave();
                }}
              >
                THE NEWSLETTER
              </button>
            </div>
          </div>

          {/* Weekly Builds Content - Scrollable */}
          <div className="min-h-screen pt-24 pb-20 px-8 max-w-6xl mx-auto overflow-y-auto">
            {/* HOTTEST BUILDS THIS WEEK */}
            <div className={`mb-12 ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '0.2s' : '0.2s' }}>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-inter text-2xl font-bold text-[#FE4629] tracking-wide">HOTTEST BUILDS THIS WEEK</h2>
                <span className={`font-inter text-lg text-[#FE4629] ml-auto ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '0.1s' : '0.1s' }}>[momentum: 847]</span>
              </div>
              
              {/* Product Cards */}
              <div className="space-y-6">
                {/* Released */}
                <div className={`border border-[#FAF5EB]/10 rounded-lg p-6 bg-transparent backdrop-blur-sm ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '0.4s' : '0.4s' }}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-inter text-2xl font-bold text-[#FAF5EB]">1.</span>
                      <img src="/released.png" alt="Released" className="w-12 h-12 rounded-lg" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-inter text-xl font-bold text-[#FE4629]">Released</h3>
                        <div className="flex items-center gap-2">
                          <MomentumLogo state="hot" size={32} />
                          <span className="font-inter text-xl text-[#FE4629]">234</span>
                          <span className="font-inter text-xs uppercase tracking-wider text-transparent bg-clip-text hot-gradient">Hot</span>
                        </div>
                      </div>
                      <p className="font-inter text-sm text-[#FAF5EB]">AI for effortless guest communication & revenue growth</p>
                    </div>
                  </div>
                </div>

                {/* Lero */}
                <div className={`border border-[#FAF5EB]/10 rounded-lg p-6 bg-transparent backdrop-blur-sm ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '0.6s' : '0.6s' }}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-inter text-2xl font-bold text-[#FAF5EB]">2.</span>
                      <img src="/lero.png" alt="Lero" className="w-12 h-12 rounded-lg" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-inter text-xl font-bold text-[#FE4629]">Lero</h3>
                        <div className="flex items-center gap-2">
                          <MomentumLogo state="building" size={32} />
                          <span className="font-inter text-xl text-[#FE4629]">156</span>
                          <span className="font-inter text-xs uppercase tracking-wider text-[#FAF5EB]/60">Rising</span>
                        </div>
                      </div>
                      <p className="font-inter text-sm text-[#FAF5EB]">Zero bounce for founders</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RISING BUILDS */}
            <div className={`mb-12 ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '0.8s' : '0.8s' }}>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-inter text-2xl font-bold text-[#FE4629] tracking-wide">RISING BUILDS</h2>
                <span className={`font-inter text-lg text-[#FE4629] ml-auto ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '0.1s' : '0.1s' }}>[momentum: 200-100]</span>
              </div>
              
              <div className="space-y-6">
                {/* MindDump */}
                <div className={`border border-[#FAF5EB]/10 rounded-lg p-6 bg-transparent backdrop-blur-sm ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '1.0s' : '1.0s' }}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-inter text-2xl font-bold text-[#FAF5EB]">3.</span>
                      <div className="w-12 h-12 bg-[#FAF5EB]/10 rounded-lg flex items-center justify-center">
                        <span className="font-inter text-[#FAF5EB] font-bold text-lg">M</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-inter text-xl font-bold text-[#FE4629]">MindDump</h3>
                        <div className="flex items-center gap-2">
                          <MomentumLogo state="building" size={32} />
                          <span className="font-inter text-xl text-[#FE4629]">189</span>
                          <span className="font-inter text-xs uppercase tracking-wider text-[#FAF5EB]/60">Rising</span>
                        </div>
                      </div>
                      <p className="font-inter text-sm text-[#FAF5EB]">Brain-to-text voice notes</p>
                    </div>
                  </div>
                </div>

                {/* CodeSnap */}
                <div className={`border border-[#FAF5EB]/10 rounded-lg p-6 bg-transparent backdrop-blur-sm ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '1.2s' : '1.2s' }}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-inter text-2xl font-bold text-[#FAF5EB]">4.</span>
                      <div className="w-12 h-12 bg-[#FAF5EB]/10 rounded-lg flex items-center justify-center">
                        <span className="font-inter text-[#FAF5EB] font-bold text-lg">C</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-inter text-xl font-bold text-[#FE4629]">CodeSnap</h3>
                        <div className="flex items-center gap-2">
                          <MomentumLogo state="normal" size={32} />
                          <span className="font-inter text-xl text-[#FE4629]">145</span>
                          <span className="font-inter text-xs uppercase tracking-wider text-[#FAF5EB]/40">Steady</span>
                        </div>
                      </div>
                      <p className="font-inter text-sm text-[#FAF5EB]">Screenshot your code beautifully</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FRESH BUILDS */}
            <div className={`mb-12 ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '1.4s' : '1.4s' }}>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-inter text-2xl font-bold text-[#FE4629] tracking-wide">FRESH BUILDS</h2>
                <span className={`font-inter text-lg text-[#FE4629] ml-auto ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '0.1s' : '0.1s' }}>[momentum: {'<100'}]</span>
              </div>
              
              <div className="space-y-6">
                {/* TaskFlow */}
                <div className={`border border-[#FAF5EB]/10 rounded-lg p-6 bg-transparent backdrop-blur-sm ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '1.6s' : '1.6s' }}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-inter text-2xl font-bold text-[#FAF5EB]">5.</span>
                      <div className="w-12 h-12 bg-[#FAF5EB]/10 rounded-lg flex items-center justify-center">
                        <span className="font-inter text-[#FAF5EB] font-bold text-lg">T</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-inter text-xl font-bold text-[#FE4629]">TaskFlow</h3>
                        <div className="flex items-center gap-2">
                          <MomentumLogo state="building" size={32} />
                          <span className="font-inter text-xl text-[#FE4629]">87</span>
                          <span className="font-inter text-xs uppercase tracking-wider text-[#FAF5EB]/60">Rising</span>
                        </div>
                      </div>
                      <p className="font-inter text-sm text-[#FAF5EB]">Visual project management for teams</p>
                    </div>
                  </div>
                </div>

                {/* DataViz */}
                <div className={`border border-[#FAF5EB]/10 rounded-lg p-6 bg-transparent backdrop-blur-sm ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '1.8s' : '1.8s' }}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-inter text-2xl font-bold text-[#FAF5EB]">6.</span>
                      <div className="w-12 h-12 bg-[#FAF5EB]/10 rounded-lg flex items-center justify-center">
                        <span className="font-inter text-[#FAF5EB] font-bold text-lg">D</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-inter text-xl font-bold text-[#FE4629]">DataViz</h3>
                        <div className="flex items-center gap-2">
                          <MomentumLogo state="normal" size={32} />
                          <span className="font-inter text-xl text-[#FE4629]">65</span>
                          <span className="font-inter text-xs uppercase tracking-wider text-[#FAF5EB]/40">Steady</span>
                        </div>
                      </div>
                      <p className="font-inter text-sm text-[#FAF5EB]">Beautiful charts from any data source</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Live Time */}
          <div className={`fixed bottom-4 right-8 z-40 ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '0.1s' : '0.1s' }}>
            <span 
              className="font-inter text-base font-normal text-[#FE4629] font-mono"
            >
              {currentTime ? formatTimeWithHighlight(currentTime) : '--:--:--'}
            </span>
          </div>
        </>
      )}

      <style jsx>{`
        .hot-gradient {
          background-image: linear-gradient(90deg, #22D3EE, #60A5FA, #8B5CF6, #EC4899);
          animation: hueShift 6s linear infinite;
          background-size: 300% 100%;
        }
        @keyframes hueShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-out {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up-stagger {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes scale-in-modal {
          0% {
            opacity: 0;
            transform: scale(0.7) translateY(50px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes scale-out-modal {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(0.7) translateY(50px);
          }
        }

        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-advanced {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-10px) rotate(5deg) scale(1.05);
          }
          50% {
            transform: translateY(-5px) rotate(0deg) scale(1);
          }
          75% {
            transform: translateY(-15px) rotate(-5deg) scale(0.95);
          }
        }

        @keyframes particle-float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
          }
          50% {
            transform: translateY(-10px) scale(1);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-30px) scale(0.8);
            opacity: 0.4;
          }
        }

        @keyframes pulse-smooth {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-cursor {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        

                .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slide-down 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up-stagger {
          animation: slide-up-stagger 1s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 1.2s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in-modal {
          animation: scale-in-modal 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-out-modal {
          animation: scale-out-modal 0.3s ease-in forwards;
        }

        .animate-float-advanced {
          animation: float-advanced 6s ease-in-out infinite;
        }

        .animate-particle-float {
          animation: particle-float 8s ease-in-out infinite;
        }

        .animate-pulse-smooth {
          animation: pulse-smooth 2s ease-in-out infinite;
        }

        .animate-pulse-cursor {
          animation: pulse-cursor 1s infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-float-particle {
          animation: float-particle 8s ease-in-out infinite;
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) scale(1.2);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-40px) scale(0.8);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-20px) scale(1.1);
            opacity: 0.5;
          }
        }

        @keyframes spring {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-spring {
          animation: spring 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }



        



        .animate-fade-in {
          animation: fade-in-up 0.5s ease-out forwards;
        }

        .animate-fade-out {
          animation: fade-out 0.3s ease-in forwards;
        }

        .placeholder-muted::placeholder {
          color: rgba(254, 70, 41, 0.4);
        }
      `}</style>
    </div>
  )
}
