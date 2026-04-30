import QuizContainer from '@/components/quiz/QuizContainer'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">🧳 Saily</h1>
          <p className="text-gray-500 mt-1 text-sm">Your smart packing assistant</p>
        </div>
        <QuizContainer />
      </div>
    </main>
  )
}
