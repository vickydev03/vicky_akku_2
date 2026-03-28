import Footer from '@/component/Footer'
import React from 'react'

function layout({children}:{children:React.ReactNode}) {
  return (
    <div>
        {children}
        <Footer/>
    </div>
  )
}

export default layout