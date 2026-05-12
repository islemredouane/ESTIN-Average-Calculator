import type { SemesterId, GradesMap, CalculationResult } from './data/types'
import { semesterData } from './data/semesters'

export function calculateModuleAverage(exam: number, td: number): number {
  return (exam * 2 + td) / 3
}

export function getModuleKey(moduleName: string, index: number): string {
  return `${moduleName}-${index}`
}

export function calculateResults(
  semesterId: SemesterId,
  grades: GradesMap
): CalculationResult {
  const modules = semesterData[semesterId].modules

  const unitData: Record<string, {
    totalWeightedAverage: number
    totalCoefficients: number
    totalCredits: number
    obtainedCredits: number
    modules: Array<{
      unit: string
      module: string
      coef: number
      credit: number
      key: string
      average: number
      creditsObtained: number
    }>
  }> = {}

  modules.forEach((module, index) => {
    const moduleKey = getModuleKey(module.module, index)
    const examGrade = parseFloat(grades[moduleKey]?.exam || '0')
    const tdGrade = parseFloat(grades[moduleKey]?.td || '0')
    const moduleAvg = calculateModuleAverage(examGrade, tdGrade)

    if (!unitData[module.unit]) {
      unitData[module.unit] = {
        totalWeightedAverage: 0,
        totalCoefficients: 0,
        totalCredits: 0,
        obtainedCredits: 0,
        modules: [],
      }
    }

    unitData[module.unit].totalWeightedAverage += moduleAvg * module.coef
    unitData[module.unit].totalCoefficients += module.coef
    unitData[module.unit].totalCredits += module.credit
    unitData[module.unit].obtainedCredits += moduleAvg >= 10 ? module.credit : 0
    unitData[module.unit].modules.push({
      ...module,
      key: moduleKey,
      average: moduleAvg,
      creditsObtained: moduleAvg >= 10 ? module.credit : 0,
    })
  })

  let semesterWeightedAverage = 0
  let semesterTotalCoefficients = 0
  let semesterTotalCredits = 0
  let semesterObtainedCredits = 0

  const units = Object.keys(unitData).map((unitName) => {
    const data = unitData[unitName]
    const unitAverage =
      data.totalCoefficients > 0
        ? data.totalWeightedAverage / data.totalCoefficients
        : 0

    if (data.totalCoefficients > 0) {
      semesterWeightedAverage += unitAverage * data.totalCoefficients
      semesterTotalCoefficients += data.totalCoefficients
    }

    semesterTotalCredits += data.totalCredits
    semesterObtainedCredits += data.obtainedCredits

    return {
      name: unitName,
      average: unitAverage,
      credits: data.obtainedCredits,
      totalCredits: data.totalCredits,
      modules: data.modules,
    }
  })

  const semesterAverage =
    semesterTotalCoefficients > 0
      ? semesterWeightedAverage / semesterTotalCoefficients
      : 0

  return {
    units,
    semesterAverage,
    semesterObtainedCredits,
    semesterTotalCredits,
  }
}
