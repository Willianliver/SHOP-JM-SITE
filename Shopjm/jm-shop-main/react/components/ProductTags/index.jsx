import React from 'react'
import { useProduct } from 'vtex.product-context'
import styles from "./style.css";


const DiscountedPrice = () => {
  const productContext = useProduct()

  if (!productContext || !productContext.selectedItem) return null

  const seller = productContext.selectedItem.sellers[0]
  if (!seller || !seller.commertialOffer) return null

  const sellingPrice = seller.commertialOffer.ListPrice
  const discountedPrice = sellingPrice / 12 // Dividindo por 12x (calculo do preço)
  const formattedPrice = `R$ ${discountedPrice
    .toFixed(2) // Define duas casas decimais
    .replace(".", ",") // Troca ponto por vírgula nos centavos
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` // Adiciona ponto nos milhares
  
  return (
   
    <div className="discounted-price-container">
      {/*<span className={styles.discountedPrice}>12x{formattedPrice}</span>*/}
      <span className={styles.discountedPriceText}>
         à vista, no cartão ou Pix (25% off)
      </span>
    </div>
    
  )
  
}

export default DiscountedPrice
