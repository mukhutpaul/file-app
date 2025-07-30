import { Ticket } from '@/type'
import React, { FC } from 'react'

interface TickeComponentProps {
    ticket : Ticket;
    index?: number;
    totalWaitingTime?: number;
}

const TicketComponent : FC<TickeComponentProps> = ({ticket,index,totalWaitingTime=0}) => {
  return (
    <div>
        tetegdg
    </div>
  )
}

export default TicketComponent