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

              {/* Momentum */}
              <div className="text-right">
                <div className="font-inter text-xl font-bold text-[#FE4629]">
                  {product.momentum}
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

// Mock data
const mockProducts = [
  { id: '1', rank: 1, name: 'Product Hunt', tagline: 'The best new products in tech', momentum: 1250, band: 'hot' },
  { id: '2', rank: 2, name: 'Linear', tagline: 'Issue tracking for modern teams', momentum: 890, band: 'hot' },
  { id: '3', rank: 3, name: 'Notion', tagline: 'All-in-one workspace', momentum: 654, band: 'hot' },
  { id: '4', rank: 4, name: 'Figma', tagline: 'Design and prototyping platform', momentum: 423, band: 'rising' },
  { id: '5', rank: 5, name: 'Vercel', tagline: 'Deploy web projects with zero configuration', momentum: 321, band: 'rising' },
  { id: '6', rank: 6, name: 'Supabase', tagline: 'Open source Firebase alternative', momentum: 154, band: 'fresh' },
  { id: '7', rank: 7, name: 'Planetscale', tagline: 'The database for developers', momentum: 98, band: 'fresh' },
]

export default function WeeklyBuildsPage() {
  const [mounted, setMounted] = useState(false)
  const [logoAnimated, setLogoAnimated] = useState(false)
  const [products] = useState(mockProducts)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  
  const router = useRouter()

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
    // Start logo animation after mount
    const timer = setTimeout(() => {
      setLogoAnimated(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

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

  const productsByBand = {
    hot: products.filter(p => p.band === 'hot'),
    rising: products.filter(p => p.band === 'rising'),
    fresh: products.filter(p => p.band === 'fresh')
  }

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
              <button 
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-[#FAF5EB]/10 hover:bg-[#FAF5EB]/20 text-[#FAF5EB] rounded-lg font-inter text-sm font-semibold transition-colors backdrop-blur-sm border border-[#FAF5EB]/10"
              >
                Join Newsletter
              </button>

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
          <div className="pt-20">
            {/* Simple title */}
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              <span className="font-inter text-xs md:text-sm font-normal text-[#FE4629]/60 tracking-wider uppercase">This Week's</span>
              <div className="font-inter text-3xl md:text-6xl font-bold text-[#FE4629] tracking-tight mt-1 md:mt-2">TOP BUILDS</div>
            </motion.div>

            {/* Products list */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
              {/* Hot products */}
              {productsByBand.hot.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#FE4629] mb-4">🔥 HOT</h2>
                  <div className="space-y-4">
                    {productsByBand.hot.map((product, index) => (
                      <SimpleProductCard 
                        key={product.id} 
                        product={product} 
                        index={index}
                        hoveredProduct={hoveredProduct}
                        setHoveredProduct={setHoveredProduct}
                        selectedProducts={selectedProducts}
                        toggleProductSelection={toggleProductSelection}
                        focusedIndex={focusedIndex}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Rising products */}
              {productsByBand.rising.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-4">📈 RISING</h2>
                  <div className="space-y-4">
                    {productsByBand.rising.map((product, index) => (
                      <SimpleProductCard 
                        key={product.id} 
                        product={product} 
                        index={index}
                        hoveredProduct={hoveredProduct}
                        setHoveredProduct={setHoveredProduct}
                        selectedProducts={selectedProducts}
                        toggleProductSelection={toggleProductSelection}
                        focusedIndex={focusedIndex}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Fresh products */}
              {productsByBand.fresh.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-green-400 mb-4">🌱 FRESH</h2>
                  <div className="space-y-4">
                    {productsByBand.fresh.map((product, index) => (
                      <SimpleProductCard 
                        key={product.id} 
                        product={product} 
                        index={index}
                        hoveredProduct={hoveredProduct}
                        setHoveredProduct={setHoveredProduct}
                        selectedProducts={selectedProducts}
                        toggleProductSelection={toggleProductSelection}
                        focusedIndex={focusedIndex}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
