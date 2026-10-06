import Navbar from "../components/navbar"
import SiteFooter from "../components/SiteFooter"

const questions = [
  {
    question: 'How do I start looking for a home?',
    answer: 'Begin by thinking about your preferred areas, budget, and must-haves. You can explore the sample properties on this site, then connect with the team once business contact details are configured.',
  },
  {
    question: 'Can I use the site to search rental homes?',
    answer: 'Yes. Choose “For rent” in the property search to filter the illustrative rental examples. The current listings are sample content and are not available rentals.',
  },
  {
    question: 'What should I prepare before selling a property?',
    answer: 'It helps to gather basic property information, note any improvements, and consider your ideal timing. A local real estate professional can help you plan pricing and next steps.',
  },
  {
    question: 'How accurate is the mortgage calculator?',
    answer: 'The calculator provides a rough monthly estimate based on principal, interest, property tax, and insurance. It does not include every cost and is not a loan quote. Ask a licensed mortgage professional for a personalized estimate.',
  },
  {
    question: 'Are the properties shown on this site active listings?',
    answer: 'No. The properties and prices currently shown are illustrative sample content used while the property database and listing feed are being connected.',
  },
]

export default function FaqPage() {
  return (
    <>
    <Navbar/>
    <main className="flex-1">
      <section className="bg-[#e9e5da]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#806b44]">Helpful answers</p>
          <h1 className="mt-3 font-serif text-4xl text-[#24372c] sm:text-5xl">Frequently asked questions</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            A few starting points for common questions about finding, renting, and selling a home.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="space-y-3">
          {questions.map(({ question, answer }) => (
            <details key={question} className="group rounded-md border border-stone-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 font-semibold text-[#26362c] marker:hidden focus-visible:outline-2 focus-visible:outline-[#315b48] sm:px-6">
                {question}
                <span aria-hidden="true" className="text-xl font-normal text-[#806b44] transition group-open:rotate-45">+</span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-6 text-stone-600 sm:px-6">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
    <SiteFooter/>
    </>
  )
}
