const pokemonList = document.getElementById("pokemon-list");
const searchBox = document.getElementById("search-box");
const loadMoreBtn = document.getElementById("load-more");

let offset = 0;
const limit = 20;
let allPokemonNames = [];

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


async function fetchPokemon(offset, limit) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    for (const pokemon of data.results) {
      await displayPokemon(pokemon.url);
    }
  } catch (err) {
    console.error("Error fetching Pokémon:", err);
  }
}


async function displayPokemon(url) {
  try {
    const pokeRes = await fetch(url);
    const pokeData = await pokeRes.json();

    const types = pokeData.types
      .map(t => capitalizeFirstLetter(t.type.name))
      .join(', ');

    const li = document.createElement("li");
    li.setAttribute("id", `pokemon-${pokeData.id}`);
    li.innerHTML = `
      <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}" />
      <h3>${capitalizeFirstLetter(pokeData.name)}</h3>
      <p><strong>ID:</strong> ${pokeData.id}</p>
      <p><strong>Type:</strong> ${types}</p>
    `;
    pokemonList.appendChild(li);
  } catch (err) {
    console.error("Error displaying Pokémon:", err);
  }
}


loadMoreBtn.addEventListener("click", () => {
  offset += limit;
  fetchPokemon(offset, limit);
});


async function fetchAllPokemonNames() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
  const data = await response.json();
  allPokemonNames = data.results.map(p => p.name);
}
fetchAllPokemonNames();


searchBox.addEventListener("input", async () => {
  const query = searchBox.value.toLowerCase().trim();


  if (query === "") {
    pokemonList.innerHTML = "";
    offset = 0;
    fetchPokemon(offset, limit);
    loadMoreBtn.style.display = "block";
    return;
  }


  const matching = allPokemonNames.filter(name => name.startsWith(query));


  pokemonList.innerHTML = "";

  if (matching.length === 0) {
    pokemonList.innerHTML = `<li style="color:white;">No Pokémon found</li>`;
    loadMoreBtn.style.display = "none";
    return;
  }

  loadMoreBtn.style.display = "none";

  for (const name of matching.slice(0, 10)) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const pokeData = await response.json();

      const types = pokeData.types.map(t => capitalizeFirstLetter(t.type.name)).join(', ');

      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}" />
        <h3>${capitalizeFirstLetter(pokeData.name)}</h3>
        <p><strong>ID:</strong> ${pokeData.id}</p>
        <p><strong>Type:</strong> ${types}</p>
      `;

      pokemonList.appendChild(li);
    } catch (err) {
      console.error(`Failed to load data for ${name}:`, err);
    }
  }
});


fetchPokemon(offset, limit);