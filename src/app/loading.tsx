import React from 'react'
import Image from 'next/image'
import logo from '@/public/static/jainco_logo.png'

const loading = () => {
  return (
    <>
     <div className='flex flex-col justify-center items-center min-h-[90vh] w-full bg-zinc-100'>
        <Image 
        src={logo}
        className='w-24 h-auto mb-5'
        alt='Jainco Decor | Decor Your Dream Home'
        />
        <p className='h-2 text-center text-lbold text-primary mb-10'>Decor Your Dream Home</p>
        <div
  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-secondary border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
  role="status">
  <span
    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
    >Loading...</span>
</div>
    </div>
    </>
  )
}

export default loading