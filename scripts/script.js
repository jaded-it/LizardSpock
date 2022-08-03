// List of all the actions that are available to either player
const ALL_ACTIONS = ["rock", "paper", "scissors", "spock", "lizard"];

// List of all the verbs for winning combinations
const ALL_ACTION_VERBS = ["crushes", "covers", "cuts", "smashes", "poisons",
                          "crushes", "disproves", "decapitates", "vaporizes", "eats"]

let player_win_count = 0;
let computer_win_count = 0;
let round_number = 1;

let message = 'Select your move!';
let game_over_message = '';

let is_game_over = false;

const game_counter = document.querySelector("#games-played");
const win_counter = document.querySelector("#wins");
const loss_counter = document.querySelector("#losses");
const draw_counter = document.querySelector("#draws");

const message_section = document.querySelector("#message-section");
const game_over_section = document.querySelector("#game-over-section");


function getRandomActionIndex() {
    return Math.floor(Math.random() * ALL_ACTIONS.length);
}

function getComputerActionIndex() {
    return getRandomActionIndex();
}

// Converts an action (string) to an action_index (integer)
function convertActionToIndex(action) {
    return ALL_ACTIONS.findIndex( (current_item) => {return current_item === action} );
}

// Determines which verb to use for the winning action e.g. cuts, disproves, vaporizes, etc.
function getVictoryVerb(winning_action_index, losing_action_index) {
    let distance_to_left;
    if (winning_action_index < losing_action_index) {  // calculated distance to the left only if wrapping
        distance_to_left = Math.abs(winning_action_index + ALL_ACTIONS.length - losing_action_index);
    } else {  // calculates distance to the left only if not wrapping
        distance_to_left = Math.abs(winning_action_index - losing_action_index); 
    }

    switch (distance_to_left) {
        case 1:
            return ALL_ACTION_VERBS[winning_action_index];
            break;
        case 3:
            return ALL_ACTION_VERBS[winning_action_index + ALL_ACTIONS.length];
            break;
    }
}

function getRoundResult(player_action_index, computer_action_index) {
    // Convert action indexes to strings for both players
    let player_action = ALL_ACTIONS[player_action_index];
    let computer_action = ALL_ACTIONS[computer_action_index];

    // Based on the computers action, calculate the action index the player would needs to win
        /* This works because if we consider each action in a circle where rock = 0, and paper = 1,
        then if the computers action index is 0 (rock), then the player needs 0 + 1 (paper) to win.
        +3 is used for the new additions to the game. If the computer index is 0 (rock),
        then another winning option is 0 + 3 (spock). Modulo is used to wrap the array into a circle */
    const player_winning_action = (computer_action_index + 1) % ALL_ACTIONS.length;
    const player_alternate_winning_action = (computer_action_index + 3) % ALL_ACTIONS.length;

    // Determine which player wins, and return message stating the round result
    let victory_verb;
    switch (player_action_index) {
        case computer_action_index:
            return [0, `You drew because you both chose ${player_action}`];
        case player_winning_action:
        case player_alternate_winning_action:
            victory_verb = getVictoryVerb(player_action_index, computer_action_index);
            return [1, `You won because ${player_action} ${victory_verb} ${computer_action}`];
        default:
            victory_verb = getVictoryVerb(computer_action_index, player_action_index);
            return [2, `You lost because ${computer_action} ${victory_verb} ${player_action}`];
    }
}

function getPlayerActionIndex() {
    for (;;) {
        let user_action = prompt("Rock Paper Scissors Lizard or Spock?\nEnter your choice:");

        if (!!user_action) { // If user action prompt not empty or null
            let user_action_index = convertActionToIndex(user_action.toLowerCase());
            if (user_action_index != -1) {
                return user_action_index;
            }
        }
    }
}

function updateStats() {
    game_counter.textContent = `Round: ${round_number}`;
    win_counter.textContent = `Wins: ${player_win_count}`;
    loss_counter.textContent = `Losses: ${computer_win_count}`;
    draw_counter.textContent = `Draws: ${round_number - player_win_count - computer_win_count - 1}`;

    message_section.textContent = `${message}`;
    game_over_section.textContent = `${game_over_message}`;
}

function playerSelect(player_action_index) {
    // Reset stats if necessary
    if (is_game_over) {
        player_win_count = 0;
        computer_win_count = 0;
        round_number = 1;
        game_over_message = '';
        is_game_over = false;
    }

    const computer_action_index = getComputerActionIndex();

    // Calculate the round result
    let round_result = getRoundResult(player_action_index, computer_action_index);
    console.log(`You played: ${ALL_ACTIONS[player_action_index]}\n${round_result[1]}`); // Output round result message

    // Get who won and increment respectively
    switch (round_result[0]) {
        case 1: // Player victory
            player_win_count++
            break;
        case 2: // Computer victory
            computer_win_count++
            break;
        default: // Draw
            break;
    }

    message = round_result[1];

    // If either player has won, display appropriate message, then break the game loop
    if (player_win_count >= 3) {
        console.log("\nVictory! You won the LizardSpock championship!");
        game_over_message = "Victory! You won the LizardSpock championship!"
        is_game_over = true;
    } else if (computer_win_count >= 3) {
        console.log("\nDefeat! You lost the LizardSpock championship :C");
        game_over_message = "Defeat! You lost the LizardSpock championship :C";
        is_game_over = true;
    }

    // Update the scores display
    round_number++;
    updateStats();
}

function game() {
    updateStats();
    
    // Add event listeners to buttons
    let player_input_buttons = document.querySelectorAll(".player-input");
    player_input_buttons.forEach(button => {
        let player_index = ALL_ACTIONS.findIndex(item => item === button.id);
        button.addEventListener("click", () => {
            playerSelect(player_index);
        });
    })
}


game();