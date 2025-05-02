import React from "react";

const Item = ({
  name = "",
  quantity = "",
  price = "",
  total = "",
  onChange,
  onBlur,
  onDelete,
  errors = {},
  touched = {},
}) => {
  return (
    <div className="item-box">
      <div
        className={
          touched.name && errors.name
            ? "input-box input-box-error"
            : "input-box"
        }
      >
        <p>Item Name</p>
        <input
          type="text"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          onBlur={() => onBlur("name")}
        />
        <p className="error">
          {touched.name && errors.name ? errors.name : ""}
        </p>
      </div>

      <div className="item-tripple-input-box">
        <div
          className={
            touched.quantity && errors.quantity
              ? "input-box input-box-error"
              : "input-box"
          }
          style={{ width: "20%" }}
        >
          <p>Qty.</p>
          <input
            type="number"
            value={quantity}
            onChange={(e) => onChange("quantity", e.target.value)}
            onBlur={() => onBlur("quantity")}
          />
          <p className="error">
            {touched.quantity && errors.quantity ? errors.quantity : ""}
          </p>
        </div>

        <div className={touched.price && errors.price ? "input-box input-box-error" : "input-box"} style={{ width: "40%" }}>
          <p>Price</p>
          <input
            type="number"
            value={price}
            onChange={(e) => onChange("price", e.target.value)}
            onBlur={() => onBlur("price")}
          />
          <p className="error">
            {touched.price && errors.price ? errors.price : ""}
          </p>
        </div>

        <div className="input-box" style={{ width: "25%" }}>
          <p>Total</p>
          <h1 style={{ color: "#888EB0", padding: "9px 0" }}>{total}</h1>
        </div>

        <img
          style={{
            width: "12.5px",
            height: "16px",
            marginTop: "18px",
            cursor: "pointer",
          }}
          src="delete.png"
          alt="delete"
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

export default Item;
