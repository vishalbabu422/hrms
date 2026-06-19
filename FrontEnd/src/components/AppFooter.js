import React from 'react'
import { CFooter } from '@coreui/react'
import logoFooterDark from 'src/assets/brand/nicLogoWhite.png'
import logoFooterLight from 'src/assets/brand/nicLogoBlack.svg'
import { useState, useEffect } from 'react'

const AppFooter = () => {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-coreui-theme') || 'light',
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-coreui-theme') || 'light'
      setTheme(currentTheme)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-coreui-theme'],
    })

    return () => observer.disconnect()
  }, [])

  const footerLogo = theme === 'dark' ? logoFooterDark : logoFooterLight
  const footerLogoSize = theme === 'light' ? 25 : 30

  return (
    <CFooter className="px-4 d-flex justify-content-center">
      <span className="me-1 text-center">
        eOffice is Mission Mode Project under the National E-Governance Plan, developed and
        implemented by National Informatics Centre (NIC) © 2026 Version {__APP_VERSION__}
      </span>
    </CFooter>
  )
}

export default React.memo(AppFooter)
