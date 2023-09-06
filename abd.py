# Define the initial state
initial_state = (3, 3, 1)  # (Missionaries on left, Cannibals on left, Boat on left)

# Define the goal state
goal_state = (0, 0, 0)  # (Missionaries on left, Cannibals on left, Boat on left)

# Define a function to check if a state is valid
def is_valid(state):
    missionaries_left, cannibals_left, boat_left = state
    missionaries_right, cannibals_right, boat_right = 3 - missionaries_left, 3 - cannibals_left, 1 - boat_left

    # Check if the missionaries are not outnumbered by cannibals on both sides
    if (missionaries_left != 0 and missionaries_left < cannibals_left) or (missionaries_right != 0 and missionaries_right < cannibals_right):
        return False

    return True

# Define a function to generate possible actions from a given state
def generate_actions(state): 
    actions = [] 
    missionaries_left, cannibals_left, boat_left = state

    # Generate possible actions based on the number of missionaries and cannibals
    for m in range(3):
        for c in range(3):
            if 1 <= m + c <= 2:  # The boat can carry 1 or 2 people
                new_state = (missionaries_left - m, cannibals_left - c, 1 - boat_left)
                if is_valid(new_state):
                    actions.append((m, c))
    
    return actions

# Define a depth-first search function to explore the state space
def dfs(state, path=[], depth_limit=100):
    if state == goal_state:
        return path + [state]

    if depth_limit <= 0:
        return None

    for action in generate_actions(state):
        m, c = action
        new_state = (state[0] - m, state[1] - c, 1 - state[2])
        if new_state not in path:
            new_path = path + [state]
            solution = dfs(new_state, new_path, depth_limit - 1)
            if solution:
                return solution


# Find the solution using depth-first search
solution_path = dfs(initial_state)

# Print the solution
if solution_path:
    print("Solution Path:")
    for i, state in enumerate(solution_path):
        print(f"Step {i + 1}: {state}")
else:
    print("No solution found.")
