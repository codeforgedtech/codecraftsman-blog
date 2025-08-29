import React from "react";
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/solid";

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/20">
    {children}
  </span>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
    {/* lite mindre padding för kompaktare kort */}
    <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-4 sm:p-6 ring-1 ring-white/10 shadow-2xl">
      {children}
    </div>
  </div>
);

const AboutPage: React.FC = () => {
  return (
    // helsvart, täcker hela bredden, jämn inre padding & ingen horisontell scroll
    <div className="bg-black min-h-screen text-white font-sans px-2 sm:px-4 lg:px-6 py-8 w-full overflow-x-hidden">
      {/* max-width för behaglig läsbredd, men låt bakgrunden vara 100% */}
      <div className="w-full">
        {/* Header: undvik klippning av nedre delar (j/g) med leading + litet bottom padding */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-[1.15] pb-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent mb-8">
          About Me
        </h1>

        {/* Hero / Intro */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-[220px,1fr] gap-6 md:gap-8 items-center">
            <div className="mx-auto md:mx-0">
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden ring-1 ring-white/10">
                {/* stabil aspekt + lazy */}
                <img
                  src="/assets/mascot.png"
                  alt="CodeCraftsMan mascot"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300">
                <MapPinIcon className="h-5 w-5 text-cyan-400" aria-hidden="true" />
                <span>Hofors, Gästrikland (moved 2024) · from Ronneby, Blekinge</span>
              </div>

              <p className="mt-3 text-gray-200 leading-relaxed">
                My name is <span className="font-semibold text-white">Christer Holm</span>. I manage several online
                platforms and this blog is where I share projects, insights and lessons learned about
                web development, technology and the journey of building things.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>Web dev & tinkerer</Badge>
                <Badge>Writer & tutorial maker</Badge>
                <Badge>AI-assisted music experiments</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* What you can expect */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-cyan-500/10 p-2 ring-1 ring-cyan-400/20">
                <RocketLaunchIcon className="h-6 w-6 text-cyan-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Project Updates</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Regular progress notes, challenges, and previews of what I’m building next.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-cyan-500/10 p-2 ring-1 ring-cyan-400/20">
                <BookOpenIcon className="h-6 w-6 text-cyan-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Guides</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Step-by-step walkthroughs for tools and workflows to help you ship faster.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-cyan-500/10 p-2 ring-1 ring-cyan-400/20">
                <CodeBracketIcon className="h-6 w-6 text-cyan-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Coding Series</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Bite-sized lessons for beginners and practitioners—practical, clear and hands-on.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Skills */}
        <div className="mt-8">
          <Card>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Skills & Focus
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Follow along to learn how to plan, build and run your own website—from fundamentals to more
              advanced techniques.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>HTML</Badge>
              <Badge>CSS</Badge>
              <Badge>JavaScript</Badge>
              <Badge>TypeScript</Badge>
              <Badge>React</Badge>
              <Badge>Tailwind</Badge>
              <Badge>Supabase</Badge>
              <Badge>Git</Badge>
              <Badge>Deployment</Badge>
            </div>
          </Card>
        </div>

        {/* Join the journey CTA */}
        <div className="mt-8">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Join the Journey
                </h2>
                <p className="text-gray-300">
                  Whether you’re starting your first site or levelling up your stack—there’s something here for you.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30"
                >
                  Browse Posts
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 ring-1 ring-white/10"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;


