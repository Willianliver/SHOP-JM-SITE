//@ts-ignore
import React, { FC, useMemo, useContext, ReactNode } from 'react'
import { useProduct, SpecificationGroup } from 'vtex.product-context'
// import { useState } from "react";

import styles from "./style.css";

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

const Certificados: FC<ProductSpecificationGroupProps> = ({
  filter = defaultFilter,
  // children,
}) => {
  const { product } = useProduct()

  if (!product || !canUseDOM) {
    return null
  }


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

  let filtered = groups.filter((group) => {
    return slugify(group.name, { lower: true }) == "certificados";
  });


  if (!!filtered && !!filtered[0] && filtered[0]['specifications'] != undefined) {
    let items = filtered[0]['specifications'];
    let selos = items[0]['values'];

    let certContainer = document.createElement("div");
    certContainer.classList.add(styles.certificados);

    selos.forEach((item) => {
      let img = document.createElement("img");
      img.src = "/arquivos/" + slugify(item, { lower: true }) + ".png";
      img.classList.add("selo");
      img.onerror = function () {
        this.remove();
      };
      certContainer.appendChild(img);
    });

    let productImage = document.querySelector(".vtex-store-components-3-x-productImagesContainer");
    if (productImage && !document.querySelector("." + styles.certificados)) {
      productImage.appendChild(certContainer);
    }

  }

  return <></>;

}

const SpecificationGroupContext = React.createContext<
  SpecificationGroup | undefined
>(undefined)

export const useProductSpecificationGroup = () => {
  const group = useContext(SpecificationGroupContext)

  return group
}

export default Certificados
