import React from 'react'
import Navigation from '../containers/Navigation'
import Main from '../containers/HeroContainers/Main'
import { Session } from 'next-auth'

const Hero = ({session}: {session?:Session | null}) => {
  return (
    <section id='home' className='h-[100vh] relative w-full flex flex-col overflow-x-hidden'>
        <Navigation session={session}/>
        <Main/>
    </section>
  )
}

export default Hero