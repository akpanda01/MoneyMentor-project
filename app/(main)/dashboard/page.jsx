import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React from 'react'

const Dashboardpage = () => {
  return (
    <div>
      {/* Budget Progress */}

      {/* Overview */}

      {/* Accounts Grid */}

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <CreateAccountDrawer>
            <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
                <CardContent className='hover:text-black flex flex-col items-center justify-center text-muted-foreground h-full pt-3'>
                    <Plus className='h-10 w-10 mb-2'/>
                    <p className='text-md font-medium'>
                        Add New Account
                    </p>
                </CardContent>
            </Card>
        </CreateAccountDrawer>
      </div>

    </div>
  )
}

export default Dashboardpage
