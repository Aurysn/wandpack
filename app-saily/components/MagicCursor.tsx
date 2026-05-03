'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  decay: number
  size: number
  hue: number
  isStar: boolean
}

const WAND_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><line x1="10" y1="10" x2="29" y2="29" stroke="#100c28" stroke-width="5" stroke-linecap="round"/><line x1="10" y1="10" x2="29" y2="29" stroke="#c8961a" stroke-width="2" stroke-linecap="round"/><path d="M6 1.5L7.9 4.1L10.5 6L7.9 7.9L6 10.5L4.1 7.9L1.5 6L4.1 4.1Z" fill="#100c28"/><path d="M6 1.5L7.9 4.1L10.5 6L7.9 7.9L6 10.5L4.1 7.9L1.5 6L4.1 4.1Z" fill="#f0c040"/><circle cx="4.5" cy="4" r="1" fill="white" opacity="0.75"/></svg>`

const SPARKLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><line x1="16" y1="3" x2="16" y2="13" stroke="#f0c040" stroke-width="2.5" stroke-linecap="round"/><line x1="16" y1="19" x2="16" y2="29" stroke="#f0c040" stroke-width="2.5" stroke-linecap="round"/><line x1="3" y1="16" x2="13" y2="16" stroke="#f0c040" stroke-width="2.5" stroke-linecap="round"/><line x1="19" y1="16" x2="29" y2="16" stroke="#f0c040" stroke-width="2.5" stroke-linecap="round"/><line x1="7" y1="7" x2="12" y2="12" stroke="#f0c040" stroke-width="1.8" stroke-linecap="round"/><line x1="20" y1="20" x2="25" y2="25" stroke="#f0c040" stroke-width="1.8" stroke-linecap="round"/><line x1="25" y1="7" x2="20" y2="12" stroke="#f0c040" stroke-width="1.8" stroke-linecap="round"/><line x1="7" y1="25" x2="12" y2="20" stroke="#f0c040" stroke-width="1.8" stroke-linecap="round"/><circle cx="16" cy="16" r="2.5" fill="#f0c040"/></svg>`

function toDataUri(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2
    const d = i % 2 === 0 ? r : r * 0.38
    if (i === 0) ctx.moveTo(x + Math.cos(a) * d, y + Math.sin(a) * d)
    else ctx.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d)
  }
  ctx.closePath()
  ctx.fill()
}

export default function MagicCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Particle[] = []
    let raf: number
    let lastSpawn = 0
    let lastTime = 0

    function spawn(x: number, y: number, burst = false) {
      const count = burst ? 8 : 1
      for (let i = 0; i < count; i++) {
        const angle = burst
          ? (i / count) * Math.PI * 2 + Math.random() * 0.4
          : Math.random() * Math.PI * 2
        const speed = burst ? 2 + Math.random() * 2.5 : 0.4 + Math.random() * 0.9
        particles.push({
          x: x + (Math.random() - 0.5) * 5,
          y: y + (Math.random() - 0.5) * 5,
          vx: burst ? Math.cos(angle) * speed : (Math.random() - 0.5) * 1.2,
          vy: burst ? Math.sin(angle) * speed : -(speed + 0.3),
          life: 1,
          decay: burst
            ? 1 / (220 + Math.random() * 180)
            : 1 / (420 + Math.random() * 320),
          size: 1.2 + Math.random() * 2.4,
          hue: 38 + Math.random() * 18,
          isStar: Math.random() > 0.45,
        })
      }
      if (particles.length > 65) particles.splice(0, particles.length - 65)
    }

    function tick(time: number) {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(time - lastTime, 50)
      lastTime = time

      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx * (dt / 16)
        p.y += p.vy * (dt / 16)
        p.life -= p.decay * dt
        if (p.life <= 0) { particles.splice(i, 1); continue }

        ctx.globalAlpha = p.life * p.life
        ctx.fillStyle = `hsl(${p.hue}, 92%, 62%)`

        if (p.isStar) {
          drawStar(ctx, p.x, p.y, p.size)
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 0.65, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(tick)

    function onMove(e: MouseEvent) {
      const now = performance.now()
      if (now - lastSpawn < 28) return
      lastSpawn = now
      spawn(e.clientX, e.clientY)
    }

    function onDown(e: MouseEvent) {
      spawn(e.clientX, e.clientY, true)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)

    const style = document.createElement('style')
    style.textContent = `
      *, *::before, *::after {
        cursor: url("${toDataUri(WAND_SVG)}") 6 6, default !important;
      }
      *:active {
        cursor: url("${toDataUri(SPARKLE_SVG)}") 16 16, default !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      style.parentNode?.removeChild(style)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}
    />
  )
}
