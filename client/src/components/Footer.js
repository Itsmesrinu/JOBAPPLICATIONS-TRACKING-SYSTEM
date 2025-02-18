import React from 'react'
import logoURL from '../assets/img/logo.jpeg'
import { Link } from 'react-router-dom'

export const Footer = () => {

    const footerNav = ["Jobs","Login","Signup","Post Job"]

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-6 md:mb-0">
                        <Link to="/" className="text-xl font-bold">
                            <img src={logoURL} className="rounded-full h-16" alt="Flowbite Logo" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap ">HumGrow™</span>
                        </Link>
                    </div>
                    <div className="flex flex-wrap justify-between">
                        {/* Quick Links */}
                        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul>
                                {
                                    footerNav.map( (menu, key)=> {
                                        return (
                                            <li key={key} className="mb-2">
                                                <Link to="#" className="hover:text-gray-300">{menu}</Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center ">© 2024 <Link to="/" className="hover:underline">HumGrow™</Link>. All Rights Reserved.</span>
            </div>
        </footer>
    )
}
