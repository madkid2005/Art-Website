import React, { useEffect } from 'react'

export default function Product() {
    useEffect(()=>{
        fetch("http://127.0.0.1:8000/api/store/products/?filter_by=on_sale",{

        })
        .then(res=> res.json())
        .then(data=>{
            console.log(data);
            
        })
    },[])
  return (
    <div>Product</div>
  )
}
