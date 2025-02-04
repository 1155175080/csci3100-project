import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductImage from "../../Assets/Images/ProductIcon.jpg";
import add_icon from "../../Assets/Icons/add-icon.svg";
import minus_icon from "../../Assets/Icons/minus-icon.svg";
import "./CartItem.css";
import remove_icon from "../../Assets/Icons/remove_icon.svg";

export const CartItem = ({ id, quantity }) => {
  const userId = JSON.parse(localStorage.getItem("userAuth")).id;
  const [count, setCount] = useState(1);
  const [name, setName] = useState("Product Name");
  const [price, setPrice] = useState(30);
  const [discount, setDiscount] = useState(1.0);
  const [stock, setStock] = useState(0);
  const [photo, setPhoto] = useState(ProductImage);

  const loadCartItem = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/api/product/${id}`);
    const data = await response.json();
    setName(data.data.name);
    setPrice(+data.data.price);
    setDiscount(+data.data.discount);
    setStock(+data.data.stock);
    setCount(+quantity);
    if (data.data.product_images[0] != undefined) {
      setPhoto(
        process.env.REACT_APP_BACKEND_URL + "/images/" + data.data.product_images[0].path
      );
    }
  };

  const updateCart = async (userId, productId, quantity) => {
    const updateCartItemQuantityUrl = process.env.REACT_APP_BACKEND_URL + `/api/cart/update/`;
    const res = await fetch(updateCartItemQuantityUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    const data = await res.json();

    if (res.ok) {
      if (data.success) {
        console.log(data.message);
        setCount(quantity);
      } else {
        alert(data.message);
      }
      return;
    } else {
      console.log(data.error);
      return;
    }
  };
  const decrement = async () => {
    if (count > 1) {
      updateCart(userId, id, count-1);
      setCount(count - 1);
    }
  };
  const increment = async () => {
    await updateCart(userId, id, count+1);
    
  };

  const handleRemoveCartItem = async () => {
    const removeCartItemUrl = process.env.REACT_APP_BACKEND_URL + `/api/cart/remove/`;
    const res = await fetch(removeCartItemUrl, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId: id }),
    });
    const data = await res.json();

    if (res.ok) {
      console.log(data.message);
      window.location.reload();
      return;
    } else {
      console.log(data.error);
      return;
    }
  };

  useEffect(() => {
    loadCartItem();
  }, []);

  return (
    <div class="cart-item">
      <Link
        to={"/product/" + id}
        onClick={() => {
          window.scrollTo({ top: (0, 0), behavior: "instant" });
        }}
      >
        <div class="cart-product-box">
          <img class="cart-product-img" src={photo} alt="product img"></img>
          <div class="cart-product-description">
            <div class="cart-product-status">
              {stock == 0 ? (
                <p class="out-of-stock"> Out of Stock</p>
              ) : (
                [discount < 1 ? <p class="on-sale"> On Sale</p> : <p></p>]
              )}
            </div>
            <div class="cart-product-name">{name}</div>
          </div>
        </div>
      </Link>
      <div class="CartItemAmountBox">
        <button onClick={decrement}>
          <img
            class="CartItemAmountContainer_minus"
            src={minus_icon}
            alt="minus"
          />
        </button>
        <div>
          <p class="CartItemAmountText">{count}</p>
        </div>
        <button onClick={increment}>
          <img class="CartItemAmountContainer_add" src={add_icon} alt="add" />
        </button>
      </div>
      <div class="item-price">
        <p class="cart-discount-price">${(price * discount).toFixed(1)}</p>
        {discount < 1 ? <p class="cart-item-price">${price} </p> : <div> </div>}
      </div>
      <div class="subtotal">${(price * discount * count).toFixed(1)}</div>
      <button class="cart-cancel-button" onClick={handleRemoveCartItem}>
        <img src={remove_icon} />
      </button>
    </div>
  );
};
