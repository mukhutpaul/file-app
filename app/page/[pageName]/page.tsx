import React from 'react'

const page = ({params} : {params : Promise<{pageName : string}>}) => {

    //const resolveParamsAndFatchServices = async ()
  return (
    <div className='px-5 md:px-[10%] mt-8 mb-10'>
        <div>
            <h1>Bienvenue sur <span></span></h1>
        </div>
    </div>
  )
}

export default page