import React from 'react'
import { ProductsList } from '../shared/ProductsList'
import ProductsPresentation from '../components/Home';
export default function HomePage() {
  return <ProductsPresentation products={ProductsList} />
}
