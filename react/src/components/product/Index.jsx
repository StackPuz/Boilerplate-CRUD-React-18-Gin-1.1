import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Util from '../../util'
import Service from './Service'

export default function ProductIndex(props) {

  const [products, setProducts] = useState([])
  const [paging, setPaging] = useState({
    current: 1,
    size: 1,
    last: 1
  })

  useEffect(() => {
    Util.initView()
  }, [])

  useEffect(() => {
    get()
  }, [props.location])

  function get() {
    Service.get().then(response => {
      let query = Util.getQuery()
      setProducts(response.data.products)
      setPaging({
        current: parseInt(query.page) || 1,
        size: parseInt(query.size) || 10,
        last: response.data.last
      })
    }).catch(e => {
      alert(e.response.data.message)
    })
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="col-12"><input id="searchbar_toggle" type="checkbox" />
            <div id="searchbar" className="mb-4">
              <div className="form-group col-lg-2 me-2 mb-lg-0 mb-3">
                <select id="search_col" onChange={()=> Util.searchChange()} className="form-select form-select-sm">
                  <option value="Product.id" data-type="number">Product Id</option>
                  <option value="Product.image">Product Image</option>
                  <option value="Product.name">Product Name</option>
                  <option value="Product.price" data-type="number">Product Price</option>
                  <option value="Brand.name">Brand Name</option>
                  <option value="UserAccount.name">User Account Name</option>
                </select>
              </div>
              <div className="form-group col-lg-2 me-2 mb-lg-0 mb-3">
                <select id="search_oper" className="form-select form-select-sm">
                  <option value="c">Contains</option>
                  <option value="e">Equals</option>
                  <option value="g">&gt;</option>
                  <option value="ge">&gt;&#x3D;</option>
                  <option value="l">&lt;</option>
                  <option value="le">&lt;&#x3D;</option>
                </select>
              </div>
              <div className="form-group col-lg-2 me-2 mb-lg-0 mb-3">
                <input id="search_word" autoComplete="off" onKeyUp={event=> Util.search(event)} className="form-control form-control-sm" />
              </div>
              <div className="col">
                <button className="btn btn-primary btn-sm" onClick={()=> Util.search()}>Search</button>
                <button className="btn btn-secondary btn-sm" onClick={()=> Util.clearSearch()}>Clear</button>
              </div>
            </div>
            <table className="table table-sm table-striped table-hover">
              <thead>
                <tr>
                  <th className={Util.getSortClass('Product.id','asc')}>
                    <Link to={Util.getLink(paging,'sort','Product.id','asc')}>Id</Link>
                  </th>
                  <th className={Util.getSortClass('Product.image') + ' d-none d-md-table-cell' }>
                    <Link to={Util.getLink(paging,'sort','Product.image')}>Image</Link>
                  </th>
                  <th className={Util.getSortClass('Product.name')}>
                    <Link to={Util.getLink(paging,'sort','Product.name')}>Name</Link>
                  </th>
                  <th className={Util.getSortClass('Product.price') + ' d-none d-md-table-cell' }>
                    <Link to={Util.getLink(paging,'sort','Product.price')}>Price</Link>
                  </th>
                  <th className={Util.getSortClass('Brand.name') + ' d-none d-md-table-cell' }>
                    <Link to={Util.getLink(paging,'sort','Brand.name')}>Brand</Link>
                  </th>
                  <th className={Util.getSortClass('UserAccount.name') + ' d-none d-md-table-cell' }>
                    <Link to={Util.getLink(paging,'sort','UserAccount.name')}>Create User</Link>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) =>
                <tr key={index}>
                  <td className="text-center">{product.Id}</td>
                  <td className="d-none d-md-table-cell text-center">{ product.Image && <a href={`http://localhost:8080/uploads/products/${product.Image}`} target="_blank" rel="noreferrer" title={`${product.Image}`}><img className="img-list" src={`http://localhost:8080/uploads/products/${product.Image}`} /></a> }</td>
                  <td>{product.Name}</td>
                  <td className="d-none d-md-table-cell text-end">{product.Price}</td>
                  <td className="d-none d-md-table-cell">{product.BrandName}</td>
                  <td className="d-none d-md-table-cell">{product.UserAccountName}</td>
                  <td className="text-center">
                    <Link className="btn btn-sm btn-secondary" to={`/product/${product.Id}`} title="View"><i className="fa fa-eye"></i></Link>
                    <Link className="btn btn-sm btn-primary" to={`/product/edit/${product.Id}`} title="Edit"><i className="fa fa-pencil"></i></Link>
                    <Link className="btn btn-sm btn-danger" to={`/product/delete/${product.Id}`} title="Delete"><i className="fa fa-times"></i></Link>
                  </td>
                </tr>
                )}
              </tbody>
            </table>
            <div className="row mb-1">
              <div className="col-md-3 col-6">
                <label>Show
                  <select id="page_size" onChange={event=> props.history.push(event.target.value)} value={Util.getLink(paging,'size',paging.size)}>
                    <option value={Util.getLink(paging,'size',10)}>10</option>
                    <option value={Util.getLink(paging,'size',20)}>20</option>
                    <option value={Util.getLink(paging,'size',30)}>30</option>
                  </select>
                  entries
                </label>
              </div>
              <div className="col-md-9 col-6">
                <div className="float-right d-none d-md-block">
                  <ul className="pagination flex-wrap">
                    <li className={`page-item${paging.current <=1 ? ' disabled' : '' }`}>
                      <Link className="page-link" to={Util.getLink(paging,'page',paging.current-1)}>Prev</Link>
                    </li>
                    {Util.getPages(paging.last).map(page => 
                    <li key={page} className={`page-item${paging.current==page ? ' active' : '' }`}>
                      <Link className="page-link" to={Util.getLink(paging,'page',page)}>{page}</Link>
                    </li>
                    )}
                    <li className={`page-item${paging.current>= paging.last ? ' disabled' : ''}`}>
                      <Link className="page-link" to={Util.getLink(paging,'page',paging.current+1)}>Next</Link>
                    </li>
                  </ul>
                </div>
                <div className="float-right d-block d-md-none">
                  <label> Page
                    <select id="page_size" onChange={event=> props.history.push(event.target.value)} value={Util.getLink(paging,'page', paging.current)}>
                      {Util.getPages(paging.last).map(page => 
                      <option key={page} value={Util.getLink(paging,'page',page)}>{page}</option>
                      )}
                    </select>
                  </label> of <span>{paging.last}</span>
                  <div className="btn-group">
                    <Link className={` btn btn-primary btn-sm${paging.current <=1 ? ' disabled' : '' }`} to={Util.getLink(paging,'page',paging.current-1)}><i className="fa fa-chevron-left"></i></Link>
                    <Link className={` btn btn-primary btn-sm${paging.current>= paging.last ? ' disabled' : ''}`} to={Util.getLink(paging,'page',paging.current+1)}><i className="fa fa-chevron-right"></i></Link>
                  </div>
                </div>
              </div>
            </div>
            <Link className="btn btn-sm btn-primary" to="/product/create">Create</Link>
          </div>
          <style dangerouslySetInnerHTML={{ __html: '#searchbar_toggle_menu { display: inline-flex!important }' }} />
        </div>
      </div>
    </div>
  )
}