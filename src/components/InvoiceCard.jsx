import React, { useRef, useState } from "react";

const InvoiceCard = (data) => {
  const cardRef = useRef(null);
  const infoRef = useRef(null);
  const portionRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const invData = data.data;
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const ActivateCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (cardRef.current.classList.contains("card-active")) {
      infoRef.current.classList.toggle("info-active");
      portionRef.current.classList.toggle("portion-2-active");
      console.log("toggled");
      setTimeout(() => {
        cardRef.current.classList.toggle("card-active");
        setIsAnimating(false);
      }, 800);
    } else {
      cardRef.current.classList.toggle("card-active");
      console.log("toggled");
      setTimeout(() => {
        infoRef.current.classList.toggle("info-active");
        portionRef.current.classList.toggle("portion-2-active");
        setIsAnimating(false);
      }, 800);
    }
  };
  return (
    <div className="card" ref={cardRef}>
      <div className="portion-box" onClick={ActivateCard}>
        <div className="portion">
          <h1 className="cardId">
            <p>#</p>
            {invData.id}
          </h1>
          <p>Due {formatDate(invData.paymentDue)}</p>
          <p className="CardName">{invData.clientName}</p>
          <h1 className="price">£ {invData.total}</h1>
          <div
            className={
              invData.status == "Draft"
                ? "draft"
                : invData.status == "Pending"
                ? "pending"
                : invData.status == "Paid"
                ? "paid"
                : ""
            }
          >
            <span>.</span> {invData.status}
          </div>
          <img src="dropIcon.png" alt="" />
        </div>

        <div className="portion-2" ref={portionRef}>
          <p>Status</p>
          <div
            className={
              invData.status == "Draft"
                ? "draft"
                : invData.status == "Pending"
                ? "pending"
                : invData.status == "Paid"
                ? "paid"
                : ""
            }
          >
            <span>.</span> {invData.status}
          </div>
        </div>
      </div>
      <div className="full" ref={infoRef}>
        <div className="idBox">
          <h1 className="cardId">
            <p>#</p>
            {invData.id}
          </h1>
          <p>{invData.description}</p>
        </div>
        <div className="senderAddress-box">
          <p>{invData.senderAddress.street}</p>
          <p>{invData.senderAddress.city}</p>
          <p>{invData.senderAddress.postCode}</p>
          <p>{invData.senderAddress.country}</p>
        </div>
        <div className="double-info-box">
          <div className="triple-info-box">
            <div className="double-info-box">
              <div className="info-box">
                <p>Invoice Date</p>
                <h1>{formatDate(invData.createdAt)}</h1>
              </div>
              <div className="info-box">
                <p>Pament Due</p>
                <h1>{formatDate(invData.paymentDue)}</h1>
              </div>
            </div>
            <div className="clientAddress-box">
              <p>Bill To</p>
              <h1>{invData.clientName}</h1>
              <div className="paragraph-box">
                <p>{invData.clientAddress.street}</p>
                <p>{invData.clientAddress.city}</p>
                <p>{invData.clientAddress.postCode}</p>
                <p>{invData.clientAddress.country}</p>
              </div>
            </div>
          </div>
          <div className="info-box">
            <p>Sent to</p>
            <h1>{invData.clientEmail}</h1>
          </div>
        </div>
        <div className="AllItems-box">
          <div className="item-container">
            {invData.items.map((item, index) => (
              <div className="item" key={index}>
                <div className="item-text">
                  <h1>{item.name}</h1>
                  <p>
                    {item.quantity} x £ {item.price}
                  </p>
                </div>
                <h1>£ {item.total}</h1>
              </div>
            ))}
          </div>
          <div className="Item-total">
            <p>Grand Total</p>
            <h1>£ {invData.total}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
