"use client"
import { createTicket, getServicesByPageName, getTicketsByIds } from '@/app/actions'
import EmptyState from '@/app/components/EmptyState'
import TicketComponent from '@/app/components/TicketComponent'
import { Service } from '@/app/generated/prisma'
import { Ticket } from '@/type'
import React, { useEffect, useState } from 'react'

const page = ({params} : {params : Promise<{pageName : string}>}) => {

    const [pageName,setPageName] = useState<string | null>(null)
    const [services,setServices] = useState<Service[]>([])

    const[selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
    const [nameComplete,setNameComplete] = useState<string>("")
    const [ticketNums,setTicketNums] = useState<any[]>([])
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [countDown,setCountDown] = useState<number>(5)

    const resolveParamsAndFatchServices = async () =>{
        try {
            const  resolvedParams = await params
            setPageName(decodeURIComponent(resolvedParams.pageName))
            const servicesList = await getServicesByPageName(decodeURIComponent(resolvedParams.pageName))
            if(servicesList) {
                setServices(servicesList)
            }

        } catch (error) {
            console.error(error)
        }
    }



    useEffect(() =>{
        resolveParamsAndFatchServices()
        const ticketNumfromLocalStorage = localStorage.getItem('ticketNums')
        
        if(ticketNumfromLocalStorage && ticketNumfromLocalStorage !== "undefined"){
            const savedTicketNums = JSON.parse(ticketNumfromLocalStorage)
            setTicketNums(savedTicketNums)
            
            if(savedTicketNums.length > 0){
            fetchTicketsById(savedTicketNums)
           
          }else{
            setTicketNums([])
          }
        }
       
    },[])

    const fetchTicketsById =async (ticketsNums:any[]) =>{
        try {
            const fetchedTickets = await getTicketsByIds(ticketsNums)
            const validTickets = fetchedTickets?.filter(ticket => ticket.status !== "FINISHED")
            const validTicketNums = validTickets?.map(ticket => ticket.num)

            localStorage.setItem('ticketNums',JSON.stringify(validTicketNums))
            if(validTickets){
               setTickets(validTickets)
            }      
      
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault()
        if(!selectedServiceId || !nameComplete){
            alert("Veuillez selectionner un service et entrer votre nom.")
            return
        }

        try {
            
            const   ticketNum = await  createTicket(selectedServiceId,nameComplete,pageName || '')
            setSelectedServiceId(null)
            setNameComplete("")

            const updatedTicketNums = [...(ticketNums || []),ticketNum]
            setTicketNums(updatedTicketNums)
            localStorage.setItem("ticketNums",JSON.stringify( updatedTicketNums))
            console.log(ticketNums)    
            
        } catch (error) {
            
        }
    }



   useEffect(()=>{
     const handleCountdownAndRefresh = () =>{
     if(countDown === 0){
       fetchTicketsById(ticketNums)
       setCountDown(5)
 
     }else {
       setCountDown((prevCountdown) => prevCountdown -1)
     }
   }
   const timeOutId = setTimeout(handleCountdownAndRefresh,1000)
 
   return () => clearTimeout(timeOutId)
     
   },[countDown])

  

  return (
    <div className='px-5 md:px-[10%] mt-8 mb-10'>
        <div>
            <h1 className='text-2xl font-bold'>
                Bienvenue sur 
                <span className='badge badge-accent ml-2'>@{pageName}</span>
            </h1>
            <p className='text-md'>Aller, créer votre ticket</p>
        </div>

        <div className='flex flex-col md:flex-row w-full mt-4'>
            <form action="flex flex-col space-y-2 md:w-96"
            onSubmit={handleSubmit}
            >
                <select 
                className="select select-bordered w-full"
                onChange={(e)=>setSelectedServiceId(e.target.value)}
                value={selectedServiceId || ''}
                >
                    <option disabled value="">Choisissez un service</option>
                    {services.map((service) =>(
                       <option key={service.id} value={service.id}>
                           {service.name} - ({service.avgTime} min)
                       </option>
                    ))}
                  
                </select>
                <input 
                type="text" 
                onChange={(e)=>setNameComplete(e.target.value)}
                value={nameComplete || ''}
                placeholder='Quel est votre nom'
                className ="input input-bordered w-full mt-2"
                />
                <button 
                className='btn btn-accent w-fit rounded-2xl mt-2'
                type='submit'
                >
                    Go
                </button>
            </form>

        <div className='w-full mt-4 md:ml-4 md:mt-0'>
        {tickets.length !== 0 &&(
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Vos tickets</h1>

        <div className="flex items-center">
          <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-accent"></span>
        </span>
          <div className="ml-2">
            ({countDown}s)
          </div>

        </div>
      </div>
          {tickets.map((ticket,index) =>{
            const totalWaitTime= tickets
            .slice(0,index)
            .reduce((acc,prevTicket) => acc + prevTicket.avgTime,0)



            return(
             <TicketComponent 
             ticket={ticket} 
             key={ticket.id}
             totalWaitingTime={totalWaitTime}
             index={index}
             />
           )})}
          
        </div>
      )}
    </div>
    </div>

    </div>
  )
}

export default page