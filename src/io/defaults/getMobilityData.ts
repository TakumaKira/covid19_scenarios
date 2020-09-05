import type { ScenarioArray, ScenarioData } from '../../algorithms/types/Param.types'

import { Convert } from '../../algorithms/types/Param.types'

import mobilityRaw from '../../assets/data/mobility.json'

import { toInternal } from '../../algorithms/types/convert'

function validate() {
  // const valid = validateScenarioArray(mobilityRaw)
  // if (!valid) {
  //   throw errors
  // }

  return ((mobilityRaw as unknown) as ScenarioArray).all
}

const mobility = validate()

export function getMobilityData(name: string): ScenarioData | null {
  const mobilityFound = mobility.find((s) => s.name === name)
  if (!mobilityFound) {
    console.warn(`Mobility "${name}" not found in JSON`)
    return null
  }

  // FIXME: this should be changed, too hacky
  mobilityFound.data.mitigation = Convert.toScenarioDatumMitigation(JSON.stringify(mobilityFound.data.mitigation))
  return { ...mobilityFound, data: toInternal(mobilityFound.data) }
}
