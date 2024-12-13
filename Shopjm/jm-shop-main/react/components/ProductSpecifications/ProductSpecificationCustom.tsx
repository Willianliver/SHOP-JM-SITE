//@ts-ignore
import React, { FC, useMemo, useContext, ReactNode } from 'react'
import { useProduct, SpecificationGroup } from 'vtex.product-context'
import { useState } from "react";


import { Tabs } from 'vtex.styleguide';
import Tab from '@vtex/styleguide/lib/Tabs/Tab';

import styles from "./style.module.css";

import canUseDOM from 'vtex.render-runtime';

import slugify from 'slugify';

interface ProductSpecificationGroupProps {
  filter?: {
    type: 'hide' | 'show'
    specificationGroups: string[]
  }
  children: ReactNode
}

const defaultFilter: ProductSpecificationGroupProps['filter'] = {
  type: 'hide',
  specificationGroups: [],
}

const ProductSpecificationGroup: FC<ProductSpecificationGroupProps> = ({
  filter = defaultFilter,
  // children,
}) => {
  try {


    const { product } = useProduct()

    const { type, specificationGroups: filterSpecificationGroups } = filter
    const specificationGroups = product?.specificationGroups ?? []

    let groups = useMemo(
      () =>
        specificationGroups.filter((group) => {
          if (group.originalName === 'allSpecifications') {
            return false
          }

          const hasGroup = filterSpecificationGroups.includes(group.originalName)

          if ((type === 'hide' && hasGroup) || (type === 'show' && !hasGroup)) {
            return false
          }

          return true
        }),
      [specificationGroups, type, filterSpecificationGroups]
    )

    if (!product && !canUseDOM) {
      return null
    }

    groups = groups.filter((group) => {
      return slugify(group.name, { lower: true }) != "certificados";
    });



    const [currentTab, setTab] = useState(0);

    let maxColumns = 0;
    groups.forEach((group) => {
      if (slugify(group.name, { lower: true }) == "tabela-nutricional" || slugify(group.name, { lower: true }) == "informacao-nutricional") {
        group.specifications.forEach((specification) => {
          if (slugify(specification.name, { lower: true }) == "header") {
            if (specification.values[0].indexOf('%VD*') == -1) {
              specification.values[0] = specification.values[0] + ' - %VD*';
            }
          }
          specification.values.forEach((value) => {
            let columns = value.split(' - ').length;
            if (columns > maxColumns) {
              maxColumns = columns;
            }
          });
        });
      }
    });


    let fakeColumns: any = [];
    for (let i = 0; i < maxColumns; i++) {
      fakeColumns.push(i);
    }

    return (
      <div className={`specificationCustom vtex-store-components-3-x-container ph3 ph5-m ph2-xl mw9 center`}>
        <div>
          <Tabs>
            {groups.map((group, index) => (
              <Tab
                label={group.name}
                active={currentTab === index}
                onClick={() => setTab(index)}>
                {
                  (() => {
                    if (slugify(group.name, { lower: true }) != "receita" && slugify(group.name, { lower: true }) != "receitas") {
                      return <table className={styles.specificationsTable}>
                        {
                          group.specifications.map((specification) => {
                            if (slugify(specification.name, { lower: true }) == 'header') {
                              return (
                                <thead className={styles.specificationRow}>
                                  <tr>
                                    {
                                      specification.values.map((value) => (
                                        <>
                                          <th className={styles.specificationValue}></th>
                                          {
                                            value
                                              .split('-')
                                              .map((colValue, colIndex) => (
                                                <th key={index + colIndex} className={styles.specificationValue}><b>{colValue}</b></th>
                                              ))
                                          }
                                        </>
                                      ))
                                    }
                                  </tr>
                                </thead>
                              );
                            }
                            return null;
                          })
                        }
                        {
                          group.specifications.map((specification) => {
                            if (slugify(specification.name, { lower: true }) != 'header') {
                              return (
                                <tr className={styles.specificationRow}>
                                  <td className={styles.especificationName}>
                                    {specification.name}
                                  </td>
                                  {
                                    slugify(specification.name, { lower: true }) == 'observacao' ?
                                      <td className={styles.specificationValue} colSpan={maxColumns}>
                                        {specification.values[0]}
                                      </td>
                                      :
                                      specification.values.map((value: any) => (
                                        <>
                                          {
                                            slugify(group.name, { lower: true }) == 'tabela-nutricional' || slugify(group.name, { lower: true }) == 'informacao-nutricional' ?
                                              fakeColumns.map((fakeIndex: any, colIndex: any) => (
                                                <td key={index + colIndex}>{value.split(' - ')[fakeIndex] ? value.split(' - ')[fakeIndex] : "-"}</td>
                                              ))
                                              :
                                              value.split(' - ').map((colValue: any, colIndex: any) => (
                                                <td key={index + colIndex} className={styles.specificationValue}>{colValue}</td>
                                              ))
                                          }
                                        </>
                                      ))
                                  }
                                </tr>
                              );
                            }
                            return null;
                          })
                        }
                      </table>
                    } else {
                      if (canUseDOM) {
                        let parser = new DOMParser();
                        let htmlDoc = parser.parseFromString(group.specifications[0].values[0], 'text/html');
                        return <div dangerouslySetInnerHTML={{ __html: htmlDoc.body.innerHTML }} />
                      }
                    }
                    return null;
                  })()
                }
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>
    )
  } catch (error) {
    console.warn('Error in ProductSpecificationGroup', error)
    return null;
  }
}

const SpecificationGroupContext = React.createContext<
  SpecificationGroup | undefined
>(undefined)

export const useProductSpecificationGroup = () => {
  const group = useContext(SpecificationGroupContext)

  return group
}

export default ProductSpecificationGroup
