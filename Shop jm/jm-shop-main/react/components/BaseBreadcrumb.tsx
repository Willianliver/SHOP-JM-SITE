import React, { Fragment, useMemo } from 'react'
import unorm from 'unorm'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
// import { IconCaret } from 'vtex.store-icons'
import { useDevice } from 'vtex.device-detector'

import styles from "./BaseBreadcrumb.css";

const CSS_HANDLES = [
  'container',
  'link',
  'homeLink',
  'arrow',
  'term',
  'termArrow',
] as const

export interface NavigationItem {
  name: string
  href: string
}

export interface Props {
  term?: string
  /** Shape [ '/Department' ,'/Department/Category'] */
  categories: string[]
  categoryTree?: NavigationItem[]
  breadcrumb?: NavigationItem[]
  showOnMobile?: boolean
  homeIconSize?: number
  caretIconSize?: number
}

const makeLink = (str: string) =>
  unorm
    .nfd(str)
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[-\s]+/g, '-')

const getCategoriesList = (categories: string[]): NavigationItem[] => {
  const categoriesSorted = categories
    .slice()
    .sort((a, b) => a.length - b.length)

  return categoriesSorted.map((category) => {
    const categoryStripped = category.replace(/^\//, '').replace(/\/$/, '')
    const currentCategories:any = categoryStripped.split('/')
    const [categoryKey] = currentCategories.reverse()
    const linkCompletion = currentCategories.length === 1 ? '/d' : ''
    const href = `/${makeLink(categoryStripped)}${linkCompletion}`

    return {
      href,
      name: categoryKey,
    }
  })
}

/**
 * Breadcrumb Component.
 */
const Breadcrumb: React.FC<Props> = ({
  term,
  categories,
  categoryTree,
  breadcrumb,
  showOnMobile = false,
  // homeIconSize = 26,
  // caretIconSize = 8,
}) => {
  const handles:any = useCssHandles(CSS_HANDLES)
  const { isMobile } = useDevice()
  const navigationList = useMemo(
    () => breadcrumb ?? categoryTree ?? getCategoriesList(categories),
    [breadcrumb, categories, categoryTree]
  )

  const linkBaseClasses = 'dib pv1 link ph2 c-muted-2'
  const shouldBeRendered = (showOnMobile && isMobile) || !isMobile

  if (!navigationList.length || !shouldBeRendered) {
    return null
  }

  return (
    <div data-testid="breadcrumb" className={`${handles.container} ${styles.breadcrumb} pv3`}>
      <Link
        className={`${handles.link} ${handles.homeLink} ${linkBaseClasses} v-mid ${styles.breadcrumbLink}`}
        page="store.home"
      >
        Home
      </Link>
      {navigationList.map(({ name, href }, i) => {
        let decodedName = ''

        try {
          decodedName = decodeURIComponent(name)
        } catch {
          decodedName = name
        }

        return (
          <span
            key={`navigation-item-${i}`}
          >
            {/* <IconCaret orientation="right" size={caretIconSize} /> */}
            <span className={styles.separator}>{">"}</span>
            <Link
              className={`${linkBaseClasses} ${(i == (navigationList.length - 1) && !term ) ? styles.breadPrincipal : ""}`}
              to={href}
              // See https://github.com/vtex-apps/breadcrumb/pull/66 for the reasoning behind this
              waitToPrefetch={1200}
            >
              {decodedName}
            </Link>
          </span>
        )
      })}

      {term && (
        <Fragment>
          {/* <span
            className={`${handles.arrow} ${handles.termArrow} ph2 c-muted-2`}
          >
            <IconCaret orientation="right" size={caretIconSize} />
          </span> */}
          <span className={styles.separator}>{">"}</span>
          <span className={`${handles.term} ph2 c-on-base ${styles.breadPrincipal}`}>{term}</span>
        </Fragment>
      )}
    </div>
  )
}

Breadcrumb.defaultProps = {
  categories: [],
}

export default Breadcrumb
