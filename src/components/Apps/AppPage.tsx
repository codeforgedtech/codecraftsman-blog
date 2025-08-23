import AdsSection from "../Ads/adsPage";
import { FaGooglePlay, FaGithub, FaAndroid, FaDownload } from "react-icons/fa";

const AppPage = () => {
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
              <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">
                Where to download my apps!
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                All apps are available <span className="text-cyan-300 font-semibold">here</span>. Some of my apps are also available on alternative platforms.
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Google Play */}
                <a
                  href="https://play.google.com/store/apps/developer?id=YourDeveloperName"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-green-600 rounded-lg shadow hover:scale-105 transition-transform"
                >
                  <FaGooglePlay className="text-white w-6 h-6" />
                  <span className="font-semibold text-white ml-2">Google Play</span>
                </a>

                {/* F-Droid */}
                <a
                  href="https://f-droid.org/en/packages/your.package.name/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-blue-700 rounded-lg shadow hover:scale-105 transition-transform"
                >
                  <FaAndroid className="text-white w-6 h-6" />
                  <span className="font-semibold text-white ml-2">F-Droid</span>
                </a>

                {/* GitHub Releases */}
                <a
                  href="https://github.com/yourusername/yourapp/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-gray-800 rounded-lg shadow hover:scale-105 transition-transform"
                >
                  <FaGithub className="text-white w-6 h-6" />
                  <span className="font-semibold text-white ml-2">GitHub</span>
                </a>

                {/* APKMirror */}
                <a
                  href="https://www.apkmirror.com/uploads/?q=yourapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-purple-700 rounded-lg shadow hover:scale-105 transition-transform"
                >
                  <FaDownload className="text-white w-6 h-6" />
                  <span className="font-semibold text-white ml-2">APKMirror</span>
                </a>
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
