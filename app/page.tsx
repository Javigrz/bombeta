"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"

const STRIPE_URL = "https://buy.stripe.com/00weV5bp38dq7v4dph9EI01"
import MomentumLogo from "../components/momentum-logo"
import { Clock, FileText, GitBranch, RefreshCw, Instagram } from "lucide-react"
import { sendFormEmail } from "./actions/send-email"
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
    position: "",
    language: "en",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)


  // Estados para la animación de inicio
  const [introStage, setIntroStage] = useState(0) // 0: negro, 1: naranja, 2: muelle, 3: cambio fondo
  const [introTextComplete, setIntroTextComplete] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // Estado para el hover de productos
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  // Estados para Weekly Builds
  const [showWeeklyBuilds, setShowWeeklyBuilds] = useState(false)
  const [showWeeklyBuildsContent, setShowWeeklyBuildsContent] = useState(false)
  const [logoTransitioned, setLogoTransitioned] = useState(false)
  const [isExitingWeeklyBuilds, setIsExitingWeeklyBuilds] = useState(false)
  const [isTop3Entering, setIsTop3Entering] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)

  // Estado para la página de El Programa
  const [showPlaybookPage, setShowPlaybookPage] = useState(false)
  const [isExitingPlaybook, setIsExitingPlaybook] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  // Estado para la página de Misión
  const [showMisionPage, setShowMisionPage] = useState(false)
  const [isExitingMision, setIsExitingMision] = useState(false)

  // Estado para la página de Precio
  const [showPrecioPage, setShowPrecioPage] = useState(false)
  const [isExitingPrecio, setIsExitingPrecio] = useState(false)

  // Estado para el modal pre-checkout
  const [showPreCheckoutModal, setShowPreCheckoutModal] = useState(false)

  // Funciones para cerrar páginas con animación
  const closePlaybookPage = useCallback(() => {
    setIsExitingPlaybook(true)
    setTimeout(() => {
      setShowPlaybookPage(false)
      setIsExitingPlaybook(false)
    }, 300)
  }, [])

  const closeMisionPage = useCallback(() => {
    setIsExitingMision(true)
    setTimeout(() => {
      setShowMisionPage(false)
      setIsExitingMision(false)
    }, 300)
  }, [])

  const closePrecioPage = useCallback(() => {
    setIsExitingPrecio(true)
    setTimeout(() => {
      setShowPrecioPage(false)
      setIsExitingPrecio(false)
    }, 300)
  }, [])

  // Feature flag para Weekly Builds
  const showWeeklyBuildsButton = process.env.NEXT_PUBLIC_SHOW_WEEKLY_BUILDS === 'true'

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
              // Primero el logo sube
              setLogoTransitioned(true)
              // Después de que el logo termine de subir, aparece el contenido
              setTimeout(() => {
                setShowMainContent(true)
              }, 1000) // Esperar a que el logo termine de subir (800ms transition + 200ms buffer)
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

  const handleCloseSignupModal = () => {
    setShowSignup(false)
    setFormData({ name: "", email: "", position: "", language: "en" })
    setSubmitMessage(null)
    setFormSubmitted(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const result = await sendFormEmail(formData)

      if (result.success) {
        setFormSubmitted(true)
      } else {
        setSubmitMessage({ type: 'error', text: result.error || 'Error al enviar la solicitud' })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitMessage({ type: 'error', text: 'Error inesperado. Por favor, inténtalo de nuevo.' })
    } finally {
      setIsSubmitting(false)
    }
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
        (showWeeklyBuildsContent || showMainContent) ? 'min-h-screen overflow-y-auto' : 'h-screen overflow-hidden'
      }`}
      style={{
        backgroundColor: mounted && introStage === 3 ? '#4B0A23' : '#000000',
        transition: 'background-color 1s ease-in-out'
      }}
    >
      {/* Estilos para prevenir fondo amarillo del autocompletado */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgba(254, 70, 41, 0.05) inset !important;
          -webkit-text-fill-color: #FE4629 !important;
          caret-color: #FE4629 !important;
          border: 1px solid rgba(254, 70, 41, 0.2) !important;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes stackInPage {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes stackOutPage {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
        }
      `}</style>

      {/* Eliminado MomentumLogoHot */}







        












              {/* Logo único que hace la animación y luego permanece */}
        <div
          className="fixed z-20 flex flex-col items-center"
          style={{
            top: logoTransitioned ? '1rem' : '50%',
            left: '50%',
            transform: logoTransitioned ? 'translateX(-50%)' : 'translate(-50%, -50%)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: showWeeklyBuildsContent ? 'none' : 'auto'
          }}
        >
          <img
            src={mounted && introStage === 0 ? "/javigil_white.svg" : "/javigil.svg"}
            alt="javigil"
            className="cursor-pointer w-[260px] sm:w-[350px] md:w-[500px]"
            onMouseEnter={() => handleSimpleHover("javigil", "bg-orange-400")}
            onMouseLeave={handleSimpleLeave}
            style={{
              height: 'auto',
              transform: mounted && introStage === 2 ? 'scale(1.05)' : logoTransitioned ? 'scale(0.35)' : 'scale(1)',
              transition: introStage === 2 ? 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s ease-in-out',
              opacity: mounted ? 1 : 0
            }}
          />

          {/* Links de navegación - dentro del contenedor del logo */}
          <div
            className="font-inter text-xs md:text-sm"
            style={{
              marginTop: logoTransitioned ? '-0.5rem' : '1rem',
              opacity: logoTransitioned ? 1 : 0,
              visibility: logoTransitioned ? 'visible' : 'hidden',
              transition: 'all 0.8s ease-out 1s, visibility 0s 1s'
            }}
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                setShowMisionPage(true);
              }}
              className="transition-all duration-300 cursor-pointer"
              style={{ color: 'rgba(254, 70, 41, 0.8)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FE4629';
                handleSimpleHover("Misión", "bg-orange-400");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(254, 70, 41, 0.8)';
                handleSimpleLeave();
              }}
            >
              Misión
            </a>
          </div>
        </div>

        {/* Contenido principal (texto, botón) - separado del logo */}
        <div className="relative h-screen flex items-center justify-center px-4" style={{ zIndex: 5 }}>
          <div className="text-center max-w-4xl w-full">
            {/* Título del curso */}
            <div
              className="mb-4"
              style={{
                opacity: showMainContent && !showWeeklyBuilds ? 1 : 0,
                visibility: showMainContent && !showWeeklyBuilds ? 'visible' : 'hidden',
                transition: 'opacity 0.8s ease-out 0.1s, visibility 0s, transform 0.8s ease-out 0.1s',
                transform: showMainContent && !showWeeklyBuilds ? 'translateY(0)' : 'translateY(15px)'
              }}
            >
              <h1 className="font-inter text-3xl md:text-5xl font-bold tracking-tight" style={{ color: '#FE4629' }}>
                THE <span style={{ textShadow: '0 0 20px rgba(254, 70, 41, 0.6)' }}>AI</span> PLAYBOOK
              </h1>
            </div>

            {/* Tagline */}
            <div
              className="font-inter text-base md:text-xl leading-relaxed max-w-2xl mx-auto mb-3 px-2"
              style={{
                color: 'rgba(254, 70, 41, 0.9)',
                opacity: showMainContent && !showWeeklyBuilds ? 1 : 0,
                visibility: showMainContent && !showWeeklyBuilds ? 'visible' : 'hidden',
                transition: 'opacity 0.8s ease-out 0.2s, visibility 0s, transform 0.8s ease-out 0.2s',
                transform: showMainContent && !showWeeklyBuilds ? 'translateY(0)' : 'translateY(15px)'
              }}
            >
              Aprende a{" "}
              <span
                className="font-newsreader italic text-xl md:text-2xl"
                style={{ color: '#FE4629' }}
              >
                construir
              </span>{" "}
              con IA para{" "}
              <span
                className="font-newsreader italic text-xl md:text-2xl"
                style={{ color: '#FE4629' }}
              >
                vivir
              </span>{" "}
              de ello.
            </div>

            {/* Stats */}
            <div
              className="flex flex-wrap gap-2 justify-center mb-8"
              style={{
                opacity: showMainContent && !showWeeklyBuilds ? 1 : 0,
                visibility: showMainContent && !showWeeklyBuilds ? 'visible' : 'hidden',
                transition: 'opacity 0.8s ease-out 0.25s, visibility 0s, transform 0.8s ease-out 0.25s',
                transform: showMainContent && !showWeeklyBuilds ? 'translateY(0)' : 'translateY(15px)'
              }}
            >
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-inter text-sm"
                style={{ backgroundColor: 'rgba(254, 70, 41, 0.07)', color: 'rgba(254, 70, 41, 0.6)', border: '1px solid rgba(254, 70, 41, 0.15)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
                En directo · Videollamada
              </span>
              <span
                className="px-3 py-1.5 rounded-full font-inter text-sm"
                style={{ backgroundColor: 'rgba(254, 70, 41, 0.07)', color: 'rgba(254, 70, 41, 0.6)', border: '1px solid rgba(254, 70, 41, 0.15)' }}
              >
                8 sesiones · 16h
              </span>
              <span
                className="px-3 py-1.5 rounded-full font-inter text-sm"
                style={{ backgroundColor: 'rgba(254, 70, 41, 0.07)', color: 'rgba(254, 70, 41, 0.6)', border: '1px solid rgba(254, 70, 41, 0.15)' }}
              >
                4 semanas
              </span>
            </div>

            {/* Botones */}
            <div
              className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6"
              style={{
                opacity: showMainContent && !showWeeklyBuilds ? 1 : 0,
                visibility: showMainContent && !showWeeklyBuilds ? 'visible' : 'hidden',
                transition: 'opacity 0.8s ease-out 0.3s, visibility 0s, transform 0.8s ease-out 0.3s',
                transform: showMainContent && !showWeeklyBuilds ? 'translateY(0)' : 'translateY(15px)'
              }}
            >
              <button
                onClick={() => setShowPreCheckoutModal(true)}
                className="px-8 md:px-12 py-3 md:py-4 font-inter text-base md:text-lg font-semibold rounded-lg"
                style={{
                  backgroundColor: '#FE4629',
                  color: '#4B0A23',
                  border: '2px solid #FE4629',
                  transition: 'all 0.3s ease',
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
                Reserva tu plaza
              </button>
              <button
                onClick={() => document.getElementById('course-content')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 md:px-12 py-3 md:py-4 font-inter text-base md:text-lg font-semibold rounded-lg"
                style={{
                  backgroundColor: 'transparent',
                  color: '#FE4629',
                  border: '2px solid rgba(254, 70, 41, 0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FE4629';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(254, 70, 41, 0.4)';
                }}
              >
                Más información
              </button>
            </div>

            {/* Próxima edición + precio */}
            <div
              className="font-inter text-sm animate-fade-in-up"
              style={{
                opacity: showMainContent && !showWeeklyBuilds ? 1 : 0,
                visibility: showMainContent && !showWeeklyBuilds ? 'visible' : 'hidden',
                transition: 'opacity 0.8s ease-out 0.4s, visibility 0s, transform 0.8s ease-out 0.4s',
                transform: showMainContent && !showWeeklyBuilds ? 'translateY(0)' : 'translateY(15px)'
              }}
            >
              <span style={{ color: 'rgba(254, 70, 41, 0.55)' }}>Próxima edición: <b>9 marzo</b> · Plazas limitadas · </span>
              <span style={{ color: 'rgba(254, 70, 41, 0.45)', textDecoration: 'line-through' }}>490€</span>
              <span style={{ color: '#FE4629', fontWeight: 700 }}> 390€</span>
              <span style={{ color: 'rgba(254, 70, 41, 0.45)' }}> · Código </span>
              <span
                className="font-mono font-bold tracking-widest px-2 py-0.5 rounded"
                style={{ backgroundColor: 'rgba(254, 70, 41, 0.15)', color: '#FE4629' }}
              >
                EARLY
              </span>
            </div>
          </div>

          {/* Scroll indicator */}
          {showMainContent && !showWeeklyBuilds && (
            <div
              className="absolute bottom-20 left-1/2"
              style={{ transform: 'translateX(-50%)', zIndex: 10 }}
            >
              <style>{`
                @keyframes bounce-down {
                  0%, 100% { transform: translateY(0); opacity: 0.4; }
                  50% { transform: translateY(8px); opacity: 0.9; }
                }
              `}</style>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FE4629"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animation: 'bounce-down 1.6s ease-in-out infinite' }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          )}
        </div>

        {/* Secciones de contenido del curso — scroll */}
        {showMainContent && !showWeeklyBuilds && (
          <>
            {/* INTRO / CONTEXTO */}
            <div id="course-content" className="w-full py-24 px-4 md:px-16" style={{ backgroundColor: '#4B0A23' }}>
              <div className="max-w-3xl mx-auto">
                <p className="font-inter text-xl md:text-2xl leading-relaxed mb-8 font-medium" style={{ color: 'rgba(254, 70, 41, 0.95)' }}>
                  La IA no es el futuro. Es el presente. Y la mayoría de la gente sigue usándola para pedirle recetas a ChatGPT.
                </p>
                <div className="space-y-6 font-inter text-base md:text-lg leading-relaxed" style={{ color: 'rgba(254, 70, 41, 0.7)' }}>
                  <p>Cuando apareció la imprenta, los monjes copiaban tres libros en toda su vida. De repente, podías imprimir esos mismos libros en minutos. Con el ordenador pasó lo mismo. "Me va a quitar el trabajo." Sí, arrasó con trabajos. Pero creó millones que nadie podía ni imaginar.</p>
                  <p>Con la IA está pasando exactamente igual. Los que estén ahí, los que entiendan las herramientas, vean las oportunidades y actúen, se llevan todo. Los demás llegarán tarde.</p>
                  <p className="font-semibold text-lg" style={{ color: '#FE4629' }}>Este curso te pone ahí.</p>
                </div>
                <div className="mt-12 mb-12">
                  <img
                    src="/Diffusion-Innovation-Curve.png"
                    alt="Curva de difusión de innovación"
                    className="w-full max-w-xl mx-auto block rounded-xl"
                    style={{ opacity: 0.9 }}
                  />
                </div>
                <div className="p-6 rounded-2xl" style={{ backgroundColor: 'rgba(254, 70, 41, 0.06)', border: '1px solid rgba(254, 70, 41, 0.15)' }}>
                  <p className="font-inter text-base" style={{ color: 'rgba(254, 70, 41, 0.8)' }}>
                    Ahora mismo estamos en la fase de <span className="font-semibold" style={{ color: '#FE4629' }}>early adopters</span>. La ventana para posicionarte está abierta, pero se cierra rápido. La pregunta no es si la IA va a cambiar las reglas — es si tú vas a estar preparado cuando lo haga.
                  </p>
                </div>
              </div>
            </div>

            {/* LOS 3 BLOQUES — header */}
            <div className="w-full py-16 px-4 md:px-8" style={{ backgroundColor: '#FAEBD7' }}>
              <div className="max-w-3xl mx-auto text-center">
                <p className="font-inter text-xs font-semibold tracking-widest mb-4 uppercase" style={{ color: 'rgba(75, 10, 35, 0.4)' }}>El programa</p>
                <h2 className="font-inter text-4xl md:text-5xl font-bold mb-3" style={{ color: '#4B0A23' }}>Los 3 bloques</h2>
                <p className="font-inter text-base" style={{ color: 'rgba(75, 10, 35, 0.6)' }}>16h · 8 sesiones · 4 semanas</p>
                <div className="flex justify-center mt-4">
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-inter text-sm font-semibold"
                    style={{ backgroundColor: 'rgba(75, 10, 35, 0.08)', color: '#4B0A23', border: '1px solid rgba(75, 10, 35, 0.2)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                    </svg>
                    Todas las sesiones en directo, por videollamada
                  </span>
                </div>
              </div>
            </div>

            {/* 01 · ENTIENDE */}
            <div className="w-full py-16 px-4 md:px-16" style={{ backgroundColor: '#4B0A23' }}>
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <span className="font-inter text-xs font-bold tracking-widest" style={{ color: 'rgba(254, 70, 41, 0.4)' }}>01</span>
                  <h3 className="font-inter text-3xl md:text-4xl font-bold mt-1" style={{ color: '#FE4629' }}>ENTIENDE</h3>
                  <p className="font-inter text-sm mt-2" style={{ color: 'rgba(254, 70, 41, 0.45)' }}>Semana 1 · 2h · 1 sesión</p>
                </div>
                <p className="font-inter text-base md:text-lg mb-8 leading-relaxed" style={{ color: 'rgba(254, 70, 41, 0.85)' }}>
                  Qué es IA, cómo funciona de verdad, y por qué todo lo que lees en redes es la mitad de la historia. No hace falta que seas ingeniero. Pero sí necesitas entender qué hay debajo del capó.
                </p>
                <div className="space-y-3 font-inter text-sm md:text-base" style={{ color: 'rgba(254, 70, 41, 0.65)' }}>
                  <p>- Qué es un modelo de lenguaje, por qué a veces la IA se inventa cosas, qué puede hacer hoy y qué todavía no.</p>
                  <p>- Por qué esto está cambiando más rápido de lo que parece.</p>
                  <p>- Sin tecnicismos innecesarios, sin hype. Lo justo para tener criterio propio.</p>
                </div>
              </div>
            </div>

            {/* 02 · USA */}
            <div className="w-full py-16 px-4 md:px-16" style={{ backgroundColor: '#FAEBD7' }}>
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <span className="font-inter text-xs font-bold tracking-widest" style={{ color: 'rgba(75, 10, 35, 0.35)' }}>02</span>
                  <h3 className="font-inter text-3xl md:text-4xl font-bold mt-1" style={{ color: '#4B0A23' }}>USA</h3>
                  <p className="font-inter text-sm mt-2" style={{ color: 'rgba(75, 10, 35, 0.45)' }}>Semana 2 · 4h · 2 sesiones</p>
                </div>
                <p className="font-inter text-base md:text-lg mb-8 leading-relaxed" style={{ color: 'rgba(75, 10, 35, 0.85)' }}>
                  Las herramientas, los modelos, y qué usar para cada cosa. La parte práctica donde aprendes a usar la IA de verdad.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Modelos: ChatGPT, Claude, Gemini, Deepseek, Kimi. Cuál usar para qué',
                    'Prompting: plantillas que te llevas para siempre',
                    'Imágenes con IA: sin ser diseñador',
                    'Vídeo con IA: contenido, marketing, presentaciones',
                    'No-code y automatización: n8n',
                    'Vibecoding: webs y apps sin escribir código',
                    'Marketing con IA: copy, contenido, campañas',
                    'Productividad: Excel, emails, informes, análisis de datos',
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(75, 10, 35, 0.05)', border: '1px solid rgba(75, 10, 35, 0.08)' }}>
                      <p className="font-inter text-sm leading-snug" style={{ color: 'rgba(75, 10, 35, 0.75)' }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 03 · CREA */}
            <div className="w-full py-16 px-4 md:px-16" style={{ backgroundColor: '#4B0A23' }}>
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <span className="font-inter text-xs font-bold tracking-widest" style={{ color: 'rgba(254, 70, 41, 0.4)' }}>03</span>
                  <h3 className="font-inter text-3xl md:text-4xl font-bold mt-1" style={{ color: '#FE4629' }}>CREA</h3>
                  <p className="font-inter text-sm mt-2" style={{ color: 'rgba(254, 70, 41, 0.45)' }}>Semanas 3 y 4 · 10h · 5 sesiones</p>
                </div>
                <p className="font-inter text-base md:text-lg mb-8 leading-relaxed" style={{ color: 'rgba(254, 70, 41, 0.85)' }}>
                  Aquí es donde todo lo anterior cobra sentido. Aquí montas tu negocio.
                </p>
                <ul className="list-disc list-inside space-y-3 font-inter text-sm md:text-base" style={{ color: 'rgba(254, 70, 41, 0.7)' }}>
                  <li>Ideas de negocio con IA que funcionan ahora mismo. Casos de éxito reales de gente que está facturando con esto.</li>
                  <li>Tú decides qué quieres construir. Y lo construyes. Con asesoramiento personalizado en cada sesión.</li>
                  <li>El objetivo: un MVP real que funciona y que puedes empezar a vender al día siguiente.</li>
                </ul>
                {/* Shark Tank card */}
                <div className="mt-8 p-6 rounded-2xl" style={{
                  backgroundColor: 'rgba(254, 70, 41, 0.1)',
                  border: '2px solid rgba(254, 70, 41, 0.45)',
                }}>
                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    <div className="flex-shrink-0 rounded-xl p-2" style={{ border: '1.5px solid rgba(254, 70, 41, 0.3)' }}>
                      <img
                        src="/shark_tank.png"
                        alt="Shark Tank"
                        className="rounded-lg block w-[140px] sm:w-[200px]"
                      />
                    </div>
                    <div>
                      <p className="font-inter text-xs font-bold tracking-widest uppercase mb-3"
                        style={{ color: 'rgba(254, 70, 41, 0.5)' }}>Sesión final</p>
                      <p className="font-inter text-2xl font-bold mb-3" style={{ color: '#FE4629' }}>
                        Shark Tank
                      </p>
                      <p className="font-inter text-sm md:text-base leading-relaxed"
                        style={{ color: 'rgba(254, 70, 41, 0.75)' }}>
                        Presentas tu proyecto como si estuvieras levantando una ronda. Feedback directo, sin filtros. El momento de la verdad.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUÉ TE LLEVAS */}
            <div className="w-full py-16 px-4 md:px-16" style={{ backgroundColor: '#FAEBD7' }}>
              <div className="max-w-3xl mx-auto">
                <h2 className="font-inter text-3xl md:text-4xl font-bold mb-10 text-center" style={{ color: '#4B0A23' }}>Qué te llevas</h2>
                <div className="space-y-4">
                  {[
                    { title: '8 clases en directo, grabadas para siempre', desc: 'Si te pierdes una, la ves cuando quieras. Si quieres repasar, ahí están.' },
                    { title: 'Cheatsheets y resúmenes de cada sesión', desc: 'Todo lo que hacemos en clase, simplificado en documentos para consultar cuando quieras.' },
                    { title: 'Tu MVP terminado', desc: 'No un ejercicio teórico. Un producto real que puedes empezar a vender.' },
                    { title: 'Red de contactos', desc: 'Gente que está exactamente en el mismo punto que tú. Las mejores oportunidades salen de ahí.' },
                    { title: 'Acceso al club The AI Playbook', desc: 'Actualizaciones por correo para que nunca te quedes atrás. Esto cambia cada 6 meses. Tú sigues al día.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(75, 10, 35, 0.05)', border: '1px solid rgba(75, 10, 35, 0.08)' }}>
                      <div className="flex-shrink-0 mt-0.5">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M3 9l4 4L15 4" stroke="#FE4629" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-inter text-base font-semibold mb-1" style={{ color: '#4B0A23' }}>{item.title}</p>
                        <p className="font-inter text-sm leading-relaxed" style={{ color: 'rgba(75, 10, 35, 0.65)' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECCIÓN EJECUTIVOS */}
            <div className="w-full py-16 px-4 md:px-16" style={{ backgroundColor: '#4B0A23' }}>
              <div className="max-w-3xl mx-auto">
                <div className="p-8 md:p-10 rounded-3xl" style={{ border: '1px solid rgba(254, 70, 41, 0.2)', backgroundColor: 'rgba(254, 70, 41, 0.04)' }}>
                  <p className="font-inter text-xs font-semibold tracking-widest mb-3 uppercase" style={{ color: 'rgba(254, 70, 41, 0.45)' }}>Para directivos y ejecutivos</p>
                  <h3 className="font-inter text-2xl md:text-3xl font-bold mb-4" style={{ color: '#FE4629' }}>¿Lideras una empresa?</h3>
                  <p className="font-inter text-base md:text-lg mb-8 leading-relaxed" style={{ color: 'rgba(254, 70, 41, 0.75)' }}>
                    THE AI PLAYBOOK tiene una versión one-to-one diseñada para ejecutivos y directivos. 20 horas contigo, a tu ritmo, centrado en las decisiones que afectan a tu empresa. Rellena el formulario y contactamos contigo.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <button
                      onClick={() => setShowSignup(true)}
                      className="px-8 py-3 font-inter text-base font-semibold rounded-lg transition-all duration-300"
                      style={{ backgroundColor: '#FE4629', color: '#4B0A23', border: '2px solid #FE4629' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FE4629'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FE4629'; e.currentTarget.style.color = '#4B0A23'; }}
                    >
                      Solicita tu plaza
                    </button>
                    <button
                      onClick={() => setShowPlaybookPage(true)}
                      className="px-8 py-3 font-inter text-base font-semibold rounded-lg transition-all duration-300"
                      style={{ backgroundColor: 'transparent', color: 'rgba(254, 70, 41, 0.7)', border: '2px solid rgba(254, 70, 41, 0.25)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#FE4629'; e.currentTarget.style.borderColor = 'rgba(254, 70, 41, 0.6)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(254, 70, 41, 0.7)'; e.currentTarget.style.borderColor = 'rgba(254, 70, 41, 0.25)'; }}
                    >
                      Ver el programa
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA FINAL */}
            <div className="w-full py-24 px-4 md:px-8 text-center" style={{ backgroundColor: '#4B0A23' }}>
              <div className="max-w-2xl mx-auto">
                <p className="font-inter text-xs font-semibold tracking-widest mb-3 uppercase" style={{ color: 'rgba(254, 70, 41, 0.4)' }}>Próxima edición</p>
                <h2 className="font-inter text-4xl md:text-6xl font-bold mb-2" style={{ color: '#FE4629' }}>9 de marzo</h2>
                <p className="font-inter text-base mb-10" style={{ color: 'rgba(254, 70, 41, 0.5)' }}>Plazas limitadas · descuento de "early adopter"</p>
                <button
                  onClick={() => setShowPreCheckoutModal(true)}
                  className="px-12 py-4 font-inter text-lg font-semibold rounded-lg mb-6 transition-all duration-300"
                  style={{ backgroundColor: '#FE4629', color: '#4B0A23', border: '2px solid #FE4629' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FE4629'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FE4629'; e.currentTarget.style.color = '#4B0A23'; }}
                >
                  Reserva tu plaza
                </button>
                <div className="font-inter text-base" style={{ color: 'rgba(254, 70, 41, 0.55)' }}>
                  <span style={{ textDecoration: 'line-through' }}>490€</span>
                  <span style={{ color: '#FE4629', fontWeight: 700 }}> 390€</span>
                  <span style={{ color: 'rgba(254, 70, 41, 0.4)' }}> · Código </span>
                  <span className="font-mono font-bold tracking-widest px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(254, 70, 41, 0.15)', color: '#FE4629' }}>EARLY</span>
                  <span style={{ color: 'rgba(254, 70, 41, 0.4)' }}> al pagar</span>
                </div>
              </div>
            </div>

            {/* Spacer final */}
            <div className="h-20" style={{ backgroundColor: '#4B0A23' }} />
          </>
        )}

           {/* The Weekly Builds Button */}
           {showWeeklyBuildsButton && (
           <div
             className="fixed top-8 left-8 z-30"
             style={{
               opacity: showMainContent && !showWeeklyBuilds ? 1 : 0,
               visibility: showMainContent && !showWeeklyBuilds ? 'visible' : 'hidden',
               transition: 'opacity 0.8s ease-out 0.1s, visibility 0s, transform 0.8s ease-out 0.1s',
               transform: showMainContent && !showWeeklyBuilds ? 'translateY(0)' : 'translateY(-20px)'
             }}
           >
             <button
               onClick={() => {
                 setShowWeeklyBuilds(true);
                 // Transición del logo después de que el contenido se desvanezca
                 setTimeout(() => {
                   setLogoTransitioned(true);
                   // Mostrar el contenido de Weekly Builds después de que el logo se posicione
                   setTimeout(() => {
                     setShowWeeklyBuildsContent(true);
                     // Activar animación de entrada del TOP 3
                     setTimeout(() => {
                       setIsTop3Entering(true);
                       // Mantener isTop3Entering en true después de la animación
                       setTimeout(() => {
                         // No resetear isTop3Entering, mantenerlo en true
                       }, 1000); // Tiempo suficiente para que se complete la animación
                     }, 300); // Pequeño delay para que el contenido se renderice
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
           )}

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
             {/* Left - Instagram */}
             <div className="absolute bottom-0 left-4 md:left-8">
               <a
                 href="https://www.instagram.com/javiggil/"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="transition-opacity duration-200 hover:opacity-70"
                 style={{ color: '#FE4629' }}
               >
                 <Instagram size={16} />
               </a>
             </div>
             {/* Center - Contact */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
               <a
                 href="mailto:contact@javiggil.com"
                 className="font-inter text-xs transition-opacity duration-200 hover:opacity-70"
                 style={{ color: '#FE4629' }}
               >
                 <span className="hidden sm:inline">¿Tienes alguna duda? Escríbenos → </span>contact@javiggil.com
               </a>
             </div>
             {/* Right - Live Time */}
             <div className="absolute bottom-0 right-4 md:right-8">
               <span
                 className="font-inter text-base font-normal text-[#FE4629] font-mono"
               >
                 {currentTime ? formatTimeWithHighlight(currentTime) : '--:--:--'}
               </span>
             </div>
           </div>



      {/* Enhanced Signup Modal */}
      {showSignup && (
        <div className={`fixed inset-0 flex items-center justify-center z-\[100\] cursor-auto ${signupAnimating ? 'animate-fade-out' : 'animate-fade-in'}`} style={{ backgroundColor: '#4B0A23' }}>
          <div className={`border rounded-2xl p-8 max-w-md w-full mx-4 relative ${signupAnimating ? 'animate-scale-out-modal' : 'animate-scale-in-modal'}`} style={{ backgroundColor: '#4B0A23', borderColor: 'rgba(254, 70, 41, 0.2)', boxShadow: '0 25px 50px -12px rgba(254, 70, 41, 0.1)' }}>
            <button
              onClick={() => {
                setSignupAnimating(true)
                setTimeout(() => {
                  handleCloseSignupModal()
                  setSignupAnimating(false)
                }, 300)
              }}
              className="absolute top-4 right-4 text-2xl soft-glow-hover"
              style={{ color: 'rgba(254, 70, 41, 0.6)' }}
            >
              ×
            </button>

            {formSubmitted ? (
              // Thank you message view
              <div className="py-8">
                {/* Logo javigil centrado */}
                <div className="flex justify-center mb-8 animate-slide-up">
                  <img src="/javigil.svg" alt="javigil" className="h-12 w-auto" />
                </div>

                {/* Icono de éxito */}
                <div className="flex justify-center mb-6 animate-scale-in-modal">
                  <div className="rounded-full p-4" style={{ backgroundColor: 'rgba(254, 70, 41, 0.1)', border: '2px solid rgba(254, 70, 41, 0.3)' }}>
                    <svg className="w-12 h-12" fill="none" stroke="#FE4629" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <h2 className="font-inter text-3xl font-bold mb-4 text-center animate-slide-up" style={{ animationDelay: "0.1s", color: '#FE4629' }}>
                  ¡Gracias por tu solicitud!
                </h2>

                <p className="font-inter text-base mb-6 text-center animate-slide-up leading-relaxed" style={{animationDelay: "0.15s", color: 'rgba(254, 70, 41, 0.85)' }}>
                  Hemos recibido tu solicitud correctamente. Nuestro equipo la revisará y nos pondremos en contacto contigo en menos de <span className="font-semibold" style={{ color: '#FE4629' }}>48 horas</span>.
                </p>

                <p className="font-inter text-sm mb-8 text-center animate-slide-up" style={{animationDelay: "0.2s", color: 'rgba(254, 70, 41, 0.6)' }}>
                  Mientras tanto, revisa tu email por si llegamos antes 😉
                </p>

                <button
                  onClick={() => {
                    setSignupAnimating(true)
                    setTimeout(() => {
                      handleCloseSignupModal()
                      setSignupAnimating(false)
                    }, 300)
                  }}
                  className="w-full py-4 font-inter font-semibold rounded-lg animate-slide-up"
                  style={{
                    animationDelay: "0.3s",
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
                  Cerrar
                </button>
              </div>
            ) : (
              // Original form view
              <>
                {/* Logo javigil centrado */}
                <div className="flex justify-center mb-6 animate-slide-up">
                  <img src="/javigil.svg" alt="javigil" className="h-12 w-auto" />
                </div>

                <h2 className="font-inter text-3xl font-bold mb-2 text-center animate-slide-up" style={{ animationDelay: "0.1s", color: '#FE4629' }}>
                  Solicita tu plaza
                </h2>

                <p className="font-inter text-sm mb-8 text-center animate-slide-up" style={{animationDelay: "0.15s", color: 'rgba(254, 70, 41, 0.7)' }}>
                  Plazas limitadas · Respuesta en 48h
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
              <div className="animate-slide-up" style={{animationDelay: "0.2s"}}>
                <label className="block font-inter text-sm font-medium mb-2" style={{ color: 'rgba(254, 70, 41, 0.9)' }}>Nombre</label>
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
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className="animate-slide-up" style={{animationDelay: "0.3s"}}>
                <label className="block font-inter text-sm font-medium mb-2" style={{ color: 'rgba(254, 70, 41, 0.9)' }}>Email</label>
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
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="animate-slide-up" style={{animationDelay: "0.4s"}}>
                <label className="block font-inter text-sm font-medium mb-2" style={{ color: 'rgba(254, 70, 41, 0.9)' }}>Cargo / Empresa</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-3 font-inter rounded-lg focus:outline-none transition-all duration-300 placeholder-muted"
                  style={{
                    backgroundColor: 'rgba(254, 70, 41, 0.05)',
                    border: '1px solid rgba(254, 70, 41, 0.2)',
                    color: '#FE4629'
                  }}
                  placeholder="CEO en Acme / Director de Ops en..."
                  required
                />
              </div>

              {submitMessage && (
                <div
                  className={`mt-4 p-3 rounded-lg font-inter text-sm text-center animate-slide-up ${
                    submitMessage.type === 'success'
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 font-inter font-semibold rounded-lg mt-6 animate-slide-up disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  animationDelay: "0.5s",
                  backgroundColor: isSubmitting ? 'rgba(254, 70, 41, 0.5)' : '#FE4629',
                  color: '#4B0A23',
                  border: '2px solid #FE4629',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#FE4629';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = '#FE4629';
                    e.currentTarget.style.color = '#4B0A23';
                  }
                }}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Página completa de El Programa / The Playbook */}
      {showPlaybookPage && (
        <div
          className="fixed inset-0 overflow-y-auto"
          style={{
            backgroundColor: '#4B0A23',
            animation: isExitingPlaybook ? 'stackOutPage 0.3s cubic-bezier(0.4, 0, 0.6, 1)' : 'stackInPage 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: isExitingPlaybook ? 60 : 50
          }}
        >
          {/* Logo y menú de navegación */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center" style={{ backgroundColor: 'transparent' }}>
            <img
              src="/javigil.svg"
              alt="javigil"
              onClick={() => closePlaybookPage()}
              className="cursor-pointer"
              style={{
                width: '150px',
                height: 'auto',
              }}
            />

            {/* Menú de navegación debajo del logo */}
            <div className="font-inter text-sm mt-2">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  closePlaybookPage();
                }}
                className="transition-all duration-300 cursor-pointer"
                style={{ color: 'rgba(254, 70, 41, 0.8)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FE4629';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(254, 70, 41, 0.8)';
                }}
              >
                Home
              </a>
            </div>
          </div>

          {/* Contenido con scroll */}
          <div className="pt-32 pb-16">
            {/* Título principal */}
            <div className="px-4 md:px-8 text-center mb-32">
              <h1 className="font-inter text-4xl md:text-6xl font-bold mb-6 mt-12" style={{ color: '#FE4629' }}>
                THE AI PLAYBOOK
              </h1>
              <p className="font-inter text-lg md:text-2xl mb-16" style={{ color: 'rgba(254, 70, 41, 0.8)' }}>
                El <span className="font-newsreader italic">sistema operativo</span> del ejecutivo moderno
              </p>

              {/* One to one */}
              <div className="max-w-5xl mx-auto">
                <h2 className="font-inter text-3xl md:text-5xl font-bold mb-8" style={{ color: '#FE4629' }}>
                  One to one
                </h2>
                <p className="font-inter text-base md:text-xl mb-12" style={{ color: 'rgba(254, 70, 41, 0.75)' }}>
                  20 horas para dominar lo que importa
                </p>

                {/* Grid de 4 pilares preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="font-inter text-2xl font-bold mb-2" style={{ color: '#FE4629' }}>01</div>
                    <div className="font-inter text-lg font-semibold" style={{ color: 'rgba(254, 70, 41, 0.9)' }}>ENTIENDES</div>
                  </div>
                  <div className="text-center">
                    <div className="font-inter text-2xl font-bold mb-2" style={{ color: '#FE4629' }}>02</div>
                    <div className="font-inter text-lg font-semibold" style={{ color: 'rgba(254, 70, 41, 0.9)' }}>CONTROLAS</div>
                  </div>
                  <div className="text-center">
                    <div className="font-inter text-2xl font-bold mb-2" style={{ color: '#FE4629' }}>03</div>
                    <div className="font-inter text-lg font-semibold" style={{ color: 'rgba(254, 70, 41, 0.9)' }}>EJECUTAS</div>
                  </div>
                  <div className="text-center">
                    <div className="font-inter text-2xl font-bold mb-2" style={{ color: '#FE4629' }}>04</div>
                    <div className="font-inter text-lg font-semibold" style={{ color: 'rgba(254, 70, 41, 0.9)' }}>LIDERAS</div>
                  </div>
                </div>
              </div>
            </div>

              {/* Secciones de ancho completo alternando colores */}

            {/* ENTIENDES - Fondo crema */}
            <div className="w-full py-16 px-4 md:px-8" style={{ backgroundColor: '#FAEBD7' }}>
              <div className="max-w-5xl mx-4 md:mx-0 md:ml-[20%] md:mr-auto">
                <h3 className="font-inter text-3xl md:text-4xl font-bold mb-8 text-center md:text-left" style={{ color: '#4B0A23' }}>
                  ENTIENDES
                </h3>
                <div className="space-y-6 font-inter text-base md:text-lg text-center md:text-left" style={{ color: 'rgba(75, 10, 35, 0.9)' }}>
                  <p>Sabrás qué es IA realmente, no el marketing, no el hype, y por qué "inteligencia" es la palabra más engañosa del siglo.</p>
                  <p>Entenderás qué hace tu equipo técnico sin depender de que te lo traduzcan.</p>
                  <p>Distinguirás ML de IA Generativa y sabrás cuándo usar cada una (y cuándo ninguna).</p>
                </div>
              </div>
            </div>

            {/* CONTROLAS - Fondo burdeos */}
            <div className="w-full py-16 px-4 md:px-8" style={{ backgroundColor: '#4B0A23' }}>
              <div className="max-w-5xl mx-4 md:mx-0 md:ml-auto md:mr-[20%]">
                <h3 className="font-inter text-3xl md:text-4xl font-bold mb-8 text-center md:text-right" style={{ color: '#FE4629' }}>
                  CONTROLAS
                </h3>
                <div className="space-y-6 font-inter text-base md:text-lg text-center md:text-right" style={{ color: 'rgba(254, 70, 41, 0.9)' }}>
                  <p>Detectarás humo en cualquier propuesta en los primeros 5 minutos.</p>
                  <p>Sabrás qué preguntar para evaluar proyectos, proveedores y candidatos técnicos.</p>
                  <p>Supervisarás implementaciones sin que te cuenten lo que quieren que sepas.</p>
                  <p>Decidirás inversiones con criterio propio, no con la opinión de quien te vende.</p>
                </div>
              </div>
            </div>

            {/* EJECUTAS - Fondo crema */}
            <div className="w-full py-16 px-4 md:px-8" style={{ backgroundColor: '#FAEBD7' }}>
              <div className="max-w-5xl mx-4 md:mx-0 md:ml-[20%] md:mr-auto">
                <h3 className="font-inter text-3xl md:text-4xl font-bold mb-8 text-center md:text-left" style={{ color: '#4B0A23' }}>
                  EJECUTAS
                </h3>
                <div className="space-y-6 font-inter text-base md:text-lg text-center md:text-left" style={{ color: 'rgba(75, 10, 35, 0.9)' }}>
                  <p>Usarás IA para hacer en 1 hora lo que antes te llevaba un día.</p>
                  <p>Optimizarás tu trabajo y el de tu equipo con herramientas que ya existen.</p>
                  <p>Automatizarás tareas repetitivas que hoy te roban tiempo.</p>
                </div>
              </div>
            </div>

            {/* LIDERAS - Fondo burdeos */}
            <div className="w-full py-16 px-4 md:px-8" style={{ backgroundColor: '#4B0A23' }}>
              <div className="max-w-5xl mx-4 md:mx-0 md:ml-auto md:mr-[20%]">
                <h3 className="font-inter text-3xl md:text-4xl font-bold mb-8 text-center md:text-right" style={{ color: '#FE4629' }}>
                  LIDERAS
                </h3>
                <div className="space-y-6 font-inter text-base md:text-lg text-center md:text-right" style={{ color: 'rgba(254, 70, 41, 0.9)' }}>
                  <p>Serás el que guía conversaciones de IA, no el que asiente sin entender.</p>
                  <p>Contratarás talento técnico sabiendo quién sabe realmente y quién vende humo.</p>
                  <p>Estarás donde hay que estar mientras el mundo se transforma.</p>
                </div>
              </div>
            </div>

            {/* QUÉ TE LLEVAS - Recuadro crema centrado */}
            <div className="w-full py-16 px-4 md:px-8 flex justify-center">
              <div className="max-w-6xl w-full p-6 md:p-16 rounded-3xl" style={{ backgroundColor: '#FAEBD7' }}>
                <h2 className="font-inter text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: '#4B0A23' }}>
                  QUÉ TE LLEVAS
                </h2>

                {/* Grid de 4 columnas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* 20 horas */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#4B0A23' }}>
                      <Clock size={48} style={{ color: '#FE4629' }} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-inter text-2xl font-bold mb-3" style={{ color: '#4B0A23' }}>
                      20h 1a1
                    </h3>
                    <p className="font-inter text-sm leading-relaxed" style={{ color: 'rgba(75, 10, 35, 0.7)' }}>
                      Formación presencial o remota. Uno a uno
                    </p>
                  </div>

                  {/* Cheatsheets */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#4B0A23' }}>
                      <FileText size={48} style={{ color: '#FE4629' }} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-inter text-2xl font-bold mb-3" style={{ color: '#4B0A23' }}>
                      Cheatsheets
                    </h3>
                    <p className="font-inter text-sm leading-relaxed" style={{ color: 'rgba(75, 10, 35, 0.7)' }}>
                      Las reglas simplificadas para no depender de tu memoria
                    </p>
                  </div>

                  {/* Decision Trees */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#4B0A23' }}>
                      <GitBranch size={48} style={{ color: '#FE4629' }} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-inter text-2xl font-bold mb-3" style={{ color: '#4B0A23' }}>
                      Decision Trees
                    </h3>
                    <p className="font-inter text-sm leading-relaxed" style={{ color: 'rgba(75, 10, 35, 0.7)' }}>
                      Árboles de decisión para cada tipo de problema
                    </p>
                  </div>

                  {/* Actualizaciones */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#4B0A23' }}>
                      <RefreshCw size={48} style={{ color: '#FE4629' }} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-inter text-2xl font-bold mb-3" style={{ color: '#4B0A23' }}>
                      Actualizaciones
                    </h3>
                    <p className="font-inter text-sm leading-relaxed" style={{ color: 'rgba(75, 10, 35, 0.7)' }}>
                      Esto cambia cada 6 meses. Tú no te quedas atrás con actualizaciones semanales
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Final - precio + botón */}
            <div className="w-full py-16 px-4 md:px-8 flex justify-center">
              <div className="max-w-md w-full px-8 py-10 rounded-3xl text-center" style={{ backgroundColor: '#FAEBD7' }}>
                <p className="font-inter text-xs font-semibold tracking-widest mb-4 uppercase" style={{ color: 'rgba(75, 10, 35, 0.4)' }}>Inversión</p>
                <h2 className="font-inter text-5xl md:text-6xl font-bold mb-1" style={{ color: '#4B0A23' }}>1.890€</h2>
                <p className="font-inter text-sm mb-8" style={{ color: 'rgba(75, 10, 35, 0.5)' }}>IVA incluido · One to one · 20h</p>
                <button
                  onClick={() => setShowSignup(true)}
                  className="w-full py-3 font-inter text-base font-semibold rounded-lg transition-all duration-300 mb-3"
                  style={{ backgroundColor: '#FE4629', color: '#FAEBD7', border: '2px solid #FE4629' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FE4629'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FE4629'; e.currentTarget.style.color = '#FAEBD7'; }}
                >
                  Solicita tu plaza
                </button>
                <p className="font-inter text-xs" style={{ color: 'rgba(75, 10, 35, 0.45)' }}>
                  Plazas limitadas · Te contactamos en menos de 48h
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Página completa de Misión */}
      {showMisionPage && (
        <div
          className="fixed inset-0 overflow-y-auto"
          style={{
            backgroundColor: '#4B0A23',
            animation: isExitingMision ? 'stackOutPage 0.3s cubic-bezier(0.4, 0, 0.6, 1)' : 'stackInPage 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: isExitingMision ? 60 : 50
          }}
        >
          {/* Logo y menú de navegación */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center" style={{ backgroundColor: 'transparent' }}>
            <img
              src="/javigil.svg"
              alt="javigil"
              onClick={() => closeMisionPage()}
              className="cursor-pointer"
              style={{
                width: '150px',
                height: 'auto',
              }}
            />

            {/* Menú de navegación debajo del logo */}
            <div className="font-inter text-sm mt-2">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  closeMisionPage();
                }}
                className="transition-all duration-300 cursor-pointer"
                style={{ color: 'rgba(254, 70, 41, 0.8)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FE4629';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(254, 70, 41, 0.8)';
                }}
              >
                Home
              </a>
            </div>
          </div>

          {/* Contenido con scroll */}
          <div className="pt-24 pb-16">
            {/* SECCIÓN MISIÓN */}
            <div className="w-full py-12 px-4 md:px-8">
              <div className="max-w-4xl mx-auto">
                {/* Headline centrado */}
                <h1 className="font-inter text-3xl md:text-5xl font-bold text-center mb-16 leading-tight" style={{ color: '#FE4629' }}>
                  He visto la IA desde todos los lados. Estoy aquí para que la uses.
                </h1>

                {/* Layout con foto y contenido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-16">
                  {/* Foto */}
                  <div className="flex justify-center md:justify-start">
                    <div className="relative">
                      <img
                        src="/foto_javigil.jpg"
                        alt="Javi Gil"
                        className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl"
                        style={{ filter: 'grayscale(100%)' }}
                      />
                    </div>
                  </div>

                  {/* Narrativa */}
                  <div>
                    <p className="font-inter text-base md:text-lg leading-relaxed" style={{ color: 'rgba(254, 70, 41, 0.85)' }}>
                      Monté mi propia consultora de IA cuando nadie hablaba de esto. Después me dediqué a programar y crear departamentos de inteligencia artificial desde cero en algunas de las empresas más grandes del mundo. Hoy lidero la IA de préstamos de un banco europeo para dos países enteros. Todo, mientras sigo con mis empresas, de IA claro.
                    </p>
                  </div>
                </div>

                {/* Quote destacada */}
                <div className="max-w-4xl mx-auto px-8 py-12 rounded-2xl" style={{ backgroundColor: 'rgba(254, 70, 41, 0.05)' }}>
                  <p className="font-newsreader italic text-xl leading-relaxed" style={{ color: '#FE4629' }}>
                    "Podría quedarme en mi carril. Pero llevo años viendo lo mismo: gente con talento que no sabe cómo aprovechar la IA, o que cree que ya lo hace porque usa ChatGPT. Y me frustra. Porque cuando alguien aprende a usar bien la IA, crece. Y cuando la gente crece, la rueda gira para todos. Ese es mi por qué. Este curso es el cómo."
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Final */}
            <div className="text-center mt-4">
              <button
                onClick={() => setShowPreCheckoutModal(true)}
                className="font-inter text-xl font-semibold w-full sm:w-auto px-8 sm:px-12 py-4 rounded-lg mb-4 transition-all duration-300"
                style={{
                  backgroundColor: '#FE4629',
                  color: '#4B0A23',
                  border: '2px solid #FE4629',
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
                Reserva tu plaza
              </button>
              <p className="font-inter text-sm mb-1" style={{ color: 'rgba(254, 70, 41, 0.55)' }}>
                <b>9 marzo</b> · Plazas limitadas ·{' '}
                <span style={{ textDecoration: 'line-through' }}>490€</span>
                <span style={{ color: '#FE4629', fontWeight: 700 }}> 390€</span>
              </p>
              <p className="font-inter text-xs" style={{ color: 'rgba(254, 70, 41, 0.6)' }}>
                Código{' '}
                <span className="font-mono font-bold tracking-widest px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(254, 70, 41, 0.15)', color: '#FE4629' }}>
                  EARLY
                </span>
                {' '}al pagar
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Página completa de Precio */}
      {showPrecioPage && (
        <div
          className="fixed inset-0 overflow-y-auto"
          style={{
            backgroundColor: '#4B0A23',
            animation: isExitingPrecio ? 'stackOutPage 0.3s cubic-bezier(0.4, 0, 0.6, 1)' : 'stackInPage 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: isExitingPrecio ? 60 : 50
          }}
        >
          {/* Logo y menú de navegación */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center" style={{ backgroundColor: 'transparent' }}>
            <img
              src="/javigil.svg"
              alt="javigil"
              onClick={() => closePrecioPage()}
              className="cursor-pointer"
              style={{
                width: '150px',
                height: 'auto',
              }}
            />

            {/* Menú de navegación debajo del logo */}
            <div className="font-inter text-sm mt-2">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  closePrecioPage();
                }}
                className="transition-all duration-300 cursor-pointer"
                style={{ color: 'rgba(254, 70, 41, 0.8)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FE4629';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(254, 70, 41, 0.8)';
                }}
              >
                Home
              </a>
              <span style={{ color: 'rgba(254, 70, 41, 0.8)' }}> · </span>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  setIsExitingPrecio(true);
                  setShowPlaybookPage(true);
                  setTimeout(() => {
                    setShowPrecioPage(false);
                    setIsExitingPrecio(false);
                  }, 300);
                }}
                className="transition-all duration-300 cursor-pointer"
                style={{ color: 'rgba(254, 70, 41, 0.8)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FE4629';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(254, 70, 41, 0.8)';
                }}
              >
                El Programa
              </a>
              <span style={{ color: 'rgba(254, 70, 41, 0.8)' }}> · </span>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  setIsExitingPrecio(true);
                  setShowMisionPage(true);
                  setTimeout(() => {
                    setShowPrecioPage(false);
                    setIsExitingPrecio(false);
                  }, 300);
                }}
                className="transition-all duration-300 cursor-pointer"
                style={{ color: 'rgba(254, 70, 41, 0.8)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FE4629';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(254, 70, 41, 0.8)';
                }}
              >
                Misión
              </a>
            </div>
          </div>

          {/* Contenido con scroll */}
          <div className="pt-40 pb-8">
            {/* SECCIÓN PRECIO */}
            <div className="w-full px-4 md:px-8">
              <div className="max-w-2xl mx-auto">
                {/* Card de Precio */}
                <div className="px-6 md:px-10 py-10 rounded-3xl" style={{ backgroundColor: '#FAEBD7' }}>
                  {/* Precio */}
                  <div className="text-center mb-8">
                    <h1 className="font-inter text-4xl md:text-6xl font-bold mb-2" style={{ color: '#4B0A23' }}>
                      1.890€
                    </h1>
                    <p className="font-inter text-base" style={{ color: 'rgba(75, 10, 35, 0.7)' }}>
                      IVA incluido
                    </p>
                  </div>

                  {/* Lista de beneficios */}
                  <div className="space-y-4 mb-8">
                    {/* 20h formación */}
                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(254, 70, 41, 0.08)' }}>
                      <h3 className="font-inter text-lg font-bold mb-1" style={{ color: '#4B0A23' }}>
                        20h de formación one-to-one
                      </h3>
                      <p className="font-inter text-sm" style={{ color: 'rgba(75, 10, 35, 0.7)' }}>
                        Presencial u online, como te venga mejor
                      </p>
                    </div>

                    {/* Cheatsheets */}
                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(254, 70, 41, 0.08)' }}>
                      <h3 className="font-inter text-lg font-bold mb-1" style={{ color: '#4B0A23' }}>
                        Cheatsheets con las reglas simplificadas
                      </h3>
                      <p className="font-inter text-sm" style={{ color: 'rgba(75, 10, 35, 0.7)' }}>
                        Para que no dependas de tu memoria
                      </p>
                    </div>

                    {/* Árboles de decisión */}
                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(254, 70, 41, 0.08)' }}>
                      <h3 className="font-inter text-lg font-bold mb-1" style={{ color: '#4B0A23' }}>
                        Árboles de decisión
                      </h3>
                      <p className="font-inter text-sm" style={{ color: 'rgba(75, 10, 35, 0.7)' }}>
                        Cada problema tiene su camino
                      </p>
                    </div>

                    {/* Actualizaciones */}
                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(254, 70, 41, 0.08)' }}>
                      <h3 className="font-inter text-lg font-bold mb-1" style={{ color: '#4B0A23' }}>
                        Actualizaciones de por vida
                      </h3>
                      <p className="font-inter text-sm" style={{ color: 'rgba(75, 10, 35, 0.7)' }}>
                        Esto cambia cada 6 meses. Tú no te quedas atrás.
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="text-center">
                    <button
                      onClick={() => setShowPreCheckoutModal(true)}
                      className="font-inter text-lg font-semibold px-10 py-3 rounded-lg transition-all duration-300 mb-3"
                      style={{
                        backgroundColor: '#FE4629',
                        color: '#FAEBD7',
                        border: '2px solid #FE4629',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#FE4629';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FE4629';
                        e.currentTarget.style.color = '#FAEBD7';
                      }}
                    >
                      Reserva tu plaza
                    </button>
                    <p className="font-inter text-sm mb-1" style={{ color: 'rgba(254, 70, 41, 0.55)' }}>
                      <b>9 marzo</b> · Plazas limitadas ·{' '}
                      <span style={{ textDecoration: 'line-through' }}>490€</span>
                      <span style={{ color: '#FE4629', fontWeight: 700 }}> 390€</span>
                    </p>
                    <p className="font-inter text-xs" style={{ color: 'rgba(254, 70, 41, 0.6)' }}>
                      Código{' '}
                      <span className="font-mono font-bold tracking-widest px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(254, 70, 41, 0.15)', color: '#FE4629' }}>
                        EARLY
                      </span>
                      {' '}al pagar
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Builds Content */}
      {showWeeklyBuildsContent && (
        <>
          {/* Weekly Builds Header */}
          <div className={`fixed top-4 left-0 w-full z-40 transition-all duration-300 ease-out ${!isHeaderVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ 
            height: '60px', 
            opacity: isExitingWeeklyBuilds ? 0 : (!isHeaderVisible ? 0 : 1),
            transform: isExitingWeeklyBuilds ? 'translateY(-20px)' : 'translateY(0)',
            transition: isExitingWeeklyBuilds ? 'all 0.2s ease-out' : 'all 0.3s ease-out'
          }}>
            {/* Left - Join Newsletter Button */}
            <div className={`hidden md:block fixed top-1/2 left-8 transform -translate-y-1/2 z-50 transition-all duration-300 ease-out ${!isHeaderVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{
              opacity: isExitingWeeklyBuilds ? 0 : (!isHeaderVisible ? 0 : 1),
              transform: isExitingWeeklyBuilds ? 'translateY(-20px)' : 'translateY(-50%)',
              transition: isExitingWeeklyBuilds ? 'all 0.2s ease-out' : 'all 0.3s ease-out'
            }}>
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
            <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-out ${!isHeaderVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{
              opacity: isExitingWeeklyBuilds ? 0 : (!isHeaderVisible ? 0 : 1),
              transform: isExitingWeeklyBuilds ? 'translate(-50%, -20px)' : 'translate(-50%, -50%)',
              transition: isExitingWeeklyBuilds ? 'all 0.2s ease-out' : 'all 0.3s ease-out'
            }}>
              <div className={`text-center ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '0.3s' : '0.3s' }}>
                <span className="font-inter text-sm font-normal text-[#FE4629]/60 tracking-wider uppercase">The</span>
                <div className="font-inter text-xl font-bold text-[#FE4629] tracking-wider mt-1">WEEKLY BUILDS</div>
              </div>
            </div>

            {/* Right - The Newsletter Button */}
            <div className={`hidden md:block fixed top-1/2 right-8 transform -translate-y-1/2 z-50 transition-all duration-300 ease-out ${!isHeaderVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{
              opacity: isExitingWeeklyBuilds ? 0 : (!isHeaderVisible ? 0 : 1),
              transform: isExitingWeeklyBuilds ? 'translateY(-20px)' : 'translateY(-50%)',
              transition: isExitingWeeklyBuilds ? 'all 0.2s ease-out' : 'all 0.3s ease-out'
            }}>
              <button
                onClick={() => {
                  setIsExitingWeeklyBuilds(true);
                  setIsTop3Entering(false); // Resetear la animación de entrada
                  setTimeout(() => {
                    setShowWeeklyBuildsContent(false);
                    setTimeout(() => {
                      setLogoTransitioned(false);
                      setTimeout(() => {
                        setShowWeeklyBuilds(false);
                        setIsExitingWeeklyBuilds(false);
                      }, 600);
                    }, 150);
                  }, 600); // Reducido de 1200ms a 600ms
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
          <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto overflow-y-auto">
            {/* TOP 3 BUILDS */}
            <div className="mb-16 transition-all duration-1000 ease-out" style={{ 
              opacity: isExitingWeeklyBuilds ? 0 : (isTop3Entering ? 1 : 0), 
              transform: isExitingWeeklyBuilds ? 'translateY(40px) scale(0.98)' : (isTop3Entering ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)'),
              transition: isExitingWeeklyBuilds ? 'all 0.2s ease-out' : (isTop3Entering ? 'all 0.8s ease-out' : 'all 0.8s ease-out'),
              animationDelay: isExitingWeeklyBuilds ? '0.1s' : '0.1s'
            }}>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="font-inter text-2xl font-bold text-[#FE4629] tracking-wide transition-all duration-800 ease-out" style={{
                  opacity: isExitingWeeklyBuilds ? 0 : (isTop3Entering ? 1 : 0), 
                  transform: isExitingWeeklyBuilds ? 'translateY(-15px) scale(0.95)' : (isTop3Entering ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.9)'),
                  transition: isExitingWeeklyBuilds ? 'all 0.2s ease-out' : (isTop3Entering ? 'all 0.6s ease-out 0.2s' : 'all 0.6s ease-out 0.2s')
                }}>TOP 3 THIS WEEK</h2>
                <span className="font-inter text-lg text-[#FE4629] ml-auto transition-all duration-800 ease-out" style={{
                  opacity: isExitingWeeklyBuilds ? 0 : (isTop3Entering ? 1 : 0), 
                  transform: isExitingWeeklyBuilds ? 'translateY(-15px) scale(0.95)' : (isTop3Entering ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.9)'),
                  transition: isExitingWeeklyBuilds ? 'all 0.2s ease-out' : (isTop3Entering ? 'all 0.6s ease-out 0.3s' : 'all 0.6s ease-out 0.3s'),
                  animationDelay: isExitingWeeklyBuilds ? '0.05s' : '0.05s'
                }}>[momentum: 847]</span>
              </div>
              
              {/* Top 3 Horizontal Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* 1st Place - Released */}
                                                 <div
                  className={`border border-[#FE4629]/20 rounded-lg p-6 md:p-12 bg-transparent relative cursor-pointer smooth-hover top3-entry-exit hover:border-[#FE4629]/40 hover:bg-[#FE4629]/5 hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#FE4629]/10`} 
                  style={{ 
                    opacity: isExitingWeeklyBuilds ? 0 : (isTop3Entering ? 1 : 0), 
                    transform: isExitingWeeklyBuilds ? 'translateY(30px) scale(0.92) rotateX(5deg)' : (isTop3Entering ? 'translateY(0) scale(1) rotateX(0deg)' : 'translateY(40px) scale(0.9) rotateX(10deg)'),
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
                  className={`border border-[#FE4629]/20 rounded-lg p-6 md:p-12 bg-transparent relative cursor-pointer smooth-hover top3-entry-exit hover:border-[#FE4629]/40 hover:bg-[#FE4629]/5 hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#FE4629]/10`} 
                  style={{ 
                    opacity: isExitingWeeklyBuilds ? 0 : (isTop3Entering ? 1 : 0), 
                    transform: isExitingWeeklyBuilds ? 'translateY(30px) scale(0.92) rotateX(5deg)' : (isTop3Entering ? 'translateY(0) scale(1) rotateX(0deg)' : 'translateY(40px) scale(0.9) rotateX(10deg)'),
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
                  className={`border border-[#FE4629]/20 rounded-lg p-6 md:p-12 bg-transparent relative cursor-pointer smooth-hover top3-entry-exit hover:border-[#FE4629]/40 hover:bg-[#FE4629]/5 hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#FE4629]/10`} 
                  style={{ 
                    opacity: isExitingWeeklyBuilds ? 0 : (isTop3Entering ? 1 : 0), 
                    transform: isExitingWeeklyBuilds ? 'translateY(30px) scale(0.92) rotateX(5deg)' : (isTop3Entering ? 'translateY(0) scale(1) rotateX(0deg)' : 'translateY(40px) scale(0.9) rotateX(10deg)'),
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
                  className={`border border-[#FAF5EB]/10 rounded-lg p-4 bg-transparent relative cursor-pointer smooth-hover hover:border-[#FE4629]/30 hover:bg-[#FE4629]/5 ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} 
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
                  className={`border border-[#FAF5EB]/10 rounded-lg p-4 bg-transparent relative cursor-pointer smooth-hover hover:border-[#FE4629]/30 hover:bg-[#FE4629]/5 ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} 
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
                  className={`border border-[#FAF5EB]/10 rounded-lg p-4 bg-transparent relative cursor-pointer smooth-hover hover:border-[#FE4629]/30 hover:bg-[#FE4629]/5 ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} 
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
          <div className={`fixed bottom-4 right-4 md:right-8 z-40 ${isExitingWeeklyBuilds ? 'animate-fade-out' : 'animate-fade-in-up'}`} style={{ animationDelay: isExitingWeeklyBuilds ? '0.1s' : '0.1s' }}>
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

        /* FORZAR TRANSICIONES DE HOVER */
        .top3-card {
          transition: all 0.3s ease-out !important;
        }
        .top3-card:hover {
          transition: all 0.3s ease-out !important;
        }
        .weekly-card {
          transition: all 0.3s ease-out !important;
        }
        .weekly-card:hover {
          transition: all 0.3s ease-out !important;
        }
        
        /* ANIMACIONES SMOOTH PARA HOVER */
        .smooth-hover {
          transition: border-color 0.3s ease-out, 
                      background-color 0.3s ease-out, 
                      transform 0.3s ease-out, 
                      box-shadow 0.3s ease-out !important;
        }
        
        .smooth-hover:hover {
          transition: border-color 0.3s ease-out, 
                      background-color 0.3s ease-out, 
                      transform 0.3s ease-out, 
                      box-shadow 0.3s ease-out !important;
        }
        
        /* ANIMACIONES DE ENTRADA/SALIDA PARA TOP 3 */
        .top3-entry-exit {
          transition: opacity 0.8s ease-out, transform 0.8s ease-out !important;
        }
        
        .top3-exiting {
          transition: opacity 0.2s ease-out, transform 0.2s ease-out !important;
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

      {/* Modal pre-checkout */}
      {showPreCheckoutModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowPreCheckoutModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-8 relative"
            style={{ backgroundColor: '#4B0A23', border: '1px solid rgba(254,70,41,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cerrar */}
            <button
              onClick={() => setShowPreCheckoutModal(false)}
              className="absolute top-4 right-4 font-inter text-sm"
              style={{ color: 'rgba(254,70,41,0.5)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#FE4629' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(254,70,41,0.5)' }}
            >
              ✕
            </button>

            <p className="font-inter text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'rgba(254,70,41,0.45)' }}>
              Antes de pagar
            </p>
            <h2 className="font-inter text-2xl font-bold mb-2" style={{ color: '#FE4629' }}>
              ¿Tienes alguna duda?
            </h2>
            <p className="font-inter text-sm mb-8" style={{ color: 'rgba(254,70,41,0.55)' }}>
              Puedes reservar 15 min conmigo para resolverlas, mandarme un correo, o apuntarte directamente si ya lo tienes claro.
            </p>

            <div className="flex flex-col gap-3">
              {/* Opción 1: Sesión */}
              <a
                href="https://calendar.app.google/yYpUtkcX8qaCgnq28"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-4 rounded-xl font-inter text-sm font-semibold text-center transition-all duration-200 flex items-center gap-3"
                style={{ backgroundColor: 'rgba(254,70,41,0.12)', color: '#FE4629', border: '1px solid rgba(254,70,41,0.25)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(254,70,41,0.2)'; e.currentTarget.style.borderColor = 'rgba(254,70,41,0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(254,70,41,0.12)'; e.currentTarget.style.borderColor = 'rgba(254,70,41,0.25)'; }}
              >
                <div className="text-left">
                  <div>Reservar 15 min conmigo</div>
                  <div className="font-normal text-xs mt-0.5" style={{ color: 'rgba(254,70,41,0.55)' }}>Resuelvo tus dudas antes de que decidas</div>
                </div>
              </a>

              {/* Opción 2: Email */}
              <a
                href="mailto:contact@javiggil.com?subject=Duda%20sobre%20el%20curso"
                className="w-full px-6 py-4 rounded-xl font-inter text-sm font-semibold text-center transition-all duration-200 flex items-center gap-3"
                style={{ backgroundColor: 'rgba(254,70,41,0.12)', color: '#FE4629', border: '1px solid rgba(254,70,41,0.25)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(254,70,41,0.2)'; e.currentTarget.style.borderColor = 'rgba(254,70,41,0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(254,70,41,0.12)'; e.currentTarget.style.borderColor = 'rgba(254,70,41,0.25)'; }}
              >
                <div className="text-left">
                  <div>Mandar un correo</div>
                  <div className="font-normal text-xs mt-0.5" style={{ color: 'rgba(254,70,41,0.55)' }}>contact@javiggil.com</div>
                </div>
              </a>

              {/* Opción 3: Pago directo */}
              <button
                onClick={() => { setShowPreCheckoutModal(false); window.open(STRIPE_URL, '_blank'); }}
                className="w-full px-6 py-4 rounded-xl font-inter text-sm font-semibold transition-all duration-200"
                style={{ backgroundColor: '#FE4629', color: '#4B0A23', border: '2px solid #FE4629' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FE4629'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FE4629'; e.currentTarget.style.color = '#4B0A23'; }}
              >
                Apuntarme directamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

