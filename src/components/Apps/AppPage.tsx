import React from "react";
import {
  FaGooglePlay,
  FaGithub,
  FaAndroid,
  FaDownload,
  FaLinux,
  FaWindows,
} from "react-icons/fa";

// --- Types ---
type Platform = {
  name: string;
  href?: string;
  icon: JSX.Element;
  classes: string; // bg color classes for active state
  available: boolean; // toggle true when live
};

// --- UI bits ---
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/20">
    {children}
  </span>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
    <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-6 ring-1 ring-white/10 shadow-2xl">
      {children}
    </div>
  </div>
);

// --- Platform button (with Coming soon ABOVE the button) ---
const PlatformButton = ({ p }: { p: Platform }) => {
  const base =
    "flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-xl font-semibold shadow transition-transform ring-1 text-center w-full";
  const enabled = `${p.classes} hover:scale-[1.03] active:scale-[0.99] text-white ring-white/10`;
  const disabled = "bg-slate-800/70 text-gray-300 cursor-not-allowed ring-white/10";

  const buttonContent = (
    <>
      {p.icon}
      <span>{p.name}</span>
    </>
  );

  return (
    <div className="flex flex-col items-center w-full">
      {!p.available && (
        <span className="mb-2 text-[11px] px-2 py-0.5 rounded-full bg-black/30 text-gray-200 border border-white/10 whitespace-nowrap">
          Coming soon
        </span>
      )}

      {p.available && p.href ? (
        <a
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} ${enabled}`}
          aria-label={`${p.name} – open store page`}
        >
          {buttonContent}
        </a>
      ) : (
        <div
          role="button"
          aria-disabled="true"
          className={`${base} ${disabled}`}
          title="Not available yet"
        >
          {buttonContent}
        </div>
      )}
    </div>
  );
};

// --- Page ---
const AppPage: React.FC = () => {
  const platforms: Platform[] = [
    {
      name: "Google Play",
      href: "https://play.google.com/store/apps/developer?id=YourDeveloperName",
      icon: <FaGooglePlay className="text-white w-5 h-5" />,
      classes: "bg-green-600",
      available: false,
    },
    {
      name: "F-Droid",
      href: "https://f-droid.org/en/packages/your.package.name/",
      icon: <FaAndroid className="text-white w-5 h-5" />,
      classes: "bg-blue-700",
      available: false,
    },
    {
      name: "GitHub",
      href: "https://github.com/yourusername/yourapp/releases",
      icon: <FaGithub className="text-white w-5 h-5" />,
      classes: "bg-gray-800",
      available: false,
    },
    {
      name: "APKMirror",
      href: "https://www.apkmirror.com/uploads/?q=yourapp",
      icon: <FaDownload className="text-white w-5 h-5" />,
      classes: "bg-purple-700",
      available: false,
    },
    {
      name: "Linux",
      href: "https://github.com/yourusername/yourapp/releases", // exempel, byt vid behov
      icon: <FaLinux className="text-white w-5 h-5" />,
      classes: "bg-orange-600",
      available: false,
    },
    {
      name: "Windows",
      href: "https://github.com/yourusername/yourapp/releases", // exempel, byt vid behov
      icon: <FaWindows className="text-white w-5 h-5" />,
      classes: "bg-blue-600",
      available: false,
    },
  ];

  return (
    <div className="bg-black min-h-screen text-white font-sans px-2 sm:px-4 lg:px-6 py-8 w-full overflow-x-hidden">
      <div className="w-full">
        {/* Header */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-[1.15] pb-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent mb-8">
          Apps
        </h1>

        {/* Intro */}
        <Card>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Behind all my apps
          </h2>
          <p className="text-gray-300 leading-relaxed">
            I enjoy crafting small Android apps that make everyday tasks easier. So far I’ve built
            <span className="text-white font-medium"> Sticky Note</span> — a straightforward, on-the-go note app — and
            <span className="text-white font-medium"> Bangolf Protocol</span> — a handy score tracker for miniature golf.
          </p>
          <p className="text-gray-300 leading-relaxed mt-3">
            I also make apps for <span className="font-medium text-white">Linux</span> and <span className="font-medium text-white">Windows</span>, bringing the same attention to detail across platforms.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>Android</Badge>
            <Badge>Linux</Badge>
            <Badge>Windows</Badge>
            <Badge>Open source (planned)</Badge>
            <Badge>Privacy-minded</Badge>
          </div>
        </Card>

        {/* Where to download */}
        <div className="mt-8">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Where to download my apps
              </h2>
              <span className="text-xs text-gray-400">Publishing gradually</span>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4">
              These platforms are coming soon — check back for releases.
            </p>

            {/* Grid: 1 → 2 → 3 → 6 kolumner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {platforms.map((p) => (
                <PlatformButton key={p.name} p={p} />
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 text-xs text-gray-400">
              <span className="inline-flex items-center">
                <span className="w-3 h-3 rounded-sm bg-slate-800/70 mr-2 ring-1 ring-white/10"></span>
                Coming soon (not live yet)
              </span>
            </div>
          </Card>
        </div>

        {/* Join the Journey */}
        <div className="mt-8">
          <Card>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Join the Journey
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Explore the world of mobile and desktop development with me — from idea to publish. Whether you’re building your first app or refining your stack, there’s something here for you.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppPage;




