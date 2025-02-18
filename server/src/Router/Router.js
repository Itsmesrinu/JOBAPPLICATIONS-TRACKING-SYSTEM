import { Routes, Route } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Login } from '../components/Login/Login';
import { Register } from '../components/Login/Register';
import { JobDetails } from '../components/Home/JobDetails';
import { ShortlistedCandidates } from '../components/ShortlistedCandidates';
import { ShortlistedDetails } from '../components/ShortlistedDetails';
import { AllPostedJobs } from '../Pages/AllPostedJobs';
import { Footer } from '../components/Footer';

// Employer Pages
import { Home } from '../Pages/Employer/Home';
import { PostJob } from '../Pages/Employer/PostJob';
import { AllJobs } from '../Pages/Employer/AllJobs';
import { UpdateJob } from '../Pages/Employer/UpdateJob';

// Recruiter Pages
import { RecruiterDashboard } from '../Pages/Recruiter/RecruiterDashboard';
import { CandidateProfile } from '../Pages/Recruiter/CandidateProfile';

// Coordinator Pages
import { CoordinatorDashboard } from '../Pages/Coordinator/CoordinatorDashboard';
import { AssignRecruiter } from '../Pages/Coordinator/AssignRecruiter';

// Candidate Pages
import { ApplicationForm } from '../Pages/Candidate/ApplicationForm';
import { MyJobs } from '../Pages/Candidate/MyJobs';

// Protected Route Component
import { ProtectedRoute } from '../components/ProtectedRoute';

const Router = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Navbar />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Register />} />
          <Route path='all-posted-jobs' element={<AllPostedJobs />} />
          <Route path='current-job/:id' element={<JobDetails />} />

          {/* Protected Employer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
            <Route path='post-job' element={<PostJob />} />
            <Route path='all-jobs' element={<AllJobs />} />
            <Route path='update-job/:id' element={<UpdateJob />} />
          </Route>

          {/* Protected Recruiter Routes */}
          <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
            <Route path='recruiter/review' element={<RecruiterDashboard />} />
            <Route path='candidate/:id' element={<CandidateProfile />} />
            <Route path='candidates' element={<ShortlistedCandidates />} />
          </Route>

          {/* Protected Coordinator Routes */}
          <Route element={<ProtectedRoute allowedRoles={['coordinator']} />}>
            <Route path='coordinator/review' element={<CoordinatorDashboard />} />
            <Route path='assign-recruiter/:id' element={<AssignRecruiter />} />
          </Route>

          {/* Protected Candidate Routes */}
          <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
            <Route path='my-jobs' element={<MyJobs />} />
            <Route path='application-form/:id' element={<ApplicationForm />} />
          </Route>

          {/* Shared Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['employer', 'coordinator', 'recruiter']} />}>
            <Route path='shortlist' element={<ShortlistedCandidates />} />
            <Route path='shortlist/details/:candidate_id/:job_id' element={<ShortlistedDetails />} />
          </Route>

          {/* Catch-all route */}
          <Route path='*' element={<Home />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
};

export default Router;
