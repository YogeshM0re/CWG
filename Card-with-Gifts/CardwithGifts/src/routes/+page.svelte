<script>
  // @ts-nocheck

  import { loggedIn, username } from "../lib/stores";
  import { goto } from "$app/navigation";

  let user = { email: "", phone: "" };
  let inputEmail = "";
  let inputPhone = "";
  let errorMessage = "";
  let showError = false;

  async function handleLogin() {
    if (!inputEmail || !inputPhone) {
      errorMessage = "Please provide both email and phone.";
      showError = true;
      return;
    }

    user.email = inputEmail;
    user.phone = inputPhone;

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      console.log(response.status);

      if (response.ok) {
        const data = await response.json();
        loggedIn.set(true);
        username.set(data.user.email);
        goto("/dashboard");
      } else {
        const data = await response.json();
        if (response.status === 401) {
          if (data.error === "invalid_email") {
            errorMessage = "Wrong email. Please check your email address.";
          } else if (data.error === "invalid_phone") {
            errorMessage = "Wrong phone. Please check your phone number.";
          } else {
            errorMessage =
              "Invalid email or phone. Please check your credentials.";
          }
        } else {
          errorMessage = "Invalid email or phone.Please try again later.";
        }
        console.error(errorMessage);
        showError = true;
      }
    } catch (error) {
      errorMessage = "Unexpected error. Please try again later.";
      console.error(errorMessage, error);
      showError = true;
    }
  }
</script>

<div class="container mx-auto p-2 flex justify-center items-center h-screen">
  <div
    class="login-container"
    style="background: linear-gradient(#F5DDDA, #D5EAF5); padding: 2rem; box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.1); border: 0.1px solid grey; border-radius: 0.375rem;"
  >
    <h1 class="text-2xl mb-4 text-center text-grey">Welcome Back!</h1>

    <form
      class="flex flex-col space-y-6 items-center"
      on:submit|preventDefault={handleLogin}
    >
      <label class="flex flex-col">
        <span class="text-gray-700 mb-2 text-lg">Email</span>
        <input
          bind:value={inputEmail}
          class="input w-64 rounded-lg py-3 px-4 bg-white"
          type="text"
          placeholder="Enter your email"
        />
      </label>

      <label class="flex flex-col">
        <span class="text-gray-700 mb-2 text-lg">Password</span>
        <input
          bind:value={inputPhone}
          class="input w-64 rounded-lg py-3 px-4 bg-white"
          type="password"
          placeholder="Enter your phone"
        />
      </label>
      {#if showError}
        <p class="text-red-500 text-center mt-2">{errorMessage}</p>
      {/if}

      <button
        type="submit"
        class="btn bg-purple-400 text-white py-2 rounded-lg hover:bg-purple-800"
      >
        Login
      </button>
    </form>

    <div class="flex flex-col mt-6 space-y-4">
      <a href="/" class="text-black text-center hover:underline"
        >Forgot Password?</a
      >

      <p class="text-center mt-6">
        Don't have an account?
        <a
          href="/registration"
          style="text-decoration: none; color: #1a73e8; font-weight: bold; transition: color 0.3s ease;"
          onmouseover="this.style.color='#ea4335'"
          onmouseout="this.style.color='#1a73e8'"
        >
          Create one
        </a>
      </p>
    </div>
  </div>
</div>

<style>
   @import '../routes/global.css';
</style>
