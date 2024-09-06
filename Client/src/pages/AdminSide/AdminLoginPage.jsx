import React from 'react'
import LoginForm from '../../components/layout/AdminSide/LoginForm'
function AdminLoginPage() {
  return (
    <>
      <div className='min-h-screen flex flex-col bg-customP2BackgroundW'>
        <header className='bg-white shadow'>
          <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
            <h1 className='text-3xl font-bold font-secondary tracking-tight text-gray-900'>
              Frame Up
            </h1>
          </div>
        </header>
        <main className='flex-grow flex   pb-12'>
          <LoginForm />
        </main>
      </div>
    </>
  )
}

export default AdminLoginPage
