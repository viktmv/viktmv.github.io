import React from 'react'
import Toggle from 'react-toggle'
import "react-toggle/style.css"

const Switch = ({toggle, value}) => {
  const toggleValue = ({target}) => toggle(target.checked)
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Toggle
        icons={false}
        defaultChecked={value}
        onChange={toggleValue}
      />
      <span style={{ marginLeft: '1rem' }}>
        Include drafts and mumbles
      </span>
    </label>
  )
}

export default Switch
