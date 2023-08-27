import { Button, Input } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

function Checkout({ cart, setCart }) {
  const [quantity, setQuantity] = useState({});
  const [amount, setAmount] = useState(0);
  const [cash, setCash] = useState(0.0);
  const [change, setChange] = useState(0.0);
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState([]);
  const [removedProducts, setRemovedProducts] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const [currentUser, setCurrentUser] = useState([]);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    checkUser();
  }, [user]);

  const checkUser = async () => {
    try {
      if (user) {
        setCurrentUser(user);
      }
    } catch (e) {
      console.error(e);
      setMsg("Something went wrong");
    }
  };
  useEffect(() => {
    let totalAmount = 0;
    Object.keys(cart).forEach((productId) => {
      totalAmount += cart[productId].price * (quantity[productId] || 0);
    });
    setAmount(totalAmount);

    const orderDetails = Object.keys(cart).map((productId) => ({
      productId: productId,
      productName: cart[productId].name,
      unitPrice: cart[productId].price,
      unit: cart[productId].unit,
      quantity: quantity[productId] || 0,
    }));
    setOrder(orderDetails);
    console.log(order.length);
  }, [cart, quantity]);

  const handleInputChange = (e, productId) => {
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [productId]: e.target.value,
    }));
  };

  const handleCashChange = (e) => {
    const cashValue = e.target.value;
    setCash(cashValue);
    if (cashValue <= amount) {
      setChange(0);
    } else {
      setChange(Math.round(cashValue - amount));
    }
  };

  const deleteProductInCart = (productId) => {
    const updatedCart = { ...cart };
    delete updatedCart[productId];

    setCart(updatedCart);

    const updatedOrder = order.filter((item) => item.productId !== productId);
    setOrder(updatedOrder);
  };

  const submitOrder = async () => {
    console.log("Submitting order...");

    const newOrder = {
      customerName: "",
      salerId: user.id,
      orderDetails: order,
    };

    try {
      if (order.length === 0) {
        console.log("Empty cart.");
        toast.error("Empty cart");
      } else if (cash < amount) {
        console.log("Invalid cash.");
        setChange(0);
        toast.error("Invalid cash");
      } else {
        console.log("Submitting the order...");
        if (cash >= amount) {
          const response = await axios
            .post(`${API_URL}/order`, newOrder)
            .catch((error) => {
              return error.response;
            });
          console.log("API Response:", response);
          if (response.status === 200) {
            console.log("Order submitted successfully.");
            toast.success("Order submitted successfully");
            setRemovedProducts([]);
            setCart({});
            setOrder([]);
            setCash(0);
            setChange(0);
          } else if (response.status === 400) {
            toast.error(response.data.message);
          } else {
            console.log(response.status.message);
          }
        } else {
          console.log("Cash: " + cash);
          console.log("Amout: " + amount);
        }
      }
    } catch (error) {
      console.error("Error submitting order", error);
    }
  };

  return (
    <div>
      {currentUser.position === "Manager" ||
      currentUser.position === "Saler" ? (
        <>
          <h2>
            <b>Receipt</b>
          </h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Product Name</th>
                <th scope="col">Unit Price</th>
                <th scope="col">Unit</th>
                <th scope="col">Quantity</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {order.map((orderItem) => (
                <tr key={orderItem.productId} style={{}}>
                  <td>{orderItem.productName}</td>
                  <td>{orderItem.unitPrice.toLocaleString()}</td>
                  <td>{orderItem.unit}</td>
                  <td>
                    <Input
                      value={quantity[orderItem.productId] || ""}
                      onChange={(e) =>
                        handleInputChange(e, orderItem.productId)
                      }
                      disableUnderline={true}
                      placeholder="Enter quantity..."
                    />
                  </td>
                  <td>
                    <Button
                      onClick={() => deleteProductInCart(orderItem.productId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Total amount: {amount.toLocaleString()} VND</p>
          <Input
            onChange={(e) => handleCashChange(e)}
            placeholder="Enter customer's cash..."
            disableUnderline={true}
          />
          <p>Change: {change.toLocaleString()} VND</p>
          <Button onClick={submitOrder}>Submit Order</Button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Checkout;
