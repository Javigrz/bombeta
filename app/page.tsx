"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import MomentumLogo from "../components/momentum-logo"
// Eliminar la importación de MomentumLogoHot

// Componente de gráfica de tendencia minimalista
interface MomentumTrendProps {
  data: number[]
  color?: string
  width?: number
  height?: number
}

function MomentumTrend({ data, color = "#FE4629", width = 80, height = 24 }: MomentumTrendProps) {
  if (data.length < 2) return null
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  )
}

// Inline expandable details for ranking products
interface InlineDetailsProps {
  description: string
  categories: string[]
  makers: string
}

function InlineDetails({ description, categories, makers }: InlineDetailsProps) {
  return (
    <div className="mt-3 border-t border-[#FAF5EB]/10 pt-3">
      <p className="font-inter text-sm text-[#FAF5EB] leading-relaxed mb-2">{description}</p>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {categories.map((cat) => (
          <span key={cat} className="px-2 py-1 rounded-md bg-[#FE4629]/20 text-[#FE4629] text-xs font-semibold uppercase border border-[#FE4629]/30">
            {cat}
          </span>
        ))}
      </div>
      <p className="font-inter text-xs text-[#FE4629]">Makers: {makers}</p>
    </div>
  )
}

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
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  
  // Estados para la animación de inicio
  const [introStage, setIntroStage] = useState(0) // 0: negro, 1: naranja, 2: muelle, 3: cambio fondo
  const [introTextComplete, setIntroTextComplete] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // Estado para el hover de productos
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  
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
      // Ocultar header inmediatamente al hacer scroll
      if (window.scrollY > 10) {
        setIsHeaderVisible(false)
      } else {
        setIsHeaderVisible(true)
      }
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
          className={`${logoTransitioned ? 'fixed' : 'absolute'} inset-0 flex items-center justify-center ${logoTransitioned ? 'z-10' : 'z-20'} ${showWeeklyBuildsContent ? 'pointer-events-none' : ''}`}
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
          Every Tuesday 11:00 am
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
              className="absolute top-4 right-4 text-2xl soft-glow-hover"
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
          <div className={`fixed top-4 left-0 w-full z-40 transition-all duration-300 ease-out ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'} ${!isHeaderVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ height: '60px', animationDelay: isExitingWeeklyBuilds ? '0.1s' : '0.1s' }}>
            {/* Left - Join Newsletter Button */}
            <div className={`fixed top-1/2 left-8 transform -translate-y-1/2 z-50 transition-all duration-300 ease-out ${!isHeaderVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <button
                onClick={() => setShowSignup(true)}
                className={`px-6 py-2 font-inter text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`}
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#FE4629',
                  border: '2px solid #FE4629',
                  animationDelay: isExitingWeeklyBuilds ? '0.2s' : '0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FE4629';
                  e.currentTarget.style.color = '#4B0A23';
                  handleSimpleHover("Join the Club", "bg-orange-400");
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#FE4629';
                  handleSimpleLeave();
                }}
              >
                JOIN THE CLUB
              </button>
            </div>

            {/* Center - Weekly Builds Brand */}
            <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-out ${!isHeaderVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className={`text-center ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '0.3s' : '0.3s' }}>
                <span className="font-inter text-sm font-normal text-[#FE4629]/60 tracking-wider uppercase">The</span>
                <div className="font-inter text-xl font-bold text-[#FE4629] tracking-wider mt-1">WEEKLY BUILDS</div>
              </div>
            </div>

            {/* Right - The Newsletter Button */}
            <div className={`fixed top-1/2 right-8 transform -translate-y-1/2 z-50 transition-all duration-300 ease-out ${!isHeaderVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
                  color: '#FE4629',
                  border: '2px solid #FE4629',
                  animationDelay: isExitingWeeklyBuilds ? '0.4s' : '0.4s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FE4629';
                  e.currentTarget.style.color = '#4B0A23';
                  handleSimpleHover("The Newsletter", "bg-orange-400");
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#FE4629';
                  handleSimpleLeave();
                }}
              >
                THE NEWSLETTER
              </button>
            </div>
          </div>

          {/* Weekly Builds Content - Scrollable */}
          <div className="min-h-screen pt-32 pb-20 px-8 max-w-6xl mx-auto overflow-y-auto">
            {/* TOP 3 BUILDS */}
            <div className="mb-16 transition-all duration-1000 ease-out" style={{ 
              opacity: isExitingWeeklyBuilds ? 0 : 1, 
              transform: isExitingWeeklyBuilds ? 'translateY(40px) scale(0.98)' : 'translateY(0) scale(1)',
              animationDelay: isExitingWeeklyBuilds ? '0.1s' : '0.1s'
            }}>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="font-inter text-2xl font-bold text-[#FE4629] tracking-wide transition-all duration-800 ease-out" style={{
                  opacity: isExitingWeeklyBuilds ? 0 : 1, 
                  transform: isExitingWeeklyBuilds ? 'translateY(-15px) scale(0.95)' : 'translateY(0) scale(1)'
                }}>TOP 3 THIS WEEK</h2>
                <span className="font-inter text-lg text-[#FE4629] ml-auto transition-all duration-800 ease-out" style={{
                  opacity: isExitingWeeklyBuilds ? 0 : 1, 
                  transform: isExitingWeeklyBuilds ? 'translateY(-15px) scale(0.95)' : 'translateY(0) scale(1)',
                  animationDelay: isExitingWeeklyBuilds ? '0.05s' : '0.05s'
                }}>[momentum: 847]</span>
              </div>
              
              {/* Top 3 Horizontal Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* 1st Place - Released */}
                                                 <div 
                  className={`border border-[#FE4629]/20 rounded-lg p-12 bg-transparent relative cursor-pointer transition-all duration-700 ease-in-out hover:border-[#FE4629]/40 hover:bg-[#FE4629]/5 hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#FE4629]/10`} 
                  style={{ 
                    opacity: isExitingWeeklyBuilds ? 0 : 1, 
                    transform: isExitingWeeklyBuilds ? 'translateY(30px) scale(0.92) rotateX(5deg)' : 'translateY(0) scale(1) rotateX(0deg)',
                    transition: 'all 900ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    animationDelay: isExitingWeeklyBuilds ? '0.2s' : '0.2s'
                  }}
                   onMouseEnter={() => setHoveredProduct('released')}
                   onMouseLeave={() => setHoveredProduct(null)}
                 >
                  <div className="absolute top-4 right-4">
                    <span className="font-inter text-2xl font-light text-[#FE4629]/40">01</span>
                  </div>
                  <div className="text-center">
                    <img src="/released.png" alt="Released" className="w-16 h-16 rounded-lg mx-auto mb-6" />
                    <h3 className="font-inter text-2xl font-bold text-[#FE4629] mb-4">Released</h3>
                                                              <p className="font-inter text-base text-[#FAF5EB] mb-6 leading-relaxed h-12 flex items-center justify-center">AI for effortless guest communication & revenue growth</p>
                     <div className="flex justify-center mb-8">
                       <MomentumTrend data={[180, 195, 210, 225, 234]} color="#FE4629" width={100} height={28} />
                     </div>
                     <div className="flex justify-center">
                       <div className="flex items-center gap-3">
                         <MomentumLogo state="hot" size={36} />
                         <div className="flex flex-col items-start">
                           <div className="flex items-center gap-3">
                             <span className="font-inter text-2xl text-[#FE4629] font-bold">234</span>
                             <span className="font-inter text-sm uppercase tracking-wider text-transparent bg-clip-text hot-gradient">Hot</span>
                           </div>
                           <span className="font-inter text-sm text-[#FE4629] font-semibold">+48 today</span>
                         </div>
                       </div>
                     </div>
                  </div>
                  
                  {/* Complete info overlay */}
                  {hoveredProduct === 'released' && (
                    <div className="absolute inset-0 rounded-lg flex items-end animate-in slide-in-from-bottom-4 duration-300" style={{animation: 'slideIn 300ms ease-in-out forwards'}}>
                      <div className="absolute inset-0 bg-[#4B0A23]/50 backdrop-blur-3xl rounded-lg animate-in fade-in duration-300" style={{animation: 'fadeIn 300ms ease-in-out forwards'}}></div>
                      <div className="relative w-full p-4 bg-gradient-to-t from-[#4B0A23] via-[#4B0A23]/80 to-transparent rounded-b-lg">
                        <p className="font-inter text-sm text-white leading-relaxed mb-3">AI-powered guest communication platform that automates check-ins, handles inquiries, and maximizes revenue through intelligent upselling.</p>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {["AI", "Hospitality", "Revenue"].map((cat) => (
                            <span key={cat} className="px-2 py-1 rounded-md bg-[#FE4629]/20 text-[#FE4629] text-xs font-semibold uppercase border border-[#FE4629]/30">
                              {cat}
                            </span>
                          ))}
                        </div>
                        <p className="font-inter text-xs text-[#FE4629]">Makers: Maria Lopez, James Chen</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2nd Place - Lero */}
                                                 <div 
                  className={`border border-[#FE4629]/20 rounded-lg p-12 bg-transparent relative cursor-pointer transition-all duration-700 ease-in-out hover:border-[#FE4629]/40 hover:bg-[#FE4629]/5 hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#FE4629]/10`} 
                  style={{ 
                    opacity: isExitingWeeklyBuilds ? 0 : 1, 
                    transform: isExitingWeeklyBuilds ? 'translateY(30px) scale(0.92) rotateX(5deg)' : 'translateY(0) scale(1) rotateX(0deg)',
                    transition: 'all 900ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    animationDelay: isExitingWeeklyBuilds ? '0.4s' : '0.4s'
                  }}
                   onMouseEnter={() => setHoveredProduct('lero')}
                   onMouseLeave={() => setHoveredProduct(null)}
                 >
                  <div className="absolute top-4 right-4">
                    <span className="font-inter text-2xl font-light text-[#FAF5EB]/30">02</span>
                  </div>
                  <div className="text-center">
                    <img src="/lero.png" alt="Lero" className="w-16 h-16 rounded-lg mx-auto mb-6" />
                    <h3 className="font-inter text-2xl font-bold text-[#FE4629] mb-4">Lero</h3>
                                                              <p className="font-inter text-base text-[#FAF5EB] mb-6 leading-relaxed h-12 flex items-center justify-center">Zero bounce for founders</p>
                     <div className="flex justify-center mb-8">
                       <MomentumTrend data={[120, 135, 145, 150, 156]} color="#FE4629" width={100} height={28} />
                     </div>
                     <div className="flex justify-center">
                       <div className="flex items-center gap-3">
                         <MomentumLogo state="building" size={36} />
                         <div className="flex flex-col items-start">
                           <div className="flex items-center gap-3">
                             <span className="font-inter text-2xl text-[#FE4629] font-bold">156</span>
                             <span className="font-inter text-sm uppercase tracking-wider text-[#FAF5EB]/60">Rising</span>
                           </div>
                           <span className="font-inter text-sm text-[#FE4629] font-semibold">+32 today</span>
                         </div>
                       </div>
                     </div>
                  </div>
                  
                  {/* Complete info overlay */}
                  {hoveredProduct === 'lero' && (
                    <div className="absolute inset-0 rounded-lg flex items-end animate-in slide-in-from-bottom-4 duration-300" style={{animation: 'slideIn 300ms ease-in-out forwards'}}>
                      <div className="absolute inset-0 bg-[#4B0A23]/50 backdrop-blur-3xl rounded-lg animate-in fade-in duration-300" style={{animation: 'fadeIn 300ms ease-in-out forwards'}}></div>
                      <div className="relative w-full p-4 bg-gradient-to-t from-[#4B0A23] via-[#4B0A23]/80 to-transparent rounded-b-lg">
                        <p className="font-inter text-sm text-white leading-relaxed mb-3">Anti-bounce platform specifically designed for founders. Reduces website abandonment through intelligent engagement flows and personalized retention strategies.</p>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {["Retention", "Analytics", "Founders"].map((cat) => (
                            <span key={cat} className="px-2 py-1 rounded-md bg-[#FE4629]/20 text-[#FE4629] text-xs font-semibold uppercase border border-[#FE4629]/30">
                              {cat}
                            </span>
                          ))}
                        </div>
                        <p className="font-inter text-xs text-[#FE4629]">Makers: Alex Rivera, Sophie Kim</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3rd Place - MindDump */}
                                                 <div 
                  className={`border border-[#FE4629]/20 rounded-lg p-12 bg-transparent relative cursor-pointer transition-all duration-700 ease-in-out hover:border-[#FE4629]/40 hover:bg-[#FE4629]/5 hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#FE4629]/10`} 
                  style={{ 
                    opacity: isExitingWeeklyBuilds ? 0 : 1, 
                    transform: isExitingWeeklyBuilds ? 'translateY(30px) scale(0.92) rotateX(5deg)' : 'translateY(0) scale(1) rotateX(0deg)',
                    transition: 'all 900ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    animationDelay: isExitingWeeklyBuilds ? '0.6s' : '0.6s'
                  }}
                   onMouseEnter={() => setHoveredProduct('minddump')}
                   onMouseLeave={() => setHoveredProduct(null)}
                 >
                  <div className="absolute top-4 right-4">
                    <span className="font-inter text-2xl font-light text-[#FAF5EB]/20">03</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#FE4629] rounded-lg flex items-center justify-center mx-auto mb-6">
                      <span className="font-inter text-[#4B0A23] font-bold text-2xl">M</span>
                    </div>
                    <h3 className="font-inter text-2xl font-bold text-[#FE4629] mb-4">MindDump</h3>
                                                              <p className="font-inter text-base text-[#FAF5EB] mb-6 leading-relaxed h-12 flex items-center justify-center">Brain-to-text voice notes</p>
                     <div className="flex justify-center mb-8">
                       <MomentumTrend data={[125, 130, 138, 142, 145]} color="#FE4629" width={100} height={28} />
                     </div>
                     <div className="flex justify-center">
                       <div className="flex items-center gap-3">
                         <MomentumLogo state="building" size={36} />
                         <div className="flex flex-col items-start">
                           <div className="flex items-center gap-3">
                             <span className="font-inter text-2xl text-[#FE4629] font-bold">145</span>
                             <span className="font-inter text-sm uppercase tracking-wider text-[#FAF5EB]/60">Rising</span>
                           </div>
                           <span className="font-inter text-sm text-[#FE4629] font-semibold">+23 today</span>
                         </div>
                       </div>
                     </div>
                  </div>
                  
                  {/* Complete info overlay */}
                  {hoveredProduct === 'minddump' && (
                    <div className="absolute inset-0 rounded-lg flex items-end animate-in slide-in-from-bottom-4 duration-300" style={{animation: 'slideIn 300ms ease-in-out forwards'}}>
                      <div className="absolute inset-0 bg-[#4B0A23]/50 backdrop-blur-3xl rounded-lg animate-in fade-in duration-300" style={{animation: 'fadeIn 300ms ease-in-out forwards'}}></div>
                      <div className="relative w-full p-4 bg-gradient-to-t from-[#4B0A23] via-[#4B0A23]/80 to-transparent rounded-b-lg">
                        <p className="font-inter text-sm text-white leading-relaxed mb-3">Revolutionary voice-to-text brain dump tool that captures your thoughts instantly. Perfect for brainstorming, meeting notes, and creative ideation with AI-powered organization.</p>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {["Voice AI", "Productivity", "Notes"].map((cat) => (
                            <span key={cat} className="px-2 py-1 rounded-md bg-[#FE4629]/20 text-[#FE4629] text-xs font-semibold uppercase border border-[#FE4629]/30">
                              {cat}
                            </span>
                          ))}
                        </div>
                        <p className="font-inter text-xs text-[#FE4629]">Makers: Sam Taylor, Rachel Park</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

                         {/* RANKING CONTINUATION */}
             <div className={`mb-12 ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '1.0s' : '1.0s' }}>
              
              <div className="space-y-4">
                {/* CodeSnap */}
                                                 <div 
                  className={`border border-[#FAF5EB]/10 rounded-lg p-4 bg-transparent relative cursor-pointer transition-all duration-500 ease-in-out hover:border-[#FE4629]/30 hover:bg-[#FE4629]/5 ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} 
                  style={{ animationDelay: isExitingWeeklyBuilds ? '1.2s' : '1.2s' }}
                   onMouseEnter={() => {
                     console.log('Hover CodeSnap');
                     setHoveredProduct('codesnap');
                   }}
                   onMouseLeave={() => {
                     console.log('Leave CodeSnap');
                     setHoveredProduct(null);
                   }}
                 >
                   <div className="flex items-center gap-4">
                     <div className="flex items-center gap-3">
                       <span className="font-inter text-2xl font-light text-[#FAF5EB]/20 w-8">04</span>
                       <div className="w-10 h-10 bg-[#FAF5EB]/10 rounded-lg flex items-center justify-center">
                         <span className="font-inter text-[#FAF5EB] font-bold text-sm">C</span>
                       </div>
                     </div>
                     <div className="flex-1">
                                              <div className="flex items-center justify-between">
                          <h3 className="font-inter text-xl font-bold text-[#FE4629]">CodeSnap</h3>
                          <div className="flex items-center gap-3">
                            <MomentumTrend data={[110, 125, 135, 140, 145]} color="#FE4629" width={60} height={20} />
                            <div className="flex items-center gap-2">
                              <MomentumLogo state="normal" size={32} />
                              <div className="flex flex-col items-start">
                                <span className="font-inter text-lg text-[#FE4629] font-bold">145</span>
                                <span className="font-inter text-sm text-[#FE4629] font-semibold">+18</span>
                              </div>
                            </div>
                          </div>
                        </div>
                       <p className="font-inter text-sm text-[#FAF5EB]/80">Screenshot your code beautifully</p>
                     </div>
                  </div>
                  
                  {/* Inline details that expand the card */}
                  <div className={`overflow-hidden ${
                    hoveredProduct === 'codesnap' 
                      ? 'expand-animation' 
                      : 'max-h-0 opacity-0'
                  }`}>
                    <InlineDetails
                      description="Create beautiful screenshots of your code with customizable themes, syntax highlighting, and professional formatting."
                      categories={["Developer Tools"]}
                      makers="Sarah Chen, Alex Rodriguez"
                    />
                  </div>
                </div>

                                {/* TaskFlow */}
                <div 
                  className={`border border-[#FAF5EB]/10 rounded-lg p-4 bg-transparent relative cursor-pointer transition-all duration-500 ease-in-out hover:border-[#FE4629]/30 hover:bg-[#FE4629]/5 ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} 
                  style={{ animationDelay: isExitingWeeklyBuilds ? '1.4s' : '1.4s' }}
                  onMouseEnter={() => {
                    console.log('Hover TaskFlow');
                    setHoveredProduct('taskflow');
                  }}
                  onMouseLeave={() => {
                    console.log('Leave TaskFlow');
                    setHoveredProduct(null);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-inter text-2xl font-light text-[#FAF5EB]/20 w-8">05</span>
                      <div className="w-10 h-10 bg-[#FAF5EB]/10 rounded-lg flex items-center justify-center">
                        <span className="font-inter text-[#FAF5EB] font-bold text-sm">T</span>
                      </div>
                    </div>
                    <div className="flex-1">
                                             <div className="flex items-center justify-between">
                        <h3 className="font-inter text-xl font-bold text-[#FE4629]">TaskFlow</h3>
                        <div className="flex items-center gap-3">
                          <MomentumTrend data={[65, 72, 78, 82, 87]} color="#FE4629" width={60} height={20} />
                          <div className="flex items-center gap-2">
                            <MomentumLogo state="building" size={32} />
                            <div className="flex flex-col items-start">
                              <span className="font-inter text-lg text-[#FE4629] font-bold">87</span>
                              <span className="font-inter text-sm text-[#FE4629] font-semibold">+15</span>
                            </div>
                          </div>
                        </div>
                      </div>
                     <p className="font-inter text-sm text-[#FAF5EB]/80">Visual project management for teams</p>
                   </div>
                 </div>
                 
                 {/* Inline details that expand the card */}
                 <div className={`overflow-hidden ${
                   hoveredProduct === 'taskflow' 
                     ? 'expand-animation' 
                     : 'max-h-0 opacity-0'
                 }`}>
                   <InlineDetails
                     description="Streamline your team's workflow with intuitive task management, real-time collaboration, and visual project tracking."
                     categories={["Productivity", "Project Management"]}
                     makers="Marcus Johnson, Emily Zhang"
                   />
                 </div>
               </div>

                                {/* DataViz */}
                <div 
                  className={`border border-[#FAF5EB]/10 rounded-lg p-4 bg-transparent relative cursor-pointer transition-all duration-500 ease-in-out hover:border-[#FE4629]/30 hover:bg-[#FE4629]/5 ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} 
                  style={{ animationDelay: isExitingWeeklyBuilds ? '1.6s' : '1.6s' }}
                  onMouseEnter={() => {
                    console.log('Hover DataViz');
                    setHoveredProduct('dataviz');
                  }}
                  onMouseLeave={() => {
                    console.log('Leave DataViz');
                    setHoveredProduct(null);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-inter text-2xl font-light text-[#FAF5EB]/20 w-8">06</span>
                      <div className="w-10 h-10 bg-[#FAF5EB]/10 rounded-lg flex items-center justify-center">
                        <span className="font-inter text-[#FAF5EB] font-bold text-sm">D</span>
                      </div>
                    </div>
                    <div className="flex-1">
                                             <div className="flex items-center justify-between">
                        <h3 className="font-inter text-xl font-bold text-[#FE4629]">DataViz</h3>
                        <div className="flex items-center gap-3">
                          <MomentumTrend data={[50, 55, 58, 62, 65]} color="#FE4629" width={60} height={20} />
                          <div className="flex items-center gap-2">
                            <MomentumLogo state="normal" size={32} />
                            <div className="flex flex-col items-start">
                              <span className="font-inter text-lg text-[#FE4629] font-bold">65</span>
                              <span className="font-inter text-sm text-[#FE4629] font-semibold">+12</span>
                            </div>
                          </div>
                        </div>
                      </div>
                     <p className="font-inter text-sm text-[#FAF5EB]/80">Beautiful charts from any data source</p>
                   </div>
                 </div>
                 
                 {/* Inline details that expand the card */}
                 <div className={`overflow-hidden ${
                   hoveredProduct === 'dataviz' 
                     ? 'expand-animation' 
                     : 'max-h-0 opacity-0'
                 }`}>
                   <InlineDetails
                     description="Transform raw data into stunning, interactive visualizations. Connect to any data source and create professional charts, dashboards, and reports with zero coding required."
                     categories={["Data", "Analytics"]}
                     makers="David Kim, Lisa Patel"
                   />
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



        



        @keyframes expand-subtle {
          0% {
            opacity: 0;
            max-height: 0;
            transform: translateY(-4px) scale(0.98);
            padding-top: 0;
            margin-top: 0;
          }
          50% {
            opacity: 0.3;
            max-height: 80px;
            transform: translateY(-2px) scale(0.99);
          }
          100% {
            opacity: 1;
            max-height: 200px;
            transform: translateY(0) scale(1);
            padding-top: 12px;
            margin-top: 12px;
          }
        }

        .animate-expand-subtle {
          animation: expand-subtle 1.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
          overflow: hidden;
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

        @keyframes soft-glow {
          0% {
            text-shadow: 0 0 0 rgba(254, 70, 41, 0);
          }
          50% {
            text-shadow: 0 0 6px rgba(254, 70, 41, 0.45);
          }
          100% {
            text-shadow: 0 0 0 rgba(254, 70, 41, 0);
          }
        }

        .soft-glow-hover:hover {
          animation: soft-glow 0.9s ease-out;
        }

        /* FORZAR TRANSICIONES LENTAS PARA OVERLAYS */
        .overlay-transition-slow {
          transition: all 500ms ease-in-out !important;
        }

        .details-transition-slow {
          transition: all 600ms ease-in-out !important;
        }

        /* ANIMACIONES PERSONALIZADAS PARA OVERLAYS */
        @keyframes overlay-fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .overlay-animate {
          animation: overlay-fade-in 500ms ease-in-out !important;
        }

        /* ANIMACIONES PERSONALIZADAS PARA OVERLAYS */
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        /* ANIMACIONES PARA DETALLES EXPANDIBLES */
        @keyframes expandDetails {
          0% {
            max-height: 0;
            opacity: 0;
          }
          100% {
            max-height: 200px;
            opacity: 1;
          }
        }

        .expand-animation {
          animation: expandDetails 400ms ease-in-out forwards;
        }

        /* ANIMACIONES MEJORADAS PARA TOP 3 */
        @keyframes top3-exit {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
          }
          50% {
            opacity: 0.7;
            transform: translateY(15px) scale(0.96) rotateX(2deg);
          }
          100% {
            opacity: 0;
            transform: translateY(30px) scale(0.92) rotateX(5deg);
          }
        }

        .top3-exit-animation {
          animation: top3-exit 900ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes title-exit {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-15px) scale(0.95);
          }
        }

        .title-exit-animation {
          animation: title-exit 800ms ease-out forwards;
        }
      `}</style>
    </div>
  )
}

