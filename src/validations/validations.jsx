import * as Yup from "yup";

const addressSchema = Yup.object({
  street: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  postCode: Yup.string().required("Required"),
  country: Yup.string().required("Required"),
});

const itemSchema = Yup.object({
  name: Yup.string().required("Item name is required"),
  quantity: Yup.number().integer("integer").required("required").min(1, "Min 1"),
  price: Yup.number()
    .required("Price is required")
    .min(0.01, "Min price is 0.01"),
  total: Yup.number().required(),
});

const validationSchema = Yup.object({
  createdAt: Yup.date().required("Created date is required"),
  description: Yup.string().required("Project description is required"),
  paymentTerms: Yup.string().required("Payment terms are required"),
  clientName: Yup.string().required("Client name is required"),
  clientEmail: Yup.string()
    .email("Invalid email format")
    .required("Client email is required"),
  senderAddress: addressSchema,
  clientAddress: addressSchema,
  items: Yup.array().of(itemSchema).min(1, "At least one item is required"),
});

export default validationSchema;
