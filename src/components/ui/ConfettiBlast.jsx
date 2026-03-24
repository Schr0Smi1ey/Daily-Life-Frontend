import { useEffect, useRef } from 'react'

export default function ConfettiBlast({ trigger }) {
  const hasRun = useRef(false)

  useEffect(() => {
    if (!trigger || hasRun.current) return
    hasRun.current = true

    const colors = ['#f97316', '#fb923c', '#fbbf24', '#ffffff', '#a3e635']
    const container = document.body
    const pieces = 80

    for (let i = 0; i < pieces; i++) {
      const el = document.createElement('div')
      el.style.cssText = `
        position: fixed;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
        transition: none;
      `
      container.appendChild(el)

      const duration = Math.random() * 2000 + 1000
      const xDrift = (Math.random() - 0.5) * 200

      el.animate([
        { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(100vh) translateX(${xDrift}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      }).onfinish = () => el.remove()
    }

    // Reset so it can fire again next time
    setTimeout(() => { hasRun.current = false }, 3000)
  }, [trigger])

  return null
}
