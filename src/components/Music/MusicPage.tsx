
import { SiApplemusic, SiSpotify, SiSoundcloud, SiYoutubemusic, SiAmazon } from "react-icons/si";
import { FaDeezer } from "react-icons/fa";

const MusicPage = () => {
  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        <div className="p-1 rounded-lg shadow-lg mb-2">
        
        </div>
        <div className="w-full max-w-screen-sm sm:max-w-6xl px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">
            Music
          </h1>

          <div className="space-y-10">
            {/* Intro */}
           <section>
  <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">
    Behind the Music
  </h2>
  <p className="text-gray-300 leading-relaxed">
    I'm going to be honest with you — I'm not exactly a natural-born singer.
    But that hasn't stopped me from diving into music creation. All the lyrics
    and the music itself are created by me and are deeply inspired by my passion
    for technology, software development, and the journey of learning to code.
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

            {/* Where to listen */}
           <section>
  <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">
    Where to Listen
  </h2>
  <p className="text-gray-300 leading-relaxed mb-4">
    All songs are available on{" "}
    <span className="text-cyan-300 font-semibold">SoundCloud</span>. Some tracks are also on other platforms.
  </p>

  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
    <a
      href="https://soundcloud.com/codecraftsman"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center p-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-lg shadow hover:scale-105 transition-transform"
      aria-label="SoundCloud"
    >
      <SiSoundcloud className="text-white w-6 h-6" />
      <span className="font-semibold text-white ml-2">SoundCloud</span>
    </a>

    <a
      href="https://music.apple.com/us/artist/codecraftsman/1825410607"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center p-3 bg-gradient-to-r from-pink-600 to-purple-700 rounded-lg shadow hover:scale-105 transition-transform"
      aria-label="Apple Music"
    >
      <SiApplemusic className="text-white w-6 h-6" />
      <span className="font-semibold text-white ml-2">Apple Music</span>
    </a>

    {/* NEW: Amazon Music */}
    <a
      href="https://music.amazon.com/search?keywords=CodeCraftsMan"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow hover:scale-105 transition-transform"
      aria-label="Amazon Music"
    >
      <SiAmazon className="text-white w-6 h-6" />
      <span className="font-semibold text-white ml-2">Amazon Music</span>
    </a>

    <a
      href="https://open.spotify.com/artist/0voqr9KSdMAufUnbljpbuH"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center p-3 bg-green-500 rounded-lg shadow hover:scale-105 transition-transform"
      aria-label="Spotify"
    >
      <SiSpotify className="text-white w-6 h-6" />
      <span className="font-semibold text-white ml-2">Spotify</span>
    </a>

     <a
      href="https://www.deezer.com/us/artist/334807261"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center gap-2 p-3 rounded-lg shadow hover:scale-105 transition-transform bg-gradient-to-r from-neutral-800 to-neutral-900"
      aria-label="Deezer"
    >
      <FaDeezer className="text-white w-6 h-6" />
      <span className="font-semibold text-white">Deezer</span>
    </a>

    <a
      href="https://www.youtube.com/channel/UCkW-tg18F3brVDsT7mPZPLw"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center p-3 bg-red-600 rounded-lg shadow hover:scale-105 transition-transform col-span-full sm:col-span-2 md:col-span-4"
      aria-label="YouTube Art Track"
    >
      <SiYoutubemusic className="text-white w-6 h-6" />
      <span className="font-semibold text-white ml-2">YouTube Art Track</span>
    </a>
  </div>
</section>


            {/* Albums */}
           <section>
  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
    Albums
  </h2>

  <div className="grid md:grid-cols-2 gap-8">
    {/* Album Card */}
    <div className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-cyan-500/40 transition-shadow">
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-3">Runtime Ghosts</h3>
        <iframe
          width="100%"
          height="380"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          className="rounded-lg"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2063145678&color=%23ff5500&auto_play=false"
        ></iframe>
      </div>
    </div>

    <div className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-cyan-500/40 transition-shadow">
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-3">The Compile Abyss</h3>
        <iframe
          width="100%"
          height="380"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          className="rounded-lg"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2059610679&color=%23ff5500&auto_play=false"
        ></iframe>
      </div>
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
