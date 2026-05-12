export type SemesterId = '1CP-S1' | '1CP-S2' | '2CP-S1' | '2CP-S2' | '1CS-S1' | '1CS-S2' | '2CS-IA-S1' | '2CS-IA-S2' | '2CS-CS-S1' | '2CS-CS-S2'

export interface Module {
  unit: string
  module: string
  coef: number
  credit: number
}

export interface SemesterInfo {
  name: string
  modules: Module[]
}

export type SemesterData = Record<SemesterId, SemesterInfo>

export interface ModuleGrades {
  exam: string
  td: string
}

export type GradesMap = Record<string, ModuleGrades>

export interface ModuleResult {
  unit: string
  module: string
  coef: number
  credit: number
  key: string
  average: number
  creditsObtained: number
}

export interface UnitResult {
  name: string
  average: number
  credits: number
  totalCredits: number
  modules: ModuleResult[]
}

export interface CalculationResult {
  units: UnitResult[]
  semesterAverage: number
  semesterObtainedCredits: number
  semesterTotalCredits: number
}
