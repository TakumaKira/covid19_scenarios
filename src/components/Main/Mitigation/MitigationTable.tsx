import React from 'react'

import { useField } from 'formik'
import { useTranslation } from 'react-i18next'
import { FaPlus, FaMinus } from 'react-icons/fa'
import { connect } from 'react-redux'
import { Button, Col, Row } from 'reactstrap'
import { ActionCreator } from 'typescript-fsa'

import type { MitigationInterval } from '../../../algorithms/types/Param.types'
import { UUIDv4 } from '../../../helpers/uuid'
import type { State } from '../../../state/reducer'
import {
  addMitigationInterval,
  removeMitigationInterval,
  addMobilityData,
  removeMobilityData,
} from '../../../state/scenario/scenario.actions'
import { MitigationIntervalComponent } from './MitigationIntervalComponent'

export interface MitigationTableProps {
  addMitigationInterval: ActionCreator<void>
  removeMitigationInterval: ActionCreator<UUIDv4>
  addMobilityData: ActionCreator<void>
  removeMobilityData: ActionCreator<void>
}

const mapStateToProps = (state: State) => ({})

const mapDispatchToProps = {
  addMitigationInterval,
  removeMitigationInterval,
  addMobilityData,
  removeMobilityData,
}

export const MitigationTable = connect(mapStateToProps, mapDispatchToProps)(MitigationTableDisconnected)

export function MitigationTableDisconnected({
  addMitigationInterval,
  removeMitigationInterval,
  addMobilityData,
  removeMobilityData,
}: MitigationTableProps) {
  const { t } = useTranslation()
  const [{ value: mitigationIntervals }] = useField<MitigationInterval[]>('mitigation.mitigationIntervals') // prettier-ignore

  return (
    <>
      <Row>
        <Col>
          <div className="mitigation-table-wrapper">
            {mitigationIntervals.map((interval, index) => {
              return (
                <MitigationIntervalComponent
                  key={interval.id}
                  interval={interval}
                  index={index}
                  onRemove={() => removeMitigationInterval(interval.id)}
                />
              )
            })}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="table-controls text-right align-middle">
            <Button type="button" onClick={() => addMobilityData()}>
              <FaPlus size={20} />
              <span className="ml-2 d-inline align-middle">{t(`Add Mobility Data`)}</span>
            </Button>
          </div>
        </Col>
        <Col>
          <div className="table-controls text-right align-middle">
            <Button type="button" onClick={() => removeMobilityData()}>
              <FaMinus size={20} />
              <span className="ml-2 d-inline align-middle">{t(`Remove Mobility Data`)}</span>
            </Button>
          </div>
        </Col>
        <Col>
          <div className="table-controls text-right align-middle">
            <Button type="button" onClick={() => addMitigationInterval()}>
              <FaPlus size={20} />
              <span className="ml-2 d-inline align-middle">{t(`Add`)}</span>
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
            <p>Google LLC "Google COVID-19 Community Mobility Reports".</p>
            <p>https://www.google.com/covid19/mobility/</p>
        </Col>
      </Row>
    </>
  )
}
