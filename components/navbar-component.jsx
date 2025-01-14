"use client"
import { AppWindow, KeyRound, LayoutDashboard, Lock, User } from "lucide-react"
import { useEffect, useState, useContext, createContext } from "react"
import Link from "next/link"

const pathContext = createContext("")

const NavLink = ({children,href}) => {
  const [active, setActive] = useState(false)
  const {path,setPath} = useContext(pathContext)
  useEffect(() => {
    if(path == href.split("/").pop()){
      setActive(true)
      return
    }
    setActive(false)
  }, [href,path])
  return(
    <Link onClick={() => setPath(href.split("/").pop())} href={href} className={`text-accent-foreground flex gap-2 px-2 py-3 rounded-xl ${active ? "text-background bg-foreground" : "hover:bg-accent"}`}>{children}</Link>
  )
}

const Navbar = () => {
  const [path, setPath] = useState("")
  useEffect(() => {
    setPath(window.location.pathname.split("/").pop())
  }, [])
  return(
    <div className="min-w-[300px] border-r h-full">
      <h2 className="flex text-xl p-4 gap-2 font-extrabold"><Lock/> OTC Password Manager</h2>
      <nav className="flex flex-col gap-2 p-4">
        <pathContext.Provider value={{path,setPath}}>
          <NavLink href="/main/dashboard"><LayoutDashboard/> Dashboard</NavLink>
          <NavLink href="/main/accounts"><AppWindow/>Accounts</NavLink>
          <NavLink href="/main/passwords"><KeyRound/>Passwords</NavLink>
          <NavLink href="/main/profile"><User/>Profile</NavLink>
        </pathContext.Provider>
      </nav>
    </div>
  )
}

export default Navbar