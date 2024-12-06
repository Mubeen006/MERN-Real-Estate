import React from 'react'
import { Link } from 'react-router-dom'
const SignUp = () => {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' >
        <input type="text" placeholder='username' id="username" className='border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2' />
        <input type="email" placeholder='@gmail.com' id="email"  className='border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2' />
        <input type="password" placeholder='password' id="password"  className='border border-[#158a7b] p-3 rounded-lg focus:outline-none focus:border-2' />
        <button className='bg-gradient-to-r from-[#147d6c] to-[#14a390] text-white p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#14a390] hover:to-[#147d6c]'>
          SIGN UP
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Already have an account?</p>
        <Link to= {"/login"}>
        <span className='text-blue-700'>Login</span></Link>
      </div>
    </div>
  );
}

export default SignUp
