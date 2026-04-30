import QuizContainer from '@/components/quiz/QuizContainer'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl font-black text-white tracking-widest uppercase">
            ✨ Tripalis Packendo
          </h1>
          <p className="text-brand-text-secondary mt-2 text-sm tracking-wide">
            Your journey, perfectly packed
          </p>
        </div>
        <QuizContainer />
      </div>
    </main>
  )
}
