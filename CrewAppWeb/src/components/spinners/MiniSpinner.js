import React from 'react'
import {CSpinner} from "@coreui/react"

const MiniSpinner = ({ center = false }) =>
  <div className={ center ? 'd-flex justify-content-center' : 'd-inline' }><CSpinner color='warning' size='sm'/></div>

export default MiniSpinner