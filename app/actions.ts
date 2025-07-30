"use server"

import prisma from "@/lib/prisma"

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




