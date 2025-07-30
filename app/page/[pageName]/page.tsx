"use client"
import { createTicket, getServicesByPageName } from '@/app/actions'
import { Service } from '@/app/generated/prisma'
import React, { useEffect, useState } from 'react'

const page = ({params} : {params : Promise<{pageName : string}>}) => {

    const [pageName,setPageName] = useState<string | null>(null)
    const [services,setServices] = useState<Service[]>([])

    const[selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
    const [nameComplete,setNameComplete] = useState<string>("")

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
    },[])

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault()
        if(!selectedServiceId || !nameComplete){
            alert("Veuillez selectionner un service et entrer votre nom.")
            return
        }

        try {
            
            const   ticketNum = await  createTicket(selectedServiceId,nameComplete,pageName || '')
            setSelectedServiceId(null)
            setPageName("")
        } catch (error) {
            
        }
    }

  return (
    <div className='px-5 md:px-[10%] mt-8 mb-10'>
        <div>
            <h1 className='text-2xl font-bold'>
                Bienvenue sur 
                <span className='badge badge-accent ml-2'>@{pageName}</span>
            </h1>
            <p className='text-md'>Aller, créer votre ticket</p>
        </div>

        <div className='flex flex-col md: flex flex-row w-full mt-4 gap-2'>
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
        </div>

    </div>
  )
}

export default page