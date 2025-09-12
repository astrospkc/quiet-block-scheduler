import Link from 'next/link'
import React from 'react'

const Auth = () => {
    return (
        <div className='  flex flex-col items-center gap-4 justify-center w-full min-h-screen m-auto'>
            <h1 className='text-4xl font-serif font-bold'>Hey User! What&apos;s up? </h1>
            <div className='flex flex-col items-center gap-4'>
                <h1 className='text-2xl font-serif '>If you are new here, please sign up</h1>
                <Link href={'/auth/signUp'}>
                    <button className='bg-violet-500/30 p-3 rounded-2xl cursor-pointer hover:bg-slate-600  font-bold'>Sign Up</button>

                </Link>
            </div>
            <div className='flex flex-col items-center gap-4'>
                <h1 className='text-xl font-semibold font-serif '>If you already have an account, please sign in</h1>
                <Link href={'/auth/login'}>
                    <button className='bg-violet-500/30 p-3 rounded-2xl cursor-pointer hover:bg-slate-600  font-bold'>Login</button>

                </Link>
            </div>

        </div>
    )
}

export default Auth
