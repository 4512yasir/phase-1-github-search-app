document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const repoList = document.getElementById("repos-list");
    const toggleButton = document.getElementById("toggle-search");

    let searchType = "users"; // Default search type

    // Event listener for form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;
        searchUsersOrRepos(query);
    });

    // Toggle search type (Users or Repositories)
    toggleButton.addEventListener("click", () => {
        searchType = searchType === "users" ? "repos" : "users";
        toggleButton.textContent = `Search: ${searchType.charAt(0).toUpperCase() + searchType.slice(1)}`;
    });

    // Search Users or Repositories
    function searchUsersOrRepos(query) {
        const url = searchType === "users"
            ? `https://api.github.com/search/users?q=${query}`
            : `https://api.github.com/search/repositories?q=${query}`;

        fetch(url, { headers: { Accept: "application/vnd.github.v3+json" } })
            .then(res => res.json())
            .then(data => {
                userList.innerHTML = "";
                repoList.innerHTML = "";

                if (searchType === "users") {
                    data.items.forEach(user => renderUser(user));
                } else {
                    data.items.forEach(repo => renderRepo(repo));
                }
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    // Render user data
    function renderUser(user) {
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${user.avatar_url}" width="50" height="50" />
            <a href="${user.html_url}" target="_blank">${user.login}</a>
            <button data-username="${user.login}">View Repos</button>
        `;
        li.querySelector("button").addEventListener("click", () => fetchRepos(user.login));
        userList.appendChild(li);
    }

    // Fetch repositories of a specific user
    function fetchRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: { Accept: "application/vnd.github.v3+json" }
        })
        .then(res => res.json())
        .then(repos => {
            repoList.innerHTML = `<h3>Repositories for ${username}</h3>`;
            repos.forEach(repo => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
                repoList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching repositories:", error));
    }

    // Render repository data
    function renderRepo(repo) {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a> - ⭐ ${repo.stargazers_count}`;
        repoList.appendChild(li);
    }
});
