import React from 'react'

function DiscoverHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Discover</h1>
        <p className="text-gray-400 text-sm">
          Explore campus life everywhere
        </p>
      </div>

      <div className="w-10 h-10 rounded-full bg-gray-500" />
    </div>
  );
}

export default DiscoverHeader