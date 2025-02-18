import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

// Main component to display the jobs a candidate has applied for
export const MyJobs = () => {

    // CSS class for table headers
    const tableHeaderCss = "px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
    
    // const applications = [
    //     {
    //         jobTitle: "Web Developer",
    //         employmentType: "Full Time",
    //         location: "Hyderabad"
    //     },
    //     {
    //         jobTitle: "Data Analyst",
    //         employmentType: "Part Time",
    //         location: "Mumbai"
    //     },
    //     {
    //         jobTitle: "Full Stack Developer",
    //         employmentType: "Full Time",
    //         location: "Delhi"
    //     }
    // ]
    // State to store login data and applications
    const [loginData, setLoginData] = useState();
    const [applications, setApplications] = useState([]);
    
    // Effect to fetch user login data from local storage
    useEffect(() => {
        let token = localStorage.getItem("user"); // Retrieve user token from local storage
        const user = JSON.parse(token); // Parse the token to get user data
        setLoginData(user[0])
        console.log(user); // Log user data for debugging
    }, [])

    // Effect to fetch applications data
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                // Fetch applications for the logged-in user
                const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/user/${loginData?._id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch applications');
                }
                const data = await response.json();
                setApplications(data.applications); // Set applications in state
            } catch (error) {
                console.log(error); // Log any errors
            }
        };

        if (loginData?._id) {
            fetchApplications(); // Fetch applications if login data is available
        }
    }, [loginData]);

    return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>

            <div className='py-1'>
                <div className='w-full '>

                    {/* MAIN TABLE */}
                    <section className="py-1 bg-blueGray-50">
                        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
                                <div className="rounded-t mb-0 px-4 py-3 border-0 bg-secondary text-white ">
                                    <div className="flex flex-wrap items-center">
                                        <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-center">
                                            <h3 className="font-bold text-base text-blueGray-700">My Applications</h3>
                                        </div>

                                    </div>
                                </div>

                                <div className="block w-full overflow-x-hidden">
                                    <table className="items-center bg-transparent w-full border-collapse ">
                                        <thead>
                                            <tr>
                                                <th className={tableHeaderCss}>Job Role</th>
                                                <th className={`${tableHeaderCss} hidden md:table-cell`}>Type</th>
                                                <th className={`${tableHeaderCss} hidden md:table-cell`}>Location</th>
                                                <th className={tableHeaderCss}>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {applications.length > 0 ? (
                                                applications.map((application, key) => (
                                                    <RenderTableRows key={key} application={application} />
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-4">
                                                        No applications found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>

                    </section>
                </div>
            </div>
        </div>
    )
}

// Component to render each row in the applications table
function RenderTableRows({application}){
    
    const tableDataCss = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
    return (

        <tr>
            <th className= {`${tableDataCss} text-left text-blueGray-700 px-3 md:px-6`}>
                {application.jobTitle}
            </th>
            <td className={`${tableDataCss} hidden md:table-cell`}>
                {application.employmentType}
            </td>
            <td className={`${tableDataCss} hidden md:table-cell`}>
                {application.location}
            </td>
            <td className={`${tableDataCss} font-bold hidden md:table-cell`}>
                {application.status}
            </td>
            
        </tr>
    )
}