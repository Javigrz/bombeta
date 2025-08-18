"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import MomentumLogo from "@/components/momentum-logo"
import { motion, useScroll, useTransform } from "framer-motion"

// Simple static product card without entrance animations
const SimpleProductCard = ({ product, index, hoveredProduct, setHoveredProduct, selectedProducts, toggleProductSelection, focusedIndex }: { 
  product: any, 
  index: number,
  hoveredProduct: string | null,
  setHoveredProduct: (id: string | null) => void,
  selectedProducts: Set<string>,
  toggleProductSelection: (id: string) => void,
  focusedIndex: number
}) => {
  const isHovered = hoveredProduct === product.id
  const isFocused = focusedIndex === index
  const isSelected = selectedProducts.has(product.id)
  
  return (
    <div
      className={`relative group ${isFocused ? 'z-10' : ''}`}
      onMouseEnter={() => setHoveredProduct(product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      <div className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer ${
        isHovered || isFocused ? 'border-[#FE4629]/30 bg-[#FE4629]/5' : 'border-[#FAF5EB]/10 bg-transparent'
      } ${isSelected ? 'border-[#FE4629]/50' : ''}`}
           style={{
             backdropFilter: 'blur(10px)',
             transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
             boxShadow: isHovered ? '0 10px 30px rgba(254, 70, 41, 0.1)' : 'none'
           }}>
        {/* Rank badge */}
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#FE4629] rounded-full flex items-center justify-center text-white text-sm font-bold">
          {product.rank}
        </div>

        {/* Checkbox for comparison - only visible on hover */}
        <div className={`absolute top-4 right-4 transition-opacity ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleProductSelection(product.id)}
            className="w-4 h-4 text-[#FE4629] border-[#FAF5EB]/30 rounded focus:ring-[#FE4629]"
          />
        </div>

        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 w-12 h-12 bg-[#FAF5EB]/10 rounded-lg flex items-center justify-center">
            <MomentumLogo />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-inter text-lg font-semibold text-[#FAF5EB] truncate">
                  {product.name}
                </h3>
                <p className="font-inter text-sm text-[#FAF5EB]/70 mt-1">
                  {product.tagline}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.band === 'hot' ? 'bg-[#FE4629]/20 text-[#FE4629]' :
                    product.band === 'rising' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {product.band.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Momentum with mini sparkline */}
              <div className="text-right">
                <div className="font-inter text-xl font-bold text-[#FE4629]">
                  {product.momentum}
                </div>
                <div className="w-16 h-6 mt-1">
                  <Sparkline data={product.momentumHistory} />
                </div>
              </div>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-4">
              <button className="px-3 py-1 bg-[#FE4629] text-white rounded-lg font-inter text-sm font-semibold hover:bg-[#FE4629]/80 transition-colors">
                Open
              </button>
              <button className="px-3 py-1 bg-[#FAF5EB]/10 text-[#FAF5EB] rounded-lg font-inter text-sm font-semibold hover:bg-[#FAF5EB]/20 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// Types
interface Product {
  id: string
  rank: number
  name: string
  tagline: string
  description?: string
  logo?: string
  momentum: number
  momentumChange?: number
  category?: string[]
  makers?: string[]
  band: "hot" | "rising" | "fresh"
  sparklineData?: number[]
}

interface FilterState {
  timeframe: "today" | "week" | "month" | "all"
  sortBy: "momentum" | "votes" | "new" | "velocity"
  view: "list" | "grid"
  categories: string[]
}

// Simple Podium card component
const PodiumCard = ({ product, position }: { product: Product, position: number }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
    >
        {/* Card background with glass effect */}
        <div className={`relative p-8 rounded-2xl border transition-all duration-300 ${
          position === 1 
            ? 'bg-gradient-to-b from-[#FE4629]/10 to-transparent border-[#FE4629]/30' 
            : 'bg-[#FAF5EB]/5 border-[#FAF5EB]/10'
        } ${isHovered ? 'border-[#FE4629]/50 bg-[#FE4629]/5' : ''}`}
             style={{
               backdropFilter: 'blur(20px)',
               boxShadow: isHovered 
                 ? '0 20px 40px rgba(254, 70, 41, 0.1), 0 0 60px rgba(254, 70, 41, 0.05)' 
                 : '0 10px 30px rgba(0, 0, 0, 0.2)'
             }}
        >
          {/* Position badge */}
          <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center font-inter font-bold text-xl ${
            position === 1 ? 'bg-[#FE4629] text-[#4B0A23]' : 'bg-[#FAF5EB]/10 text-[#FE4629]'
          }`}>
            {position}
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            {product.logo ? (
              <img 
                src={product.logo} 
                alt={product.name} 
                className="w-20 h-20 rounded-xl object-cover"
                style={{
                  filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
                }}
              />
            ) : (
              <div className="w-20 h-20 bg-[#FAF5EB]/10 rounded-xl flex items-center justify-center">
                <span className="font-inter text-2xl font-bold text-[#FAF5EB]">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Product info */}
          <h3 className="font-inter text-2xl font-bold text-[#FE4629] text-center mb-2">
            {product.name}
          </h3>
          <p className="font-inter text-sm text-[#FAF5EB]/80 text-center mb-6">
            {product.tagline}
          </p>

          {/* Momentum meter */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <MomentumLogo 
              state={product.momentum > 500 ? "hot" : "building"} 
              size={36} 
            />
            <div className="text-center">
              <div className="font-inter text-2xl font-bold text-[#FE4629]">
                {product.momentum}
              </div>
              <div className="font-inter text-xs text-[#FAF5EB]/60 uppercase tracking-wider">
                momentum
              </div>
            </div>
          </div>

          {/* Sparkline */}
          {product.sparklineData && (
            <div className="flex justify-center mb-4">
              <Sparkline data={product.sparklineData} />
            </div>
          )}

          {/* Quick actions */}
          {isHovered && (
            <div className="flex gap-2 justify-center transition-opacity duration-200">
              <button className="px-4 py-2 bg-[#FE4629] text-[#4B0A23] rounded-lg font-inter text-sm font-semibold hover:bg-[#FE4629]/80 transition-colors">
                Open
              </button>
              <button className="px-4 py-2 bg-[#FAF5EB]/10 text-[#FE4629] rounded-lg font-inter text-sm font-semibold hover:bg-[#FAF5EB]/20 transition-colors">
                Save
              </button>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

// Mock data generator
const generateMockProducts = (): Product[] => {
  const products = [
    {
      id: "1",
      rank: 1,
      name: "Released",
      tagline: "AI for effortless guest communication & revenue growth",
      description: "Automated AI-powered guest messaging platform that handles everything from booking confirmations to personalized recommendations, increasing revenue by 30%.",
      logo: "/released.png",
      momentum: 847,
      momentumChange: 234,
      category: ["AI", "SaaS", "Hospitality"],
      makers: ["John Doe", "Jane Smith"],
      band: "hot" as const,
      sparklineData: [650, 680, 720, 780, 820, 840, 847]
    },
    {
      id: "2",
      rank: 2,
      name: "Lero",
      tagline: "Zero bounce for founders",
      description: "Email verification and validation service designed specifically for startup founders who need reliable communication channels.",
      logo: "/lero.png",
      momentum: 632,
      momentumChange: 156,
      category: ["Email", "Developer Tools"],
      makers: ["Alex Chen"],
      band: "hot" as const,
      sparklineData: [450, 480, 520, 580, 600, 620, 632]
    },
    {
      id: "3",
      rank: 3,
      name: "FlowSync",
      tagline: "Sync your workflow across all devices",
      momentum: 524,
      momentumChange: 189,
      category: ["Productivity", "Cross-platform"],
      makers: ["Sarah Johnson", "Mike Wilson"],
      band: "hot" as const,
      sparklineData: [320, 360, 420, 480, 500, 510, 524]
    },
    {
      id: "4",
      rank: 4,
      name: "MindDump",
      tagline: "Brain-to-text voice notes",
      momentum: 189,
      momentumChange: 89,
      category: ["Productivity", "AI"],
      makers: ["Emma Davis"],
      band: "rising" as const,
      sparklineData: [100, 120, 140, 160, 170, 180, 189]
    },
    {
      id: "5", 
      rank: 5,
      name: "CodeSnap",
      tagline: "Screenshot your code beautifully",
      momentum: 145,
      momentumChange: 45,
      category: ["Developer Tools"],
      makers: ["Tom Anderson"],
      band: "rising" as const,
      sparklineData: [80, 90, 100, 120, 130, 140, 145]
    },
    {
      id: "6",
      rank: 6,
      name: "TaskFlow",
      tagline: "Visual project management for teams",
      momentum: 87,
      momentumChange: 32,
      category: ["Project Management", "Team Collaboration"],
      makers: ["Lisa Wang", "David Kim"],
      band: "fresh" as const,
      sparklineData: [40, 45, 55, 65, 75, 80, 87]
    },
    {
      id: "7",
      rank: 7,
      name: "DataViz",
      tagline: "Beautiful charts from any data source",
      momentum: 65,
      momentumChange: 15,
      category: ["Data Visualization", "Analytics"],
      makers: ["Carlos Rodriguez"],
      band: "fresh" as const,
      sparklineData: [30, 35, 40, 50, 55, 60, 65]
    }
  ]
  
  return products
}

// Sparkline component
const Sparkline = ({ data, color = "#FE4629" }: { data: number[], color?: string }) => {
  const width = 80
  const height = 24
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')
  
  return (
    <svg width={width} height={height} className="opacity-60">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Podium component
const Podium = ({ heroRef, filteredProducts }: { 
  heroRef: React.RefObject<HTMLDivElement>,
  filteredProducts: Product[]
}) => {
  const [hasAnimated, setHasAnimated] = useState(false)
  const topThree = filteredProducts.slice(0, 3)
  
  useEffect(() => {
    if (!hasAnimated) {
      setHasAnimated(true)
    }
  }, [])
  
  return (
    <div 
      ref={heroRef}
      className="relative min-h-[70vh] flex items-center justify-center px-8 py-16 overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
             style={{
               background: `radial-gradient(circle, rgba(254, 70, 41, 0.05) 0%, transparent 70%)`,
               filter: 'blur(60px)'
             }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <motion.h1 
          className="text-center mb-8 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          <span className="font-inter text-xs md:text-sm font-normal text-[#FE4629]/60 tracking-wider uppercase">This Week's</span>
          <div className="font-inter text-3xl md:text-6xl font-bold text-[#FE4629] tracking-tight mt-1 md:mt-2">TOP BUILDS</div>
        </motion.h1>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-end justify-center gap-8">
          {/* 2nd place */}
          {topThree[1] && (
            <motion.div 
              className="flex-1 max-w-sm"
              initial={{ opacity: 0, y: 50 }}
              animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
            >
              <PodiumCard product={topThree[1]} position={2} />
            </motion.div>
          )}

          {/* 1st place */}
          {topThree[0] && (
            <motion.div 
              className="flex-1 max-w-sm transform scale-110"
              initial={{ opacity: 0, y: 50 }}
              animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
            >
              <PodiumCard product={topThree[0]} position={1} />
            </motion.div>
          )}

          {/* 3rd place */}
          {topThree[2] && (
            <motion.div 
              className="flex-1 max-w-sm"
              initial={{ opacity: 0, y: 50 }}
              animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
            >
              <PodiumCard product={topThree[2]} position={3} />
            </motion.div>
          )}
        </div>

        {/* Mobile Layout - Vertical Stack */}
        <div className="md:hidden space-y-4">
          {topThree.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, x: -30 }}
              animate={hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ delay: 0.6 + index * 0.2, duration: 0.5, ease: "easeOut" }}
            >
              <PodiumCard product={product} position={index + 1} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Simplified Product card component without animations
const ProductCard = React.memo(({ product, index, hoveredProduct, setHoveredProduct, selectedProducts, toggleProductSelection, focusedIndex }: { 
  product: Product, 
  index: number,
  hoveredProduct: string | null,
  setHoveredProduct: (id: string | null) => void,
  selectedProducts: Set<string>,
  toggleProductSelection: (id: string) => void,
  focusedIndex: number
}) => {
  const isHovered = hoveredProduct === product.id
  const isFocused = focusedIndex === index
  const isSelected = selectedProducts.has(product.id)
  
  return (
    <div
      className={`relative group ${isFocused ? 'z-10' : ''}`}
      onMouseEnter={() => setHoveredProduct(product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      <div className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer ${
        isHovered || isFocused ? 'border-[#FE4629]/30 bg-[#FE4629]/5' : 'border-[#FAF5EB]/10 bg-transparent'
      } ${isSelected ? 'border-[#FE4629]/50' : ''}`}
           style={{
             backdropFilter: 'blur(10px)',
             transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
             boxShadow: isHovered ? '0 10px 30px rgba(254, 70, 41, 0.1)' : 'none'
           }}>
        {/* Rank badge */}
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#FE4629] rounded-full flex items-center justify-center text-white text-sm font-bold">
          {product.rank}
        </div>

        {/* Checkbox for comparison - only visible on hover */}
        <div className={`absolute top-4 right-4 transition-opacity ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleProductSelection(product.id)}
            className="w-4 h-4 text-[#FE4629] border-[#FAF5EB]/30 rounded focus:ring-[#FE4629]"
          />
        </div>

        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 w-12 h-12 bg-[#FAF5EB]/10 rounded-lg flex items-center justify-center">
            <MomentumLogo />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-inter text-lg font-semibold text-[#FAF5EB] truncate">
                  {product.name}
                </h3>
                <p className="font-inter text-sm text-[#FAF5EB]/70 mt-1">
                  {product.tagline}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.band === 'hot' ? 'bg-[#FE4629]/20 text-[#FE4629]' :
                    product.band === 'rising' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {product.band.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Momentum with mini sparkline */}
              <div className="text-right">
                <div className="font-inter text-xl font-bold text-[#FE4629]">
                  {product.momentum}
                </div>
                <div className="w-16 h-6 mt-1">
                  <Sparkline data={product.momentumHistory} />
                </div>
              </div>
            </div>

            {/* Expanded details on mobile hover/focus */}
            {(isHovered || isFocused) && product.description && (
              <div className="mt-3 md:hidden w-full transition-opacity duration-200" style={{ opacity: isHovered || isFocused ? 1 : 0 }}>
                <p className="font-inter text-sm text-[#FAF5EB]/70 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex gap-2 mt-2">
                  {product.tags?.slice(0, 3).map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-[#FAF5EB]/10 text-[#FAF5EB]/60 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="px-3 py-1 bg-[#FE4629] text-white rounded-lg font-inter text-sm font-semibold hover:bg-[#FE4629]/80 transition-colors">
                Open
              </button>
              <button className="px-3 py-1 bg-[#FAF5EB]/10 text-[#FAF5EB] rounded-lg font-inter text-sm font-semibold hover:bg-[#FAF5EB]/20 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  })
             boxShadow: isHovered ? '0 10px 30px rgba(254, 70, 41, 0.1)' : 'none'
           }}>
        {/* Rank badge */}
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#FE4629] rounded-full flex items-center justify-center text-white text-sm font-bold">
          {product.rank}
        </div>

        {/* Checkbox for comparison - only visible on hover */}
        <div className={`absolute top-4 right-4 transition-opacity ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleProductSelection(product.id)}
            className="w-4 h-4 text-[#FE4629] border-[#FAF5EB]/30 rounded focus:ring-[#FE4629]"
          />
        </div>

        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 w-12 h-12 bg-[#FAF5EB]/10 rounded-lg flex items-center justify-center">
            <MomentumLogo />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-inter text-lg font-semibold text-[#FAF5EB] truncate">
                  {product.name}
                </h3>
                <p className="font-inter text-sm text-[#FAF5EB]/70 mt-1">
                  {product.tagline}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.band === 'hot' ? 'bg-[#FE4629]/20 text-[#FE4629]' :
                    product.band === 'rising' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {product.band.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Momentum with mini sparkline */}
              <div className="text-right">
                <div className="font-inter text-xl font-bold text-[#FE4629]">
                  {product.momentum}
                </div>
                <div className="w-16 h-6 mt-1">
                  <Sparkline data={product.momentumHistory} />
                </div>
              </div>
            </div>

            {/* Expanded details on mobile hover/focus */}
            {(isHovered || isFocused) && product.description && (
              <div className="mt-3 md:hidden w-full transition-opacity duration-200" style={{ opacity: isHovered || isFocused ? 1 : 0 }}>
                <p className="font-inter text-sm text-[#FAF5EB]/70 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex gap-2 mt-2">
                  {product.tags?.slice(0, 3).map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-[#FAF5EB]/10 text-[#FAF5EB]/60 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="px-3 py-1 bg-[#FE4629] text-white rounded-lg font-inter text-sm font-semibold hover:bg-[#FE4629]/80 transition-colors">
                Open
              </button>
              <button className="px-3 py-1 bg-[#FAF5EB]/10 text-[#FAF5EB] rounded-lg font-inter text-sm font-semibold hover:bg-[#FAF5EB]/20 transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  })

export default function WeeklyBuildsPage() {
  const [mounted, setMounted] = useState(false)
  const [logoAnimated, setLogoAnimated] = useState(false)
  const [products] = useState<Product[]>(generateMockProducts())
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [filters, setFilters] = useState<FilterState>({
    timeframe: "week",
    sortBy: "momentum",
    view: "list",
    categories: []
  })
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [expandedBands, setExpandedBands] = useState<Set<string>>(new Set(["hot", "rising", "fresh"]))
  const [showFilters, setShowFilters] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  
  const heroRef = useRef<HTMLDivElement>(null)
  const filterBarRef = useRef<HTMLDivElement>(null)
  
  // Scroll animations for filter bar
  const { scrollY } = useScroll()
  const filterBarOpacity = useTransform(scrollY, [400, 500], [0, 1])
  const filterBarY = useTransform(scrollY, [400, 500], [-20, 0])


  
  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
    // Start logo animation after mount
    const timer = setTimeout(() => {
      setLogoAnimated(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Time display
  useEffect(() => {
    if (mounted) {
      setCurrentTime(new Date())
      const timer = setInterval(() => {
        setCurrentTime(new Date())
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [mounted])
  
  const formatTimeWithHighlight = (date: Date) => {
    const timeString = date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
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
  
  // Group products by band
  const productsByBand = {
    hot: filteredProducts.filter(p => p.band === 'hot'),
    rising: filteredProducts.filter(p => p.band === 'rising'), 
    fresh: filteredProducts.filter(p => p.band === 'fresh')
  }
  
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products]
    
    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "momentum":
          return b.momentum - a.momentum
        case "velocity":
          return (b.momentumChange || 0) - (a.momentumChange || 0)
        case "new":
          return a.rank - b.rank // Assuming lower rank = newer
        default:
          return b.momentum - a.momentum
      }
    })
    
    // Re-rank after sorting
    filtered.forEach((product, index) => {
      product.rank = index + 1
    })
    
    setFilteredProducts(filtered)
  }, [filters, products])
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          setFocusedIndex(prev => Math.max(0, prev - 1))
          break
        case "ArrowDown":
          e.preventDefault()
          setFocusedIndex(prev => Math.min(filteredProducts.length - 1, prev + 1))
          break
        case "Enter":
          if (focusedIndex >= 0 && focusedIndex < filteredProducts.length) {
            // Open product
            console.log("Opening product:", filteredProducts[focusedIndex])
          }
          break
        case "/":
          e.preventDefault()
          // Focus search
          break
        case "f":
          e.preventDefault()
          setShowFilters(prev => !prev)
          break
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusedIndex, filteredProducts])
  
  const toggleBand = (band: string) => {
    setExpandedBands(prev => {
      const newSet = new Set(prev)
      if (newSet.has(band)) {
        newSet.delete(band)
      } else {
        newSet.add(band)
      }
      return newSet
    })
  }
  
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#4B0A23]">
      {!mounted && (
        <div className="fixed inset-0 bg-[#4B0A23] z-50 flex items-center justify-center">
          <img 
            src="/Bombeta_white.svg" 
            alt="Bombeta" 
            className="w-[200px] h-auto opacity-40"
          />
        </div>
      )}
      
      {mounted && (
        <>
            {/* Logo transition animation */}
      <div 
        className="fixed z-50 pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, calc(-50% + 55vh - 10px)) scale(0.4)'
        }}
      >
        <motion.img
          src="/Bombeta_white.svg"
          alt="Bombeta"
          className="w-[500px] h-auto"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={logoAnimated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Header Navigation */}
      <div className="fixed top-4 left-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Left - Join Newsletter Button */}
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-[#FAF5EB]/10 hover:bg-[#FAF5EB]/20 text-[#FAF5EB] rounded-lg font-inter text-sm font-semibold transition-colors backdrop-blur-sm border border-[#FAF5EB]/10"
          >
            Join Newsletter
          </button>

          {/* Right - Navigation Links */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push('/')}
              className="font-inter text-sm text-[#FAF5EB]/80 hover:text-[#FAF5EB] transition-colors"
            >
              Home
            </button>
            <button className="font-inter text-sm text-[#FE4629] hover:text-[#FE4629]/80 transition-colors">
              Weekly Builds
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div>
        {/* Hero/Podium */}
        <Podium heroRef={heroRef} filteredProducts={filteredProducts} />

              {/* Logo and name */}
              <div className="flex items-center gap-3 flex-1">
                {product.logo ? (
                  <img 
                    src={product.logo} 
                    alt={product.name} 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FAF5EB]/10 rounded-lg flex items-center justify-center">
                    <span className="font-inter text-[#FAF5EB] font-bold text-base md:text-lg">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="font-inter text-lg md:text-xl font-bold text-[#FE4629]">
                    {product.name}
                  </h3>
                  <p className="font-inter text-xs md:text-sm text-[#FAF5EB]/80">
                    {product.tagline}
                  </p>
                </div>
              </div>

              {/* Mobile Momentum */}
              <div className="md:hidden flex items-center gap-2">
                <MomentumLogo 
                  state={product.momentum > 500 ? "hot" : product.momentum > 100 ? "building" : "normal"} 
                  size={28} 
                />
                <div className="text-right">
                  <div className="font-inter text-lg font-bold text-[#FE4629]">
                    {product.momentum}
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded details */}
            {(isHovered || isFocused) && product.description && (
              <div
                className="mt-3 md:hidden w-full transition-opacity duration-200"
                style={{ opacity: isHovered || isFocused ? 1 : 0 }}
              >
                <p className="font-inter text-sm text-[#FAF5EB]/60 mb-3">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.category?.map(cat => (
                    <span key={cat} className="px-2 py-1 bg-[#FAF5EB]/10 rounded-md font-inter text-xs text-[#FAF5EB]/80">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop Layout - Content Area */}
            <div className="hidden md:flex md:items-center md:gap-3 md:flex-1">
              <div className="flex-1">
                {/* Expanded details for desktop */}
                {(isHovered || isFocused) && product.description && (
                  <div
                    className="mt-3 transition-opacity duration-200"
                    style={{ opacity: isHovered || isFocused ? 1 : 0 }}
                  >
                    <p className="font-inter text-sm text-[#FAF5EB]/60 mb-3">
                      {product.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.category?.map(cat => (
                        <span key={cat} className="px-2 py-1 bg-[#FAF5EB]/10 rounded-md font-inter text-xs text-[#FAF5EB]/80">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Metrics */}
            <div className="hidden md:flex items-center gap-6">
              {/* Sparkline */}
              {product.sparklineData && (
                <div className="hidden lg:block">
                  <Sparkline data={product.sparklineData} />
                </div>
              )}
              
              {/* Momentum */}
              <div className="flex items-center gap-2">
                <MomentumLogo 
                  state={product.momentum > 500 ? "hot" : product.momentum > 100 ? "building" : "normal"} 
                  size={32} 
                />
                <div className="text-right">
                  <div className="font-inter text-xl font-bold text-[#FE4629]">
                    {product.momentum}
                  </div>
                  {product.momentumChange && (
                    <div className="font-inter text-xs text-[#FAF5EB]/60">
                      +{product.momentumChange}
                    </div>
                  )}
                </div>
              </div>

              {/* Band indicator */}
              <div className={`px-3 py-1 rounded-full font-inter text-xs uppercase tracking-wider ${
                product.band === "hot" 
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                  : ""
              }`}>
                <span 
                  className={`${
                    product.band === "hot" 
                      ? "text-transparent bg-clip-text"
                      : product.band === "rising"
                      ? "text-[#FAF5EB]/60"
                      : "text-[#FAF5EB]/40"
                  }`}
                  style={product.band === "hot" ? {
                    backgroundImage: 'linear-gradient(90deg, #22D3EE, #60A5FA, #8B5CF6, #EC4899)',
                    backgroundSize: '300% 100%',
                    animation: 'hueShift 6s linear infinite'
                  } : {}}
                >
                  {product.band}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 hover:bg-[#FAF5EB]/10 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-[#FAF5EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#4B0A23]">
      {!mounted && (
        <div className="fixed inset-0 bg-[#4B0A23] z-50 flex items-center justify-center">
          <img 
            src="/Bombeta_white.svg" 
            alt="Bombeta" 
            className="w-[200px] h-auto opacity-40"
          />
        </div>
      )}
      
      {mounted && (
        <>
            {/* Logo transition animation */}
      <div 
        className="fixed z-50 pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, calc(-50% + 55vh - 10px)) scale(0.4)'
        }}
      >
        <motion.img
          src="/Bombeta_white.svg"
          alt="Bombeta"
          className="w-[500px] h-auto"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={logoAnimated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Header Navigation */}
      <div className="fixed top-4 left-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Left - Join Newsletter Button */}
          <button
            onClick={() => router.push('/')}
            className="px-3 md:px-6 py-2 font-inter text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer bg-transparent text-[#FE4629] border-2 border-[#FE4629] hover:bg-[#FE4629] hover:text-[#4B0A23]"
          >
            <span className="hidden md:inline">JOIN THE CLUB</span>
            <span className="md:hidden">JOIN</span>
          </button>

          {/* Center - Weekly Builds Brand */}
          <div className="text-center">
            <span className="font-inter text-xs md:text-sm font-normal text-[#FE4629]/60 tracking-wider uppercase">The</span>
            <div className="font-inter text-base md:text-xl font-bold text-[#FE4629] tracking-wider md:mt-1">WEEKLY BUILDS</div>
          </div>

          {/* Right - The Newsletter Button */}
          <button
            onClick={() => router.push('/')}
            className="px-3 md:px-6 py-2 font-inter text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer bg-transparent text-[#FE4629] border-2 border-[#FE4629] hover:bg-[#FE4629] hover:text-[#4B0A23]"
          >
            <span className="hidden md:inline">THE NEWSLETTER</span>
            <span className="md:hidden">NEWSLETTER</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div>
        {/* Hero/Podium */}
        <Podium heroRef={heroRef} filteredProducts={filteredProducts} />

        {/* Sticky filter bar */}
        <motion.div
          ref={filterBarRef}
          className="sticky top-0 z-40 border-b border-[#FAF5EB]/10"
          style={{
            opacity: filterBarOpacity,
            y: filterBarY,
            backdropFilter: 'blur(20px)',
            background: 'rgba(75, 10, 35, 0.8)'
          }}
        >
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-3">
                {/* Timeframe */}
                <select
                  value={filters.timeframe}
                  onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e.target.value as any }))}
                  className="bg-[#FAF5EB]/10 border border-[#FAF5EB]/20 rounded-lg px-3 py-2 font-inter text-sm text-[#FAF5EB] focus:outline-none focus:border-[#FE4629]/50"
                >
                  <option value="today">Today</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="all">All</option>
                </select>

                {/* Sort */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="bg-[#FAF5EB]/10 border border-[#FAF5EB]/20 rounded-lg px-3 py-2 font-inter text-sm text-[#FAF5EB] focus:outline-none focus:border-[#FE4629]/50"
                >
                  <option value="momentum">Momentum</option>
                  <option value="velocity">Velocity</option>
                  <option value="new">Newest</option>
                  <option value="votes">Votes</option>
                </select>

                {/* Compare button for mobile */}

                  {selectedProducts.size > 0 && (
                    <button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="px-3 py-2 bg-[#FE4629] text-[#4B0A23] rounded-lg font-inter text-xs font-semibold"
                    >
                      Compare ({selectedProducts.size})
                    </button>
                  )}

              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between gap-4">
              {/* Timeframe filters */}
              <div className="flex items-center gap-2">
                {(["today", "week", "month", "all"] as const).map(timeframe => (
                  <button
                    key={timeframe}
                    onClick={() => setFilters(prev => ({ ...prev, timeframe }))}
                    className={`px-4 py-2 rounded-lg font-inter text-sm font-medium transition-all ${
                      filters.timeframe === timeframe
                        ? "bg-[#FE4629] text-[#4B0A23]"
                        : "bg-transparent text-[#FAF5EB]/60 hover:text-[#FAF5EB] hover:bg-[#FAF5EB]/10"
                    }`}
                  >
                    {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                  </button>
                ))}
              </div>

              {/* Sort options */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-inter text-sm text-[#FAF5EB]/60">Sort by:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="bg-transparent border border-[#FAF5EB]/20 rounded-lg px-3 py-1.5 font-inter text-sm text-[#FAF5EB] focus:outline-none focus:border-[#FE4629]/50"
                  >
                    <option value="momentum">Momentum</option>
                    <option value="velocity">Velocity</option>
                    <option value="new">Newest</option>
                    <option value="votes">Votes</option>
                  </select>
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-1 bg-[#FAF5EB]/10 rounded-lg p-1">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, view: "list" }))}
                    className={`p-1.5 rounded transition-all ${
                      filters.view === "list" ? "bg-[#FE4629] text-[#4B0A23]" : "text-[#FAF5EB]/60"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, view: "grid" }))}
                    className={`p-1.5 rounded transition-all ${
                      filters.view === "grid" ? "bg-[#FE4629] text-[#4B0A23]" : "text-[#FAF5EB]/60"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>

                {/* Compare button */}

                  {selectedProducts.size > 0 && (
                    <button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="px-4 py-2 bg-[#FE4629] text-[#4B0A23] rounded-lg font-inter text-sm font-semibold hover:bg-[#FE4629]/80 transition-colors"
                    >
                      Compare ({selectedProducts.size})
                    </button>
                  )}

              </div>
            </div>
          </div>
        </motion.div>

        {/* Continuous leaderboard */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Hot band */}
          {productsByBand.hot.length > 0 && (
            <div className="mb-8">
              <button
                onClick={() => toggleBand("hot")}
                className="sticky top-20 z-30 w-full flex items-center justify-between p-4 mb-4 rounded-lg border border-[#FAF5EB]/10 bg-[#4B0A23]/80 backdrop-blur-lg hover:border-[#FE4629]/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <h2 className="font-inter text-xl font-bold text-[#FE4629] tracking-wide">
                    HOT BUILDS
                  </h2>
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full">
                    <span 
                      className="font-inter text-sm font-medium text-transparent bg-clip-text"
                      style={{
                        backgroundImage: 'linear-gradient(90deg, #22D3EE, #60A5FA, #8B5CF6, #EC4899)',
                        backgroundSize: '300% 100%',
                        animation: 'hueShift 6s linear infinite'
                      }}
                    >
                      {productsByBand.hot.length} products
                    </span>
                  </span>
                  <span className="font-inter text-sm text-[#FE4629]/60">
                    Momentum ≥500
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-[#FAF5EB]/60 group-hover:text-[#FAF5EB] transition-transform duration-200 ${expandedBands.has("hot") ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedBands.has("hot") && (
                <div className="space-y-4">
                  {productsByBand.hot.map((product, index) => (
                    <SimpleProductCard 
                      key={product.id} 
                      product={product} 
                      index={filteredProducts.indexOf(product)}
                      hoveredProduct={hoveredProduct}
                      setHoveredProduct={setHoveredProduct}
                      selectedProducts={selectedProducts}
                      toggleProductSelection={toggleProductSelection}
                      focusedIndex={focusedIndex}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rising band */}
          {productsByBand.rising.length > 0 && (
            <div className="mb-8">
              <button
                onClick={() => toggleBand("rising")}
                className="sticky top-20 z-30 w-full flex items-center justify-between p-4 mb-4 rounded-lg border border-[#FAF5EB]/10 bg-[#4B0A23]/80 backdrop-blur-lg hover:border-[#FE4629]/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <h2 className="font-inter text-xl font-bold text-[#FE4629] tracking-wide">
                    RISING BUILDS
                  </h2>
                  <span className="px-3 py-1 bg-[#FAF5EB]/10 rounded-full">
                    <span className="font-inter text-sm font-medium text-[#FAF5EB]/60">
                      {productsByBand.rising.length} products
                    </span>
                  </span>
                  <span className="font-inter text-sm text-[#FE4629]/60">
                    Momentum 100-500
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-[#FAF5EB]/60 group-hover:text-[#FAF5EB] transition-transform duration-200 ${expandedBands.has("rising") ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedBands.has("rising") && (
                <div className="space-y-4">
                  {productsByBand.rising.map((product, index) => (
                    <SimpleProductCard 
                      key={product.id} 
                      product={product} 
                      index={filteredProducts.indexOf(product)}
                      hoveredProduct={hoveredProduct}
                      setHoveredProduct={setHoveredProduct}
                      selectedProducts={selectedProducts}
                      toggleProductSelection={toggleProductSelection}
                      focusedIndex={focusedIndex}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Fresh band */}
          {productsByBand.fresh.length > 0 && (
            <div className="mb-8">
              <button
                onClick={() => toggleBand("fresh")}
                className="sticky top-20 z-30 w-full flex items-center justify-between p-4 mb-4 rounded-lg border border-[#FAF5EB]/10 bg-[#4B0A23]/80 backdrop-blur-lg hover:border-[#FE4629]/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <h2 className="font-inter text-xl font-bold text-[#FE4629] tracking-wide">
                    FRESH BUILDS
                  </h2>
                  <span className="px-3 py-1 bg-[#FAF5EB]/10 rounded-full">
                    <span className="font-inter text-sm font-medium text-[#FAF5EB]/40">
                      {productsByBand.fresh.length} products
                    </span>
                  </span>
                  <span className="font-inter text-sm text-[#FE4629]/60">
                    Momentum &lt;100
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-[#FAF5EB]/60 group-hover:text-[#FAF5EB] transition-transform duration-200 ${expandedBands.has("fresh") ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedBands.has("fresh") && (
                <div className="space-y-4">
                  {productsByBand.fresh.map((product, index) => (
                    <SimpleProductCard 
                      key={product.id} 
                      product={product} 
                      index={filteredProducts.indexOf(product)}
                      hoveredProduct={hoveredProduct}
                      setHoveredProduct={setHoveredProduct}
                      selectedProducts={selectedProducts}
                      toggleProductSelection={toggleProductSelection}
                      focusedIndex={focusedIndex}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Live Time */}
        <div className="fixed bottom-4 right-4 md:right-8 z-40">
          <span className="font-inter text-base font-normal text-[#FE4629] font-mono">
            {currentTime ? formatTimeWithHighlight(currentTime) : '--:--:--'}
          </span>
        </div>
      </div>
        </>
      )}
    </div>
  )
}
