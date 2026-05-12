import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SemesterId, GradesMap, CalculationResult } from '@/lib/data/types'
import { calculateResults } from '@/lib/calculator'

interface CalculatorState {
  currentSemester: SemesterId
  grades: GradesMap
  firstName: string
  lastName: string
  results: CalculationResult | null
  showResults: boolean
}

interface CalculatorActions {
  setSemester: (id: SemesterId) => void
  setGrade: (moduleKey: string, type: 'exam' | 'td', value: string) => void
  setStudentInfo: (field: 'firstName' | 'lastName', value: string) => void
  calculate: () => void
  reset: () => void
}

export const useCalculatorStore = create<CalculatorState & CalculatorActions>()(
  persist(
    (set, get) => ({
      currentSemester: '1CP-S1',
      grades: {},
      firstName: '',
      lastName: '',
      results: null,
      showResults: false,

      setSemester: (id) =>
        set({ currentSemester: id, grades: {}, results: null, showResults: false }),

      setGrade: (moduleKey, type, value) =>
        set((state) => ({
          grades: {
            ...state.grades,
            [moduleKey]: {
              exam: state.grades[moduleKey]?.exam ?? '',
              td: state.grades[moduleKey]?.td ?? '',
              [type]: value,
            },
          },
        })),

      setStudentInfo: (field, value) => {
        if (field === 'firstName') set({ firstName: value })
        else set({ lastName: value })
      },

      calculate: () => {
        const { currentSemester, grades } = get()
        const results = calculateResults(currentSemester, grades)
        set({ results, showResults: true })
      },

      reset: () =>
        set({
          grades: {},
          firstName: '',
          lastName: '',
          results: null,
          showResults: false,
        }),
    }),
    {
      name: 'estin-calculator-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentSemester: state.currentSemester,
        grades: state.grades,
        firstName: state.firstName,
        lastName: state.lastName,
        results: state.results,
        showResults: state.showResults,
      }),
    }
  )
)
