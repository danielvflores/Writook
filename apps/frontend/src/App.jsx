import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InitialPage from './pages/InitialPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import EditorTest from './pages/EditorTest';
import CreateStory from './pages/CreateStory';
import MyStoryDetails from './pages/MyStoryDetails';
import CreateChapter from './pages/CreateChapter';
import ReadChapter from './pages/ReadChapter';
import ChapterEditor from './pages/ChapterEditor.jsx';
import PublicStoryView from './pages/PublicStoryView.jsx';
import useAuth from './config/AuthContext.js';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
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
        <Route path="/myworks/:storyId" element={
          user ? <MyStoryDetails /> : <Navigate to="/" />
        } />
        <Route path="/create-chapter/:storyId" element={
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
        <Route path="/editor-test" element={
          user ? <EditorTest /> : <Navigate to="/" />
        } />
      </Routes>
    </Router>
  );
}
export default App;

