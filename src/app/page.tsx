import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to Us</h1>
          <p className="text-xl text-gray-600">Strengthen your relationship together</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Quiz Block */}
          <Link href="/quiz" className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🧠</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Quiz</h2>
              <p className="text-gray-600">
                Interactive quizzes to learn how much you know each other
              </p>
            </div>
          </Link>

          {/* Remember Block */}
          <Link href="/remember" className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📸</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Remember</h2>
              <p className="text-gray-600">
                Photo albums of your shared memories
              </p>
            </div>
          </Link>

          {/* Frustrations Block */}
          <Link href="/frustrations" className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">💭</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Frustrations</h2>
              <p className="text-gray-600">
                Safe space to express concerns with AI counseling
              </p>
            </div>
          </Link>

          {/* Future Block */}
          <Link href="/future" className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📅</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Future</h2>
              <p className="text-gray-600">
                Shared calendar for planning your future together
              </p>
            </div>
          </Link>

          {/* Us'isms Block */}
          <Link href="/usisms" className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">💕</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Us&apos;isms</h2>
              <p className="text-gray-600">
                Dictionary of your couple&apos;s unique language
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
