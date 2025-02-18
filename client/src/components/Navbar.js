import React, { useState, useContext, useEffect } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { LoginContext } from './ContextProvider/Context.js';
import 'boxicons/css/boxicons.min.css';
import logoURL from '../assets/img/logo.jpeg'

const employerNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Post Job', path: '/post-job' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Candidates', path: '/shortlist' },
    {
        name: "Candidates",
        path: "/candidates",
        icon: "user"
    },
];
const coordinatorNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/coordinator/dashboard' },
    { label: 'Review', path: '/coordinator/review' },
    { label: 'Shortlisted', path: '/shortlist' }
];
const recruiterNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'All Applications', path: '/recruiter/applications' },
    { label: 'Review Dashboard', path: '/recruiter/dashboard' },
];
const candidateNavItems = [
    { label: 'Home', path: '/' },
    { label: 'All Jobs', path: '/all-posted-jobs' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Applications', path: '/my-jobs' }
];

export const Navbar = () => {
    const navigate = useNavigate();
    const { loginData, setLoginData } = useContext(LoginContext);
    const [navItems, setNavItems] = useState([
        { label: 'Home', path: '/' },
        { label: 'All Jobs', path: '/all-posted-jobs' },
    ]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const MenuIcon = () => (
        <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-primary md:hidden"
        >
            <i className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'} text-2xl`}></i>
        </button>
    );

    useEffect(() => {
        try {
            let token = localStorage.getItem("user");
            if (token) {
                const user = JSON.parse(token);
                setLoginData(user);
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
    }, [setLoginData]);

    useEffect(() => {
        if (loginData?.role === 'coordinator') {
            setNavItems(coordinatorNavItems);
        } else if (loginData?.role === 'recruiter') {
            setNavItems(recruiterNavItems);
        } else if (loginData?.role === 'employer') {
            setNavItems(employerNavItems);
        } else if (loginData?.role === 'candidate') {
            setNavItems(candidateNavItems);
        } else {
            setNavItems([
                { label: 'Home', path: '/' },
                { label: 'All Jobs', path: '/all-posted-jobs' },
            ]);
        }
    }, [loginData]);

    const logoutHandler = () => {
        localStorage.removeItem("usertoken");
        localStorage.removeItem("user");
        setLoginData(null);
        navigate('/login');
    };

    return (
        <div className='max-w-screen container mx-auto xl:px-24 px-4'>
            <nav className='flex justify-between items-center py-6'>
                {/* BRAND */}
                <NavLink to='/' className='flex items-center gap-2 text-2xl text-[#087658]'>
                    <img src={logoURL} className="rounded-full h-12 md:h-16" alt="Logo" />
                    <span className='font-extrabold text-xl md:text-3xl'>humgrow.com</span>
                </NavLink>

                {/* MAIN MENU - Lg device */}
                {navItems && (
                    <ul className="hidden md:flex gap-12 font-bold">
                        {navItems.map(({ label, path }) => (
                            <li key={path} className='text-base text-primary'>
                                <NavLink
                                    to={path}
                                    className={({ isActive }) => isActive ? "active" : ""}
                                >
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                )}

                {/* LOGIN/LOGOUT SECTION */}
                <div>
                    {localStorage.getItem("usertoken") ? (
                        <div className='hidden md:block'>
                            <div className='grid grid-cols-2 items-center gap-4'>
                                <span>Hello, {loginData?.userName}</span>
                                <button 
                                    onClick={logoutHandler} 
                                    className='py-2 px-5 text-center border-2 bg-gray-200 cursor-pointer rounded hover:bg-gray-300'
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='text-base text-primary font-medium space-x-5 hidden md:block'>
                            <Link to="/login" className='py-2 px-5 border rounded bg-gray-100 hover:bg-gray-200'>Login</Link>
                            <Link to="/signup" className='bg-secondary text-white py-2 px-5 border rounded hover:bg-green-700'>Sign Up</Link>
                        </div>
                    )}
                </div>

                {/* HAMBURGER MENU */}
                <MenuIcon />
            </nav>

            {/* MOBILE MENU */}
            {isMenuOpen && (
                <div className="md:hidden font-bold px-4 bg-gray-200 py-5 rounded">
                    <ul className="flex flex-col">
                        {navItems.map(({ label, path }) => (
                            <li key={path} className='text-base text-primary first:text-black py-1'>
                                <NavLink
                                    to={path}
                                    className={({ isActive }) => isActive ? "active" : ""}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                        {localStorage.getItem("usertoken") ? (
                            <li>
                                <button 
                                    onClick={logoutHandler} 
                                    className='py-2 px-5 border rounded mt-2 w-full text-left hover:bg-gray-300'
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li>
                                <Link 
                                    to="/login" 
                                    className='py-1 text-primary block hover:text-green-700'
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            )}

            <Outlet />
        </div>
    );
}

