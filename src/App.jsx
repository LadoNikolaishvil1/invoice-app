import { useState, useRef, useEffect } from "react";
import "./App.css";
import Form from "./components/InvoiceForm.jsx";
import InvoiceCard from "./components/InvoiceCard.jsx";

function App() {
  const moonRef = useRef(null);
  const sunRef = useRef(null);
  const dropdownRef = useRef(null);
  const formRef = useRef(null);
  const imgRef = useRef(null);
  const [checkedItems, setCheckedItems] = useState({
    draft: false,
    pending: false,
    paid: false,
  });
  const [HoveredItems, setHoveredItems] = useState({
    draft: false,
    pending: false,
    paid: false,
  });
  const [resetForm, setResetForm] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [ShowPopUp, SetShowPopUp] = useState(false);
  const [deletingInv, setDeletingInv] = useState(null);

  const ChangeTheeme = () => {
    document.documentElement.classList.toggle("dark");

    if (document.documentElement.classList.contains("dark")) {
      moonRef.current.classList.remove("active");
      moonRef.current.classList.add("deactive");

      moonRef.current.addEventListener(
        "animationend",
        () => {
          sunRef.current.classList.remove("deactive");
          sunRef.current.classList.add("active");
        },
        { once: true }
      );
    } else {
      sunRef.current.classList.remove("active");
      sunRef.current.classList.add("deactive");

      sunRef.current.addEventListener(
        "animationend",
        () => {
          moonRef.current.classList.remove("deactive");
          moonRef.current.classList.add("active");
        },
        { once: true }
      );
    }
  };

  const popUpForm = (bool) => {
    formRef.current.classList.toggle("form-active");
    if (!bool) return;
    setSelectedInvoice(null);
    setResetForm(true);
  };

  const handleItemClick = (key, functionVar) => {
    if (dropdownRef.current.classList.contains("filter-dropdown-active")) {
      functionVar((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  const handleDropdown = () => {
    dropdownRef.current.classList.toggle("filter-dropdown-active");
    imgRef.current.classList.toggle("active-img");
  };

  const handleEdit = (invoiceId) => {
    const invoiceToEdit = invoices.find((inv) => inv.id === invoiceId);
    setSelectedInvoice(invoiceToEdit);
    popUpForm();
  };

  const handleDelete = (invoiceId) => {
    const invoiceToDelete = invoices.find((inv) => inv.id === invoiceId);
    setDeletingInv(invoiceToDelete);
    SetShowPopUp(true);
  };

  const confirmDelete = () => {
    setInvoices((prevInvoices) =>
      prevInvoices.filter((inv) => inv.id !== deletingInv.id)
    );
    SetShowPopUp(false);
    setDeletingInv(null);
  };

  const cancelDelete = () => {
    SetShowPopUp(false);
    setDeletingInv(null);
  };

  return (
    <main>
      <header>
        <div className="icon">
          <div></div>
          <img src="icon.png" alt="" />
        </div>
        <div className="user-box">
          <button className="dark-light-box" onClick={ChangeTheeme}>
            <img ref={moonRef} className="moon-icon" src="moon.png" alt="" />
            <img ref={sunRef} className="sun-icon" src="sun.png" alt="" />
          </button>
          <div className="line"></div>
          <img className="user-icon" src="datomasw.png" alt="" />
        </div>
      </header>
      {/* header end */}
      <section>
        <div className="filters-box">
          <div className="title">
            <h1>Invoices</h1>
            <p>
              {invoices.length > 0
                ? `${invoices.length} invoices`
                : "no invoices"}
            </p>
          </div>
          <div className="filters">
            <div className="container">
              <button className="FilterBtn" onClick={handleDropdown}>
                <h1>Filter</h1>
                <img ref={imgRef} src="dropIcon.png" alt="" />
              </button>
              <div ref={dropdownRef} className="filter-dropdown">
                <ul>
                  <li
                    onClick={() => handleItemClick("draft", setCheckedItems)}
                    onMouseEnter={() =>
                      handleItemClick("draft", setHoveredItems)
                    }
                    onMouseLeave={() =>
                      handleItemClick("draft", setHoveredItems)
                    }
                    className="dropdown-item"
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.draft}
                      className={HoveredItems.draft ? "hovered" : ""}
                      readOnly
                    />
                    <h1>Draft</h1>
                  </li>
                  <li
                    onClick={() => handleItemClick("pending", setCheckedItems)}
                    onMouseEnter={() =>
                      handleItemClick("pending", setHoveredItems)
                    }
                    onMouseLeave={() =>
                      handleItemClick("pending", setHoveredItems)
                    }
                    className="dropdown-item"
                  >
                    <input
                      type="checkbox"
                      className={HoveredItems.pending ? "hovered" : ""}
                      checked={checkedItems.pending}
                      readOnly
                    />
                    <h1>Pending</h1>
                  </li>
                  <li
                    onClick={() => handleItemClick("paid", setCheckedItems)}
                    onMouseEnter={() =>
                      handleItemClick("paid", setHoveredItems)
                    }
                    onMouseLeave={() =>
                      handleItemClick("paid", setHoveredItems)
                    }
                    className="dropdown-item"
                  >
                    <input
                      type="checkbox"
                      className={HoveredItems.paid ? "hovered" : ""}
                      checked={checkedItems.paid}
                      readOnly
                    />
                    <h1>Paid</h1>
                  </li>
                </ul>
              </div>
            </div>
            <button className="CreateInvoice" onClick={() => popUpForm("yes")}>
              <div className="circle">
                <img src="plus.png" alt="" />
              </div>
              <h1>New</h1>
            </button>
          </div>
        </div>
        <div className="card-box">
          {invoices.length > 0 ? (
            invoices.map((data) => (
              <InvoiceCard
                key={data.id}
                Data={data}
                onEdit={() => handleEdit(data.id)}
                onDelete={() => handleDelete(data.id)}
              />
            ))
          ) : (
            <div className="callout-box">
              <img src="callout.png" alt="" />
              <div className="text-box">
                <h1>There is nothing here</h1>
                <p>
                  create an invoice by clicking the <br /> <span>New</span>{" "}
                  button and get started
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* section end */}
      <Form
        formRef={formRef}
        invoiceData={selectedInvoice}
        setSelectedInvoice={setSelectedInvoice}
        setInvoices={setInvoices}
        popUpForm={popUpForm}
        resetValues={resetForm}
        setResetValues={setResetForm}
      />
      {ShowPopUp && (
        <div className="popUp">
          <div className="background"></div>
          <div className="popUp-box">
            <h1>Confirm Deletion</h1>
            <p>
              Are you sure you want to delete invoice #{deletingInv?.id}? This
              action cannot be undone.
            </p>
            <div className="PopUpBtn-box">
              <button className="Discard" type="button" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="delete" type="submit" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
