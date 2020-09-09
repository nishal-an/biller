import { gql } from "@apollo/client";

const GET_PRODUCTS = gql`
  query GetProducts {
    product(
      where: { organization_id: { _eq: "58bdf297bdcb49fcbe3bf84c5859a63d" } }
    ) {
      name
      hsn_code
      sgst
      cgst
      price
      remaining_stock
      unit
      id
      description
      cess
    }
  }
`;

export default GET_PRODUCTS;
