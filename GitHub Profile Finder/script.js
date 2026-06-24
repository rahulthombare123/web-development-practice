const input = document.getElementById("username");
const searchBtn = document.getElementById("search-btn");
const profileCard = document.querySelector(".profile-card");

searchBtn.addEventListener("click", getProfile);

async function getProfile() {
  const username = input.value.trim();

  if (username === "") {
    profileCard.innerHTML = `
      <h2>Please enter a GitHub username.</h2>
    `;
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}`
    );

    const data = await response.json();

    if (data.message === "Not Found") {
      profileCard.innerHTML = `
        <h2>User not found 😔</h2>
      `;
      return;
    }

    profileCard.innerHTML = `
      <img
        src="${data.avatar_url}"
        alt="${data.login}"
        class="avatar"
      >

      <h2>${data.name || "No Name"}</h2>

      <p class="username">
        @${data.login}
      </p>

      <p class="bio">
        ${data.bio || "No bio available"}
      </p>

      <div class="stats">
        <div>
          <h3>${data.followers}</h3>
          <span>Followers</span>
        </div>

        <div>
          <h3>${data.following}</h3>
          <span>Following</span>
        </div>

        <div>
          <h3>${data.public_repos}</h3>
          <span>Repos</span>
        </div>
      </div>

      <a
        href="${data.html_url}"
        target="_blank"
        class="profile-link"
      >
        Visit GitHub Profile
      </a>
    `;
  } catch (error) {
    profileCard.innerHTML = `
      <h2>Something went wrong.</h2>
    `;
    console.log(error);
  }
}