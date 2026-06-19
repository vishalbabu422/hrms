import React from 'react'
import { useLocation } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { matchPath } from 'react-router-dom'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    for (const route of routes) {
      const match = matchPath({ path: route.path, end: true }, pathname)
      if (match) return route.name
    }
    return false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location
      .split('/')
      .filter(Boolean) // removes empty string
      .reduce((prev, curr, index, array) => {
        const currentPathname = `${prev}/${curr}`
        const routeName = getRouteName(currentPathname, routes)

        if (routeName) {
          breadcrumbs.push({
            pathname: currentPathname,
            name: routeName,
            active: index === array.length - 1,
          })
        }

        return currentPathname
      }, '')

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
