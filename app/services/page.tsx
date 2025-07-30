"use client"
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '@clerk/nextjs'
import { createService, deleteSericeById, getServiceByEmail } from '../actions'
import { Service } from '../generated/prisma'
import Loading from '../components/Loading'
import { Clock, ClockArrowUp, Trash } from 'lucide-react'
import EmptyState from '../components/EmptyState'

const page = () => {
    const {user} = useUser()
    const email = user?.primaryEmailAddress?.emailAddress
    const [serviceName, setServiceName] = useState('')
    const [avgTime, setAvgTime] = useState(0)
    const [loading,setLoading] = useState<boolean>(false)
    const [services,setServices] = useState<Service[]>([])


 const fetchServices = async () =>{
        setLoading(true)

        try {
            if(email){
                const serviceData = await getServiceByEmail(email)
                if(serviceData){
                    setServices(serviceData)
                    setLoading(false)
                }    
            }
            
        } catch (error) {
            
        }

  }

const handleDeleteService = async (serviceId:string) =>{
    const confirmation = window.confirm("Etes-vous sûr de vouloir supprimer ce service? tous les tickets seront également supprimer.")
    if(confirmation){
    try {
        await deleteSericeById(serviceId)
        fetchServices()
    } catch (error) {   
      console.error(error)
    }

  }
    
}

const handleCreateService = async () => {
       if(serviceName && avgTime >0 && email){
        try {
            await createService(email,serviceName,avgTime)
            setAvgTime(0)
            setServiceName("")  
            fetchServices()
        } catch (error) {
            
        }
    }
}

useEffect(()=>{
    fetchServices()
},[email])

  return (
    <Wrapper>
        <div className='flex flex-col md:flex-row w-full'>

            <div className='space-y-2 md:w-1/4 w-full '>
               <span className='label-text'>Nom du service</span>
               <div className=''>
                  <input type="text" 
                  placeholder='Nom du service'
                  value={serviceName}
                  onChange={(e)=>setServiceName(e.target.value)}
                  className='input input-bordered input-sm w-full rounded-2xl'
                  />
               </div>
                           <span className='label-text'>Temps moyen du service</span>
            <label className="input input-sm w-full">
                <ClockArrowUp className='w-4 h-4'/>
                <input 
                type="number" 
                value={avgTime}
                onChange={(e)=>setAvgTime(Number(e.target.value))}
                className="grow" 
                placeholder="20min" />
            </label>
            <button className='btn btn-sm btn-accent rounded-xl mt-4'
            onClick={handleCreateService}
            >
                Nouveau
            </button>
            </div>

            <div className='mt-4 md:mt-0 md:ml-4 md:w-3/4 md:border-l border-base-200 pl-4 w-full'>
             <h3 className='font-semibold'>Liste des services</h3>

             {loading ? (
                <div className='flex justify-center items-center w-full'>
                    <Loading />
                </div>
             ) :services.length === 0 ?(
                <div>
                     <EmptyState message={`Aucun service pour le moment`} IconComponent={`Telescope`} />
                </div>

             ):(
<div className="overflow-x-auto">
  <table className="table w-fit">

    <thead>
      <tr>
        <th>#</th>
        <th>Nom de service</th>
        <th>Temps moyen</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {services.map((serv,index) =>(
        <tr>
        <th>{index +1}</th>
        <td>{serv.name}</td>
        <td className='flex items-center'>
          <Clock className='w-4 h-4 mr-1'/>{serv.avgTime} min</td>
        <td>
        <button className='btn btn-xs btn-error'
        onClick={() =>handleDeleteService(serv.id)}
        >
          <Trash className='w-4 h-4'/>
        </button>
        </td>
      </tr>
      ))}
     
    </tbody>
  </table>
</div>
)}

 </div>


</div>
</Wrapper>
  )
}

export default page;