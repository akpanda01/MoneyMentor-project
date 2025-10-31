"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

// A simple check icon component to use in the feature list
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 flex-shrink-0 text-violet-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const HeroSection = () => {
  return (
    
    <motion.div
      className="container mx-auto flex flex-col items-center text-center pt-20 pb-24 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col items-center space-y-8">
        
        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl max-w-8xl"
        >
          Manage your finances effortlessly with{" "}
          <span className="text-blue-900">Money Mentor</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-muted-foreground md:text-xl max-w-2xl"
        >
          Your personal finance companion for budgeting, tracking expenses, and
          achieving your financial goals.
          <br /> Harness the power of AI to take control of your money today.
        </motion.p>

        {/* Button Group */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 pt-4"
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-blue-900 hover:bg-blue-200 hover:text-blue-900 px-8 transition-transform duration-200 hover:scale-105"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="hover:bg-blue-200 hover:text-blue-900 px-8 transition-transform duration-200 hover:scale-105"
            >
              Watch Demo
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants} 
          className="pt-12 w-full max-w-7xl" 
        >
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            <div className="w-full lg:w-1/2">
              <Image
                src="/header.png"
                width={1280}
                height={720}
                alt="Dashboard Preview"
                className="rounded-lg shadow-2xl border mx-auto transition-transform duration-500 ease-out hover:scale-105"
                priority
              />
            </div>
            
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4 flex flex-col items-center lg:items-start">
              <h3 className="text-4xl font-bold text-center mb-12 text-blue-900">
                The Problem We Solve
              </h3>
              <p className="text-lg text-muted-foreground max-w-md">
                Managing finances is overwhelming and complex. Rigid budgets fail, and most apps just show data, not actionable advice. This leaves you feeling anxious and stuck. Money Mentor provides the AI-powered insights and smart guidance needed to move beyond simple tracking and finally take control of your financial future.
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}

export default HeroSection