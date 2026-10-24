/**
 * 
 * ChatGPT-6.1 Sol was used to review, validate and improve the code.
 * 
 */


import { FunctionField, NumberInput, required } from "react-admin";

const mxn = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
}); // create a number formatter for Mexican pesos

const validCents = (value: unknown) =>
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0 ? undefined : "Introduce un precio válido, mayor o igual a cero.";


export const PriceInput = () => (
    <NumberInput
        source="priceCents"
        label="Precio (MXN)"
        min={0}
        step={0.01} // allow decimal input for cents
        format={(value) =>
            value == null
                ? ""
                : (Number(value) / 100).toFixed(2) // convert cents to dollars and format to 2 decimal places
        }
        parse={(value) =>
            value === "" || value == null
                ? null
                : Math.round(Number(value) * 100)
        } // convert dollars to cents and round to nearest integer
        validate={[required(), validCents]}
    />
);

export const PriceField = () => (
    <FunctionField
        source="priceCents"
        render={(record) =>
            mxn.format(record.priceCents / 100)
        } // format the price in cents to MXN currency format
    />
);