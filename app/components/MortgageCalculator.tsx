'use client'

import { useMemo, useState } from 'react'
import Navbar from './navbar';
import SiteFooter from './SiteFooter';
const currency = new Intl.NumberFormat('en-US', {
style: 'currency',
currency: 'USD',
maximumFractionDigits: 0,
})
function NumberField({ id, label, value, min = 0, step, onChange, suffix }: {
id: string; label: string; value: number; min?: number; step?: number
onChange: (value: number) => void; suffix?: string
}) {
const [text, setText] = useState(String(value))

return (
<label htmlFor={id} className="block text-sm font-medium text-stone-700">
{label}
<span className="mt-2 flex h-12 items-center rounded border border-stone-300 bg-white focus-within:border-[#315b48] focus-within:ring-2 focus-within:ring-[#315b48]/20">
{suffix === '$' && <span className="pl-3 text-stone-500">$</span>}
<input
className="h-full w-full min-w-0 bg-transparent px-3 text-stone-900 outline-none"
id={id}
type="number"
inputMode="decimal"
min={min}
step={step}
value={text}
onChange={(event) => {
setText(event.target.value)
onChange(event.target.value === '' ? 0 : Number(event.target.value))
}}
/>
{suffix && suffix !== '$' && <span className="pr-3 text-stone-500">{suffix}</span>}
</span>
</label>
)
}
export default function MortgageCalculator() {
const [homePrice, setHomePrice] = useState(450000)
const [downPayment, setDownPayment] = useState(90000)
const [interestRate, setInterestRate] = useState(6.5)
const [loanTerm, setLoanTerm] = useState(30)
const [annualTax, setAnnualTax] = useState(5400)
const [monthlyInsurance, setMonthlyInsurance] = useState(150)

const estimate = useMemo(() => {
const principal = Math.max(0, homePrice - downPayment)
const monthlyRate = Math.max(0, interestRate) / 100 / 12
const payments = Math.max(1, loanTerm) * 12
const principalAndInterest = monthlyRate === 0
? principal / payments
: principal * monthlyRate / (1 - (1 + monthlyRate) ** -payments)
const monthlyTax = Math.max(0, annualTax) / 12
const total = principalAndInterest + monthlyTax + Math.max(0, monthlyInsurance)
return { principalAndInterest, monthlyTax, total }
}, [annualTax, downPayment, homePrice, interestRate, loanTerm, monthlyInsurance])

return (
    <>
    <Navbar/>
<section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.1fr_0.9fr] md:py-16">
<div className="rounded-md border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
<h2 className="font-serif text-2xl text-[#24372c]">Adjust your assumptions</h2>
<p className="mt-2 text-sm leading-6 text-stone-600">Enter estimates to see an approximate monthly payment.</p>
<div className="mt-7 grid gap-5 sm:grid-cols-2">
<NumberField id="home-price" label="Home price" value={homePrice} step={5000} onChange={setHomePrice} suffix="$" />
<NumberField id="down-payment" label="Down payment" value={downPayment} step={1000} onChange={setDownPayment} suffix="$" />
<NumberField id="interest-rate" label="Interest rate" value={interestRate} step={0.125} onChange={setInterestRate} suffix="%" />
<NumberField id="loan-term" label="Loan term" value={loanTerm} min={1} step={1} onChange={setLoanTerm} suffix="years" />
<NumberField id="annual-tax" label="Annual property tax" value={annualTax} step={100} onChange={setAnnualTax} suffix="$" />
<NumberField id="insurance" label="Monthly insurance" value={monthlyInsurance} step={25} onChange={setMonthlyInsurance} suffix="$" />
</div>
</div>

<aside className="h-fit rounded-md bg-[#315b48] p-7 text-white shadow-sm sm:p-9">
<p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Estimated monthly payment</p>
<p className="mt-3 font-serif text-5xl">{currency.format(estimate.total)}</p>
<div className="mt-8 space-y-4 border-t border-white/20 pt-5 text-sm">
<div className="flex justify-between gap-4"><span className="text-white/75">Principal &amp; interest</span><span>{currency.format(estimate.principalAndInterest)}</span></div>
<div className="flex justify-between gap-4"><span className="text-white/75">Property tax</span><span>{currency.format(estimate.monthlyTax)}</span></div>
<div className="flex justify-between gap-4"><span className="text-white/75">Home insurance</span><span>{currency.format(Math.max(0, monthlyInsurance))}</span></div>
</div>
<p className="mt-7 text-xs leading-5 text-white/65">
This estimate is for general planning only. It excludes mortgage insurance, HOA fees, closing costs, and other expenses. It is not a loan offer or financial advice.
</p>
</aside>
</section>
<SiteFooter/>
</>
)
}
