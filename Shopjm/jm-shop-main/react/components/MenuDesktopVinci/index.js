import React from 'react';
import { useState, useEffect } from "react";
import axios from 'axios';

import styles from "./style.css";

export default function MenuDesktopVinci({ titulo, ofertas }) {
    titulo = titulo ? titulo : "Todas as categorias";
    ofertas = ofertas ? ofertas : "Ofertas";
    const [categories, setCategories] = useState([]);


    useEffect(() => {
        axios
        .get('/api/catalog_system/pub/category/tree/4')
        .then((response) => {
          const categories = response.data.find((item) => item.name === 'Shop JM');
          if (categories && categories.children) {
            const modifiedChildren = categories.children.map((child) => ({
              ...child,
              url: child.url.replace(/^https?:\/\/[^/]+/, ''), // Remove domínio da URL
            }));
    
            setCategories(modifiedChildren);
          }
        })
        .catch((error) => {
          console.error('Ops! Parece que algo não ocorreu como esperado:', error);
        });
    }, []);
    

    // useEffect(() => {

    //     fetch("/api/catalog_system/pub/category/tree/4")
    //         .then(response => response.json())
    //         .then(data => {
    //             let lorem = [
    //                 {
    //                     name: "lorem",
    //                     url: "#"
    //                 }
    //             ];
    //             // data = data.concat(lorem).concat(lorem).concat(lorem).concat(lorem).concat(lorem).concat(lorem);
    //             setCategories(data)
    //         })

    // }, []);


    function openSubmenu() {
        const submenu = document.querySelector(`.${styles.SubmenuDesktopVinci}`);
        submenu.classList.add(styles.SubmenuDesktopVinci__active);
        const link = document.querySelector(`.${styles.linkDepartamentos}`);
        link.classList.add(styles.MenuDesktopVinci__activeLink);
    }

    function closeSubmenu() {
        // return;
        const submenu = document.querySelector(`.${styles.SubmenuDesktopVinci}`);
        submenu.classList.remove(styles.SubmenuDesktopVinci__active);
        const link = document.querySelector(`.${styles.linkDepartamentos}`);
        link.classList.remove(styles.MenuDesktopVinci__activeLink);
    }

    const chunkSize = 7;
    let categoriesChuncks = [];
    for (let i = 0; i < categories.length; i += chunkSize) {
        const chunk = categories.slice(i, i + chunkSize);
        categoriesChuncks.push(chunk);
    }

    let numberOfItens = Math.floor(window.innerWidth / 110 - window.innerWidth / 200);

    // if(canUseDOM){

    return (
        <div className={styles.customMenu} onMouseLeave={closeSubmenu}>
            <nav className={styles.MenuDesktopVinci}>
                <div className={styles.hamburguerContainer}>
                    <ul className={styles.MenuDesktopVinci__ul}>
                        <li
                            className={`${styles.MenuDesktopVinci__ul_li} ${styles.linkDepartamentos}`}
                            onMouseEnter={openSubmenu}
                        >
                            <svg className={styles.hamburguer} xmlns="http://www.w3.org/2000/svg" width="24.999" height="18" viewBox="0 0 24.999 18"><path class="a" d="M7,105a1,1,0,0,1-1-1v-2a1,1,0,0,1,1-1H30a1,1,0,0,1,1,1v2a1,1,0,0,1-1,1Zm0-7a1,1,0,0,1-1-1V95a1,1,0,0,1,1-1H30a1,1,0,0,1,1,1v2a1,1,0,0,1-1,1Zm0-7a1,1,0,0,1-1-1V88a1,1,0,0,1,1-1H30a1,1,0,0,1,1,1v2a1,1,0,0,1-1,1Z" transform="translate(-6 -87)"/></svg>
                            <span>
                                {titulo}
                            </span>
                        </li>
                    </ul>
                </div>
                <div className={styles.categoriasContainer}>
                    <ul className={categories.length >= 8 ? styles.MenuDesktopVinci__ul : styles.MenuDesktopVinci__ul__minimal}>
                        {categories.slice(0, numberOfItens).map((cat, index) => {
                            return <li className={styles.MenuDesktopVinci__ul_li} key={index}>
                                <a className={styles.MenuDesktopVinci__ul_li_a} href={cat.url}>{cat.name}</a>
                            </li>
                        })}
                        {/* <li className={`${styles.MenuDesktopVinci__ul_li}`}>
                            <a className={`${styles.MenuDesktopVinci__ul_li_a} ${styles.MenuDesktopVinci_ofertas_link}`} href="/144?map=productClusterIds">Ofertas</a>
                        </li> */}
                    </ul>
                </div>
            </nav>
            <nav className={`${styles.SubmenuDesktopVinci}`} onMouseLeave={closeSubmenu}>
                <div className={styles.SubmenuDesktopVinci__content}>
                    {
                        categoriesChuncks.map((chunk, i) => {
                            return <div key={i}>
                                <ul className={styles.SubmenuDesktopVinci__ul}>
                                    {chunk.map((cat, j) => {
                                        return <li key={j}>
                                            <a className={styles.SubmenuDesktopVinci__ul_li_a} href={cat.url}>{cat.name}</a>
                                        </li>
                                    })}
       
                                </ul>
                            </div>
                        })
                    }
                </div>
            </nav>
        </div>
    )
    // } else{
    //     return <></>;
    // }

}