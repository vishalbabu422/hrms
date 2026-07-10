import { useEffect, useRef, useState } from 'react'
import { CFormInput, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const ExpandableSearch = ({
  onSearchChange,
  placeholder = 'Search...',
  width = 220,
  delay = 400,
}) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const ref = useRef(null)

  //Debounce logic here
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay, onSearchChange])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target) && value === '') {
        setOpen(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && value === '') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [value])

  return (
    <div ref={ref} className="d-flex align-items-center">
      <CFormInput
        type="search"
        size="sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={open}
        style={{
          width: open ? `${width}px` : '0px',
          opacity: open ? 1 : 0,
          padding: open ? '0.25rem 0.5rem' : '0',
          marginRight: open ? '0.5rem' : '0',
          transition: 'width 0.3s ease, opacity 0.2s ease',
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {!open && (
        <CButton color="link" className="p-0" onClick={() => setOpen(true)}>
          <CIcon icon={cilSearch} size="lg" />
        </CButton>
      )}
    </div>
  )
}

export default ExpandableSearch
