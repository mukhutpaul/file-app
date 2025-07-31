"use server"

import prisma from "@/lib/prisma"
import { Ticket } from "lucide-react"

export async function checkAndAddUser(email: string, name: string) {
    if (!email) return
    try {
        const existingUser = await prisma.company.findUnique({
            where: {
                email: email
            }
        })
        if (!existingUser && name) {
            await prisma.company.create({
                data: {
                    email,
                    name
                }
            })
            console.error("Erreur lors de la vérification de l'utilisateur:");
        } else {
            console.error("Utilisateur déjà présent dans la base de données");
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error);
    }
}

export async function createService(email:string,serviceName : string, avgTime:number){
    if(!email || !serviceName || avgTime == null) return

    try {

        const existingCompany  = await prisma.company.findUnique({
            where : {
                email: email
            }
        })

        if(existingCompany){
            const newService = await prisma.service.create({
                data : {
                    name : serviceName,
                    avgTime:avgTime,
                    companyId : existingCompany.id

                }
            })
        }else{
            console.log(`No company found with email: ${email}`)
        }

    } catch (error) {
        console.error(error)
    }
}

export async function getServiceByEmail(email:string){
    if(!email) return
    try {
        const company  = await prisma.company.findUnique({
            where : {
                email: email
            }
        })

        if(!company){
            throw new Error("Aucune entreprise trouvée avec cet email")
        }

        const services = await prisma.service.findMany({
            where : {
                companyId: company.id
            },
            include:{company:true}
        })

        return services


        
    } catch (error) {
        console.error(error)
    }
}

export async function deleteSericeById(serviceId: string){
    if(!serviceId) return

    try {

        const service = await prisma.service.findUnique({
            where : {
                id:serviceId
            }
        })

        await prisma.service.delete({
            where : {
                id : serviceId
            }
        })

        
        
    } catch (error) {
        console.error(error)
    }
}

export async function getCompanyName(email: string){

    try {

        const company = await prisma.company.findUnique({
            where: {
                email: email
            },
            select : {
                pageName: true
            }
        })

        if(company){
            return  company.pageName

        }
        
    } catch (error) {
        console.error(error)
        
    }


}

export async function setCompanyPageName(email: string,pageName:string){
    try {

        const company = await prisma.company.findUnique({
            where: {
                email: email
            }
        })

        await prisma.company.update({
            where : {
                email
            },
            data : {
                pageName
            }
        })
        
    } catch (error) {
        console.error(error)
    }

}

export async function getServicesByPageName(pageName : string) {
    try {

        const company = await prisma.company.findUnique({
            where: {
                pageName: pageName
            }
        })

        if(!company){
           throw new Error(`Aucune entreprise trouvée avec le nom de la page : ${pageName}`)
        }
        const services = prisma.service.findMany({
            where : {companyId: company?.id},
            include : {
                company: true
            }
        })
        return services

        
    } catch (error) {
        console.error(error)
    }
}

export async function createTicket(serviceId: string,nameComplete:string,pageName:string){
    try {

        const company = await prisma.company.findUnique({
            where: {
                pageName: pageName
            }
        })

        if(!company){
           throw new Error(`Aucune entreprise trouvée avec le nom de la page : ${pageName}`)
        }

        //A04
        const ticketNum = `A${Math.floor(Math.random() * 10000)}`

        const ticket = await prisma.ticket.create({
            data : {
                serviceId,
                nameComplete,
                num : ticketNum,
                status : "PENDING"
            }
        })

        return ticketNum
            
            
    } catch (error) {
        console.error(error)
    }
}


export async function getPendingTicketsByEmail(email : string) {
    try{
        const company = await prisma.company.findUnique({
            where: {
                email:email
            },
            include : {
                services : {
                    include: {
                        tickets : {
                            where : {
                                status : {
                                    in: ["PENDING","CALL","IN_PROGRESS"]
                                }
                            },
                            orderBy : {
                                createdAt: "asc"
                            },
                            include : {
                                post: true
                            }
                        }

                    }
                }
            }
        })

        if(!company){
           throw new Error(`Aucune entreprise trouvée avec le nom de la page : ${email}`)
        }

        let pendingTicket = company.services.flatMap((service) => 
           service.tickets.map((ticket) =>({
             ...ticket,
             serviceName : service.name,
             avgTime :service.avgTime
           }))
        )

        pendingTicket = pendingTicket.sort(
            (a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )

        return pendingTicket
 


    }catch(error){
      console.error(error)
    }

}

export async function getTicketsByIds(ticketNums : any[]){
    try {

        const tickets = await prisma.ticket.findMany({
            where : {
                num : {
                    in : ticketNums
                }
            },
            orderBy : {
                createdAt: "asc"
            },
            include : {
                service: true,
                post : true
            }
        })

        if(tickets.length == 0){
            throw new Error("Aucun ticket trouvé");
        }

        return tickets.map((ticket) =>({
            ...ticket,
            serviceName : ticket.service.name,
            avgTime : ticket.service.avgTime
        }))
        
    } catch (error) {
        console.error(error)
    }
}

export async function createPost(email:string,postName:string){
    try {
         const company = await prisma.company.findUnique({
            where: {
                email: email
            }
        })

        if(!company){
           throw new Error(`Aucune entreprise trouvée cet email : ${email}`)
        }

        const newPost = await prisma.post.create({
            data: {
                name:postName,
                companyId: company.id
            }
        })
        
    } catch (error) {
        console.error(error)
        
    }

}

export async function deletePost(postId:string){
    try {
        await prisma.post.delete({
            where : {
                id:postId
            }
        })
        
    } catch (error) {
        console.error(error)
        
    }

}

export async function getPostsByCompanyEmail(email:string){
    try {
         const company = await prisma.company.findUnique({
            where: {
                email: email
            }
        })

        if(!company){
           throw new Error(`Aucune entreprise trouvée cet email : ${email}`)
        }

        const posts= await prisma.post.findMany({
            where: {
                companyId: company.id
            },
            include :{
                company:true
            }

        })
        return posts
        
    } catch (error) {
        console.error(error)
        
    }

}

export async function getPostNameById(postId:string){
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            select: {
                name:true
            }
        })

        if(post){
            return post.name
        }else{
            throw new Error("Poste non trouvé.")
        }
        
    } catch (error) {
        
    }
}

export async function getLastTicketByEmail(email: string, idPoste: string) {
    try {
        const existingTicket = await prisma.ticket.findFirst({
            where: {
                postId: idPoste,
                status: { in: ["CALL", "IN_PROGRESS"] }
            },
            orderBy: { createdAt: "desc" },
            include: { service: true, post: true }
        })

        if (existingTicket && existingTicket.service) {
            return {
                ...existingTicket,
                serviceName: existingTicket.service.name,
                avgTime: existingTicket.service.avgTime
            }

        }

        const ticket = await prisma.ticket.findFirst({
            where: {
                status: "PENDING",
                service: { company: { email: email } }
            },
            orderBy: { createdAt: "desc" },
            include: { service: true, post: true }
        })

        if (!ticket || !ticket?.service) return null

        const post = await prisma.post.findUnique({
            where: { id: idPoste }
        })

        if (!post) {
            console.error(`Aucun poste trouvé pour l'ID: ${idPoste}`);
            return null;
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id: ticket.id },
            data: {
                status: "CALL",
                postId: post.id,
                postName: post.name
            },
            include: { service: true }
        })

        return {
            ...updatedTicket,
            serviceName: updatedTicket.service.name,
            avgTime: updatedTicket.service.avgTime
        }

    } catch (error) {
        console.error(error)
    }
}

export async function updateTicketStatus(ticketId: string, newStatus: string) {
    try {
        await prisma.ticket.update({
            where: { id: ticketId },
            data: { status: newStatus }
        })
    } catch (error) {
        console.error(error)
    }
}