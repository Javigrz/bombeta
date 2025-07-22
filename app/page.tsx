"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showSignup, setShowSignup] = useState(false)
  const [signupAnimating, setSignupAnimating] = useState(false)
  const [showMainContent, setShowMainContent] = useState(false)
  const [showQuotes, setShowQuotes] = useState(false)
  const [quotesAnimating, setQuotesAnimating] = useState(false)
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
  
  const containerRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const textElementsRef = useRef<(HTMLDivElement | null)[]>([])

  const fullText = "It started with one bold email between founders; today it's the newsletter powering those who build the future."

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
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Advanced typing animation with stagger
  useEffect(() => {
    let currentIndex = 0
    const words = fullText.split(" ")
    let wordIndex = 0

    const typeWords = () => {
      if (wordIndex < words.length) {
        const currentWord = words[wordIndex]
        const wordsToShow = words.slice(0, wordIndex + 1).join(" ")
        setTypedText(wordsToShow)
        wordIndex++
        
        // Pausa dramática después del punto y coma
        if (currentWord.includes(";")) {
          setTimeout(typeWords, 2000) // Pausa de 2 segundos
        } else {
          setTimeout(typeWords, 120 + Math.random() * 80) // Variable timing for natural feel
        }
      } else {
        setIsTypingComplete(true)
        // Pausa después de terminar de escribir
        setTimeout(() => {
          setShowOrangeText(true) // Activar texto naranja
          setTimeout(() => {
            setShowHighlights(true)
            setTimeout(() => {
              setShowMainContent(true)
            }, 1500)
          }, 2000) // Mostrar highlights después de 2 segundos
        }, 1000) // Pausa de 1 segundo después de terminar
      }
    }

    const startTyping = setTimeout(typeWords, 1000)
    return () => clearTimeout(startTyping)
  }, [])

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
                <span style={{ color: '#FAF5EB' }}>{part}</span>
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
      const punctuation = word.match(/[;,.]/) ? word.match(/[;,.]/)[0] : ""

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

  // Typing screen
  if (!showMainContent) {
    return (
      <div className="h-screen w-full relative overflow-hidden bg-black cursor-none flex items-center justify-center">
        {/* Advanced Custom Cursor */}
        <div
          ref={cursorRef}
          className="fixed pointer-events-none z-50 transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x - 16,
            top: mousePosition.y - 16,
            transform: `scale(${cursorScale})`,
          }}
        >
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 bg-orange-600 rounded-full mix-blend-difference animate-pulse-smooth" />
            <div className="absolute inset-0 bg-orange-400 rounded-full mix-blend-difference animate-ping-slow opacity-30" />
          </div>
        </div>

        {/* Breathing background effect */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 87, 51, 0.1) 0%, transparent 50%)`,
            transition: "background 0.3s ease-out"
          }}
        />

        {/* Typing Animation */}
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="font-inter text-2xl md:text-3xl leading-loose" style={{ color: '#FE4629' }}>
            {renderTypedText(typedText)}
            {!isTypingComplete && (
              <span className="animate-pulse-cursor font-bold ml-1" style={{ color: '#FE4629' }}>|</span>
            )}
          </div>
        </div>
      </div>
    )
  }

      return (
      <div ref={containerRef} className="h-screen w-full relative overflow-hidden" style={{ backgroundColor: '#4B0A23' }}>
        
        {/* Custom Cursor Text Only */}
        {cursorText && (
          <div className="fixed pointer-events-none z-50 text-xs font-medium whitespace-nowrap"
               style={{
                 left: mousePosition.x + 10,
                 top: mousePosition.y + 10,
                 color: '#FE4629'
               }}>
            {cursorText}
          </div>
        )}


        








      {/* Top Bar with Hover Effects */}
      <div
        className="absolute top-6 right-6 text-sm font-inter flex items-center gap-6 z-20 animate-slide-down"
        style={{ animationDelay: "0.2s", color: '#FE4629' }}
      >
                 <span 
           className="transition-colors duration-300 cursor-pointer font-mono"
           style={{ color: '#FE4629' }}
           onMouseEnter={() => handleSimpleHover("Live", "bg-orange-400")}
           onMouseLeave={handleSimpleLeave}
         >
           {formatTimeWithHighlight(currentTime)}
         </span>
                 <span 
           className="transition-colors duration-300 cursor-pointer"
           style={{ color: '#FE4629' }}
           onMouseEnter={() => handleSimpleHover("Today", "bg-orange-400")}
           onMouseLeave={handleSimpleLeave}
         >
           {formatDateWithHighlight(currentTime)}
         </span>
      </div>



      {/* Central Logo with Subtle Hover Effects */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center animate-scale-in">
          <div className="flex justify-center items-center mb-8">
            <img 
              src="/Bombeta_white.svg" 
              alt="Bombeta" 
              className="w-[500px] h-auto cursor-pointer"
              onMouseEnter={() => handleSimpleHover("Bombeta", "bg-orange-400")}
              onMouseLeave={handleSimpleLeave}
            />
          </div>

          <div
            className="font-inter text-2xl leading-relaxed max-w-3xl mx-auto mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.2s", color: 'rgba(254, 70, 41, 0.9)' }}
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
              animationDelay: "0.4s", 
              backgroundColor: '#FE4629',
              color: '#4B0A23',
              border: '2px solid #FE4629',
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
            Secure My Spot Now
          </button>

                      {/* Schedule info */}
            <div
              className="font-inter text-sm mt-4 animate-fade-in-up"
              style={{ animationDelay: "0.5s", color: 'rgba(254, 70, 41, 0.7)' }}
            >
              Every Tuesday <span style={{ color: '#FAF5EB' }}>11</span>:00 am
            </div>
        </div>
      </div>

      {/* Simple Features Button */}
      <button
        onClick={() => setShowQuotes(true)}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 w-12 h-12 bg-orange-600 hover:bg-orange-500 transition-colors duration-200 flex items-center justify-center"
        onMouseEnter={() => handleSimpleHover("Features", "bg-orange-400")}
        onMouseLeave={handleSimpleLeave}
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      </button>

      {/* Enhanced Floating Quotes Window */}
      {showQuotes && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 cursor-auto animate-fade-in">
          <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-4xl w-full mx-4 relative shadow-2xl shadow-orange-600/20 animate-scale-in-modal">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setQuotesAnimating(true)
                setTimeout(() => {
                  setShowQuotes(false)
                  setQuotesAnimating(false)
                }, 300)
              }}
              className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl transition-all duration-300 hover:rotate-180 hover:scale-125 z-10"
            >
              ×
            </button>

            {/* Header */}
            <div className="text-center mb-8 animate-slide-up">
              <h2 className="text-white font-inter text-3xl mb-2">
                Why <span className="font-newsreader italic text-orange-600">Bombeta</span>?
              </h2>
              <p className="text-white/70 font-inter text-lg">
                The features that make us different
              </p>
            </div>

            {/* Enhanced Quotes Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Quote 1 */}
              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-orange-600/20 hover:to-orange-400/10 hover:border-orange-400/40 transition-all duration-500 animate-slide-up" style={{animationDelay: "0.1s"}}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors duration-300">
                    <span className="text-orange-400 text-xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-white font-inter text-lg font-semibold mb-2 group-hover:text-orange-100 transition-colors duration-300">
                      Built for <span className="font-newsreader italic text-orange-600">founders</span> who build
                    </h3>
                    <p className="text-white/80 font-inter text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      Specifically designed for ambitious entrepreneurs who are actively building and scaling their ventures.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quote 2 */}
              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-orange-600/20 hover:to-orange-400/10 hover:border-orange-400/40 transition-all duration-500 animate-slide-up" style={{animationDelay: "0.2s"}}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors duration-300">
                    <span className="text-orange-400 text-xl">🛠️</span>
                  </div>
                  <div>
                    <h3 className="text-white font-inter text-lg font-semibold mb-2 group-hover:text-orange-100 transition-colors duration-300">
                      Human playbooks, tested in the trenches
                    </h3>
                    <p className="text-white/80 font-inter text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      Real strategies from operators who've been through the challenges you're facing right now.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quote 3 */}
              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-orange-600/20 hover:to-orange-400/10 hover:border-orange-400/40 transition-all duration-500 animate-slide-up" style={{animationDelay: "0.3s"}}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors duration-300">
                    <span className="text-orange-400 text-xl">✍️</span>
                  </div>
                  <div>
                    <h3 className="text-white font-inter text-lg font-semibold mb-2 group-hover:text-orange-100 transition-colors duration-300">
                      Every word written by operators, not algorithms
                    </h3>
                    <p className="text-white/80 font-inter text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      100% human insights from people who've built successful companies, not AI-generated content.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quote 4 */}
              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-orange-600/20 hover:to-orange-400/10 hover:border-orange-400/40 transition-all duration-500 animate-slide-up" style={{animationDelay: "0.4s"}}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors duration-300">
                    <span className="text-orange-400 text-xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="text-white font-inter text-lg font-semibold mb-2 group-hover:text-orange-100 transition-colors duration-300">
                      Stay two launches ahead of your rivals
                    </h3>
                    <p className="text-white/80 font-inter text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      Get the competitive intelligence and strategic insights that keep you ahead of the competition.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quote 5 */}
              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-orange-600/20 hover:to-orange-400/10 hover:border-orange-400/40 transition-all duration-500 animate-slide-up" style={{animationDelay: "0.5s"}}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors duration-300">
                    <span className="text-orange-400 text-xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-white font-inter text-lg font-semibold mb-2 group-hover:text-orange-100 transition-colors duration-300">
                      Weekly tactics to ship faster & scale smarter
                    </h3>
                    <p className="text-white/80 font-inter text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      Actionable strategies delivered every week to accelerate your product development and growth.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quote 6 */}
              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-orange-600/20 hover:to-orange-400/10 hover:border-orange-400/40 transition-all duration-500 animate-slide-up" style={{animationDelay: "0.6s"}}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors duration-300">
                    <span className="text-orange-400 text-xl">👥</span>
                  </div>
                  <div>
                    <h3 className="text-white font-inter text-lg font-semibold mb-2 group-hover:text-orange-100 transition-colors duration-300">
                      Trusted by 8,000+ <span className="font-newsreader italic text-orange-600">founders</span> & VCs
                    </h3>
                    <p className="text-white/80 font-inter text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      Join a proven community of successful entrepreneurs and investors. Delivered Tuesdays at 11:00.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer CTA */}
            <div className="text-center mt-8 animate-slide-up" style={{animationDelay: "0.7s"}}>
              <button
                onClick={() => {
                  setShowQuotes(false)
                  setShowSignup(true)
                }}
                className="group/cta px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-black font-inter font-semibold rounded-xl hover:from-orange-500 hover:to-orange-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-600/30"
              >
                <span className="group-hover/cta:tracking-wider transition-all duration-300">
                  Join the Community
                </span>
              </button>
            </div>

          </div>
        </div>
      )}

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

      <style jsx>{`
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
