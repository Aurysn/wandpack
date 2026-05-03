import QuizContainer from '@/components/quiz/QuizContainer'

function WandIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      className="inline-block w-6 h-6 sm:w-7 sm:h-7 text-brand-gold fill-current align-middle relative -top-0.5"
      aria-hidden="true"
    >
      {/* Main 4-pointed sparkle star */}
      <path d="M14 2 L15.4 12.6 L26 14 L15.4 15.4 L14 26 L12.6 15.4 L2 14 L12.6 12.6 Z" />
      {/* Small satellite spark upper-right */}
      <path
        d="M23 5 L23.5 7.5 L26 8 L23.5 8.5 L23 11 L22.5 8.5 L20 8 L22.5 7.5 Z"
        opacity="0.55"
      />
      {/* Tiny dot lower-left */}
      <circle cx="5.5" cy="21.5" r="1.1" opacity="0.35" />
    </svg>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-wide sm:tracking-widest uppercase">
            <WandIcon /> Wandpack
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
