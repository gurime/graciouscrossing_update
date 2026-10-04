import MortgageCalculator from '../components/MortgageCalculator'

export default function MortgageCalculatorPage() {
  return (
    <main className="flex-1">
      <section className="bg-[#1e362b] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#dfc99d]">Plan with a clearer picture</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Mortgage calculator</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            Explore an estimated monthly payment using a few starting assumptions.
          </p>
        </div>
      </section>
      <MortgageCalculator />
    </main>
  )
}
