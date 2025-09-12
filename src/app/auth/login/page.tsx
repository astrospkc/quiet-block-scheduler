
"use client"
import React, { useState } from 'react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        console.log(email, password)
        //call api
    }
    return (
        <div className='flex flex-col items-center gap-4'>
            <input className='p-2 rounded-2xl bg-gray-700/50' type="email" placeholder='email' onChange={(e) => setEmail(e.target.value)} />
            <input className='p-2 rounded-2xl bg-gray-700/50' type="password" placeholder='password' onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSubmit} className='bg-violet-500/30 p-3 rounded-2xl cursor-pointer hover:bg-black'>Submit</button>
        </div>
    )
}

export default Login
