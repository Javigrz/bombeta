"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showSignup, setShowSignup] = useState(false)
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
          setTimeout(typeWords, 1500) // Pausa de 1.5 segundos
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
              <span className="text-orange-400 font-bold">{part}</span>
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
                <span className="text-orange-400 font-bold">{part}</span>
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
          <div className="text-white font-inter text-2xl md:text-3xl leading-relaxed">
            {renderTypedText(typedText)}
            {!isTypingComplete && (
              <span className="animate-pulse-cursor text-orange-600 font-bold ml-1">|</span>
            )}
          </div>
        </div>
      </div>
    )
  }

      return (
      <div ref={containerRef} className="h-screen w-full relative overflow-hidden bg-black cursor-none">
        
        {/* Artistic Reactive Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Primary Reactive Wave */}
          <div 
            className="absolute inset-0 opacity-[0.12] transition-all duration-700 ease-out"
            style={{
              background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 87, 51, 0.15) 0%, rgba(255, 87, 51, 0.05) 30%, transparent 60%)`
            }}
          />
          
          {/* Secondary Subtle Layer */}
          <div 
            className="absolute inset-0 opacity-[0.08] transition-all duration-1000 ease-out"
            style={{
              background: `radial-gradient(1200px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.08) 0%, rgba(255, 87, 51, 0.03) 40%, transparent 70%)`
            }}
          />
          
          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400/30 rounded-full animate-float-particle"
              style={{
                left: `${20 + i * 10}%`,
                top: `${15 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${8 + i * 2}s`
              }}
            />
          ))}
          
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 opacity-[0.02]">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 87, 51, 0.1)" strokeWidth="0.1"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Reactive Ripple Effect */}
          <div 
            className="absolute w-96 h-96 rounded-full opacity-[0.03] transition-all duration-1000 ease-out"
            style={{
              left: mousePosition.x - 192,
              top: mousePosition.y - 192,
              background: `conic-gradient(from 0deg, transparent, rgba(255, 87, 51, 0.1), transparent)`,
              transform: `scale(${isHovering ? 1.2 : 1})`
            }}
          />
        </div>



      {/* Enhanced Custom Cursor with Color Changes */}
      <div
        className="fixed pointer-events-none z-50 transition-all duration-0"
        style={{
          left: mousePosition.x - (isHovering ? 12 : 8),
          top: mousePosition.y - (isHovering ? 12 : 8),
        }}
      >
        <div className={`${isHovering ? 'w-6 h-6' : 'w-4 h-4'} ${cursorColor} rounded-full mix-blend-difference transition-all duration-50`} />
        {cursorText && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-orange-400 text-xs font-medium whitespace-nowrap">
            {cursorText}
          </div>
        )}
      </div>

      {/* Simple Cursor Trail */}
      <div
        className="fixed w-96 h-96 pointer-events-none z-10 transition-all duration-300 ease-out opacity-10"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background: "radial-gradient(circle, rgba(255, 87, 51, 0.1) 0%, rgba(255, 87, 51, 0.05) 30%, transparent 70%)",
        }}
      />

      {/* Enhanced Floating Elements with Parallax */}
      <div className="absolute inset-0">
        {/* Morphing Orbs with Advanced Movement */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full transition-all duration-1000 ease-out animate-float-advanced"
            style={{
              left: `${15 + i * 12}%`,
              top: `${10 + (i % 3) * 25}%`,
              width: `${80 + i * 20}px`,
              height: `${80 + i * 20}px`,
              background: `radial-gradient(circle, ${
                i % 2 === 0 
                  ? 'rgba(255, 255, 255, 0.08)' 
                  : 'rgba(255, 87, 51, 0.12)'
              } 0%, transparent 70%)`,
              transform: `
                translate(
                  ${(mousePosition.x - window.innerWidth * (0.15 + i * 0.12)) * (0.02 + i * 0.005)}px, 
                  ${(mousePosition.y - window.innerHeight * (0.1 + (i % 3) * 0.25)) * (0.02 + i * 0.005)}px
                ) 
                scale(${1 + Math.sin(Date.now() * 0.001 + i) * 0.1})
                rotate(${Date.now() * 0.02 + i * 30}deg)
              `,
              animationDelay: `${i * 0.2}s`,
              filter: `blur(${i % 2}px)`,
            }}
          />
        ))}

        {/* Advanced Floating Particles with Physics */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute transition-all duration-1000 ease-out animate-particle-float"
            style={{
              left: `${10 + i * 7}%`,
              top: `${15 + (i % 4) * 18}%`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: i % 3 === 0 ? '#ff5733' : 'rgba(255, 255, 255, 0.6)',
              borderRadius: '50%',
              transform: `
                translate(
                  ${(mousePosition.x - window.innerWidth * (0.1 + i * 0.07)) * (0.008 + i * 0.003)}px,
                  ${(mousePosition.y - window.innerHeight * (0.15 + (i % 4) * 0.18)) * (0.008 + i * 0.003)}px
                ) 
                scale(${1 + Math.sin(Date.now() * 0.002 + i) * 0.3})
              `,
              animationDelay: `${i * 0.1}s`,
              boxShadow: `0 0 ${4 + i}px rgba(255, 87, 51, 0.4)`,
            }}
          />
        ))}
      </div>

      {/* Top Bar with Hover Effects */}
      <div
        className="absolute top-6 right-6 text-white text-sm font-inter flex items-center gap-6 z-20 animate-slide-down"
        style={{ animationDelay: "0.2s" }}
      >
                 <span 
           className="hover:text-orange-400 transition-colors duration-300 cursor-pointer"
           onMouseEnter={() => handleSimpleHover("Today", "bg-orange-400")}
           onMouseLeave={handleSimpleLeave}
         >
           {formatDateWithHighlight(currentTime)}
         </span>
                 <span 
           className="hover:text-orange-400 transition-colors duration-300 cursor-pointer font-mono"
           onMouseEnter={() => handleSimpleHover("Live", "bg-orange-400")}
           onMouseLeave={handleSimpleLeave}
         >
           {formatTimeWithHighlight(currentTime)}
         </span>
        <span 
          className="hover:text-orange-400 transition-colors duration-300 cursor-pointer tracking-widest"
          onMouseEnter={() => handleSimpleHover("Weekly", "bg-orange-400")}
          onMouseLeave={handleSimpleLeave}
        >
          NEWSLETTER
        </span>
        <div 
          className="w-6 h-6 rounded-full bg-white/10 border border-white/20 hover:bg-orange-400/20 hover:border-orange-400 transition-all duration-300 cursor-pointer"
          onMouseEnter={() => handleSimpleHover("Status", "bg-orange-400")}
          onMouseLeave={handleSimpleLeave}
        ></div>
        <div 
          className="w-4 h-4 bg-orange-600/60 transform rotate-45 hover:rotate-180 hover:bg-orange-400 transition-all duration-500 cursor-pointer"
          onMouseEnter={() => handleSimpleHover("Menu", "bg-orange-400")}
          onMouseLeave={handleSimpleLeave}
        ></div>
      </div>



      {/* Central Logo with Subtle Hover Effects */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center animate-scale-in">
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-8">
            <span 
              className="font-newsreader italic text-orange-600 hover:text-orange-400 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => handleSimpleHover("Bom", "bg-orange-400")}
              onMouseLeave={handleSimpleLeave}
            >
              Bom
            </span>
            <span 
              className="font-inter hover:text-orange-100 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => handleSimpleHover("beta", "bg-orange-400")}
              onMouseLeave={handleSimpleLeave}
            >
              beta
            </span>
          </h1>

          <div
            className="text-white/90 font-inter text-2xl leading-relaxed max-w-3xl mx-auto mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div>
              Empowering <span 
                className="font-newsreader italic text-orange-600 text-3xl hover:text-orange-400 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => handleSimpleHover("Founders", "bg-orange-400")}
                onMouseLeave={handleSimpleLeave}
              >
                founders
              </span> to build the future
            </div>
          </div>

          <button
            onClick={() => setShowSignup(true)}
            className="group/btn relative px-12 py-4 bg-transparent border-2 border-orange-600 text-orange-600 font-inter text-lg font-semibold rounded-none transition-all duration-500 hover:bg-orange-600 hover:text-black overflow-hidden animate-fade-in-up hover:scale-105"
            style={{ animationDelay: "0.4s" }}
            onMouseEnter={() => handleSimpleHover("Click to Join", "bg-green-500")}
            onMouseLeave={handleSimpleLeave}
          >
            <span className="relative z-10 transition-all duration-300 group-hover/btn:tracking-wider">Secure My Spot Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left"></div>
          </button>

                      {/* Schedule info */}
            <div
              className="text-white/70 font-inter text-sm mt-4 animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              Tuesdays <span className="text-orange-400 font-bold">11</span>:<span className="text-orange-400 font-bold">11</span> am
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
                      Join a proven community of successful entrepreneurs and investors. Delivered Tuesdays at 07:00.
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 cursor-auto animate-fade-in">
          <div className="bg-black/90 border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 relative backdrop-blur-md animate-scale-in-modal shadow-2xl shadow-orange-600/10">
            <button
              onClick={() => setShowSignup(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl transition-all duration-300 hover:rotate-180 hover:scale-125"
            >
              ×
            </button>

            <h2 className="text-white font-inter text-2xl mb-2 text-center animate-slide-up">
              Join <span className="font-newsreader italic text-orange-600">Bombeta</span>
            </h2>

            <p className="text-white/70 font-inter text-sm mb-6 text-center animate-slide-up" style={{animationDelay: "0.1s"}}>
              Get exclusive insights delivered weekly
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="animate-slide-up" style={{animationDelay: "0.2s"}}>
                <label className="block text-white/80 font-inter text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white font-inter placeholder-white/40 focus:outline-none focus:border-orange-600 focus:bg-white/10 transition-all duration-300 hover:border-white/40"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="animate-slide-up" style={{animationDelay: "0.3s"}}>
                <label className="block text-white/80 font-inter text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white font-inter placeholder-white/40 focus:outline-none focus:border-orange-600 focus:bg-white/10 transition-all duration-300 hover:border-white/40"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="animate-slide-up" style={{animationDelay: "0.4s"}}>
                <label className="block text-white/80 font-inter text-sm mb-2">Language</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, language: "en" })}
                    className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-all duration-300 hover:scale-105 ${
                      formData.language === "en"
                        ? "border-orange-600 bg-orange-600/10 text-orange-600"
                        : "border-white/20 bg-white/5 text-white/80 hover:border-white/40"
                    }`}
                  >
                    <span className="text-lg">🇺🇸</span>
                    <span className="font-inter text-sm">English</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, language: "es" })}
                    className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-all duration-300 hover:scale-105 ${
                      formData.language === "es"
                        ? "border-orange-600 bg-orange-600/10 text-orange-600"
                        : "border-white/20 bg-white/5 text-white/80 hover:border-white/40"
                    }`}
                  >
                    <span className="text-lg">🇪🇸</span>
                    <span className="font-inter text-sm">Español</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 text-black font-inter font-semibold rounded-lg hover:bg-orange-700 transition-all duration-300 mt-6 hover:scale-105 hover:shadow-lg animate-slide-up"
                style={{animationDelay: "0.5s"}}
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
      `}</style>
    </div>
  )
}
