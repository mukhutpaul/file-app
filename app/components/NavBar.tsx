"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import { AudioWaveform, GlobeLock, Menu, Settings, X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { checkAndAddUser, getCompanyName } from '../actions'
import SettingModal from './SettingModal'

const NavBar = () => {

    const {user} = useUser()
    const email = user?.primaryEmailAddress?.emailAddress

    const [menuOpen, setMenuOpen] = useState(false)
    const [pageName,setPageName] = useState<string |null>(null)

    const navLinks = [
        { href:"/",label:"Accueil"},
        { href:"/services",label:"Vos services"},
        { href:"/post_list",label:"Vos postes"},
        { href:"/dashboard",label:"Tableau de bord"},
    ]

    useEffect(() =>{
        
        const init = async () => {
            
            try {      
                if(email && user.fullName){
               // console.log("bonjour")
                    await checkAndAddUser(email,user.fullName)  
                    const pageName = await getCompanyName(email) 
                    if(pageName){
                       setPageName(pageName) 
                    }
                      
                }
            } catch (error) {
                console.error(error)   
            }
       }
        init()
    },[email,user])

    const renderLinks = (className:string) => {
        return(
        <>
        <button className="btn btn-sm btn-accent btn-circle" 
        onClick={()=>(document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
            <Settings className='w-4 h-4'/>
        </button>
           {
            navLinks.map(({href,label}) => (
                <Link key={href} href={href} className={`${className} btn-sm`}>
                    {label}
                </Link>

            ))
           }

           {pageName && (
            <Link href={`/page/${pageName}`} className={`${className} btn-sm`}>
                    <GlobeLock className='w-4 h-4'/>
            </Link>
           )}
        </>
        )
     }

  return (
    <div className='border-b border-base-300 px-5 md:px-[10%] py-4 relative'>
       <div className='flex justify-between items-center'>
            <div className='flex items-center'>
                <div className='rounded-full p-2'>
                   <AudioWaveform className='w-6 h-6 text-accent'/>
                </div>
                <span className='font-bold text-xl'>
                    QuickLine
                </span>
            </div>
            <button className='btn w-fit btn-sm sm:hidden' 
            onClick={() =>setMenuOpen(!menuOpen)}
            >
                <Menu className='w-4'/>

            </button>

            <div className='space-x-2 flex items-center hidden sm:flex'>
                {renderLinks("btn rounded-xl")}
                <UserButton />
            </div>
       </div>

       <div className={`absolute top-0 w-full bg-base-100 h-screen flex flex-col gap-2 p-4 
        transition-all duration-300 sm:hidden z-50 ${menuOpen ? "left-0":"-left-full"}`}>
           <div className='flex justify-between'>
            <UserButton />
             <button className='btn w-fit btn-sm sm:hidden'
              onClick={() =>setMenuOpen(!menuOpen)}>
                <X className='w-4'/>

            </button>   
           </div>
           {renderLinks("btn")}
       </div>

        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <SettingModal 
        email={email} 
        pageName={pageName} 
        onPageNameChange={setPageName}/>
</div>

    
  )
}

export default NavBar