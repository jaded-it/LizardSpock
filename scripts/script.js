// List of all the actions that are available to either player
const ALL_ACTIONS = ["rock", "paper", "scissors", "spock", "zombie", "LHC", "lizard"];
const ALL_ACTIONS_IMAGE_PATH = ["./images/rock.svg", "./images/paper.svg", "./images/scissors.svg",
                "./images/spock.svg", "./images/zombie.svg", "./images/lhc.svg", "./images/lizard.svg"];

// List of all the verbs for winning combinations
const ALL_ACTION_VERBS = ["crushes", "covers", "cuts", "bends", "brains", "cures", "evades",
                          "trips", "reprograms", "decapitates", "vaporizes", "shreds", "magnetizes", "poisons",
                          "blunts", "disproves", "stabs", "deactivates", "swallows", "nukes", "eats"]

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

const player_score_pips = document.querySelectorAll(".player.scores .score");
const computer_score_pips = document.querySelectorAll(".computer.scores .score");
// console.log(player_scores)
// player_scores[2].classList.add("pipglow");

function getRandomActionIndex() {
    return Math.floor(Math.random() * ALL_ACTIONS.length);
}

function getComputerActionIndex() {
    return getRandomActionIndex();
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
        case 5:
            return ALL_ACTION_VERBS[winning_action_index + (ALL_ACTIONS.length * 2)];
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
    const player_extra_winning_action = (computer_action_index + 5) % ALL_ACTIONS.length;

    // Determine which player wins, and return message stating the round result
    let victory_verb;
    switch (player_action_index) {
        case computer_action_index:
            return [0, `Both chose ${player_action}`];
        case player_winning_action:
        case player_alternate_winning_action:
        case player_extra_winning_action:
            victory_verb = getVictoryVerb(player_action_index, computer_action_index);
            return [1, `${player_action} ${victory_verb} ${computer_action}`];
        default:
            victory_verb = getVictoryVerb(computer_action_index, player_action_index);
            return [2, `${computer_action} ${victory_verb} ${player_action}`];
    }
}

let is_buttons_locked = false;

function updateStats() {
    game_counter.textContent = `Round: ${round_number}`;
    win_counter.textContent = `Wins: ${player_win_count}`;
    loss_counter.textContent = `Losses: ${computer_win_count}`;
    draw_counter.textContent = `Draws: ${round_number - player_win_count - computer_win_count - 1}`;

    // Update display pips
    for (let i = 0; i < player_win_count; i++) {
        player_score_pips[2 - i].classList.add("pipglow");
    }
    for (let i = 0; i < computer_win_count; i++) {
        computer_score_pips[i].classList.add("pipglow");
    }

    // Set text and visibility of the next round / game button
    let nextButton = document.querySelector(".next-round");
    if (is_game_over) {
        nextButton.textContent = "New Game";
    } else {
        nextButton.textContent = "Next Round";
    }

    let player_input_buttons = document.querySelectorAll(".player-input");
    player_input_buttons.forEach((button) => {
        if (is_buttons_locked) {
            button.classList.add("lock-input");
        } else {
            button.classList.remove("lock-input");
        }
    })

    message_section.textContent = `${message}`;
    game_over_section.textContent = `${game_over_message}`;
}

function playerSelect(player_action_index, computer_action_index) {


    // Calculate the round result
    let round_result = getRoundResult(player_action_index, computer_action_index);
    console.log(`You played: ${ALL_ACTIONS[player_action_index]}\n${round_result[1]}`); // Output round result message

    let nextButton = document.querySelector(".next-round");
    nextButton.classList.remove("hidden");
    let combat_state_text = document.querySelector(".combat-state");
    combat_state_text.classList.remove("hidden");

    // Get who won and increment respectively
    switch (round_result[0]) {
        case 1: // Player victory
            player_win_count++
            combat_state_text.textContent = "Victory!";
            break;
        case 2: // Computer victory
            computer_win_count++
            combat_state_text.textContent = "Defeat!";
            break;
        default: // Draw
            combat_state_text.textContent = "Draw!";
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

    // Update the display
    round_number++;
    updateStats();
}

let is_player_fast_rolling = false;
let is_player_selected = false;
let player_fast_iterator = 0;
let player_selection = 0;

let is_computer_fast_rolling = false;
let is_computer_selected = false;
let computer_fast_iterator = 0;
let computer_selection = 0;

function fastSelection() {
    let player_choice_img = document.querySelector(".player-choice-display");
    let computer_choice_img = document.querySelector(".computer-choice-display");

    if (is_player_fast_rolling && !is_player_selected) {
        player_choice_img.src = `${ALL_ACTIONS_IMAGE_PATH[player_fast_iterator]}`;

        if (player_fast_iterator === player_selection) {
            is_player_selected = true;
            player_choice_img.classList.add("anim-radius");
            player_choice_img.classList.add(ALL_ACTIONS[player_selection]);
            computerSelect();
        }
    }

    if (is_computer_fast_rolling && !is_computer_selected) {
        computer_choice_img.src = `${ALL_ACTIONS_IMAGE_PATH[computer_fast_iterator]}`;

        if (computer_fast_iterator === computer_selection) {
            is_computer_selected = true;
            computer_choice_img.classList.add("anim-radius");
            computer_choice_img.classList.add(ALL_ACTIONS[computer_selection]);
            playerSelect(player_selection, computer_selection);
        }
    }
}

let spinner_iteration = 0;

function imageUpdate() {
    let player_choice_img = document.querySelector(".player-choice-display");
    let computer_choice_img = document.querySelector(".computer-choice-display");

    switch (spinner_iteration % 2) {
        case 0:
            if (!is_player_fast_rolling && !is_player_selected) {
                let player_img_index = spinner_iteration / 2;
                player_choice_img.src = `${ALL_ACTIONS_IMAGE_PATH[player_img_index]}`;
            }
            break;
        default:
            if (!is_computer_fast_rolling && !is_computer_selected) {
                let computer_img_index = (Math.floor(spinner_iteration / 2) + 3) % ALL_ACTIONS.length;
                computer_choice_img.src = `${ALL_ACTIONS_IMAGE_PATH[computer_img_index]}`;
            }
            break;
    }
}

function computerSelect() {
    if (is_computer_fast_rolling || is_computer_selected) return;

    computer_action_index = getComputerActionIndex();

    computer_fast_iterator = (computer_action_index + ALL_ACTIONS.length + 1) % ALL_ACTIONS.length;
    computer_selection = computer_action_index;
    is_computer_fast_rolling = true;
}

function selectButton(player_action_index) {
    if (is_player_fast_rolling || is_player_selected) return;

    is_buttons_locked = true;
    updateStats();

    player_fast_iterator = (player_action_index + ALL_ACTIONS.length + 3) % ALL_ACTIONS.length;
    player_selection = player_action_index;
    is_player_fast_rolling = true;
}

function game() {
    updateStats();
    let image_spinner_interval = setInterval(() => {
        spinner_iteration = (spinner_iteration + 1) % (ALL_ACTIONS.length * 2);
        imageUpdate();
    }, 150);

    let fast_spinner_interval = setInterval(() => {
        player_fast_iterator = (player_fast_iterator + 1) % ALL_ACTIONS.length;
        computer_fast_iterator = (computer_fast_iterator + 1) % ALL_ACTIONS.length
        fastSelection();
    }, 50);
    
    // Add event listeners to player buttons
    let player_input_buttons = document.querySelectorAll(".player-input");
    player_input_buttons.forEach(button => {
        let player_index = ALL_ACTIONS.findIndex(item => item === button.id); // the html id corresponds to an action string
        button.addEventListener("click", () => {
            selectButton(player_index)
            //playerSelect(player_index);
        });
    })

    let nextButton = document.querySelector(".next-round");
    nextButton.addEventListener("click", () => {
        if (!is_player_selected || !is_computer_selected) return;

        // Reset stats if necessary
        if (is_game_over) {
            player_win_count = 0;
            computer_win_count = 0;
            round_number = 1;
            game_over_message = '';
            is_game_over = false;

            // Reset pips
            for (let i = 0; i < 3; i++) {
                player_score_pips[i].classList.remove("pipglow");
                computer_score_pips[i].classList.remove("pipglow");
            }
        }

        let player_choice_img = document.querySelector(".player-choice-display");
        let computer_choice_img = document.querySelector(".computer-choice-display");

        player_choice_img.classList.remove("anim-radius");
        computer_choice_img.classList.remove("anim-radius");
        for (let i = 0; i < ALL_ACTIONS.length; i++) {
            player_choice_img.classList.remove(ALL_ACTIONS[i]);
            computer_choice_img.classList.remove(ALL_ACTIONS[i]);
        }

        let combat_state_text = document.querySelector(".combat-state");
        nextButton.classList.add("hidden");
        combat_state_text.classList.add("hidden");
        message = "Select your move!";
        is_buttons_locked = false;

        is_player_fast_rolling = false;
        is_player_selected = false;
        player_fast_iterator = 0;
        player_selection = 0;

        is_computer_fast_rolling = false;
        is_computer_selected = false;
        computer_fast_iterator = 0;
        computer_selection = 0;

        updateStats();
    });
}


game();