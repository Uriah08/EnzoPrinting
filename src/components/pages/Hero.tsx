import React from 'react'
import Navigation from '../containers/Navigation'
import Main from '../containers/HeroContainers/Main'
import { Session } from 'next-auth'

const Hero = ({session, status}: {session?:Session | null, status?: "authenticated" | "loading" | "unauthenticated"}) => {
  return (
    <section id='home' className='h-[100vh] relative w-full flex flex-col overflow-x-hidden'>
        <Navigation session={session} status={status}/>
        <Main/>
    </section>
  )
}

export default Hero