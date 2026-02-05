import React from 'react'
import { useSearchParams } from 'react-router-dom'

const TypeProduct = ({ name }) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeCategory = searchParams.get('category')
  const isActive = activeCategory === name

  const handleClick = () => {
    const newParams = new URLSearchParams(searchParams)

    if (newParams.get('category') === name) {
      newParams.delete('category')
    } else {
      newParams.set('category', name)
    }

    setSearchParams(newParams)
  }

  return (
    <div
      onClick={handleClick}
      style={{
        padding: '8px 16px',
        cursor: 'pointer',
        color: isActive ? '#326e51' : '#000',
        fontWeight: isActive ? '600' : '400',
        fontSize: '16px',
        borderBottom: isActive ? '2px solid #326e51' : '2px solid transparent',
        whiteSpace: 'nowrap'
      }}
    >
      {name}
    </div>
  )
}

export default TypeProduct