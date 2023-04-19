import React from 'react'
import {CSpinner} from "@coreui/react"

const WithBgSpinner = ({ height = '100vh' }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 3000,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: '100%',
    height
  }}
  >
    <div className="d-flex justify-content-center align-items-center" style={{ height: height }}>
      <CSpinner color="info"/>
    </div>
  </div>
)

export default WithBgSpinner