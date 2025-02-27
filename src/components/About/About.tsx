import AdsSection from "../Ads/adsPage";

const AboutPage = () => {
  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        <div className="p-1 rounded-lg shadow-lg mp-2">
          <AdsSection placement="post-top" />
        </div>
        <div className="w-full max-w-screen-sm sm:max-w-6xl px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">
            About Me
          </h1>

          <div className="space-y-6">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">
                Introduction
              </h2>
              <p className="text-gray-300 leading-relaxed">
                My name is Christer Holm, and I originally hail from the
                charming town of Ronneby in Blekinge. In 2024, I made a
                significant move to Hofors in Gästrikland, a change that has
                invigorated my passion for technology and web development.
                Managing several online platforms is a big part of what I do,
                but this blog will serve as my primary outlet for sharing my
                projects, insights, and experiences with a broader audience.
              </p>
            </section>

            {/* What You Can Expect */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">
                What You Can Expect
              </h2>
              <ul className="space-y-6">
                <li className="p-4 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                    Project Updates
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    I will share regular updates on my current work. This
                    includes detailed progress reports on ongoing projects,
                    insights into the challenges I encounter, and previews of
                    future plans.
                  </p>
                </li>
                <li className="p-4 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                    Guides
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Detailed guides on a range of technical topics and tools
                    designed to help you understand and utilize different
                    technologies effectively.
                  </p>
                </li>
                <li className="p-4 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                    Coding Series
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    A series of coding lessons, breaking down basics into
                    digestible concepts and offering practical and
                    easy-to-follow steps for beginners and seasoned developers
                    alike.
                  </p>
                </li>
              </ul>
            </section>

            {/* Skills and Knowledge */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-4">
                Skills and Knowledge
              </h2>
              <p className="text-gray-300 leading-relaxed">
                By following this blog, you will acquire the skills and
                knowledge needed to start and manage your own website
                independently, from fundamental coding principles to more
                advanced techniques.
              </p>
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

export default AboutPage;
