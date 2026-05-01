import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const navItem = (active) =>
    `relative px-4 py-1.5 text-xs rounded-full transition-all duration-300
     ${active
        ? 'text-white bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.15)]'
        : 'text-zinc-400 hover:text-white hover:bg-white/5'}`

  return (
    <div className="sticky top-6 z-50 flex justify-center pointer-events-none">


      <nav className="
        pointer-events-auto
        flex items-center justify-between
        gap-6
        px-6 py-3
        rounded-full
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        shadow-[0_10px_40px_rgba(0,0,0,0.4)]
        w-fit
      ">


     <Link
  to="/"
  className="text-2xl tracking-tighter select-none focus:outline-none transition-transform hover:scale-[1.02]"
>
  <span className="font-medium text-zinc-100">
    Simu
  </span>
  <span className="font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600 drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]">
    lyn
  </span>
</Link>


        <div className="flex items-center gap-2">

          <Link to="/">
            <button className={navItem(pathname === '/')}>
              History
            </button>
          </Link>

          <Link to="/simulate">
            <button className={navItem(pathname === '/simulate')}>
              + Simulation
            </button>
          </Link>

        </div>

      </nav>
    </div>
  )
}