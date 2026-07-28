import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CCloseButton, CSidebar, CSidebarBrand, CSidebarHeader } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import eOfficelogo from 'src/assets/brand/eofficelogo.svg'
import { sygnet } from 'src/assets/brand/sygnet'
import navigation from '../_nav'
import { set } from '../store'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.ui.sidebarShow)
  const user = useSelector((state) => state.auth.user)

  const filteredNavigation = useMemo(() => {
    const permissions = user?.permissions ?? []

    // First determine which normal menu items are accessible
    const accessibleItems = navigation.filter((item) => {
      // Titles are handled afterwards
      if (!item.to && !item.href) {
        return false
      }

      // No permission defined = visible
      if (!item.permission) {
        return true
      }

      return permissions.includes(item.permission)
    })

    // Sections that contain at least one accessible menu
    const accessibleSections = new Set(
      accessibleItems.filter((item) => item.section).map((item) => item.section),
    )

    return navigation.filter((item) => {
      // Section title
      if (!item.to && !item.href) {
        return item.section && accessibleSections.has(item.section)
      }

      // Menu without permission restriction
      if (!item.permission) {
        return true
      }

      return permissions.includes(item.permission)
    })
  }, [user?.permissions])

  useEffect(() => {
    const style = document.createElement('style')

    style.innerHTML = `
    .sidebar-backdrop,
    .sidebar-backdrop.fade,
    .sidebar-backdrop.show,
    .sidebar-backdrop.fade.show {
      opacity: 0 !important;
      background: transparent !important;
      display: none !important;
    }
  `

    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      visible={sidebarShow}
      narrow={unfoldable}
      onVisibleChange={(visible) => dispatch(set({ sidebarShow: visible }))}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <img src={eOfficelogo} className="sidebar-brand-full" alt="Logo" height={65} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={65} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch(set({ sidebarShow: false }))}
        />
      </CSidebarHeader>
      <AppSidebarNav items={filteredNavigation} collapsed={unfoldable} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
