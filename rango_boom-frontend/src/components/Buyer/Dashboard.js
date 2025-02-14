import React from 'react'
import BuyerOrders from './BuyerOrders'
import BuyerProfile from './BuyerProfile'

export default function Dashboard() {
  return (
    <div className='container'>
      <div className="row mt-5 d-flex justify-content-center">

        <div className="col-md-3 border rounded-3 d-grid">
          <span className='fw-bold'>مهدی حسینیان
          </span>
          <span style={{color:"#afafaf"}}>
            
          09056860284
          </span>
        <p className=' text-end mt-3 border-top pt-3'><i class="bi bi-house fs-4 ms-2"></i>خلاصه فعالیت </p>
        <p className='fw-bold text-end border-top pt-3'>خلاصه فعالیت </p>
        <p className='fw-bold text-end border-top pt-3'>خلاصه فعالیت </p>
        <p className='fw-bold text-end border-top pt-3'>خلاصه فعالیت </p>
        </div>
        <div className="col-md-8"></div>
      </div>


      {/* <BuyerOrders /> */}
      {/* <BuyerProfile /> */}
    </div>
  )
}