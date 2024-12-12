import React from 'react';
/* import { useState, useEffect, useRef } from "react"; */
import { canUseDOM } from 'vtex.render-runtime';
import { useProduct } from 'vtex.product-context'

import styles from "./style.css";

function bindGetPropertyValue(properties) {
    return function getPropertyValue(propertyName) {
        const property = properties?.find(property => property.name === propertyName);
        return property?.values?.[0]
    }
}


export default function ProductVideo() {
    const productContextValue = useProduct();
    const product = productContextValue.product;
    
    const properties = product?.properties
    const getPropertyValue = bindGetPropertyValue(properties)

    // const title = getPropertyValue('titulo')
    const videoProduto = getPropertyValue("video-produto")


    // if (canUseDOM) {
        // console.log("TESTE TESTE")
        // console.log(properties)
        // console.log(bannerProduto)
        // console.log(productContextValue)
    // }

    return (
        <>  
            <section className={[styles.productVideo, "center", "mw9"].join(" ")}>
                { videoProduto ? 
                    <iframe width="560px" height="315px" src={videoProduto} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style={{
                        maxWidth: "100%",
                        height: "auto",
                        width: "100%",
                        aspectRatio: "16/9",
                    }}></iframe>
                : ""}
            </section> 
        </>
    );
}