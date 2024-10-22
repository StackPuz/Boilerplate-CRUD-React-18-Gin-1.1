import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Service from './Service'
import Util from '../../util'

export default function OrderDetailCreate(props) {
  
  const [ orderDetail, setOrderDetail ] = useState({})
  const [ products, setProducts ] = useState([])
  const [ errors, setErrors ] = useState({})
  
  useEffect(() => {
    get().finally(() => {
      Util.initView(true)
    })
  }, [])
  
  function get() {
    return Service.create().then(response => {
      setProducts(response.data.products)
    }).catch(e => {
      alert(e.response.data.message)
    })
  }

  function create(e) {
    e.preventDefault()
    Service.create(orderDetail).then(() => {
      props.history.push(Util.getRef('/orderDetail'))
    }).catch((e) => {
      if (e.response.data.errors) {
        setErrors(e.response.data.errors)
      }
      else {
        alert(e.response.data.message)
      }
    })
  }

  function onChange(e) {
    let data = { ...orderDetail }
    data[e.target.name] = e.target.value
    setOrderDetail(data)
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <form method="post" onSubmit={create}>
            <div className="row">
              <div className="mb-3 col-md-6 col-lg-4">
                <label className="form-label" htmlFor="order_detail_order_id">Order Id</label>
                <input id="order_detail_order_id" name="OrderId" className="form-control form-control-sm" onChange={onChange} value={orderDetail.OrderId ?? '' } type="number" required />
                {errors.OrderId && <span className="text-danger">{errors.OrderId}</span>}
              </div>
              <div className="mb-3 col-md-6 col-lg-4">
                <label className="form-label" htmlFor="order_detail_no">No</label>
                <input id="order_detail_no" name="No" className="form-control form-control-sm" onChange={onChange} value={orderDetail.No ?? '' } type="number" required />
                {errors.No && <span className="text-danger">{errors.No}</span>}
              </div>
              <div className="mb-3 col-md-6 col-lg-4">
                <label className="form-label" htmlFor="order_detail_product_id">Product</label>
                <select id="order_detail_product_id" name="ProductId" className="form-select form-select-sm" onChange={onChange} value={orderDetail.ProductId ?? '' } required>
                  <option></option>
                  {products.map((product, index) =>
                  <option key={index} value={product.Id}>{product.Name}</option>
                  )}
                </select>
                {errors.ProductId && <span className="text-danger">{errors.ProductId}</span>}
              </div>
              <div className="mb-3 col-md-6 col-lg-4">
                <label className="form-label" htmlFor="order_detail_qty">Qty</label>
                <input id="order_detail_qty" name="Qty" className="form-control form-control-sm" onChange={onChange} value={orderDetail.Qty ?? '' } type="number" required />
                {errors.Qty && <span className="text-danger">{errors.Qty}</span>}
              </div>
              <div className="col-12">
                <Link className="btn btn-sm btn-secondary" to={Util.getRef('/orderDetail')}>Cancel</Link>
                <button className="btn btn-sm btn-primary">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}