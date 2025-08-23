import AdsSection from "../Ads/adsPage";
import { SiApplemusic, SiSpotify, SiSoundcloud, SiYoutubemusic } from "react-icons/si";
import { HiChartSquareBar } from "react-icons/hi";

const MusicPage = () => {
  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        <div className="p-1 rounded-lg shadow-lg mp-2">
          <AdsSection placement="post-top" />
        </div>
        <div className="w-full max-w-screen-sm sm:max-w-6xl px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">
            Music
          </h1>

          <div className="space-y-6">
            {/* Music Introduction */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">
                Behind the Music
              </h2>
              <p className="text-gray-300 leading-relaxed">
                I'm going to be honest with you — I'm not exactly a natural-born singer.
                But that hasn't stopped me from diving into music creation. All the lyrics
                are written by me and are deeply inspired by my passion for technology,
                software development, and the journey of learning to code.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Since singing isn’t my strongest skill, the vocals you hear are generated
                using AI — a tool that allows me to bring my creative ideas to life in a
                new and experimental way. Each song is an expression of how coding,
                development, and personal growth intersect. Think of it as tech meets
                melody.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Whether you're a developer, a curious listener, or just here to explore
                something new — welcome to my musical experiments.
              </p>
            </section>

            {/* What You Can Expect */}
           {/* Where to Listen */}
           <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">
                Where to Listen
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                All songs are available on{" "}
                <span className="text-cyan-300 font-semibold">SoundCloud</span>. Some tracks are also on other platforms.
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* SoundCloud */}
                <a
                  href="https://soundcloud.com/codecraftsman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-lg shadow hover:scale-105 transition-transform"
                >
                  <SiSoundcloud className="text-white w-6 h-6" />
                  <span className="font-semibold text-white ml-2">SoundCloud</span>
                </a>

                {/* Apple Music */}
                <a
                  href="https://music.apple.com/us/artist/codecraftsman/1825410607"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-gradient-to-r from-pink-600 to-purple-700 rounded-lg shadow hover:scale-105 transition-transform"
                >
                  <SiApplemusic className="text-white w-6 h-6" />
                  <span className="font-semibold text-white ml-2">Apple Music</span>
                </a>

                {/* Spotify */}
                <a
                  href="https://open.spotify.com/artist/0voqr9KSdMAufUnbljpbuH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-green-500 rounded-lg shadow hover:scale-105 transition-transform"
                >
                  <SiSpotify className="text-white w-6 h-6" />
                  <span className="font-semibold text-white ml-2">Spotify</span>
                </a>

                {/* Deezer */}
                <a
                  href="https://www.deezer.com/us/artist/334807261"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-blue-500 rounded-lg shadow hover:scale-105 transition-transform"
                >
                  <HiChartSquareBar className="text-white w-6 h-6" />
                  <span className="font-semibold text-white ml-2">Deezer</span>
                </a>

                {/* YouTube (centered, full width on mobile) */}
                <a
                  href="https://www.youtube.com/channel/UCkW-tg18F3brVDsT7mPZPLw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-red-600 rounded-lg shadow hover:scale-105 transition-transform col-span-full sm:col-span-2 md:col-span-4"
                >
                  <SiYoutubemusic className="text-white w-6 h-6" />
                  <span className="font-semibold text-white ml-2">YouTube Art Track</span>
                </a>
              </div>
            </section>

            {/* Latest EP */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">
                Latest EP: The Compile Abyss
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                I'm excited to share my latest EP, <span className="font-semibold text-cyan-300">The Compile Abyss</span>, which is available to listen to directly on SoundCloud. Here's the full playlist:
              </p>
              <div className="w-full">
                <iframe
                  width="100%"
                  height="300"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2059610679&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                ></iframe>
                <div style={{ fontSize: '10px', color: '#cccccc', lineBreak: 'anywhere', wordBreak: 'normal', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Interstate, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Garuda, Verdana, Tahoma, sans-serif', fontWeight: '100' }}>
                  <a href="https://soundcloud.com/codecraftsman" title="CodeCraftsMan" target="_blank" style={{ color: '#cccccc', textDecoration: 'none' }}>
                    CodeCraftsMan
                  </a> · 
                  <a href="https://soundcloud.com/codecraftsman/sets/the-compile-abyss" title="The Compile Abyss" target="_blank" style={{ color: '#cccccc', textDecoration: 'none' }}>
                    The Compile Abyss
                  </a>
                </div>
              </div>
            </section>

            {/* Join the Journey */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">
                Join the Journey
              </h2>
              <p className="text-gray-300 leading-relaxed">
                I invite you to join me as we explore the world of technology
                together. Whether you're looking to build your own website,
                improve your coding skills, or stay updated on the latest in
                technology, there's something here for you.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;

