let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

    function getAll() {
        return pokemonList;
    }

    function add(pokemon) {
        return pokemonList.push(pokemon);
    }

    function addv(item) {
        function checkKeys(array) {
            if (array.includes("name") &&
                array.includes("type") &&
                array.includes("height")) {
                return true;
            }
            else {
                return false;
            }
        }

        if (typeof (item) !== "object")
            return "Item is not an object!";
        else {

            if (checkKeys(Object.keys(item))) {
                return pokemonList.push(item);
            } else {
                return "Keys are not correct! name, type, height are required.";
            }
        }
    }

    function get(name) {
        return pokemonList.find(pokemon => pokemon.name.toLowerCase() === name.toLowerCase());
    }

    function addListItem(pokemon) {
        let pokemonList = document.querySelector(".pokemon-list");
        let listItem = document.createElement("li");
        listItem.classList.add("group-list-item");

        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("pokemon-button-container");

        let button = document.createElement("img");
        button.setAttribute("src", "resources/pokeball.png");
        button.classList.add("pokemon-button-image");
        button.setAttribute("data-target", "#pokemon-modal");
        button.setAttribute("data-toggle", "modal");

        let buttonText = document.createElement("div");
        buttonText.classList.add("pokemon-button-text");
        buttonText.innerText = pokemon.name;
        buttonContainer.appendChild(button);
        buttonContainer.appendChild(buttonText);
        listItem.appendChild(buttonContainer);
        pokemonList.appendChild(listItem);

        button.addEventListener("click", () => {
            loadDetails(pokemon).then(function () {
                showDetails(pokemon);
            })
        });
    }

    function showDetails(pokemon) {
        let title = document.getElementById("pokemon-modal-label");
        title.innerText = pokemon.name;
        let pokemonModal = document.querySelector(".modal-body");
        pokemonModal.innerHTML = "";
        let height = document.createElement("h3");
        height.innerText = `Height: ${pokemon.height}`;
        let image = document.createElement("img");
        image.src = pokemon.imageUrl;
        pokemonModal.appendChild(height);
        pokemonModal.appendChild(image);
    }

    function navigatePokemons(direction) {
        let currentPokemon = document.getElementById("pokemon-modal-label").innerHTML;
        let posCurrent = pokemonList.findIndex(element => {
            if (element.name === currentPokemon) {
                return true;
            }
        });
        let position;
        if (direction === "next") {
            position = posCurrent + 1
        } else {
            position = posCurrent - 1
        }
        let nextPokemon = pokemonList[position];

        loadDetails(nextPokemon).then(function () {
            showDetails(nextPokemon);
        })
    }

    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
                    pokeapiUrl: item.url
                };
                add(pokemon);
            });
        });
    }

    function loadDetails(item) {
        let url = item.pokeapiUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            // Now we add the details to the item
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types;
            item.spriteUrl = details.sprites.front_default;
        });
    }

    let nextButton = document.querySelector(".next-button");

    $(nextButton).ready(function () {
        $(nextButton).click(function () {
            navigatePokemons("next");
        });
    });

    let prevButton = document.querySelector(".prev-button");

    $(prevButton).ready(function () {
        $(prevButton).click(function () {
            navigatePokemons("prev");
        });
    });

    return {
        getAll: getAll,
        add: add,
        addv: addv,
        get: get,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails
    }
})();

pokemonRepository.loadList().then(function () {
    // Now the data is loaded!
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});

// colapse bootstrap navbar when clicking outside the navbar #6
let pokemonList = document.querySelector(".pokemon-list");

$(pokemonList).ready(function () {
    $(pokemonList).click(function () {
        $(".navbar-collapse").collapse("hide");
    });
});

