import './theme.css'

import React from 'react';
import { useEffect } from "react";
import { canUseDOM } from 'vtex.render-runtime';

var manifest = require('../manifest.json');
var style = require('../styles/configs/style.json');

export default function Theme() {


    useEffect(() => {
        if (canUseDOM) {
            console.log("%c " + manifest.name + "@" + manifest.version + " theme.js is running", "color: " + style.semanticColors['active-background'].success + "; font-size: 20px;")

            try {
                const url = '/api/checkout/pvt/configuration/orderForm';

                async function updateData(url, data) {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    return await response;
                }

                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        if (data) {
                            data.recaptchaValidation = "always";
                            updateData(url, data)
                                .then(result => {
                                    fetch(url)
                                        .then(response => response.json())
                                        .then(data => {
                                            console.log("orderForm: ", data)
                                        })
                                })
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } catch (error) {
                console.warn("Theme.js ~ useEffect ~ error", error)
            }

            try {
                const intervalFiltrosTitle = setInterval(() => {
                    let element = document.querySelector(".vtex-search-result-3-x-filterSelected span");
                    if (element) {
                        element.innerText = "Filtrar por:";
                        clearInterval(intervalFiltrosTitle);
                    }
                }, 500);
            } catch (error) {
                console.warn("Theme.js ~ useEffect ~ error", error)
            }
        }

    }, []);


    return <></>

}