import { useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import Item from "./Item.jsx";
import validationSchema from "../validations/validations";

function Form({
  formRef,
  invoiceData,
  setSelectedInvoice,
  setInvoices,
  popUpForm,
  resetValues,
  setResetValues,
}) {
  const [date, setDate] = useState(null);
  const Terms = [
    { name: "Next 1 Day" },
    { name: "Next 7 Days" },
    { name: "Next 14 Days" },
    { name: "Next 30 Days" },
  ];
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [submitType, setSubmitType] = useState("pending");
  const [itemErrorMsg, setItemErrorMsg] = useState(null);
  const itemErrorTimeoutRef = useRef(null);

  useEffect(() => {
    if (itemErrorMsg) {
      if (itemErrorTimeoutRef.current) {
        clearTimeout(itemErrorTimeoutRef.current);
      }

      itemErrorTimeoutRef.current = setTimeout(() => {
        setItemErrorMsg(null);
        itemErrorTimeoutRef.current = null;
      }, 5000);
    }
  }, [itemErrorMsg]);

  const initialValues = useMemo(
    () => ({
      id: invoiceData?.id || "",
      createdAt: invoiceData?.createdAt || "",
      paymentDue: invoiceData?.paymentDue || "",
      description: invoiceData?.description || "",
      clientName: invoiceData?.clientName || "",
      clientEmail: invoiceData?.clientEmail || "",
      paymentTerms: invoiceData?.paymentTerms || "",
      senderAddress: {
        street: invoiceData?.senderAddress?.street || "",
        city: invoiceData?.senderAddress?.city || "",
        postCode: invoiceData?.senderAddress?.postCode || "",
        country: invoiceData?.senderAddress?.country || "",
      },
      clientAddress: {
        street: invoiceData?.clientAddress?.street || "",
        city: invoiceData?.clientAddress?.city || "",
        postCode: invoiceData?.clientAddress?.postCode || "",
        country: invoiceData?.clientAddress?.country || "",
      },
      items: invoiceData?.items || [
        { name: "", quantity: "", price: "", total: "0.00" },
      ],
      total: invoiceData?.total || 0,
      status: invoiceData?.status || "Draft",
    }),
    [invoiceData]
  );

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (formValues) => {
      const formattedItems = formValues.items.map((item) => ({
        ...item,
        price: parseFloat(item.price).toFixed(2),
        total: (parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2),
      }));

      const grandTotal = formattedItems.reduce(
        (acc, curr) => acc + parseFloat(curr.total),
        0
      );

      const createdAtDate = new Date(formValues.createdAt);

      const termMatch = formValues.paymentTerms.match(/\d+/);
      const daysToAdd = termMatch ? parseInt(termMatch[0]) : 0;

      const paymentDueDate = new Date(createdAtDate);
      paymentDueDate.setDate(createdAtDate.getDate() + daysToAdd);

      const completeForm = {
        ...formValues,
        items: formattedItems,
        paymentDue: paymentDueDate,
        total: grandTotal.toFixed(2),
        status: submitType === "draft" ? "draft" : "pending",
      };

      if (!invoiceData) {
        completeForm.id = Math.random().toString(36).substr(2, 6).toUpperCase();
        setInvoices((prev) => [...prev, completeForm]);
      } else {
        completeForm.id = invoiceData.id;
        setSelectedInvoice(completeForm);
        setInvoices((prev) =>
          prev.map((inv) => (inv.id == completeForm.id ? completeForm : inv))
        );
      }

      onResetForm();
    },

    enableReinitialize: true,
  });

  useEffect(() => {
    if (invoiceData) {
      if (invoiceData.createdAt) {
        const parsedDate = new Date(invoiceData.createdAt);
        setDate(parsedDate);
      }

      if (invoiceData.paymentTerms) {
        const matchedTerm = Terms.find(
          (term) => term.name === invoiceData.paymentTerms
        );
        setSelectedTerm(matchedTerm || null);
      }
    }
  }, [invoiceData]);

  useEffect(() => {
    if (!resetValues) return;
    if (date !== null) setDate(null);
    if (selectedTerm !== null) setSelectedTerm(null);
    setSubmitType("pending");
    setItemErrorMsg(null);
    resetForm({ values: initialValues });
    const updatedItems = [{ name: "", quantity: "", price: "", total: "0.00" }];
    setFieldValue("items", updatedItems);
    setResetValues(false);
    console.log("reseted1");
  }, [resetValues]);

  const onResetForm = (string) => {
    popUpForm();
    setTimeout(() => {
      if (string) return resetForm({ values: invoiceData });
      if (invoiceData) return;
      if (date !== null) setDate(null);
      if (selectedTerm !== null) setSelectedTerm(null);
      setSubmitType("pending");
      setItemErrorMsg(null);
      resetForm({ values: initialValues });
      const updatedItems = [
        { name: "", quantity: "", price: "", total: "0.00" },
      ];
      setFieldValue("items", updatedItems);
      console.log("reseted");
    }, 300);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...values.items];
    updatedItems[index][field] = value;

    const quantity = parseInt(updatedItems[index].quantity) || 0;
    const price = parseFloat(updatedItems[index].price) || 0;
    const total = quantity * price;

    updatedItems[index].total = total.toFixed(2);

    setFieldValue("items", updatedItems);
  };

  const handleItemBlur = (index, field) => {
    handleBlur({ target: { name: `items[${index}].${field}` } });
  };

  const handleAddItem = () => {
    setFieldValue("items", [
      ...values.items,
      { name: "", quantity: "", price: "", total: "0.00" },
    ]);
  };

  const handleDeleteItem = (index) => {
    if (values.items.length === 1) {
      setItemErrorMsg("Can't delete the last item");
      return;
    }
    const newItems = [...values.items];
    newItems.splice(index, 1);
    setFieldValue("items", newItems);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="InvoiceForm">
        <button type="button" className="goback" onClick={popUpForm}>
          <img src="dropIcon.png" alt="" />
          <h1>Go back</h1>
        </button>
        <h1 className="form-title">
          {!invoiceData ? "New Invoice" : `Edit #${invoiceData.id}`}
        </h1>

        {/* Bill From Section */}
        <div className="form-box">
          <h1>Bill From</h1>
          <div
            className={
              touched.senderAddress?.street && errors?.senderAddress?.street
                ? "input-box input-box-error"
                : "input-box"
            }
          >
            <p className="error">
              {touched?.senderAddress?.street && errors?.senderAddress?.street
                ? errors.senderAddress.street
                : ""}
            </p>
            <p>Street Address</p>
            <input
              type="text"
              name="senderAddress.street"
              value={values.senderAddress.street}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className="triple-Input-box">
            <div className="duble-Input-box">
              <div
                className={
                  touched?.senderAddress?.city && errors?.senderAddress?.city
                    ? "input-box input-box-error"
                    : "input-box"
                }
              >
                <p className="error">
                  {touched?.senderAddress?.city && errors?.senderAddress?.city
                    ? errors.senderAddress.city
                    : ""}
                </p>
                <p>City</p>
                <input
                  type="text"
                  name="senderAddress.city"
                  value={values.senderAddress.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div
                className={
                  touched?.senderAddress?.postCode &&
                  errors?.senderAddress?.postCode
                    ? "input-box input-box-error"
                    : "input-box"
                }
              >
                <p className="error">
                  {touched?.senderAddress?.postCode &&
                  errors?.senderAddress?.postCode
                    ? errors.senderAddress.postCode
                    : ""}
                </p>
                <p>Post Code</p>
                <input
                  type="text"
                  name="senderAddress.postCode"
                  value={values.senderAddress.postCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <div
              className={
                touched?.senderAddress?.country &&
                errors?.senderAddress?.country
                  ? "input-box input-box-error"
                  : "input-box"
              }
            >
              <p className="error">
                {touched?.senderAddress?.country &&
                errors?.senderAddress?.country
                  ? errors.senderAddress.country
                  : ""}
              </p>
              <p>Country</p>
              <input
                type="text"
                name="senderAddress.country"
                value={values.senderAddress.country}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="form-box">
          <h1>Bill To</h1>
          <div
            className={
              touched?.clientName && errors?.clientName
                ? "input-box input-box-error"
                : "input-box"
            }
          >
            <p className="error">
              {touched?.clientName && errors?.clientName
                ? errors.clientName
                : ""}
            </p>
            <p>Client's Name</p>
            <input
              type="text"
              name="clientName"
              value={values.clientName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div
            className={
              touched?.clientEmail && errors?.clientEmail
                ? "input-box input-box-error"
                : "input-box"
            }
          >
            <p className="error">
              {touched?.clientEmail && errors?.clientEmail
                ? errors.clientEmail
                : ""}
            </p>
            <p>Client's Email</p>
            <input
              type="email"
              name="clientEmail"
              value={values.clientEmail}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div
            className={
              touched?.clientAddress?.street && errors?.clientAddress?.street
                ? "input-box input-box-error"
                : "input-box"
            }
          >
            <p className="error">
              {touched?.clientAddress?.street && errors?.clientAddress?.street
                ? errors.clientAddress.street
                : ""}
            </p>
            <p>Street Address</p>
            <input
              type="text"
              name="clientAddress.street"
              value={values.clientAddress.street}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className="triple-Input-box">
            <div className="duble-Input-box">
              <div
                className={
                  touched?.clientAddress?.city && errors?.clientAddress?.city
                    ? "input-box input-box-error"
                    : "input-box"
                }
              >
                <p className="error">
                  {touched?.clientAddress?.city && errors?.clientAddress?.city
                    ? errors.clientAddress.city
                    : ""}
                </p>
                <p>City</p>
                <input
                  type="text"
                  name="clientAddress.city"
                  value={values.clientAddress.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div
                className={
                  touched?.clientAddress?.postCode &&
                  errors?.clientAddress?.postCode
                    ? "input-box input-box-error"
                    : "input-box"
                }
              >
                <p className="error">
                  {touched?.clientAddress?.postCode &&
                  errors?.clientAddress?.postCode
                    ? errors.clientAddress.postCode
                    : ""}
                </p>
                <p>Post Code</p>
                <input
                  type="text"
                  name="clientAddress.postCode"
                  value={values.clientAddress.postCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <div
              className={
                touched?.clientAddress?.country &&
                errors?.clientAddress?.country
                  ? "input-box input-box-error"
                  : "input-box"
              }
            >
              <p className="error">
                {touched?.clientAddress?.country &&
                errors?.clientAddress?.country
                  ? errors.clientAddress.country
                  : ""}
              </p>
              <p>Country</p>
              <input
                type="text"
                name="clientAddress.country"
                value={values.clientAddress.country}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div className="special-double-input-box">
            <div
              className={
                touched?.createdAt && errors?.createdAt
                  ? "input-box input-box-error"
                  : "input-box"
              }
            >
              <p className="error">
                {touched?.createdAt && errors?.createdAt
                  ? errors.createdAt
                  : ""}
              </p>
              <p>Set Date</p>
              <Calendar
                value={date}
                onChange={(e) => {
                  setDate(e.value);
                  handleChange({
                    target: { name: "createdAt", value: e.value },
                  });
                }}
                onBlur={() =>
                  handleBlur({
                    target: { name: "createdAt" },
                  })
                }
                dateFormat="dd MM yy"
                appendTo={"self"}
                showIcon
              />
            </div>
            <div
              className={
                touched?.paymentTerms && errors?.paymentTerms
                  ? "input-box input-box-error"
                  : "input-box"
              }
            >
              <p className="error">
                {touched?.paymentTerms && errors?.paymentTerms
                  ? errors.paymentTerms
                  : ""}
              </p>
              <p>Payment Terms</p>
              <Dropdown
                value={selectedTerm}
                onChange={(e) => {
                  setSelectedTerm(e.value);
                  handleChange({
                    target: {
                      name: "paymentTerms",
                      value: e.value.name,
                    },
                  });
                }}
                onBlur={() =>
                  handleBlur({
                    target: { name: "paymentTerms" },
                  })
                }
                options={Terms}
                optionLabel="name"
                appendTo={"self"}
                placeholder="Select a term"
                className="w-full md:w-14rem"
              />
            </div>
          </div>

          <div
            className={
              touched?.description && errors?.description
                ? "input-box input-box-error"
                : "input-box"
            }
          >
            <p className="error">
              {touched?.description && errors?.description
                ? errors.description
                : ""}
            </p>
            <p>Project Description</p>
            <input
              type="text"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        {/* Item List Section */}
        <div className="form-box">
          <h1 style={{ color: "#777F98" }}>Item List</h1>
          <p className="error">{itemErrorMsg}</p>
          <div className="Items-box">
            {values.items.map((item, index) => (
              <Item
                key={index}
                name={item.name}
                quantity={item.quantity}
                price={item.price}
                total={item.total}
                onChange={(field, value) =>
                  handleItemChange(index, field, value)
                }
                onBlur={(field) => handleItemBlur(index, field)}
                onDelete={() => handleDeleteItem(index)}
                errors={errors.items?.[index] || {}}
                touched={touched.items?.[index] || {}}
              />
            ))}
          </div>
          <button className="New-Item" type="button" onClick={handleAddItem}>
            + Add New Item
          </button>
        </div>
      </div>

      <footer>
        <button className="Discard" type="button" onClick={onResetForm}>
          {!invoiceData ? "Discard" : "Cancel"}
        </button>

        {!invoiceData && (
          <button
            className="Save-draft"
            type="submit"
            onMouseDown={() => setSubmitType("draft")}
          >
            Save as Draft
          </button>
        )}

        <button
          className="Save-send"
          type="submit"
          onMouseDown={() => setSubmitType("pending")}
        >
          Save & Send
        </button>
      </footer>
    </form>
  );
}

export default Form;
