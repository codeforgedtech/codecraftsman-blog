import React, { useEffect, useState } from 'react';
import { fetchAdsByPlacement } from './adsApi'; // Importera funktionen här

interface AdsSectionProps {
  placement: string;
}

const AdsSection: React.FC<AdsSectionProps> = ({ placement }) => {
  const [ads, setAds] = useState<any[]>([]);
  const [currentAd, setCurrentAd] = useState<any>(null);

  useEffect(() => {
    const fetchAds = async () => {
      const adsData = await fetchAdsByPlacement(placement); // Hämta annonser
      setAds(adsData);
    };

    fetchAds();
  }, [placement]);

  useEffect(() => {
    if (ads.length > 0) {
      // Slumpa och sätt en annons varje gång annonser hämtas
      const randomAd = ads[Math.floor(Math.random() * ads.length)];
      setCurrentAd(randomAd);

      // Alternativt, om du vill att annonsen ska bytas ut regelbundet, använd en timer:
      const interval = setInterval(() => {
        const newRandomAd = ads[Math.floor(Math.random() * ads.length)];
        setCurrentAd(newRandomAd);
      }, 5000); // Byt annons varje 5:e sekund (kan justeras)

      return () => clearInterval(interval); // Rensa intervallet när komponenten avmonteras
    }
  }, [ads]);

  if (!currentAd) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`ads-section ads-${placement}`}>
      <div key={currentAd.id} className="ad-card">
        <a href={currentAd.linkUrl} target="_blank" rel="noopener noreferrer">
          <img src={currentAd.imageUrl} alt={currentAd.altTitle} />
        </a>
      </div>
    </div>
  );
};

export default AdsSection;
