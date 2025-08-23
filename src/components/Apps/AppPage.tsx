import AdsSection from "../Ads/adsPage";
import { FaGooglePlay, FaGithub, FaAndroid, FaDownload } from "react-icons/fa";

type Platform = {
  name: string;
  href?: string;
  icon: JSX.Element;
  classes: string;      // bg color classes
  available: boolean;   // toggle this to true when live
};

const AppPage = () => {
  const platforms: Platform[] = [
    {
      name: "Google Play",
      href: "https://play.google.com/store/apps/developer?id=YourDeveloperName",
      icon: <FaGooglePlay className="text-white w-6 h-6" />,
      classes: "bg-green-600",
      available: false, // set to true when published
    },
    {
      name: "F-Droid",
      href: "https://f-droid.org/en/packages/your.package.name/",
      icon: <FaAndroid className="text-white w-6 h-6" />,
      classes: "bg-blue-700",
      available: false,
    },
    {
      name: "GitHub",
      href: "https://github.com/yourusername/yourapp/releases",
      icon: <FaGithub className="text-white w-6 h-6" />,
      classes: "bg-gray-800",
      available: false,
    },
    {
      name: "APKMirror",
      href: "https://www.apkmirror.com/uploads/?q=yourapp",
      icon: <FaDownload className="text-white w-6 h-6" />,
      classes: "bg-purple-700",
      available: false,
    },
  ];

  // Reusable button that handles available/coming-soon states
  const PlatformButton = ({ p }: { p: Platform }) => {
    const base =
      "flex items-center justify-center p-3 rounded-lg shadow transition-transform";
    const enabled =
      `${p.classes} hover:scale-105`;
    const disabled =
      "bg-gray-700/60 cursor-not-allowed ring-1 ring-gray-600/40";

    const content = (
      <>
        {p.icon}
        <span className="font-semibold text-white ml-2">{p.name}</span>
        {!p.available && (
          <span className="ml-3 text-[11px] px-2 py-0.5 rounded-full bg-black/40 text-gray-200 border border-white/10">
            Coming soon
          </span>
        )}
      </>
    );

    return p.available && p.href ? (
      <a
        href={p.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${enabled}`}
      >
        {content}
      </a>
    ) : (
      <div
        role="button"
        aria-disabled="true"
        className={`${base} ${disabled}`}
        title="Not available yet"
      >
        {content}
      </div>
    );
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        <div className="p-1 rounded-lg shadow-lg mp-2">
          <AdsSection placement="post-top" />
        </div>
        <div className="w-full max-w-screen-sm sm:max-w-6xl px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">
            Apps
          </h1>

          <div className="space-y-6">
            {/* App Introduction */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">
                Behind all my apps
              </h2>
              <p className="text-gray-300 leading-relaxed">
                I enjoy creating small Android apps mainly to make my own life easier. So far, I’ve developed two apps: Sticky Note, a straightforward and user-friendly note-taking app designed to keep my thoughts and ideas organized on the go, and Bangolf Protocol, an app that helps track scores and manage game details for miniature golf, making the whole experience smoother and more enjoyable.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Whether you're a developer, curious about new apps, or just here to explore something new — welcome to download my apps.
              </p>
            </section>

            {/* Where to Download */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-2">
                Where to download my apps
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                My apps are being published gradually. They’re not available on these platforms <span className="italic">yet</span>, but they’re on the way. Check back soon! 👇
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {platforms.map((p) => (
                  <PlatformButton key={p.name} p={p} />
                ))}
              </div>

              {/* Optional legend */}
              <div className="mt-3 text-xs text-gray-400">
                <span className="inline-flex items-center">
                  <span className="w-3 h-3 rounded-sm bg-gray-700/60 mr-2 border border-white/10"></span>
                  Coming soon (not live yet)
                </span>
              </div>
            </section>

            {/* Join the Journey */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">
                Join the Journey
              </h2>
              <p className="text-gray-300 leading-relaxed">
                I invite you to join me as we explore the world of technology
                together. Whether you're looking to build your own app,
                improve your coding skills, or stay updated on the latest in
                mobile development, there's something here for you.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPage;

