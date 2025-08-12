"use client"

import React, { useEffect, useId, useMemo, useRef } from "react"

export type MomentumState = "normal" | "building" | "hot"

interface MomentumLogoProps {
  state: MomentumState
  size?: number
  className?: string
}

/**
 * MomentumLogo: Agujero negro interestelar con 3 estados animados.
 * Adaptado 1:1 del snippet proporcionado por el usuario, encapsulado como componente React.
 */
const MomentumLogo: React.FC<MomentumLogoProps> = ({ state, size = 44, className }) => {
  const id = useId().replace(/:/g, "-")
  const filterId = useMemo(() => `warpEffect-${id}` as const, [id])
  const displacementId = useMemo(() => `displacementMap-${id}` as const, [id])
  const offsetId = useMemo(() => `offsetEffect-${id}` as const, [id])
  const hotGradientId = useMemo(() => `hotGradient-${id}` as const, [id])

  const rootRef = useRef<HTMLDivElement | null>(null)
  const particlesRef = useRef<HTMLDivElement | null>(null)
  const displacementRef = useRef<SVGFEDisplacementMapElement | null>(null)
  const offsetRef = useRef<SVGFEOffsetElement | null>(null)

  // Crear/actualizar partículas y atributos del filtro según el estado
  useEffect(() => {
    const container = rootRef.current
    const particles = particlesRef.current
    if (!container || !particles) return

    // Clase de estado
    container.classList.remove("normal", "building", "hot")
    container.classList.add(state)

    // Limpia partículas
    particles.innerHTML = ""

    const createParticles = (mode: MomentumState) => {
      if (!particles) return
      let numParticles = 0
      let animationName = ""
      let particleColor = "#FAF5EB"
      let particleShadowColor = "rgba(250, 245, 235, 0.7)"

      if (mode === "hot") {
        numParticles = 60
        animationName = "particleSpiral"
        particleColor = "#A78BFA" // violeta
        particleShadowColor = "rgba(96, 165, 250, 0.8)" // azul
      } else if (mode === "normal") {
        numParticles = 20
        animationName = "particleDrift"
        particleColor = "#FAF5EB"
        particleShadowColor = "rgba(250, 245, 235, 0.7)"
      } else {
        // building: sin partículas
        numParticles = 0
      }

      const rect = container.getBoundingClientRect()
      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement("div")
        particle.classList.add("spark-particle")

        if (mode === "hot") {
          const initialRadius = 5 + Math.random() * 20
          const initialAngle = Math.random() * Math.PI * 2
          const startX = 50 + Math.cos(initialAngle) * initialRadius
          const startY = 50 + Math.sin(initialAngle) * initialRadius
          const finalRadius = 0
          const finalAngle = initialAngle + (Math.random() > 0.5 ? 2 * Math.PI : -2 * Math.PI)
          const endX = 50 + Math.cos(finalAngle) * finalRadius
          const endY = 50 + Math.sin(finalAngle) * finalRadius

          particle.style.setProperty("--x", `${((endX - startX) / 100) * rect.width}px`)
          particle.style.setProperty("--y", `${((endY - startY) / 100) * rect.height}px`)
          particle.style.setProperty("left", `${startX}%`)
          particle.style.setProperty("top", `${startY}%`)
          particle.style.animationDelay = `${Math.random() * 2}s`
          particle.style.animation = `${animationName} 3s linear forwards infinite`
        } else if (mode === "normal") {
          const startX = Math.random() * 100
          const startY = Math.random() * 100
          const driftX = (Math.random() - 0.5) * 50
          const driftY = (Math.random() - 0.5) * 50

          particle.style.setProperty("--initial-x", `${startX}%`)
          particle.style.setProperty("--initial-y", `${startY}%`)
          particle.style.setProperty("--drift-x", `${driftX}px`)
          particle.style.setProperty("--drift-y", `${driftY}px`)
          particle.style.setProperty("left", `${startX}%`)
          particle.style.setProperty("top", `${startY}%`)
          particle.style.animationDelay = `${Math.random() * 15}s`
          particle.style.animation = `${animationName} 15s linear infinite`
        }

        particle.style.background = particleColor
        particle.style.boxShadow = `0 0 2px ${particleShadowColor}`
        particles.appendChild(particle)
      }
    }

    // Ajustar filtro según estado
    if (displacementRef.current && offsetRef.current) {
      if (state === "hot") {
        displacementRef.current.setAttribute("scale", "20")
        offsetRef.current.setAttribute("dx", "0")
        offsetRef.current.setAttribute("dy", "0")
      } else {
        displacementRef.current.setAttribute("scale", "0")
        offsetRef.current.setAttribute("dx", "0")
        offsetRef.current.setAttribute("dy", "0")
      }
    }

    createParticles(state)
  }, [state])

  return (
    <div
      className={`momentum-spark ${state} ${className ?? ""}`}
      ref={rootRef}
      style={{ width: size, height: size, position: "relative" }}
    >
      <svg className="spark-svg" viewBox="0 0 100 100" style={{ width: "100%", height: "100%", filter: `url(#${filterId})` }}>
        <defs>
          <filter id={filterId}>
            <feTurbulence
              id={`turbEffect-${id}`}
              type="fractalNoise"
              baseFrequency="0.01 0.01"
              numOctaves={2}
              result="turb"
              seed={0 as unknown as string}
            >
              <animate attributeName="baseFrequency" values="0.01 0.01; 0.03 0.03; 0.01 0.01" dur="8s" repeatCount="indefinite" />
            </feTurbulence>
            <feOffset id={offsetId} dx={0} dy={0} in="turb" result="offsetTurb" ref={offsetRef as any} />
            <feDisplacementMap
              id={displacementId}
              in="SourceGraphic"
              in2="offsetTurb"
              scale={0}
              xChannelSelector="R"
              yChannelSelector="G"
              ref={displacementRef as any}
            />
          </filter>

          {/* Gradiente animado para estado HOT (morado→azul) */}
          <linearGradient id={hotGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%">
              <animate attributeName="stop-color" values="#8B5CF6; #60A5FA; #06B6D4; #8B5CF6" dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%">
              <animate attributeName="stop-color" values="#60A5FA; #06B6D4; #8B5CF6; #60A5FA" dur="6s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>

        {/* Disco de acreción (capas) */}
        <circle className="accretion-disk-layer" cx="50" cy="50" r="40" strokeWidth={4} style={{ transform: "rotate(0deg)" as any, stroke: state === "hot" ? `url(#${hotGradientId})` : "#FE4629" }} />
        <circle className="accretion-disk-layer" cx="50" cy="50" r="35" strokeWidth={4} style={{ transform: "rotate(10deg)" as any, stroke: state === "hot" ? `url(#${hotGradientId})` : "#FE4629" }} />
        <circle className="accretion-disk-layer" cx="50" cy="50" r="30" strokeWidth={4} style={{ transform: "rotate(20deg)" as any, stroke: state === "hot" ? `url(#${hotGradientId})` : "#FE4629" }} />
        <circle className="accretion-disk-layer" cx="50" cy="50" r="25" strokeWidth={4} style={{ transform: "rotate(30deg)" as any, stroke: state === "hot" ? `url(#${hotGradientId})` : "#FE4629" }} />
        <circle className="accretion-disk-layer" cx="50" cy="50" r="20" strokeWidth={4} style={{ transform: "rotate(40deg)" as any, stroke: state === "hot" ? `url(#${hotGradientId})` : "#FE4629" }} />

        {/* Singularidad */}
        <circle className="spark-core" cx="50" cy="50" r="15" fill="transparent" />
      </svg>
      <div className="spark-particles" ref={particlesRef} />

      <style jsx>{`
        .spark-svg { transition: all 0.3s ease; }

        .spark-core { fill: transparent; opacity: 1; transition: all 0.4s ease; transform-origin: center; }
        .accretion-disk-layer { fill: none; stroke: #FE4629; stroke-width: 4; opacity: 0; transform-origin: center; transition: stroke 0.2s ease, opacity 0.4s ease, stroke-width 0.4s ease; animation: none; }

        /* Estado normal */
        .momentum-spark.normal .spark-core { animation: gentlePulseBlackHole 3s ease-in-out infinite; }
        .momentum-spark.normal .accretion-disk-layer { opacity: 0.25; stroke-width: 2; animation: diskNormalRotate 40s linear infinite; }
        .momentum-spark.normal .accretion-disk-layer:nth-child(2) { animation-delay: 0.5s; }
        .momentum-spark.normal .accretion-disk-layer:nth-child(3) { animation-delay: 1s; }
        .momentum-spark.normal .accretion-disk-layer:nth-child(4) { animation-delay: 1.5s; }
        .momentum-spark.normal .accretion-disk-layer:nth-child(5) { animation-delay: 2s; }

        /* Estado building */
        .momentum-spark.building .spark-core { fill: transparent; animation: coreBuildingPulse 2s ease-in-out infinite alternate; }
        .momentum-spark.building .accretion-disk-layer { opacity: 0.85; stroke-width: 4; animation: diskBuildingRotate 2s linear infinite, diskBuildingGlow 1.6s ease-in-out infinite alternate; filter: drop-shadow(0 0 8px rgba(254, 70, 41, 0.5)); }
        .momentum-spark.building .accretion-disk-layer:nth-child(2) { animation-delay: 0.1s; }
        .momentum-spark.building .accretion-disk-layer:nth-child(3) { animation-delay: 0.2s; }
        .momentum-spark.building .accretion-disk-layer:nth-child(4) { animation-delay: 0.3s; }
        .momentum-spark.building .accretion-disk-layer:nth-child(5) { animation-delay: 0.4s; }

        /* Estado hot */
        .momentum-spark.hot .spark-core { fill: transparent; animation: coreHotPulse 0.8s ease-in-out infinite; }
        .momentum-spark.hot .accretion-disk-layer { opacity: 1; stroke-width: 7; animation: diskHotRotate 0.5s linear infinite, diskHotGlow 0.5s ease-in-out infinite alternate; filter: drop-shadow(0 0 30px rgba(99, 102, 241, 0.95)); }
        .momentum-spark.hot .accretion-disk-layer:nth-child(2) { animation-delay: 0.05s; }
        .momentum-spark.hot .accretion-disk-layer:nth-child(3) { animation-delay: 0.1s; }
        .momentum-spark.hot .accretion-disk-layer:nth-child(4) { animation-delay: 0.15s; }
        .momentum-spark.hot .accretion-disk-layer:nth-child(5) { animation-delay: 0.2s; }

        .spark-particles { position: absolute; width: 100%; height: 100%; pointer-events: none; top: 0; left: 0; overflow: hidden; }
        .spark-particle { position: absolute; width: 2px; height: 2px; border-radius: 50%; opacity: 0; transform-origin: center; }

        @keyframes gentlePulseBlackHole { 0%,100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes coreBuildingPulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.07); opacity: 0.95; } }
        @keyframes coreHotPulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.12); opacity: 0.95; } }
        @keyframes diskNormalRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes diskBuildingRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes diskBuildingGlow { 0%,100% { opacity: 0.85; stroke-width: 4; } 50% { opacity: 1; stroke-width: 5; } }
        @keyframes diskHotRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes diskHotGlow { 0%,100% { opacity: 1; stroke-width: 7; } 50% { opacity: 0.95; stroke-width: 8; } }
        @keyframes particleSpiral { 0% { opacity: 0; transform: translate(0,0) scale(0.5); } 10% { opacity: 1; } 90% { opacity: 0; transform: translate(var(--x), var(--y)) scale(0.1); } 100% { opacity: 0; transform: translate(var(--x), var(--y)) scale(0.1); } }
        @keyframes particleDrift { 0% { transform: translate(var(--initial-x), var(--initial-y)) scale(1); opacity: 0.4; } 100% { transform: translate(calc(var(--initial-x) + var(--drift-x)), calc(var(--initial-y) + var(--drift-y))) scale(0.8); opacity: 0.15; } }
      `}</style>
    </div>
  )
}

export default MomentumLogo


