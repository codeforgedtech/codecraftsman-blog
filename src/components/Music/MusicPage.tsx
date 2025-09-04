import React from "react";
import {
  SiApplemusic,
  SiSpotify,
  SiSoundcloud,
  SiYoutubemusic,
  SiAmazon,
  SiBandcamp,
} from "react-icons/si";
import { FaDeezer } from "react-icons/fa";

const PlatformTile = ({
  href,
  label,
  Icon,
  gradient,
  spanFull = false,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  gradient: string; // e.g. "from-orange-500 via-red-500 to-pink-500"
  spanFull?: boolean;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`group rounded-xl p-[1px] bg-gradient-to-r ${gradient}
      focus:outline-none focus:ring-2 focus:ring-cyan-500/40
      transition-transform hover:scale-[1.02] active:scale-[0.99]
      ${spanFull ? "col-span-full" : ""}`}
  >
    <div className="flex items-center justify-center gap-2 rounded-[0.70rem] bg-gradient-to-b from-slate-900 to-black px-4 py-3 ring-1 ring-white/10 shadow-[0_0_18px_rgba(34,211,238,0.18)]">
      <Icon className="text-white w-6 h-6" />
      <span className="font-semibold text-white">{label}</span>
    </div>
  </a>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
    <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-6 ring-1 ring-white/10 shadow-2xl">
      {children}
    </div>
  </div>
);

/** Stabil 16:9-embed som är responsiv */
const AlbumCard = ({ title, src }: { title: string; src: string }) => (
  <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent hover:shadow-cyan-500/30 transition-shadow">
    <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-4 ring-1 ring-white/10">
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg ring-1 ring-white/10">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={src}
          title={title}
          allow="autoplay"
          scrolling="no"
          frameBorder="0"
        />
      </div>
    </div>
  </div>
);

const MusicPage = () => {
  return (
    <div className="bg-black min-h-screen text-white font-sans px-2 sm:px-4 lg:px-6 py-8 w-full overflow-x-hidden">
      <div className="w-full">
        {/* Header */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-[1.15] pb-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent mb-8">
          Music
        </h1>

        <div className="space-y-10">
          {/* Intro */}
          <Card>
            <h2 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Behind the Music
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                I'm going to be honest with you — I'm not exactly a natural-born
                singer. But that hasn't stopped me from diving into music
                creation. All the lyrics and the music itself are created by me
                and are deeply inspired by my passion for technology, software
                development, and the journey of learning to code.
              </p>
              <p>
                Since singing isn’t my strongest skill, the vocals you hear are
                generated using AI — a tool that allows me to bring my creative
                ideas to life in a new and experimental way. Each song is an
                expression of how coding, development, and personal growth
                intersect. Think of it as tech meets melody.
              </p>
              <p>
                Whether you're a developer, a curious listener, or just here to
                explore something new — welcome to my musical experiments.
              </p>
            </div>
          </Card>

          {/* Where to Listen */}
          <Card>
            <h2 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Where to Listen
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              All songs are available on{" "}
              <span className="text-cyan-300 font-semibold">SoundCloud</span>.
              Some tracks are also on other platforms.
            </p>

            {/* 2 → 3 → 6 kolumner; YouTube-tile spänner hela raden */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <PlatformTile
                href="https://soundcloud.com/codecraftsman"
                label="SoundCloud"
                Icon={SiSoundcloud}
                gradient="from-orange-500 via-red-500 to-pink-500"
              />
              <PlatformTile
                href="https://music.apple.com/us/artist/codecraftsman/1825410607"
                label="Apple Music"
                Icon={SiApplemusic}
                gradient="from-pink-600 to-purple-700"
              />
              <PlatformTile
                href="https://music.amazon.com/search?keywords=CodeCraftsMan"
                label="Amazon Music"
                Icon={SiAmazon}
                gradient="from-indigo-500 to-purple-600"
              />
              <PlatformTile
                href="https://open.spotify.com/artist/0voqr9KSdMAufUnbljpbuH"
                label="Spotify"
                Icon={SiSpotify}
                gradient="from-green-500 to-emerald-600"
              />
              <PlatformTile
                href="https://www.deezer.com/us/artist/334807261"
                label="Deezer"
                Icon={FaDeezer}
                gradient="from-neutral-800 to-neutral-900"
              />
        

<PlatformTile
  href="https://codecraftsmans.bandcamp.com/"
  label="Bandcamp"
  Icon={SiBandcamp}
  gradient="from-blue-500 to-cyan-600"
/>
              <PlatformTile
                href="https://www.youtube.com/channel/UCkW-tg18F3brVDsT7mPZPLw"
                label="YouTube Art Track"
                Icon={SiYoutubemusic}
                gradient="from-red-600 to-rose-700"
                spanFull
              />
            </div>
          </Card>

          {/* Albums */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
              Albums
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              <AlbumCard
                title="Runtime Ghosts"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2063145678&color=%23ff5500&auto_play=false"
              />
              <AlbumCard
                title="The Compile Abyss"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2059610679&color=%23ff5500&auto_play=false"
              />
              <AlbumCard
                title="Neon Nights, Reimagined"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2071185003&color=%23ff5500&auto_play=false"
              />
            </div>
            
          </section>

          {/* Join the Journey */}
          <Card>
            <h2 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Join the Journey
            </h2>
            <p className="text-gray-300 leading-relaxed">
              I invite you to join me as we explore the world of technology
              together. Whether you're looking to build your own website,
              improve your coding skills, or stay updated on the latest in
              technology, there's something here for you.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;

