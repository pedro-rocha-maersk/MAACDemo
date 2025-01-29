import React, { useState } from 'react';
import './App.css';

function App() {
  const countries = [{ name: 'US', code: 'US' }];
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    country: 'US',
    shippingMethod: 'Standard'
  });

  const [label, setLabel] = useState('');

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const reset = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      country: 'US',
      shippingMethod: 'Standard'
    });
    setLabel('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.name === '' ||
      formData.address === '' ||
      formData.city === '' ||
      formData.state === '' ||
      formData.zip === '' ||
      formData.phone === ''
    ) {
      setError('Please fill in all the fields');
      return;
    }

    setLoading(true);

    const data = {
      Carrier: 'Maersk',
      ServiceType: formData.shippingMethod,
      UniqueRequestId: `MAACDEMO-${new Date().getTime()}`,
      IntegratorClientID: 'NETWORK PARCEL',
      CustomText1: 'custom-t1',
      CustomText2: 'custom-t2',
      PreferredFormat: 'PDF',
      PreferredSize: 0,
      PreferredDPI: 0,
      ShipDate: '2024-05-20T23:05:31.381Z',
      toAddress: {
        isResidential: true,
        address1: formData.address,
        address2: '',
        address3: '',
        city: formData.city,
        stateProvince: formData.state,
        postalCode: formData.zip,
        country: 'US',
        option: 0,
        name: formData.name,
        company: 'BodyGuardz',
        phone: formData.phone,
        email: 'info@sample.com'
      },
      fromAddress: {
        Name: 'Maersk',
        Company: '',
        Address1: '5370 HIGHWAY 92 STE 130',
        Address2: '',
        Address3: '',
        City: 'Fairburn',
        StateProvince: 'GA',
        PostalCode: '45069',
        Country: 'US',
        Phone: '5132231024',
        Email: 'test@indicium.com',
        IsResidential: false
      },
      ReturnAddress: {
        Name: 'Shipping Dept',
        Company: 'Maersk',
        Phone: '513-346-3100',
        Email: 'info@sample.com',
        IsResidential: true,
        Description: '',
        Id: 'string',
        Address1: '70280 Okley Industrial blvd',
        Address2: '',
        Address3: '',
        City: 'Fairburn',
        StateProvince: 'GA',
        PostalCode: '45069',
        Country: 'US',
        Option: 0
      },
      Packages: [
        {
          PackageNumber: 1,
          PackageIdentifier: 'MTRACKx=M3220311295492096',
          Height: 1.4,
          Length: 1.8,
          Width: 9.9,
          DimensionUnit: 'IN',
          Weight: 1.5,
          WeightUnit: 'LB',
          PackageType: 0,
          Value: 0,
          CurrencyCode: 'USD'
        }
      ],
      Options: {
        OriginSortCenterCode: 'ORD'
      }
    };

    try {
      const response = await fetch(
        'https://viprs-indicium-sandbox.azurewebsites.net/api/Bodyguardz/ShippingLabel',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie:
              'ARRAffinity=13673d48a5a129d46ca17ebde23192c9909d356fbe3a23654c2a7fe603495bcb; ARRAffinitySameSite=13673d48a5a129d46ca17ebde23192c9909d356fbe3a23654c2a7fe603495bcb'
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        setError('An error occurred while generating the label. Please try again later.');
        return;
      }

      const result = await response.json();

      if (
        !(
          result &&
          result['package'] &&
          result['package'].length > 0 &&
          result['package'][0]['labels'] &&
          result['package'][0]['labels'].length > 0 &&
          result['package'][0]['labels'][0]['label']
        )
      ) {
        console.log('Did not get label');
        setError('An error occurred while generating the label. Please try again later.');
        return;
      }

      const encodedLabel = result['package'][0]['labels'][0]['label'];
      setLoading(false);
      setLabel(encodedLabel);
    } catch (error) {
      setLoading(false);
      setError('An error occurred while generating the label. Please try again later.');
      return;
    }
  };

  return (
    <div className="App">
      {label === '' ? (
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
              <div className="navigation">{'Cart > Shipping > Payment > Order review'}</div>
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
                          checked={formData.shippingMethod === 'Standard'}
                          onChange={handleChange}
                        />
                        <label htmlFor="standard">
                          Maersk Standard <div className="price">($12.90)</div>
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="expedited"
                          name="shippingMethod"
                          value="Expedited"
                          checked={formData.shippingMethod === 'Expedited'}
                          onChange={handleChange}
                        />
                        <label htmlFor="expedited">
                          Maersk Expedited <div className="price">($22.95)</div>
                        </label>
                      </div>
                    </div>
                  </div>
                  {error && <div className="error">{error}</div>}
                  <button type="submit" className="form-submit" disabled={loading}>
                    {loading ? <span class="smooth spinner" /> : 'Submit'}
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
                  <div className="product-item-prices-label">Shipping and Handling</div>
                  <div className="product-item-prices-value">
                    {formData.shippingMethod === 'Expedited' ? '$22.95' : '$12.90'}
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
                  {formData.shippingMethod === 'Expedited'
                    ? '$' + (49.95 + 22.95)
                    : '$' + (49.95 + 12.9)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="label-preview-wrapper">
          <div className="label-title">
            <button className="label-back" onClick={() => reset()}>
              {'<'}
            </button>
            Label Preview
          </div>
          <div className="label-preview-container">
            <object
              type="application/pdf"
              data={`data:application/pdf;base64,${label}`}
              className="label-preview"
            >
              PDF
            </object>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
