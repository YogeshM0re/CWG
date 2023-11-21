<script>
  import { loggedIn, username, userId } from "../lib/stores"; 
</script>

<div class="custom-navbar shadow-md"
  style="background: linear-gradient(to bottom, #D5EAF5, #F5DDDA); padding: 20px; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div class="container mx-auto" style="display: flex; align-items: center;">
      <div class="title-section" style="flex: 1;">
          <h1 class="text-4xl font-extrabold great-vibes text-black" style="margin-bottom: 5px;">
              CardwithGifts
          </h1>
          <p class="text text-black museo-moderno" style="margin-top: -10px;">
              Make an Impression!
          </p>
      </div>
      {#if $loggedIn}
      <div class="publisher-dashboard" style="font-family: 'Poppins';">
          Publisher Dashboard
      </div>
      <div class="user-section text-gray-300" style="flex: 1; text-align: right;">
          <p style="margin: 0;">
              <span style="font-weight: bold; color: black;">Welcome Publisher</span>
              <span style="color: grey;">{$username}</span><br />
              <span style="color: black;">Publisher ID: {$userId}</span> 
            </p>
      </div>
      {/if}
  </div>
</div>

<style>
  .custom-navbar {
      padding: 5px 10px;
  }

  .great-vibes {
      font-family: "Great Vibes", cursive;
  }

  .museo-moderno {
      font-family: "MuseoModerno", sans-serif;
      font-weight: 200;
  }

  .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
  }

  .user-section {
      text-align: right;
  }

  .publisher-dashboard {
      text-align: center;
      border-radius: 8px;
      padding: 10px;
      color: #333;
      font-size: 40px;
  }

  @media (max-width: 768px) {
      .container {
          flex-direction: column;
          text-align: center;
      }

      .user-section {
          text-align: center;
          margin-top: 10px;
      }
  }
</style>