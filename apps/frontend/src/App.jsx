import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InitialPage from './pages/InitialPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreateStory from './pages/CreateStory';
import MyWorks from './pages/MyWorks';
import MyStoryDetails from './pages/MyStoryDetails';
import CreateChapter from './pages/CreateChapter';
import ReadChapter from './pages/ReadChapter';
import ChapterEditor from './pages/ChapterEditor.jsx';
import PublicStoryView from './pages/PublicStoryView.jsx';
import useAuth from './config/AuthContext.jsx';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          user ? <Navigate to="/home" /> : <InitialPage />
        } />
        <Route path="/login" element={
          user ? <Navigate to="/home" /> : <LoginPage />
        } />
        <Route path="/register" element={
          user ? <Navigate to="/home" /> : <RegisterPage />
        } />
        <Route path="/home" element={
          user ? <HomePage /> : <Navigate to="/" />
        } />
        <Route path="/create-story" element={
          user ? <CreateStory /> : <Navigate to="/" />
        } />
        <Route path="/myworks" element={
          user ? <MyWorks /> : <Navigate to="/" />
        } />
        <Route path="/myworks/:storyId" element={
          user ? <MyStoryDetails /> : <Navigate to="/" />
        } />
        <Route path="/create-chapter/:storyId" element={
          user ? <CreateChapter /> : <Navigate to="/" />
        } />
        <Route path="/myworks/:storyId/new-chapter" element={
          user ? <CreateChapter /> : <Navigate to="/" />
        } />
        <Route path="/read/:storyId/:chapterNumber" element={
          <ReadChapter />
        } />
        <Route path="/story/:storyId" element={
          <PublicStoryView />
        } />
        <Route path="/myworks/:storyId/edit/:chapterId" element={
          user ? <ChapterEditor /> : <Navigate to="/" />
        } />
      </Routes>
    </Router>
  );
}
export default App;

