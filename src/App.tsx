import React from 'react';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import PostList from './components/Post/PostList';
import SinglePost from './components/Post/SinglePost';
import ArchivePage from './components/Arcive/ArchivePage';
import AboutPage from './components/About/About';
import ReviewList from './components/Review/ReviewList';
import SingleReview from './components/Review/SingleReview';
import ContactPage from './components/Contact/ContactPage';
import StorePage from './components/Store/StorePage';
import MusicPage from './components/Music/MusicPage';
import AppPage from './components/Apps/AppPage.js';
import CheckoutPage from './components/Store/CheckoutPage.js';

const App: React.FC = () => {
  return (
    <PayPalScriptProvider options={{ clientId: "ASDRzDOwiS1BCDCZmNGrCGKZ1cF3PV4hqRI99nsUQvcMXZ4TPxAlxEqqSeSypk7G2hYCL8T-NRRSXbzw" }}>
      <Router>
        <div className="bg-black text-white min-h-screen">
          {/* Sidebar + innehåll direkt intill varandra */}
          <div className="flex min-h-screen gap-0">
            <Sidebar />

            {/* Tightare inner-padding = mindre “glapp” */}
            <main className="flex-1 px-2 lg:px-1">
              <Routes>
                <Route path="/" element={<PostList />} />
                <Route path="/archive" element={<ArchivePage />} />
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
            </main>
          </div>
        </div>
      </Router>
    </PayPalScriptProvider>
  );
};

export default App;
