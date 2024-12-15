"use client";

import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import Image from "next/image";
import { motion } from "framer-motion";
import { Anvil, Clock, GalleryVerticalEnd, Paintbrush } from "lucide-react";

const QuoteModal = () => {
    const images = [
        "/products/mugsample1.jpg",
        "/products/mugsample1.jpg",
        "/products/mugsample1.jpg",
        "/products/mugsample1.jpg",
        "/products/mugsample1.jpg",
      ];
  return (
    <div>
      <Modal>
        <ModalTrigger>
        <div className='mt-3 sm:mt-5 py-2 px-4 cursor-pointer bg-main duration-200 transition-all hover:bg-main2 rounded-full font-medium text-[#f3f3f3] sm:text-base text-sm'>
            REQUEST A QUOTE
        </div>
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <h4 className="text-lg md:text-2xl text-neutral-600 font-bold text-center mb-8">
              Request your{" "}
              <span className="px-1 py-0.5 rounded-md bg-gray-100 border border-gray-200">
                Quote
              </span>{" "}
              now! ✈️
            </h4>
            <div className="flex justify-center items-center">
              {images.map((image, idx) => (
                <motion.div
                  key={"images" + idx}
                  style={{
                    rotate: Math.random() * 20 - 10,
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 100,
                  }}
                  whileTap={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 100,
                  }}
                  className="rounded-xl -mr-4 mt-4 p-1 bg-white border border-neutral-100 flex-shrink-0 overflow-hidden"
                >
                  <Image
                    src={image}
                    alt="bali images"
                    width="500"
                    height="500"
                    className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                  />
                </motion.div>
              ))}
            </div>
            <div className="py-10 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start max-w-sm mx-auto">
              <div className="flex  items-center justify-center">
                <GalleryVerticalEnd className="mr-1 text-neutral-700 h-4 w-4" />
                <span className="text-neutral-700 text-sm">
                  5 connecting flights
                </span>
              </div>
              <div className="flex items-center justify-center">
                <Clock className="mr-1 text-neutral-700 h-4 w-4" />
                <span className="text-neutral-700 text-sm">
                  12 hotels
                </span>
              </div>
              <div className="flex items-center justify-center">
                <Paintbrush className="mr-1 text-neutral-700 h-4 w-4" />
                <span className="text-neutral-700 text-sm">
                  69 visiting spots
                </span>
              </div>
              <div className="flex  items-center justify-center">
                <Anvil className="mr-1 text-neutral-700 h-4 w-4" />
                <span className="text-neutral-700 text-sm">
                  Good food everyday
                </span>
              </div>
            </div>
          </ModalContent>
          <ModalFooter className="gap-4">
            <button className="px-2 py-1 bg-gray-200 text-black border-gray-300 rounded-md text-sm w-28">
              Cancel
            </button>
            <button className="bg-black text-white text-sm px-2 py-1 rounded-md border border-black w-28">
              Book Now
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default QuoteModal