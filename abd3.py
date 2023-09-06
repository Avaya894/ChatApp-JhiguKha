from time import time
from queue import Queue
import pydot
import numpy as np

class Node:
    goal_state = [0, 0, 0]
    num_of_instances = 0

    def __init__(self, state, parent, action, depth):
        self.parent = parent
        self.state = state
        self.action = action
        self.depth = depth
        if self.is_killed():
            color = "#cc241d"
        elif self.goal_test():
            color = "#d3869d"
        else:
            color = "#fbf1c7"
        self.graph_node = pydot.Node(str(self), style="filled", fillcolor=color)
        Node.num_of_instances += 1

    def __str__(self):
        return str(self.state)

    def goal_test(self):
        if self.state == self.goal_state:
            return True
        return False

    def is_valid(self): 
        missionaries = self.state[0]
        cannibals = self.state[1]
        boat = self.state[2]
        if missionaries < 0 or missionaries > 3:
            return False
        if cannibals < 0 or cannibals > 3:
            return False
        if boat > 1 or boat < 0:
            return False
        return True

    def is_killed(self):
        missionaries = self.state[0]
        cannibals = self.state[1]
        if missionaries < cannibals and missionaries > 0:
            return True
        # Check for the other side
        if missionaries > cannibals and missionaries < 3:
            return True

    def generate_child(self):
        children = []
        depth = self.depth + 1
        op = -1 # Subtract
        boat_move = "from left shore to right"

        if self.state[2] == 0:
            op = 1 # Add
            boat_move = "from right shore to left"

        for x in range(3):
            for y in range(3):
                new_state = self.state.copy()
                new_state[0], new_state[1], new_state[2] = (
                    new_state[0] + op * x,
                    new_state[1] + op * y,
                    new_state[2] + op * 1,
                )
                action = [x, y, op]
                new_node = Node(new_state, self, action, depth)
                if x + y >= 1 and x + y <= 2:
                    children.append(new_node)
        return children

    def find_solution(self):
        solution = []
        solution.append(self.action)
        path = self
        while path.parent != None:
            path = path.parent
            solution.append(path.action)
        solution = solution[:-1]
        solution.reverse()
        return solution

def bfs(initial_state):
    graph = pydot.Dot(
        graph_type="digraph",
        fontsize="30",
        color="red",
        style="filled",
        fillcolor="black",
    )
    start_node = Node(initial_state, None, None, 0)
    if start_node.goal_test():
        return start_node.find_solution()
    q = Queue()
    q.put(start_node)
    explored = []
    killed = []
    print("The starting node is \ndepth=%d" % start_node.depth)
    print(str(start_node.state))
    while not q.empty():
        node = q.get()
        print(
            "\nthe node selected to expand is\ndepth="
            + str(node.depth)
            + "\n"
            + str(node.state)
            + "\n"
        )
        explored.append(node.state)
        graph.add_node(node.graph_node)
        if node.parent:
            diff = np.subtract(node.parent.state, node.state)
        if node.parent.state[2] == 0:
            diff[0], diff[1] = -diff[0], -diff[1]
        graph.add_edge(
            pydot.Edge(node.parent.graph_node, node.graph_node, label=str(diff))
        )
        children = node.generate_child()
        if not node.is_killed():
            print("the children nodes of this node are", end="")
            for child in children:
                if child.state not in explored:
                    print("\ndepth=%d" % child.depth)
                    print(str(child.state))
                    if child.goal_test():
                        print("which is the goal state\n")
                        graph.add_node(child.graph_node)
                        diff = np.subtract(node.parent.state, node.state)
                        if node.parent.state[2] == 0:
                            diff[0], diff[1] = -diff[0], -diff[1]

                            graph.add_edge(
                                pydot.Edge(
                                    child.parent.graph_node,
                                    child.graph_node,
                                    label=str(diff),
                                )
                            )

                            # colour all leaves blue
                            leafs = {n.get_name(): True for n in graph.get_nodes()}

                            for e in graph.get_edge_list():
                                leafs[e.get_source()] = False
                            for leaf in leafs:
                                if (
                                    leafs[leaf]
                                    and str(leaf) not in killed
                                    and str(leaf) != '"[0, 0, 0]"'
                                ):
                                    node = pydot.Node(
                                        leaf, style="filled", fillcolor="#4169e1"
                                    )
                                    graph.add_node(node)

                            draw_legend(graph)
                            graph.write_png("state-space-tree.png")

                            return child.find_solution()
                    if child.is_valid():
                        q.put(child)
                        explored.append(child.state)
                    else:
                        print("This node is killed")
                        killed.append('"' + str(node.state) + '"')

def draw_legend(graph):
    graphlegend = pydot.Cluster(
        fontsize="20",
        color="red",
        fontcolor="blue",
        style="filled",
        fillcolor="white",
    )

if __name__ == "__main__":
    initial_state = [3, 3, 1]

    Node.num_of_instances = 0
    t0 = time()
    solution = bfs(initial_state)
    t1 = time() - t0
    print("Solution:", solution)
    print("space:", Node.num_of_instances)
    print("time:", t1, "seconds")
