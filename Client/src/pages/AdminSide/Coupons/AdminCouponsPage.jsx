import React from 'react'
import { useNavigate } from 'react-router-dom'

function AdminCouponsPage() {
  const navigate = useNavigate()
  return (
    <div>
      <button onClick={() => navigate('/dashboard/coupons/add-coupons')}>
        add coupons
      </button>
    </div>
  )
}

export default AdminCouponsPage
