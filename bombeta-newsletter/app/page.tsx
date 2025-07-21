"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showSignup, setShowSignup] = useState(false)
  const [showMainContent, setShowMainContent] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [showHighlights, setShowHighlights] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    language: "en",
  })
  const containerRef = useRef<HTMLDivElement>(null)

  const fullText =
    "It started with one bold email between founders; today it's the newsletter powering those who build the future."

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Typing animation effect - letter by letter
  useEffect(() => {
    let currentIndex = 0

    const typeLetters = () => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
        setTimeout(typeLetters, 80) // 80ms per letter for slower typing
      } else {
        setIsTypingComplete(true)
        // Wait 1 second, then highlight words
        setTimeout(() => {
          setShowHighlights(true)
          // Wait 2 more seconds, then show main content
          setTimeout(() => {
            setShowMainContent(true)
          }, 2000)
        }, 1000)
      }
    }

    const startTyping = setTimeout(typeLetters, 1000) // Wait 1 second before starting

    return () => clearTimeout(startTyping)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
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

      if ((cleanWord === "founders" || cleanWord === "newsletter") && showHighlights) {
        return (
          <span key={index}>
            <span className="font-newsreader italic text-orange-600 text-3xl transition-all duration-500">
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
        {/* Custom Cursor for typing screen */}
        <div
          className="fixed w-4 h-4 bg-orange-600 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-100 ease-out"
          style={{
            left: mousePosition.x - 8,
            top: mousePosition.y - 8,
            transform: "scale(1)",
          }}
        />

        {/* Typing Animation */}
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="text-white font-inter text-2xl md:text-3xl leading-relaxed">
            {renderTypedText(typedText)}
            {!isTypingComplete && <span className="animate-pulse text-orange-600 font-bold">|</span>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="h-screen w-full relative overflow-hidden bg-black cursor-none">
      {/* Custom Cursor */}
      <div
        className="fixed w-4 h-4 bg-orange-600 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-100 ease-out animate-fade-in-up"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: "scale(1)",
          animationDelay: "0.1s",
        }}
      />

      {/* Cursor Follower - Large Glow */}
      <div
        className="fixed w-96 h-96 pointer-events-none z-10 transition-all duration-300 ease-out animate-fade-in-up"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background:
            "radial-gradient(circle, rgba(255, 87, 51, 0.1) 0%, rgba(255, 87, 51, 0.05) 30%, transparent 70%)",
          animationDelay: "0.2s",
        }}
      />

      {/* Abstract Floating Elements that React to Cursor */}
      <div className="absolute inset-0">
        {/* Reactive Orbs */}
        <div
          className="absolute w-32 h-32 rounded-full transition-all duration-500 ease-out animate-fade-in-up"
          style={{
            left: "20%",
            top: "15%",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
            transform: `translate(${(mousePosition.x - window.innerWidth * 0.2) * 0.02}px, ${(mousePosition.y - window.innerHeight * 0.15) * 0.02}px)`,
            animationDelay: "0.3s",
          }}
        />

        <div
          className="absolute w-24 h-24 rounded-full transition-all duration-700 ease-out animate-fade-in-up"
          style={{
            right: "25%",
            top: "25%",
            background: "radial-gradient(circle, rgba(255, 87, 51, 0.15) 0%, transparent 70%)",
            transform: `translate(${(mousePosition.x - window.innerWidth * 0.75) * -0.03}px, ${(mousePosition.y - window.innerHeight * 0.25) * -0.03}px)`,
            animationDelay: "0.4s",
          }}
        />

        <div
          className="absolute w-40 h-40 rounded-full transition-all duration-600 ease-out animate-fade-in-up"
          style={{
            left: "60%",
            top: "10%",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)",
            transform: `translate(${(mousePosition.x - window.innerWidth * 0.6) * 0.025}px, ${(mousePosition.y - window.innerHeight * 0.1) * 0.025}px)`,
            animationDelay: "0.5s",
          }}
        />

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full transition-all duration-1000 ease-out animate-fade-in-up"
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + (i % 3) * 20}%`,
              transform: `translate(${(mousePosition.x - window.innerWidth * (0.15 + i * 0.1)) * (0.005 + i * 0.002)}px, ${(mousePosition.y - window.innerHeight * (0.2 + (i % 3) * 0.2)) * (0.005 + i * 0.002)}px)`,
              animationDelay: `${0.6 + i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Top Bar */}
      <div
        className="absolute top-6 right-6 text-white text-sm font-inter flex items-center gap-6 z-20 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <span>{formatDate(currentTime)}</span>
        <span>{formatTime(currentTime)}</span>
        <span>NEWSLETTER</span>
        <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20"></div>
        <div className="w-4 h-4 bg-orange-600/60 transform rotate-45"></div>
      </div>

      {/* Left Side Quotes - Reduced */}
      <div
        className="absolute top-20 left-8 text-white font-inter text-xl z-20 animate-fade-in-up"
        style={{ animationDelay: "0.3s" }}
      >
        <span className="font-newsreader italic text-orange-600">First</span> newsletter for founders
      </div>

      <div
        className="absolute top-48 left-12 text-white/90 font-inter text-lg z-20 animate-fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        <div>Not another ChatGPT newsletter</div>
      </div>

      <div
        className="absolute top-72 left-6 text-white/80 font-inter text-base leading-relaxed z-20 animate-fade-in-up"
        style={{ animationDelay: "0.5s" }}
      >
        <div>Zero AI-generated content</div>
        <div>
          100% <span className="font-newsreader italic text-orange-600">human</span> insights
        </div>
      </div>

      <div
        className="absolute bottom-32 left-10 text-white/70 font-inter text-base leading-relaxed z-20 animate-fade-in-up"
        style={{ animationDelay: "0.6s" }}
      >
        <div>The newsletter your competitors</div>
        <div>Don't want you to read</div>
      </div>

      {/* Right Side Quotes - Reduced */}
      <div
        className="absolute top-80 right-6 text-white/80 font-inter text-lg z-20 animate-fade-in-up"
        style={{ animationDelay: "0.7s" }}
      >
        <div>Weekly insights for</div>
        <div>
          <span className="font-newsreader italic text-orange-600">Founders</span> who ship
        </div>
      </div>

      <div
        className="absolute bottom-40 right-10 text-white/70 font-inter text-base z-20 animate-fade-in-up"
        style={{ animationDelay: "0.8s" }}
      >
        <div>
          What successful <span className="font-newsreader italic text-orange-600">founders</span>
        </div>
        <div>Read every Tuesday</div>
      </div>

      {/* Top Center Quote */}
      <div
        className="absolute top-12 left-1/2 transform -translate-x-1/2 text-white/80 font-inter text-lg text-center z-20 animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div>
          Newsletter for <span className="font-newsreader italic text-orange-600">Founders</span>
        </div>
      </div>

      {/* Central Logo */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-8">
            <span className="font-newsreader italic text-orange-600">Bom</span>
            <span className="font-inter">beta</span>
          </h1>

          {/* Mission Statement Below Logo */}
          <div
            className="text-white/90 font-inter text-2xl leading-relaxed max-w-3xl mx-auto mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div>
              Empowering <span className="font-newsreader italic text-orange-600 text-3xl">founders</span> to build the
              future
            </div>
          </div>

          {/* Animated Join Button */}
          <button
            onClick={() => setShowSignup(true)}
            className="group relative px-12 py-4 bg-transparent border-2 border-orange-600 text-orange-600 font-inter text-lg font-semibold rounded-none transition-all duration-300 hover:bg-orange-600 hover:text-black overflow-hidden animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="relative z-10">Secure My Spot Now</span>
            <div className="absolute inset-0 bg-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>
      </div>

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 cursor-auto">
          <div className="bg-black border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowSignup(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
            >
              ×
            </button>

            <h2 className="text-white font-inter text-2xl mb-2 text-center">
              Join <span className="font-newsreader italic text-orange-600">Bombeta</span>
            </h2>

            <p className="text-white/70 font-inter text-sm mb-6 text-center">Get exclusive insights delivered weekly</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-white/80 font-inter text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white font-inter placeholder-white/40 focus:outline-none focus:border-orange-600 transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-white/80 font-inter text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white font-inter placeholder-white/40 focus:outline-none focus:border-orange-600 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-white/80 font-inter text-sm mb-2">Language</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, language: "en" })}
                    className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
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
                    className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-orange-600 text-black font-inter font-semibold rounded-lg hover:bg-orange-700 transition-colors mt-6"
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

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
