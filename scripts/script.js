// List of all the actions that are available to either player
const ALL_ACTIONS = ["rock", "paper", "scissors", "spock", "lizard"];

// List of all the verbs for winning combinations
const ALL_ACTION_VERBS = ["crushes", "covers", "cuts", "smashes", "poisons",
                          "crushes", "disproves", "decapitates", "vaporizes", "eats"]

function getRandomActionIndex() {
    return Math.floor(Math.random() * ALL_ACTIONS.length);
}

function getComputerActionIndex() {
    return getRandomActionIndex();
}

function converActionToIndex(action) {
    return ALL_ACTIONS.findIndex( (cmp) => {return cmp === action} );
}

// Determines which verb to use for the winning action e.g. cuts, disproves, vaporizes, etc.
function getVictoryVerb(winning_action_index, losing_action_index) {
    if (Math.abs(winning_action_index - losing_action_index) > 1) {
        return ALL_ACTION_VERBS[winning_action_index + ALL_ACTIONS.length];
    } else {
        return ALL_ACTION_VERBS[winning_action_index];
    }
}

function getRoundResult(player_action, computer_action_index) {
    // Normalize player input
    player_action = player_action.toLowerCase();

    // Convert to numeric format to simplify determining round result
    const player_action_index = converActionToIndex(player_action);

    // Based on the computers action, calculate the action index the player would needs to win 
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
            return [1, `You won because ${player_action} ${victory_verb} ${ALL_ACTIONS[computer_action_index]}`];
        default:
            victory_verb = getVictoryVerb(computer_action_index, player_action_index);
            return [2, `You lost because ${ALL_ACTIONS[computer_action_index]} ${victory_verb} ${player_action}`];
    }
}

function game() {
    let player_win_count = 0;
    let computer_win_count = 0;
    let round_number = 1;
    // First to 3 game
    for (;; round_number++) {
        let round_result = getRoundResult('lizard', getComputerActionIndex());
        console.log(round_result[1]); // Output round result message

        // Get who one and increment respectively
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

        // If either player has one, display appropriate message, then break the game loop
        if (player_win_count >= 3) {
            console.log("\nVictory! You won the LizardSpock best of 5!");
            break;
        } else if (computer_win_count >= 3) {
            console.log("\nDefeat! You lost the LizardSpock best of 5 :C");
            break;
        }
    }

    // Output game stats
    const draw_count = round_number - player_win_count - computer_win_count;
    console.log(`Rounds played: ${round_number}\nWins: ${player_win_count}\nLosses: ${computer_win_count}\nDraws: ${draw_count}`);
}

game();