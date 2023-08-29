import {
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./order.css";
import { useFormik } from "formik";
import * as Yup from "yup";
export default function Order() {
  const [user] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([
    {
      id: "",
      name: "",
      price: 0,
      stock: 0,
    },
  ]);
  const [success, setSuccess] = useState(false);
  const [searchResult, setSearchResult] = useState([
    {
      id: "",
      name: "",
      price: 0,
      stock: 0,
    },
  ]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0.0);

  const formik = useFormik({
    initialValues: {
      amount: 0.0,
      change: 0,
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .min(total, "Cash amount must be equal or greater than total")
        .max(total + 1000000, "Cash amount is too much")
        .required("Required"),
      change: Yup.number().min(0),
    }),
    onSubmit: (values) => {
      if (values.amount < total) {
        formik.setErrors({
          amount: "Cash must be equal to or greater than total",
        });
        // Set change to 0 if amount is less than total
        formik.setFieldValue("change", 0);
        return;
      }
      createOrder(values);
    },
  });

  useEffect(() => {
    handleSearch();
    if (search === "") setSearchResult([]);
  }, [search]);

  useEffect(() => {
    fetchApi();
  }, [success]);

  useEffect(() => {}, [cart]);

  const handleSearch = () => {
    let searchProduct = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(search) ||
        product.id.includes(search)
      );
    });
    setSearchResult(searchProduct);
  };

  const handleAddToCart = (product) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex !== -1) {
      // If the item already exists in the cart, update its quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // If the item doesn't exist in the cart, add it with quantity 1
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }

    // Calculate and update the total price
    const newTotal = cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    setTotal(newTotal);
  };

  const handleDeleteItem = (product) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart.splice(existingItemIndex, 1);
      setCart(updatedCart);

      // Calculate and update the total price
      const newTotal = updatedCart.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
      setTotal(newTotal);
    }
  };

  const handleUpdateQuantity = (productId, quantity) => {
    const existingItemIndex = cart.findIndex((item) => item.id === productId);

    if (existingItemIndex !== -1) {
      if (quantity * 1 < 0) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity = 0;
        setCart(updatedCart);
        return toast.error("Quantity must be greater than 0");
      }
      // If the item already exists in the cart, update its quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity = quantity;
      setCart(updatedCart);

      // Calculate and update the total price
      const newTotal = updatedCart.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
      setTotal(newTotal);
    }
  };

  const fetchApi = async () => {
    const response = await axios
      .get(`http://vps.akabom.me/api/product`)
      .catch((err) => {
        return err.response;
      });

    if (response.status === 200) {
      setProducts(response.data);
    } else {
      toast.error(response.data.message || "Error");
    }
  };

  const createOrder = async (orderDetails, values) => {
    console.log(user);
    const order = {
      customerName: "",
      salerId: user.id,
      totalItems: cart.reduce((total, item) => {
        return total + item.quantity * 1;
      }, 0),
      totalAmount: cart.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0),
      orderDetails: orderDetails,
    };
    if (formik.values.amount >= total) {
      const response = await axios
        .post(`http://vps.akabom.me/api/order`, order)
        .catch((err) => {
          return err.response;
        });

      if (response.status === 200) {
        setSuccess(!success);
        toast.success(
          `Create order ${response.data.orderId} successfully` ||
            "Order success"
        );
        setCart([]);
        setTotal(0);
        formik.setFieldValue("amount", 0);
        formik.setFieldValue("change", 0);
      } else {
        toast.error(response.data.message || "Order error");
      }
    } else {
      toast.error("Invalid input ");
    }
  };

  const handleOrder = () => {
    console.log(cart);
    let orderDetails = cart.map((item) => {
      return {
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        amount: item.price * item.quantity,
      };
    });

    createOrder(orderDetails);
  };

  return user ? (
    <>
      <div className="m-2">
        <div className="row">
          <div className="col-7">
            <h2>Create Order</h2>
            <label htmlFor="txtSearch">Search Product</label>
            <input
              id="txtSearch"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-7">
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow className="table-header">
                    <TableCell align="left">ID</TableCell>
                    <TableCell align="left">Product Name</TableCell>
                    <TableCell align="left">Price</TableCell>
                    <TableCell align="left">Stock</TableCell>
                    <TableCell align="left">Unit</TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResult.map((product, index) => {
                    return (
                      <TableRow className="table-row" key={product.id}>
                        <TableCell component="th" scope="row">
                          {product.id}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {product.name}
                        </TableCell>
                        <TableCell align="left">
                          {product.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </TableCell>
                        <TableCell align="left">{product.stock}</TableCell>
                        <TableCell align="left">{product.unit}</TableCell>
                        <TableCell align="left">
                          <button onClick={() => handleAddToCart(product)}>
                            Add to cart
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="col-5">
            <form onSubmit={formik.handleSubmit}>
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow className="table-header">
                      <TableCell align="left">Product Name</TableCell>
                      <TableCell align="left">Quantity</TableCell>
                      <TableCell align="left">Price</TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.map((product) => {
                      return (
                        <>
                          <TableRow key={product.id} className="table-row">
                            <TableCell component="th" scope="row">
                              {product.name}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <input
                                type="number"
                                value={product.quantity}
                                onChange={(e) =>
                                  handleUpdateQuantity(
                                    product.id,
                                    e.target.value
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {product.price.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </TableCell>

                            <TableCell component="th" scope="row">
                              <button onClick={() => handleDeleteItem(product)}>
                                Delete
                              </button>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                    <TableRow>
                      <TableCell component="th" scope="row" />
                      <TableCell component="th" scope="row">
                        Quantity
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {cart.reduce((total, item) => {
                          return total + item.quantity * 1;
                        }, 0)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" />
                      <TableCell component="th" scope="row">
                        Total
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {total.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" />
                      <TableCell component="th" scope="row">
                        Cash
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          variant="standard"
                          disableUnderline={true}
                          value={formik.values.amount} // Pass the actual numeric value here
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.amount && formik.errors.amount ? (
                          <p className="error">{formik.errors.amount}</p>
                        ) : null}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" />
                      <TableCell component="th" scope="row">
                        Change
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {/* Display calculated change */}
                        {formik.values.amount > total
                          ? (formik.values.amount - total).toLocaleString(
                              "vi-VN",
                              {
                                style: "currency",
                                currency: "VND",
                              }
                            )
                          : "0"}
                        {/* If amount is less than or equal to total, display 0 */}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <button id="button-order" onClick={handleOrder}>
                Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <h1>Unauthorize</h1>
    </>
  );
}
