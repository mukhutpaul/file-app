
import React, { FC, useState } from 'react'
import { setCompanyPageName } from '../actions';

interface SettingsModalProps {
    email?: string | null;
    pageName : string | null;
    onPageNameChange : (newPageName : string) => void
}

const SettingModal: FC<SettingsModalProps> = ({email,pageName,onPageNameChange}) => {
    const [newPage,setNewPage] = useState("")
    const [loading,setLoading] = useState<boolean>(false)

    const handleSave = async () => {
        if(newPage != ""){
            setLoading(true)
            if(email){
                try {
                    await setCompanyPageName(email,newPage)
                    onPageNameChange(newPage)
                    setNewPage("")
                    setLoading(false)
                } catch (error) {
                    console.error(error)
                }
            }
            
        }
    }
  return (

        <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
            <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">Paramettre</h3>
            <label htmlFor="form-control w-full">
                <div className='label'>
                    <span className='label-text'>Le nom de votre page(ce n'est pas modifiable)</span>
                </div>
            
                {pageName ? (
                   <div>
                        <div className='badge badge-accent'>{pageName}</div>
                   </div>
                ):(
                  <div className='space-x-2'>
                    <input 
                    type="text"
                    placeholder='Nom de votre page'
                    className='input input-bordered input-sm w-full'
                    value={newPage}
                    onChange={(e)=>setNewPage(e.target.value)}
                    disabled={loading}
                     />

                    <button
                    className='btn btn-sm w-wit btn-accent mt-3 rounded-2xl'
                     disabled={loading}
                     onClick={handleSave}
                    >
                        {loading ? "Enregistrement...":"Enregisrer"}

                    </button>

                  </div>
                )}
            </label>
                </div>
            
        
        </dialog>

  )
}

export default SettingModal