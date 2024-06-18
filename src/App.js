import React, { useState } from "react";
import "./App.css";

function App() {
  const countries = [
    { name: "Australia", code: "AU" },
    { name: "Canada", code: "CA" },
    { name: "Denmark", code: "DK" },
    { name: "United Kingdom", code: "GB" },
    { name: "United States", code: "US" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    country: "US",
    shippingMethod: "Standard",
  });

  const [label, setLabel] = useState("");

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const printImage = () => {
    if (label) {
      const printWindow = window.open(
        document.getElementById("label-preview").src,
        "_blank"
      );
      printWindow.onload = function () {
        printWindow.print();
      };
    }
  };

  const reset = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      country: "US",
      shippingMethod: "Standard",
    });
    setLabel("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.name === "" ||
      formData.address === "" ||
      formData.city === "" ||
      formData.state === "" ||
      formData.zip === "" ||
      formData.phone === ""
    ) {
      setError("Please fill in all the fields");
      return;
    }

    const data = {
      Carrier: "Maersk",
      ServiceType: formData.shippingMethod,
      UniqueRequestId: "054325-ATL-ATL-NDC-202",
      IntegratorClientID: "NETWORK PARCEL",
      CustomText1: "custom-t1",
      CustomText2: "custom-t2",
      PreferredFormat: 3,
      PreferredSize: 0,
      PreferredDPI: 0,
      ShipDate: "2024-04-31T16:58:40.409Z",
      toAddress: {
        isResidential: true,
        description: "To address",
        id: "1",
        address1: formData.address,
        address2: "",
        address3: "",
        city: formData.city,
        stateProvince: formData.state,
        postalCode: formData.zip,
        country: "US",
        option: 0,
        name: formData.name,
        company: "BodyGuardz",
        phone: formData.phone,
        email: "info@sample.com",
      },
      fromAddress: {
        isResidential: false,
        description: "from addr",
        id: "string",
        address1: "7280 Oakley Industrial Blvd",
        address2: "",
        address3: "",
        city: "Fairburn",
        stateProvince: "GA",
        postalCode: "30213",
        country: "US",
        option: 0,
        name: "Shipping Dept",
        company: "Maersk",
        phone: "513-346-3100",
        email: "info@sample.com",
      },
      Packages: [
        {
          PackageNumber: 1,
          PackageIdentifier: "MTRACKx=M3220311295492096",
          Height: 16,
          Length: 4,
          Width: 1,
          DimensionUnit: "IN",
          Weight: 1,
          WeightUnit: "LB",
          PackageType: 0,
          Value: 0,
          CurrencyCode: "USD",
        },
      ],
      Options: {},
      CustomsInfo: null,
    };

    try {
      const response = await fetch(
        "https://viprs-indicium-sandbox.azurewebsites.net/api/XYNGULAR/ShippingLabel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie:
              "ARRAffinity=13673d48a5a129d46ca17ebde23192c9909d356fbe3a23654c2a7fe603495bcb; ARRAffinitySameSite=13673d48a5a129d46ca17ebde23192c9909d356fbe3a23654c2a7fe603495bcb",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        setError(
          "An error occurred while generating the label. Please try again later."
        );
        return;
      }

      const result = await response.json();
      console.log("result", result);
      console.log("result package", result["package"]);

      if (
        !(
          result &&
          result["package"] &&
          result["package"].length > 0 &&
          result["package"][0]["labels"] &&
          result["package"][0]["labels"].length > 0 &&
          result["package"][0]["labels"][0]["label"]
        )
      ) {
        console.log("Did not get label");
        setError(
          "An error occurred while generating the label. Please try again later."
        );
        return;
      }

      const encodedLabel = result["package"][0]["labels"][0]["label"];
      console.log("encodedLabel", encodedLabel);
      const label = atob(encodedLabel);
      console.log("label", label);

      const labelImageResponse = await fetch(
        `http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: JSON.stringify(label),
        }
      );

      if (!labelImageResponse.ok) {
        console.log("Did not get label image");
        setError(
          "An error occurred while generating the label. Please try again later."
        );
        return;
      }

      const labelImageBlob = await labelImageResponse.blob();
      const labelImageUrl = URL.createObjectURL(labelImageBlob);
      console.log("labelImageUrl", labelImageUrl);
      setLabel(labelImageUrl);
    } catch (error) {
      setError(
        "An error occurred while generating the label. Please try again later."
      );
      return;
    }
  };

  return (
    <div className="App">
      {label === "" ? (
        <div className="checkout-wrapper">
          <div className="header">
            <img
              src="https://www.bodyguardz.com/on/demandware.static/Sites-BodyGuardz-Site/-/default/dw7c1b4db1/images/logo-bodyguardz.png"
              className="header-logo"
              alt="logo"
            />
            <div className="header-description">Secure checkout</div>
          </div>
          <div className="checkout-content">
            <div className="form-wrapper">
              <div className="navigation">
                {"Cart > Shipping > Payment > Order review"}
              </div>
              <div className="form">
                <h1 className="form-title">Shipping Address</h1>
                <form onSubmit={handleSubmit} className="form-wrapper">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    placeholder="Country"
                    onChange={handleChange}
                    required
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    id="state"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    placeholder="ZIP Code"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Telephone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-shipping">
                    <h1>Shipping Method</h1>
                    <div className="form-shipping-wrapper">
                      <div>
                        <input
                          type="radio"
                          id="standard"
                          name="shippingMethod"
                          value="Standard"
                          checked={formData.shippingMethod === "Standard"}
                          onChange={handleChange}
                        />
                        <label htmlFor="standard">
                          Maersk Standard <div className="price">($12.90)</div>
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="express"
                          name="shippingMethod"
                          value="Express"
                          checked={formData.shippingMethod === "Express"}
                          onChange={handleChange}
                        />
                        <label htmlFor="express">
                          Maersk Express <div className="price">($22.95)</div>
                        </label>
                      </div>
                    </div>
                  </div>
                  {error && <div className="error">{error}</div>}
                  <button type="submit" className="form-submit">
                    Submit
                  </button>
                </form>
              </div>
            </div>
            <div className="product-wrapper">
              <div className="product-item-wrapper">
                <div className="product-item-image">
                  <img
                    className="product-image"
                    src="https://www.bodyguardz.com/dw/image/v2/BDCW_PRD/on/demandware.static/-/Sites-nlu_products/default/dw8783579a/images/apple/iPhone15/iPhone15/pure-3-privacy/1-bgz-pure3privacy-iphone15-hero.jpg?sw=70&amp;sfrm=jpg"
                    alt="Pure 3 Privacy Screen Protector for iPhone 15/15 Pro, , large"
                    title="Pure 3 Privacy Screen Protector for iPhone 15/15 Pro, "
                  ></img>
                  <div className="product-quantity">1</div>
                </div>
                <div className="product-item-name">
                  Pure 3 Privacy Screen Protector for iPhone 15/15 Pro
                </div>
                <div className="product-item-price">$49.95</div>
              </div>
              <div className="product-item-prices-wrapper">
                <div className="product-item-prices-item">
                  <div className="product-item-prices-label">Subtotal</div>
                  <div className="product-item-prices-value">$49.95</div>
                </div>
                <div className="product-item-prices-item">
                  <div className="product-item-prices-label">
                    Shipping and Handling
                  </div>
                  <div className="product-item-prices-value">
                    {formData.shippingMethod === "Express"
                      ? "$22.95"
                      : "$12.90"}
                  </div>
                </div>
                <div className="product-item-prices-item">
                  <div className="product-item-prices-label">Sales Tax</div>
                  <div className="product-item-prices-value">$0.00</div>
                </div>
              </div>
              <div className="product-total-wrapper">
                <div className="product-total-label">Total</div>
                <div className="product-total-value">
                  {formData.shippingMethod === "Express"
                    ? "$" + (49.95 + 22.95)
                    : "$" + (49.95 + 12.9)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="label-preview-wrapper">
          <div className="label-title">
            <button className="label-back" onClick={() => reset()}>
              {"<"}
            </button>
            Label Preview
          </div>
          <div className="label-preview-container">
            <img
              id="label-preview"
              src={label}
              className="label-preview"
              alt="label"
            />
            <button className="label-print" onClick={() => printImage()}>
              🖨️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
