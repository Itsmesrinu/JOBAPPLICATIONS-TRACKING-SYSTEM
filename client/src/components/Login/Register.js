import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ErrorMessage } from '../common/ErrorMessage'

export const Register = () => {
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const defaultValues = {
        userName: "",
        userEmail: "",
        userPassword: "",
        gender: "Male",
        address: "",
        role: "candidate",
        companyName: "",
        isAssigned: false,
        applications: []
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm({
        defaultValues,
        mode: 'onChange'
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.status === 429) {
                toast.error('Too many attempts. Please try again later.');
                return;
            }

            if (result.success) {
                toast.success('Registration successful!');
                navigate('/login');
            } else {
                throw new Error(result.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (redirect) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [redirect, navigate]);

    return (
        <div className='max-w-scren-2xl w-full md:w-4/6 lg:w-1/2 container mt-2 mx-auto xl:px-24 px-4'>
            <div className='bg-[#e7e7e7] mx-auto py-6 px-6 md:px-16 rounded-lg'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col lg:flex-row gap-8'>
                        <div className='w-full'>
                            <h1 className='text-xl my-1 font-bold text-center'>Register</h1>
                            
                            <div>
                                <label className='block mt-1 m-1 text-sm'>Full Name</label>
                                <input 
                                    type='text'
                                    {...register("userName", { required: "Name is required" })}
                                    placeholder='Ex: Abhishek Sharma'
                                    className='create-job-input placeholder:text-xs md:placeholder:text-sm'
                                />
                                {errors.userName && <ErrorMessage message={errors.userName.message} />}
                            </div>

                            <div>
                                <label className='block mt-2 m-1 text-sm'>Email</label>
                                <input 
                                    type='email'
                                    {...register("userEmail", { 
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    placeholder='Ex: abhisheksharma@gmail.com'
                                    className='create-job-input placeholder:text-xs md:placeholder:text-sm'
                                />
                                {errors.userEmail && <ErrorMessage message={errors.userEmail.message} />}
                            </div>

                            <div>
                                <label className='block mt-2 m-1 text-sm'>Password</label>
                                <input 
                                    type='password'
                                    {...register("userPassword", { 
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                    placeholder='Create strong password'
                                    className='create-job-input placeholder:text-xs md:placeholder:text-sm'
                                />
                                {errors.userPassword && <ErrorMessage message={errors.userPassword.message} />}
                            </div>

                            <div className='grid grid-cols-3 items-center pt-2 md:my-0 ' >
                                <label className='block mt-2 m-1 text-sm'>Gender</label>
                                <div className='flex'>
                                    <input {...register(`gender`, { required: true })} type="radio" value="Male" className='mx-2' />
                                    <p>Male</p>
                                </div>
                                <div className='flex'>
                                    <input {...register(`gender`, { required: true })} type="radio" value="Female" className='mx-2' />
                                    <p>Female</p>
                                </div>
                            </div>

                            <div>
                                <label className='block mt-2 m-1 text-sm'>Address</label>
                                <input type='text' required {...register("address")} placeholder='Ex: A70, Down-Town Street, Mumbai' className='create-job-input placeholder:text-xs md:placeholder:text-sm'></input>
                            </div>
                            <div>
                                <label className='block mt-2 m-1 text-sm'>User Type</label>
                                <select {...register("role", { required: true })} className='create-job-input'>
                                    <option value="candidate">Candidate</option>
                                    <option value="recruiter">Recruiter</option>
                                    <option value="coordinator">Coordinator</option>
                                    <option value="employer">Employer</option>
                                </select>
                            </div>

                            <div>
                                {watch("role") === "employer" && (
                                    <div>
                                        <label className='block mt-2 m-1 text-sm'>Company Name</label>
                                        <input 
                                            type='text'
                                            {...register("companyName", { 
                                                required: watch("role") === "employer" ? "Company name is required" : false 
                                            })}
                                            placeholder='Enter company name'
                                            className='create-job-input placeholder:text-xs md:placeholder:text-sm'
                                        />
                                        {errors.companyName && <ErrorMessage message={errors.companyName.message} />}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-center my-8'>
                        <button type="submit" className='block bg-secondary text-white text-md py-3 px-16 rounded-md'>
                            Register
                        </button>
                    </div>
                </form>
                
                <div className='text-center'>
                    <Link to='/login'>
                        <p className='hover:underline'>Already registered? Login here!</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};
