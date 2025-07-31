"use client"
import { useUser } from "@clerk/nextjs";
import Wrapper from "./components/Wrapper"
import {getPendingTicketsByEmail } from "./actions";
import { useEffect, useState } from "react";
import { Ticket } from "@/type";
import EmptyState from "./components/EmptyState";
import TicketComponent from "./components/TicketComponent";


export default function Home() {
  const {user} = useUser()
  const email = user?.primaryEmailAddress?.emailAddress
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [countDown,setCountDown] = useState<number>(5)
  
  const fetchTickets = async () => {
    if(email){
      try {
        const fetchedTickets = await getPendingTicketsByEmail(email);
        if( fetchedTickets){
          setTickets(fetchedTickets) 
        }
      } catch (error) {
        
      }
    }
     
  }
  useEffect(()=>{
    fetchTickets() 
  },[email])

  useEffect(()=>{
    const handleCountdownAndRefresh = () =>{
    if(countDown === 0){
      fetchTickets()
      setCountDown(5)

    }else {
      setCountDown((prevCountdown) => prevCountdown -1)
    }
  }
  const timeOutId = setTimeout(handleCountdownAndRefresh,1000)

  return () => clearTimeout(timeOutId)
    
  },[countDown])
  return (
  <Wrapper>

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
      {tickets.length === 0 ? (
        <div>
          <EmptyState 
            message={`Aucun ticket en attente`} 
            IconComponent={`Bird`}
          />
        </div>
      ):(
        <div className="grid grid-cols-1 gap-4">
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
  </Wrapper>

  );
}
