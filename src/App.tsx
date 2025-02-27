import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar'; // Importera Sidebar-komponenten
import PostList from './components/Post/PostList'; // Exempel på blogginläggskomponent
import SinglePost from './components/Post/SinglePost';
import ArchivePage from './components/Arcive/ArchivePage';
import AboutPage from './components/About/About';
import ReviewList from './components/Review/ReviewList';
import SingleReview from './components/Review/SingleReview';
import ContactPage from './components/Contact/ContactPage';
import GalleryPage from './components/Gallery/GalleryPage';
import StorePage from './components/Store/StorePage';
const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-black text-white min-h-screen"> {/* Hela appens bakgrund är svart */}
        <div className="flex">
          {/* Sidebar-komponenten */}
          <Sidebar />
          
          <div className="ml-25 w-full"> {/* Innehållet får plats utan att gå under sidomenyn */}
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/wallpaper" element={<GalleryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/post/:slug" element={<SinglePost />} /> 
              <Route path="/review/:slug" element={<SingleReview />} /> 
              <Route path="/reviews" element={<ReviewList />} /> 
              <Route path="/contact" element={<ContactPage />} /> 
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
