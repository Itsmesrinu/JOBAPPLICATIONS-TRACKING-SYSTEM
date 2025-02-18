import { Routes, Route } from 'react-router-dom';
import './App.css';
import 'boxicons/css/boxicons.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { Home } from './Pages/Employer/Home';
import { Navbar } from './components/Navbar';
import { PostJob } from './Pages/Employer/PostJob';
import { AllJobs } from './Pages/Employer/AllJobs';
import { Login } from './components/Login/Login';
import { Register } from './components/Login/Register';
import { RecruiterDashboard } from './Pages/Recruiter/RecruiterDashboard';
import { CoordinatorDashboard } from './Pages/Coordinator/CoordinatorDashboard';
import { JobDetails } from './components/Home/JobDetails';
import { CandidateProfile } from './Pages/Recruiter/CandidateProfile';
import { ShortlistedCandidates } from './components/ShortlistedCandidates';
import { ShortlistedDetails } from './components/ShortlistedDetails';
import { ApplicationForm } from './Pages/Candidate/ApplicationForm';
import { AssignRecruiter } from './Pages/Coordinator/AssignRecruiter';
import { Footer } from './components/Footer';
import { AllPostedJobs } from './Pages/AllPostedJobs';
import { useContext } from 'react';
import { LoginContext } from './components/ContextProvider/Context';
import { UpdateJob } from './Pages/Employer/UpdateJob';
import { MyJobs } from './Pages/Candidate/MyJobs';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import { Dashboard } from './Pages/Dashboard';
import { ApplicationDetails } from './components/Home/ApplicationDetails';
import { CoordinatorReview } from './Pages/Coordinator/CoordinatorReview';
import { AllApplications } from './components/AllApplications';

function App() {
    const { loginData } = useContext(LoginContext);

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Navbar />}>
                    {/* Public Routes */}
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Register />} />
                    <Route path="all-posted-jobs" element={<AllPostedJobs />} />
                    <Route path="current-job/:id" element={<JobDetails />} />
                    <Route path="all-jobs" element={<AllJobs />} />
                    <Route path="my-jobs" element={<MyJobs />} />


                    {/* Protected Dashboard Route */}
                    <Route 
                        path="dashboard" 
                        element={
                            <ProtectedRoute roles={['employer', 'candidate', 'recruiter', 'coordinator']}>
                                <Dashboard/>
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected Employer Routes */}
                    <Route element={<ProtectedRoute roles={['employer']} />}>
                        <Route path="post-job" element={<PostJob />} />
                        <Route path="update-job/:id" element={<UpdateJob />} />
                    </Route>

                    {/* Protected Recruiter Routes */}
                    <Route element={<ProtectedRoute roles={['recruiter']} />}>
                        <Route path="recruiter/dashboard" element={<RecruiterDashboard />} />
                        <Route path="recruiter/applications" element={<AllApplications />} />
                        <Route path="recruiter/applications/:id" element={<CandidateProfile />} />
                    </Route>

                    {/* Protected Coordinator Routes */}
                    <Route element={<ProtectedRoute roles={['coordinator']} />}>
                        {/* Main dashboard for coordinators */}
                        <Route path="coordinator/dashboard" element={<CoordinatorDashboard />} />
                        
                        {/* Assign recruiters to applications */}
                        <Route path="coordinator/assign/:applicationId" element={<AssignRecruiter />} />
                    </Route>

                    {/* Protected Candidate Routes */}
                    <Route element={<ProtectedRoute roles={['candidate']} />}>
                        <Route path="my-jobs" element={<MyJobs />} />
                        <Route path="applications/submit/:jobId" element={<ApplicationForm />} />
                    </Route>

                    {/* Protected Shared Routes for Recruiter and Coordinator */}
                    <Route element={<ProtectedRoute roles={['coordinator', 'recruiter']} />}>
                        <Route path="shortlist" element={<ShortlistedCandidates />} />
                        <Route path="shortlist/:candidate_id/:job_id" element={<ShortlistedDetails />} />
                    </Route>

                    {/* Catch-all route */}
                    <Route path="*" element={<Home />} />
                </Route>
            </Routes>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <Footer />
        </div>
    );
}

export default App;
