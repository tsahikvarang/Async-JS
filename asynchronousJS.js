let cache = {};
let currentPokemon = null;
document.getElementById("find").onclick = loadPokemon;
document.getElementById("add").onclick = addToTeam;

function loadPokemon(){
    let input = document.getElementById("pokemon").value;
	
	if (input == ""){
        alert("Please enter a name or ID.");
        return;
    }
	
    //if we already fetched this Pokemon before,
    //use the saved version instead of calling API again
    if (cache[input]){
        displayPokemon(cache[input]);
        return;
    }
	
	//call the PokeAPI
    fetch("https://pokeapi.co/api/v2/pokemon/" + input)
        .then(function(response){
            return response.json();
        })
		
        //when JSON is ready
        .then(function(pokemon){
			
            //save this Pokemon in cache
            cache[input] = pokemon;
			
            displayPokemon(pokemon);
        })
		
        //if something goes wrong
        .catch(function(){
            alert("Pokemon not found.");
        });
}

function displayPokemon(pokemon){
    currentPokemon = pokemon;
    const display = document.getElementById("pokemonDisplay");
    const moves = document.getElementById("moves");
	
	//clear old content
    display.innerHTML = "";
    moves.innerHTML = "";
	
    //image
    let img = document.createElement("img");
    img.src = pokemon.sprites.front_default;
    display.appendChild(img);
	
    //audio
    let audio = document.createElement("audio");
    audio.controls = true;
	audio.src = pokemon.cries.latest; //prefer new
	display.appendChild(audio);

    display.appendChild(document.createElement("br"));
	
    //make 4 dropdowns
    for (let i = 0; i < 4; i++){
        let select = document.createElement("select");
		
        let defaultOption = document.createElement("option");
        defaultOption.text = "Select Move";
        select.appendChild(defaultOption);
		
		for (let j = 0; j < pokemon.moves.length; j++){
            let moveName = pokemon.moves[j].move.name;
            let option = document.createElement("option");
            option.text = moveName;
            option.value = moveName;
            select.appendChild(option);
        }
		
        moves.appendChild(select);
        moves.appendChild(document.createElement("br"));
    }
}

function addToTeam(){
    if (!currentPokemon){
        alert("Choose a Pokemon first.");
        return;
    }
	
    let team = document.getElementById("team");
    let container = document.createElement("div");
	
    let img = document.createElement("img");
    img.src = currentPokemon.sprites.front_default;
    container.appendChild(img);
	
	let ul = document.createElement("ul");
	
    //get ALL dropdowns inside moves div
    let selects = document.getElementById("moves").getElementsByTagName("select");
	
    for (let i = 0; i < selects.length; i++){
        let selectedMove = selects[i].value;
        let li = document.createElement("li");
        li.textContent = selectedMove;
        ul.appendChild(li);
    }
	
    container.appendChild(ul);
	
    //add to team section
    team.appendChild(container);
}