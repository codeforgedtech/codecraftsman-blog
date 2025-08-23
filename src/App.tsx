import React from 'react';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
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
import MusicPage from './components/Music/MusicPage';
import AppPage from './components/Apps/AppPage.js'; // Importera AppPage-komponenten
import CheckoutPage from './components/Store/CheckoutPage.js';

const App: React.FC = () => {
  return (
    <PayPalScriptProvider options={{ clientId: "ASDRzDOwiS1BCDCZmNGrCGKZ1cF3PV4hqRI99nsUQvcMXZ4TPxAlxEqqSeSypk7G2hYCL8T-NRRSXbzw" }}>
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
              <Route path="/appar" element={<AppPage />} />
              <Route path="/music" element={<MusicPage />} />
              <Route path="/post/:slug" element={<SinglePost />} /> 
              <Route path="/review/:slug" element={<SingleReview />} /> 
              <Route path="/reviews" element={<ReviewList />} /> 
              <Route path="/contact" element={<ContactPage />} /> 
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
    </PayPalScriptProvider>
  );
};

export default App;
