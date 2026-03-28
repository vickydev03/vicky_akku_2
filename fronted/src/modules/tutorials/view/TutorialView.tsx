"use client"
import Navbar from '@/component/Navbar'
import ContainerBox from '@/modules/signin/component/ContainerBox'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import OnlineTutorialDetails from '../component/OnlineTutorialDetails'
import { motion } from 'framer-motion'
function TutorialView({id}:{id:string}) {
    const trpc=useTRPC()
    const {data}=useSuspenseQuery(trpc.tutorials.getTutorial.queryOptions({id}))
  return (
    
    <div className="h-full min-h-screen bg-hero relative">
      <div className=" absolute  z-53 w-full top-5">
        <Navbar />
      </div>

      <div className="h-full  py-24">
        <div className="w-[85%] flex items-center flex-col mx-auto">
          <motion.h1  initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} className="font-passion-one font-bold text-center  text-[#C77F90] text-4xl  lg:text-8xl uppercase">
            {data.title}
          </motion.h1>
          <div className="w-full h-full">
            <ContainerBox
              image={`${data.thumbnail}`}
              children={<OnlineTutorialDetails data={data}/>}
            />
          </div>
        </div>
      </div>

      </div>
  )
}

export default TutorialView