import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, 
  AddReview, 
  FindReview, 
  CreatePost, 
  CourseReviewPage, 
  CoursesListPage, 
  AdminPage, 
  Auth, 
  UserDashboard, 
  SearchResultsPage, 
} from './pages';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-dvh">
      {/* Handles routing between different pages in the app
          To add a new page: add a Route below and export the component from pages/index.js */}
      <Navbar /> 
      <div className="flex-1 overflow-auto">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/course-review" element={<CourseReviewPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/add-review" element={<AddReview />} />
        <Route path="/find-review" element={<FindReview />} />
        <Route path="/courses" element={<CoursesListPage />} />
        <Route path="/courses/:courseId/review" element={<CreatePost />} />
        <Route path="/courses/:courseId" element={<CourseReviewPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/search" element={<SearchResultsPage />} />
      </Routes>
      </div>
      </div>
    </BrowserRouter>
  )
}

export default App
