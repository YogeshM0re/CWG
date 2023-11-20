<script>
  // @ts-nocheck

  import * as yup from "yup";

  let companyName = "";
  let phone = "";
  let phoneType = "mobile";
  let email = "";
  let streetAddress = "";
  let address2 = "";
  let city = "";
  let state = "";
  let zipCode = "";

  const schema = yup.object().shape({
    companyName: yup.string().min(3, 'Company Name must be at least 3 characters').max(30, 'Company Name must be at most 30 characters'),
    phone: yup.string().matches(/^\d{10}$/, 'Phone must be a 10-digit number'),
    phoneType: yup.string().oneOf(['mobile', 'landline', 'others'], 'Invalid Phone Type').required('Phone Type is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    streetAddress: yup.string().min(10, 'Street Address must be at least 10 characters').max(200, 'Street Address must be at most 200 characters').required('Street Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().matches(/^\d{6}$/, 'Zip Code must be a 6-digit number'),
});

  let errors = {
    companyName: "",
    phone: "",
    phoneType: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  };

  async function handleSubmit() {
    try {
        await schema.validate(
            {
                companyName,
                phone,
                phoneType,
                email,
                streetAddress,
                city,
                state,
                zipCode,
            },
            { abortEarly: false }
        );

        const formData = {
            companyName,
            phone,
            phoneType,
            email,
            streetAddress,
            address2,
            city,
            state,
            zipCode,
        };

        // Make an API call to your backend
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
    const result = await response.json();
    console.log('Registration successful:', result);
    
    resetForm();
} else {
    const errorResponse = await response.json(); 
    console.error('Registration failed:', errorResponse);

    if (errorResponse.error === 'Email is already registered') {
        errors.email = errorResponse.error;
    }
}

    } catch (error) {
        error.inner.forEach((e) => {
            errors[e.path] = e.message;
        });

        $: void errors;

        console.error('Validation Error:', error.errors);
    }
}

  function handleInput(event, field) {
    eval(`${field} = event.target.value`);

    errors[field] = "";

    $: void errors;
  }

  function resetForm() {
    companyName = "";
    phone = "";
    phoneType = "mobile";
    email = "";
    streetAddress = "";
    address2 = "";
    city = "";
    state = "";
    zipCode = "";

    errors = {
      companyName: "",
      phone: "",
      phoneType: "",
      email: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
    };
  }
</script>

<main>
  <form on:submit|preventDefault={handleSubmit} class="registration-form">
    <h2>Request An Account</h2>
    <label for="companyName">Company Name:</label>
    <input
      type="text"
      id="companyName"
      bind:value={companyName}
      on:input={(e) => handleInput(e, "companyName")}
    />
    {#if errors.companyName}<p class="error-message">
        {errors.companyName}
      </p>{/if}

    <label for="phone">Phone:</label>
    <input
      type="text"
      id="phone"
      bind:value={phone}
      on:input={(e) => handleInput(e, "phone")}
    />
    {#if errors.phone}<p class="error-message">{errors.phone}</p>{/if}

    <label for="phoneType">Phone Type:</label>
    <select id="phoneType" bind:value={phoneType}>
      <option value="mobile">Mobile</option>
      <option value="landline">Landline</option>
      <option value="others">Others</option>
    </select>

    <label for="email">Email:</label>
    <input
      type="email"
      id="email"
      bind:value={email}
      on:input={(e) => handleInput(e, "email")}
    />
    {#if errors.email}<p class="error-message">{errors.email}</p>{/if}

    <label for="streetAddress">Street Address:</label>
    <input
      type="text"
      id="streetAddress"
      bind:value={streetAddress}
      on:input={(e) => handleInput(e, "streetAddress")}
    />

    {#if errors.streetAddress}<p class="error-message">
        {errors.streetAddress}
      </p>{/if}

    <label for="address2">Suite/Street Address 2:</label>
    <input type="text" id="address2" bind:value={address2} />
    {#if errors.streetAddress}<p class="error-message">
        {errors.streetAddress}
      </p>{/if}

    <label for="city">City:</label>
    <input
      type="text"
      id="city"
      bind:value={city}
      on:input={(e) => handleInput(e, "city")}
    />

    {#if errors.city}<p class="error-message">{errors.city}</p>{/if}

    <label for="state">State:</label>
    <input
      type="text"
      id="state"
      bind:value={state}
      on:input={(e) => handleInput(e, "state")}
    />

    {#if errors.state}<p class="error-message">{errors.state}</p>{/if}

    <label for="zipCode">Zip Code:</label>
    <input
      type="text"
      id="zipCode"
      bind:value={zipCode}
      on:input={(e) => handleInput(e, "zipCode")}
    />

    {#if errors.zipCode}<p class="error-message">{errors.zipCode}</p>{/if}

    <div class="center-button">
      <button type="submit">Register</button>
      <p class="text-center mt-6">
        Already have an account?
        <a
          href="/"
          style="text-decoration: none; color: #1a73e8; font-weight: bold; transition: color 0.3s ease;"
          onmouseover="this.style.color='#ea4335'"
          onmouseout="this.style.color='#1a73e8'"
        >
          Login here
        </a>
      </p>
    </div>
  </form>
</main>

<style>
  .registration-form {
    max-width: 400px;
    margin: 0 auto;

    background: linear-gradient(#f5ddda, #d5eaf5);
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  h2 {
    text-align: center;
    color: #333;
    font-size: 1.5em;
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-top: 10px;
    color: #555;
  }

  input,
  select {
    width: 100%;
    margin-top: 5px;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .center-button {
    text-align: center;
  }

  button {
    background: #845ec2;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    transition: background 0.3s;
    margin-top: 15px;
    cursor: pointer;
  }

  button:hover {
    background: linear-gradient(45deg, #faacb9, #fcb1d0, #d7bffc, #bbb3f9);
    color: black;
    animation: colorTransition 1s ease infinite;
  }

  @keyframes colorTransition {
    0% {
      filter: hue-rotate(0deg);
    }

    100% {
      filter: hue-rotate(360deg);
    }
  }

  .error-message {
    color: #ff0000;
    font-size: 0.9em;
    margin-top: 0.1px;
  }
</style>
