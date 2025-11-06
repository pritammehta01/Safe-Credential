import React, { useEffect } from 'react'
import { useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
const backendUrl = import.meta.env.VITE_BACKEND_API;


const Manager = () => {
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setpasswordArray] = useState([])
    const getpasswords = async () => {
        let req = await fetch(backendUrl)
        let passwords = await req.json()
        setpasswordArray(passwords)
        console.log(backendUrl);
    }

    useEffect(() => {
        getpasswords()
    }, [])

    const ref = useRef()
    const passref = useRef()
    const showPass = () => {
        if (ref.current.name === "eye-off-sharp") {
            passref.current.type = "text"
            ref.current.name = "eye-sharp"
        }
        else {
            ref.current.name = "eye-off-sharp"
            passref.current.type = "password"
        }
    }
    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })

    }
    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            let newId = form.id || uuidv4(); // keep existing ID if editing, or create a new one

            // Delete only if editing an existing password
            if (form.id) {
                await fetch(backendUrl, { method: "DELETE", headers: { "Content-Type": "application/json" },  body: JSON.stringify({ id: form.id }) });
            }

            const newPassword = { ...form, id: newId };

            // Update local state
            setpasswordArray([...passwordArray, newPassword]);

            // Save to backend
            await fetch(backendUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newPassword) });

            // Reset form
            setform({ site: "", username: "", password: "" });

            toast("Password Saved!");
        } else {
            toast("Error: Password not saved");
        }
    };

    const deletePassword = async (id) => {
        let c = confirm("Do You Want to Delete")
        if (c) {
            setpasswordArray(passwordArray.filter(item => item.id !== id))
            await fetch(backendUrl, { method: "DELETE", headers: { "content-Type": "application/json" }, body: JSON.stringify({ id }) })
             toast("Password Deleted!");

            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item=>item.id !==id)))
        }
    }
    const editPassword = (id) => {
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setpasswordArray(passwordArray.filter(item => item.id !== id))
        toast("Password Edited Successfully!");
    }
    //copy text
    const copyText = (text) => {
        toast('Text copied!');
        navigator.clipboard.writeText(text)

    }

    return (
        <>
            <ToastContainer/>
            <div className="absolute inset-0 -z-10 h-full w-full bg-blue-200 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"
            ><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div></div>

            <div className='p-4 md:container min-h-[85.6vh]'>
                <div className='text-white flex flex-col mx-auto items-center md:w-1/2'>
                    <div className="logo font-bold text-xl text-green-600 mx-auto mb-8">
                        <span className="text-black "> &lt; Credential </span>
                        Manager /&gt;
                        <h2 className='text-orange-300 text-sm text-center'>By Safe Credential</h2>
                    </div>
                    <input value={form.site} onChange={handleChange} placeholder='Enter Website URL' className='border rounded-full my-4 w-full text-black px-3 py-1 md:w-full' type="text" name='site' id='site' />
                    <div className="md:flex w-full relative">
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='border  rounded-full w-full text-black px-3 py-1  mr-3 mb-4' type="text" name='username' id='username' />
                        <input ref={passref} type="password" value={form.password} onChange={handleChange} placeholder='Enter Password' className='border  rounded-full  w-full text-black px-3 py-1  mb-4' name='password' id='password' />
                        <span className='absolute right-3 top-[6px] text-black' onClick={showPass}><ion-icon ref={ref} name="eye-off-sharp" ></ion-icon>
                        </span>
                    </div>
                    <button onClick={savePassword} className='bg-green-600 w-fit rounded-full px-3 flex mt-4 py-1 hover:bg-green-500 text-black'> <lord-icon src="https://cdn.lordicon.com/jgnvfzqg.json"
                        trigger="hover">
                    </lord-icon>&nbsp; Save Password</button>

                    <div className='password w-full text-black'>
                        <h2 className='font-bold text-2xl'>Your Passswords</h2>
                        {passwordArray.length === 0 && <div>No Password to show</div>}
                        {passwordArray.length != 0 && <table className='table-auto w-full rounded-md overflow-hidden'>
                            <thead className='bg-slate-700 text-white'>
                                <tr>
                                    <th className='py-2'>Site</th>
                                    <th className='py-2'>Username</th>
                                    <th className='py-2'>Password</th>
                                    <th className='py-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-slate-200'>
                                {passwordArray.map((item, index) => {
                                    return <tr id={index}>
                                        <td className='py-2 border border-white text-center flex justify-around'><a href={item.site} target='_blank' >{item.site} </a><div onClick={() => { copyText(item.site) }} className='cursor-pointer'><ion-icon name="copy-outline"></ion-icon></div>&nbsp;&nbsp;|</td>
                                        <td className='py-2 border border-white text-center justify-around'>{item.username} <span onClick={() => { copyText(item.username) }} className='cursor-pointer ml-2'><ion-icon name="copy-outline"></ion-icon></span></td>
                                        <td className='py-2 border border-white text-center'>{item.password}<span onClick={() => { copyText(item.password) }} className='ml-2 cursor-pointer '><ion-icon name="copy-outline"></ion-icon></span></td>
                                        <td className='py-2 border border-white text-center'><span className='mx-1 cursor-pointer' onClick={() => { editPassword(item.id) }}><lord-icon src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover" style={{ "width": "22px", "height": "22px" }}>
                                        </lord-icon></span> <span className='mx-1 cursor-pointer' onClick={() => { deletePassword(item.id) }}><lord-icon src="https://cdn.lordicon.com/skkahier.json" trigger="hover" style={{ "width": "22px", "height": "22px" }}></lord-icon></span></td>
                                    </tr>
                                })}
                            </tbody>
                        </table>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Manager