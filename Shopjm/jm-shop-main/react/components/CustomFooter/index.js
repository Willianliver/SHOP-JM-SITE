import React from 'react';
import { useState, useEffect, useRef } from "react";
import { canUseDOM } from 'vtex.render-runtime';
import { Spinner } from 'vtex.styleguide'

import styles from "./style.css";
import categorias from '../Categorias';

export default function CustomFooter() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        let isMounted = true;
        let response = localStorage.getItem('categories');
        if (false) {
            response = JSON.parse(response);

            let chunkedArray = [];
            let chunkSize = 7;
            for (let i = 0; i < response.length; i += chunkSize) {
                chunkedArray.push(response.slice(i, i + chunkSize));
            }
            if (isMounted) setCategories(chunkedArray);    // add conditional check
            return () => { isMounted = false }; // cleanup toggles value, if unmounted
        } else {
            fetch("/api/catalog_system/pub/category/tree/4")
                .then(response => response.json())
                .then(data => {
                    data.unshift({
                        name: "Ofertas",
                        url: "/144?map=productClusterIds"
                    });
                    localStorage.setItem('categories', JSON.stringify(data));
                    response = data;

                    let chunkedArray = [];
                    let chunkSize = 7;
                    for (let i = 0; i < response.length; i += chunkSize) {
                        chunkedArray.push(response.slice(i, i + chunkSize));
                    }
                    if (isMounted) setCategories(chunkedArray);
                    return () => { isMounted = false };
                });
        }
    }, []);

    if (canUseDOM && Array.isArray(categories) && categories.length > 0) {
        return (
            <div className={styles.customFooterContent}>
                {
                    categories.map((chunk, i) => {
                        if (chunk.length > 0) {
                            return <nav>
                                <ul key={i}>
                                    {
                                        chunk.map((cat, j) => {
                                            return <li key={j} ><a href={cat.url}>{cat.name}</a></li>
                                        })
                                    }
                                </ul>
                            </nav>
                        }
                    })
                }
            </div>
        )
    } else {
        return <div>
            <div className={styles.loadingMenu}>
            </div>
        </div>;
    }

}