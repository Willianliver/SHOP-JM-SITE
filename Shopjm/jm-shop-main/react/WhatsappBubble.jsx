import React from "react"
import wpp from "../assets/wpp.png"

export default function WhatsappBubble(){
    return (
        <div id="wppBubble" style={{position: "fixed", bottom: "64px", right: "64px"}}>
            <a href="https://api.whatsapp.com/send/?phone=5516991693882&text=Oi!+Estou+entrando+em+contato+pelo+chat+Whatsapp+da+sua+loja+virtual.+Poderia+me+ajudar%3F&type=phone_number&app_absent=0" target='_blank' rel='noreferrer'>
                <img src={wpp} width="64" height="64" />
            </a>
        </div>
    ) 
} 