"use client";

import About from "@/components/pages/About";
import Contact from "@/components/pages/Contact";
import Footer from "@/components/pages/Footer";
import Hero from "@/components/pages/Hero";
import Product from "@/components/pages/Product";
import Service from "@/components/pages/Service";
import LoadingSpinner from "@/components/ui/loading";

import { useSession } from "next-auth/react";
import React from "react";

export default function Home() {
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (localStorage.getItem("reloaded") === "false") {
      localStorage.setItem("reloaded", "true");
      window.location.reload();
    }
  }, []);
  
  return (
    <div className="w-full h-full">
      {status === "loading" ? (
        <LoadingSpinner/>
      ) : (
        <>
          <Hero session={session} status={status}/>
          <About />
          <Service />
          <Product />
          <Contact session={session}/>
          <Footer />
        </>
      )}
    </div>
  );
}
