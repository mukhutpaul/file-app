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
  return (
  <Wrapper>
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
