'use client'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'

interface Point {
    x: number
    y: number
    wave: { x: number; y: number }
    cursor: {
        x: number
        y: number
        vx: number
        vy: number
    }
}

interface WavesProps {
    className?: string
    strokeColor?: string
    backgroundColor?: string
    pointerSize?: number
}

export function Waves({
    className = "",
    strokeColor = "url(#waveGradient)", // Use the gradient by default
    backgroundColor = "#000000",
    pointerSize = 0.5
}: WavesProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const mouseRef = useRef({
        x: -10,
        y: 0,
        lx: 0,
        ly: 0,
        sx: 0,
        sy: 0,
        v: 0,
        vs: 0,
        a: 0,
        set: false,
    })
    const pathsRef = useRef<SVGPathElement[]>([])
    const linesRef = useRef<Point[][]>([])
    const noiseRef = useRef<((x: number, y: number) => number) | null>(null)
    const rafRef = useRef<number | null>(null)
    const boundingRef = useRef<DOMRect | null>(null)

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return
        noiseRef.current = createNoise2D()
        setSize()
        setLines()
        window.addEventListener('resize', onResize)
        window.addEventListener('mousemove', onMouseMove)
        containerRef.current.addEventListener('touchmove', onTouchMove, { passive: false })
        rafRef.current = requestAnimationFrame(tick)
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            window.removeEventListener('resize', onResize)
            window.removeEventListener('mousemove', onMouseMove)
            containerRef.current?.removeEventListener('touchmove', onTouchMove)
        }
    }, [])

    const setSize = () => {
        if (!containerRef.current || !svgRef.current) return
        boundingRef.current = containerRef.current.getBoundingClientRect()
        const { width, height } = boundingRef.current
        svgRef.current.style.width = `${width}px`
        svgRef.current.style.height = `${height}px`
    }

    const setLines = () => {
        if (!svgRef.current || !boundingRef.current) return
        const { width, height } = boundingRef.current
        linesRef.current = []
        
        // Preserve the defs element if it exists
        const defs = svgRef.current.querySelector('defs');
        
        // Clear paths but keep defs
        pathsRef.current.forEach(path => path.remove())
        pathsRef.current = []

        // Increased gap to reduce calculation load and prevent glitching
        const xGap = 16 
        const yGap = 16
        const oWidth = width + 200
        const oHeight = height + 30
        const totalLines = Math.ceil(oWidth / xGap)
        const totalPoints = Math.ceil(oHeight / yGap)
        const xStart = (width - xGap * totalLines) / 2
        const yStart = (height - yGap * totalPoints) / 2
        for (let i = 0; i < totalLines; i++) {
            const points: Point[] = []
            for (let j = 0; j < totalPoints; j++) {
                points.push({
                    x: xStart + xGap * i,
                    y: yStart + yGap * j,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 },
                })
            }
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            path.setAttribute('fill', 'none')
            path.setAttribute('stroke', strokeColor)
            path.setAttribute('stroke-width', '1.2')
            path.setAttribute('stroke-opacity', '0.7')
            svgRef.current.appendChild(path)
            pathsRef.current.push(path)
            linesRef.current.push(points)
        }
    }

    const onResize = () => { setSize(); setLines(); }
    const onMouseMove = (e: MouseEvent) => updateMousePosition(e.pageX, e.pageY)
    const onTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0]
        updateMousePosition(touch.clientX, touch.clientY)
    }

    const updateMousePosition = (x: number, y: number) => {
        if (!boundingRef.current) return
        const mouse = mouseRef.current
        mouse.x = x - boundingRef.current.left
        mouse.y = y - boundingRef.current.top + window.scrollY
        if (!mouse.set) {
            mouse.sx = mouse.x; mouse.sy = mouse.y
            mouse.lx = mouse.x; mouse.ly = mouse.y
            mouse.set = true
        }
    }

    const movePoints = (time: number) => {
        const { current: lines } = linesRef
        const { current: mouse } = mouseRef
        const { current: noise } = noiseRef
        if (!noise) return
        lines.forEach((points) => {
            points.forEach((p: Point) => {
                const move = noise((p.x + time * 0.008) * 0.003, (p.y + time * 0.003) * 0.002) * 8
                p.wave.x = Math.cos(move) * 12
                p.wave.y = Math.sin(move) * 6
                const dx = p.x - mouse.sx
                const dy = p.y - mouse.sy
                const d = Math.hypot(dx, dy)
                const l = Math.max(175, mouse.vs)
                if (d < l) {
                    const s = 1 - d / l
                    const f = Math.cos(d * 0.001) * s
                    p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00035
                    p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00035
                }
                p.cursor.vx += (0 - p.cursor.x) * 0.01
                p.cursor.vy += (0 - p.cursor.y) * 0.01
                p.cursor.vx *= 0.95
                p.cursor.vy *= 0.95
                p.cursor.x += p.cursor.vx
                p.cursor.y += p.cursor.vy
                p.cursor.x = Math.min(50, Math.max(-50, p.cursor.x))
                p.cursor.y = Math.min(50, Math.max(-50, p.cursor.y))
            })
        })
    }

    const moved = (point: Point, withCursorForce = true) => ({
        x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
        y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
    })

    const drawLines = () => {
        const { current: lines } = linesRef
        const { current: paths } = pathsRef
        lines.forEach((points, lIndex) => {
            if (points.length < 2 || !paths[lIndex]) return
            const firstPoint = moved(points[0], false)
            let d = `M ${firstPoint.x} ${firstPoint.y}`
            for (let i = 1; i < points.length; i++) {
                const current = moved(points[i])
                d += `L ${current.x} ${current.y}`
            }
            paths[lIndex].setAttribute('d', d)
        })
    }

    const tick = (time: number) => {
        const { current: mouse } = mouseRef
        mouse.sx += (mouse.x - mouse.sx) * 0.1
        mouse.sy += (mouse.y - mouse.sy) * 0.1
        const dx = mouse.x - mouse.lx
        const dy = mouse.y - mouse.ly
        const d = Math.hypot(dx, dy)
        mouse.v = d
        mouse.vs += (d - mouse.vs) * 0.1
        mouse.vs = Math.min(100, mouse.vs)
        mouse.lx = mouse.x
        mouse.ly = mouse.y
        mouse.a = Math.atan2(dy, dx)
        if (containerRef.current) {
            containerRef.current.style.setProperty('--x', `${mouse.sx}px`)
            containerRef.current.style.setProperty('--y', `${mouse.sy}px`)
        }
        movePoints(time)
        drawLines()
        rafRef.current = requestAnimationFrame(tick)
    }

    return (
        <div
            ref={containerRef}
            // Added pointer-events-none to ensure it doesn't block UI or capture excessive events
            className={`waves-component relative overflow-hidden pointer-events-none ${className}`}
            style={{
                background: '#FFFFFF',
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                overflow: 'hidden', '--x': '-0.5rem', '--y': '50%',
                // Force hardware acceleration
                transform: 'translate3d(0, 0, 0)',
                willChange: 'transform'
            } as any}
        >
            <svg ref={svgRef} className="block w-full h-full js-svg" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#e0f7ff" />
                        <stop offset="20%" stopColor="#00ffff" />
                        <stop offset="50%" stopColor="#0066cc" />
                        <stop offset="100%" stopColor="#000033" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}