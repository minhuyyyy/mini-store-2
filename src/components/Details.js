import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row } from 'react-materialize'

export default function Details() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    fetch(`https://649168742f2c7ee6c2c828cc.mockapi.io/api/v1/ProductList/${id}`)
      .then(response => response.json())
      .then(data => {
        setProduct(data);
      });
  }, [id]);

  if (!product) {
    return <div></div>;
  }
  return (
    <Container style={{ paddingTop: '20px', color: 'black', backgroundColor: 'white' }}>
      <Row>
        <div className="col-md-6"> 
          <div className="card" style={{ justifyContent: 'center', alignItems: 'center', flex: '1 0 auto' }}>
            <img src={product.img} alt={`${product.name}`} style={{ width: '100%', height: '100%', objectPosition: 'center' }} />
          </div>
        </div>
        <div className="col-md-6" style={{ paddingTop: 5 }}>
          <h2>{product.name}</h2>
          <h4 style={{ marginBottom: 0 }}>PRICE: {product.price} VND / {product.unit}</h4>
          <p style={{ marginTop: 5 }}><strong>INFO:</strong> {product.info}</p>
          <p style={{ marginTop: 5 }}><strong>STOCK:</strong> {product.stock}</p>
        </div>
      </Row>
    </Container>
  )
}
