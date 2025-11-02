import React, { Suspense } from 'react'
import Dashboardpage from './page'
import { BarLoader } from 'react-spinners'

const DashboardLayout = () => {
  return (
    <div className='px-5'>
      <h1 className='text-6xl text-blue-900 font-bold mb-5'>Dashboard</h1>
        <Suspense fallback={<BarLoader className="mt-4" color="#0541a2ff" width="100%" />}>
            <Dashboardpage/>
        </Suspense>
    </div>
  )
}

export default DashboardLayout
