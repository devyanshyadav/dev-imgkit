import React from 'react'

const Logo = ({size}:{size?:string}) => {
  return (
    <a href="/" className="flex gap-1 *:select-none items-center">
            <img
              src="/logo.png"
              alt="logo"
              style={{ width: size, height: size }}
              className="aspect-square"
            />
            <h2 className="font-semibold flex text-lg flex-col">
              DEV{" "}
              <span className="text-xs text-accent p-0.5 px-2 rounded-full bg-accent/20">
                IMG KIT
              </span>
            </h2>
          </a>
  )
}

export default Logo