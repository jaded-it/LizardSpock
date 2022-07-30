// List of all the actions that are available to either player
const ALL_ACTIONS = ["rock", "paper", "scissors"];

function getRandomActionIndex() {
    return Math.floor(Math.random() * ALL_ACTIONS.length);
}

function getComputerActionIndex() {
    return getRandomActionIndex();
}

function getActionToIndex(action) {
    return ALL_ACTIONS.findIndex( (cmp) => {return cmp === action} );
}

function getRoundResult(player_action, computer_action_index) {
    // Normalize player input
    player_action = player_action.toLowerCase();

    // Convert to numeric format to simplify determining round result
    const player_action_index = getActionToIndex(player_action);

    // Based on the computers action, calculate the action index the player would needs to win 
    const player_winning_action = (computer_action_index + 1) % ALL_ACTIONS.length;

    // Determine which player wins, and return message stating the round result
    switch (player_action_index) {
        case computer_action_index:
            return `You drew, the computer also chose ${player_action}`;
            break;
        case player_winning_action:
            return `You won, ${player_action} beats ${ALL_ACTIONS[computer_action_index]}`;
            break;
        default:
            return `You lost, ${player_action} loses to ${ALL_ACTIONS[computer_action_index]}`;
    }
}

console.log(getRoundResult('rock', getComputerActionIndex()));