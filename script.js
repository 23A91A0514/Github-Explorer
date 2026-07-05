const usernameInput = document.getElementById("username");
const searchBtn = document.getElementById("searchBtn");
const reposBtn = document.getElementById("reposBtn");
const profile = document.getElementById("profile");
const loading = document.getElementById("loading");

const followersBtn = document.getElementById("followersBtn");
const followingBtn = document.getElementById("followingBtn");

const usersContainer = document.getElementById("usersContainer");

let currentUser = "";

// Search button
searchBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();

    if (username === "") {
        alert("Please enter a GitHub username.");
        return;
    }

    currentUser = username;

    getProfile(username);
});

// Press Enter to search
usernameInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});
async function getProfile(username) {

    loading.style.display = "block";
    profile.innerHTML = "";
    usersContainer.innerHTML = "";

    try {

        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) {
            throw new Error("User not found");
        }

        const user = await response.json();

        displayProfile(user);

    } catch (error) {

        profile.innerHTML = `
            <h2 style="text-align:center;color:red;">
                ${error.message}
            </h2>
        `;

    }

    loading.style.display = "none";

}
function displayProfile(user) {

    profile.innerHTML = `

    <div class="profile-card">

        <img src="${user.avatar_url}" alt="Avatar">

        <div class="profile-info">

            <h2>${user.name || user.login}</h2>

            <p>@${user.login}</p>

            <p>${user.bio || "No bio available."}</p>

            <p>📍 ${user.location || "Not specified"}</p>

            <p>
    📦 Public Repositories :
    <button class="repo-btn" onclick="getRepositories()">
        ${user.public_repos}
    </button>
</p>

            <p>👥 Followers : ${user.followers}</p>

            <p>➡ Following : ${user.following}</p>

            <a href="${user.html_url}" target="_blank">
                Open GitHub Profile
            </a>

        </div>

    </div>

    `;

}followersBtn.addEventListener("click", () => {

    if (currentUser === "") {
        alert("Search a user first.");
        return;
    }

    getUsers("followers");

});

followingBtn.addEventListener("click", () => {

    if (currentUser === "") {
        alert("Search a user first.");
        return;
    }

    getUsers("following");

});
async function getUsers(type) {

    loading.style.display = "block";

    usersContainer.innerHTML = "";

    const response = await fetch(
        `https://api.github.com/users/${currentUser}/${type}`
    );

    const users = await response.json();

    loading.style.display = "none";

    users.forEach(user => {

        usersContainer.innerHTML += `

        <div class="user-card">

            <img src="${user.avatar_url}">

            <h3>${user.login}</h3>

            <button
                class="view-btn"
                onclick="viewProfile('${user.login}')">

                View Profile

            </button>

            <button
                class="github-btn"
                onclick="window.open('${user.html_url}')">

                Open GitHub

            </button>

        </div>

        `;

    });

}
function viewProfile(username) {

    usernameInput.value = username;

    currentUser = username;

    getProfile(username);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
async function getRepositories(){

    loading.style.display = "block";

    usersContainer.innerHTML = "";

    try{

        const response = await fetch(
            `https://api.github.com/users/${currentUser}/repos?sort=updated`
        );

        const repos = await response.json();

        loading.style.display = "none";

        if(repos.length===0){

            usersContainer.innerHTML=`
                <h2 style="text-align:center;width:100%;">
                    No repositories found.
                </h2>
            `;

            return;
        }

        repos.forEach(repo=>{

            usersContainer.innerHTML+=`

                <div class="user-card">

                    <h3>${repo.name}</h3>

                    <p>${repo.description || "No description available."}</p>

                    <p>⭐ ${repo.stargazers_count}</p>

                    <p>🍴 ${repo.forks_count}</p>

                    <p>💻 ${repo.language || "Not specified"}</p>

                    <button
                        class="view-btn"
                        onclick="window.open('${repo.html_url}','_blank')">

                        Open Repository

                    </button>

                </div>

            `;

        });

    }

    catch(error){

        loading.style.display="none";

        alert("Unable to fetch repositories.");

    }

}
reposBtn.addEventListener("click", () => {

    if (currentUser === "") {
        alert("Search a user first.");
        return;
    }

    getRepositories();

});
async function getRepositories() {

    loading.style.display = "block";

    usersContainer.innerHTML = "";

    try {

        const response = await fetch(
            `https://api.github.com/users/${currentUser}/repos?sort=updated`
        );

        const repos = await response.json();

        loading.style.display = "none";

        if (repos.length === 0) {
            usersContainer.innerHTML =
                "<h2 style='text-align:center;'>No repositories found.</h2>";
            return;
        }

        repos.forEach(repo => {

            usersContainer.innerHTML += `

            <div class="user-card">

                <h3>${repo.name}</h3>

                <p>${repo.description || "No description available"}</p>

                <p>⭐ Stars : ${repo.stargazers_count}</p>

                <p>🍴 Forks : ${repo.forks_count}</p>

                <p>💻 Language : ${repo.language || "N/A"}</p>

                <button class="view-btn"
                    onclick="window.open('${repo.html_url}','_blank')">

                    Open Repository

                </button>

            </div>

            `;

        });

    } catch (error) {

        loading.style.display = "none";

        alert("Unable to fetch repositories.");

    }

}
if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("service-worker.js")
            .then(() => console.log("Service Worker Registered"))
            .catch(err => console.log(err));

    });

}