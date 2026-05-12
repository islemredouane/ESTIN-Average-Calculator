'use client'

import { useCalculatorStore } from '@/store/calculatorStore'

export default function StudentInfoForm() {
  const firstName = useCalculatorStore((s) => s.firstName)
  const lastName = useCalculatorStore((s) => s.lastName)
  const setStudentInfo = useCalculatorStore((s) => s.setStudentInfo)

  const fields = [
    { id: 'firstName' as const, label: 'First Name', placeholder: 'Enter your first name', value: firstName },
    { id: 'lastName' as const, label: 'Last Name', placeholder: 'Enter your last name', value: lastName },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-2">
          <label htmlFor={field.id} className="text-sm font-medium text-slate-300">
            {field.label}
          </label>
          <input
            type="text"
            id={field.id}
            placeholder={field.placeholder}
            value={field.value}
            onChange={(e) => setStudentInfo(field.id, e.target.value)}
            className="px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
          />
        </div>
      ))}
    </div>
  )
}
