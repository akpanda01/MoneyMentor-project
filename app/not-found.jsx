import React from 'react'

// A simple SVG icon for a "lost" page.
const LostIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-20 w-20 text-violet-300"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const Notfound = () => {
  return (
    // Full-screen background
    <div className="flex items-center justify-center min-h-screen bg-blue-200 px-4">
      {/* Card container */}
      <div className="flex flex-col items-center bg-white p-8 md:p-12 rounded-xl shadow-2xl max-w-lg w-full">
        
        {/* Icon */}
        <div className="mb-6">
          <LostIcon />
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl font-extrabold text-blue-800">
          404
        </h1>
        
        {/* Page title */}
        <h2 className="mt-4 text-3xl font-bold text-blue-900">
          Page Not Found
        </h2>
        
        {/* Description */}
        <p className="mt-2 text-lg text-blue-600 text-center">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        
        {/* "Go Home" button - Styled to match your app's theme */}
        <div className="mt-10">
          <a href="/">
            <span className="inline-block px-8 py-3 text-lg font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors duration-200 cursor-pointer shadow-lg hover:shadow-md">
              Go Back Home
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Notfound

