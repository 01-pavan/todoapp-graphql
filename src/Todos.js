import { useState, useContext, useRef, useEffect, useMemo } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import TodosFooter from "./TodosFooter";

const QUERY_ALL_TASKS = gql`
  query GetAllTasks {
    todos {
      id
      title
      is_completed
      created_at
    }
  }
`;

const CLEAR_COMPLETED = gql`
  mutation clearCompleted {
    delete_todos(where: { is_completed: { _eq: true } }) {
      affected_rows
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation toggleTodo($id: Int!, $isCompleted: Boolean!) {
    update_todos(
      where: { id: { _eq: $id } }
      _set: { is_completed: $isCompleted }
    ) {
      affected_rows
    }
  }
`;

const REMOVE_TODO = gql`
  mutation removeTodo($id: Int!) {
    delete_todos(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

function Todos() {
  const [state, setState] = useState({
    filter: "all",
    clearInProgress: false,
  });

  const filterResults = (filter) => {
    console.log("iam in todo filter");
    setState({
      ...state,
      filter: filter,
    });
  };

  const [clearCompletedTodos] = useMutation(CLEAR_COMPLETED);

  const clearCompleted = () => {
    clearCompletedTodos({
      optimisticResponse: true,
      update: (cache, { data }) => {
        const existingTodos = cache.readQuery({ query: QUERY_ALL_TASKS });
        const newTodos = existingTodos.todos.filter((t) => !t.is_completed);
        cache.writeQuery({ query: QUERY_ALL_TASKS, data: { todos: newTodos } });
      },
    });
  };

  const [toggleTodoMutation] = useMutation(TOGGLE_TODO);

  const toggleTodo = (todo) => {
    toggleTodoMutation({
      variables: { id: todo.id, isCompleted: !todo.is_completed },
      optimisticResponse: true,
      update: (cache) => {
        const existingTodos = cache.readQuery({ query: QUERY_ALL_TASKS });
        const newTodos = existingTodos.todos.map((t) => {
          if (t.id === todo.id) {
            return { ...t, is_completed: !t.is_completed };
          } else {
            return t;
          }
        });
        cache.writeQuery({
          query: QUERY_ALL_TASKS,
          data: { todos: newTodos },
        });
      },
    });
  };

  const [removeTodoMutation] = useMutation(REMOVE_TODO);

  const removeTodo = (e, todo) => {
    console.log("clicked");
    e.preventDefault();
    e.stopPropagation();
    removeTodoMutation({
      variables: { id: todo.id },
      optimisticResponse: true,
      update: (cache) => {
        const existingTodos = cache.readQuery({ query: QUERY_ALL_TASKS });
        const newTodos = existingTodos.todos.filter((t) => t.id !== todo.id);
        cache.writeQuery({
          query: QUERY_ALL_TASKS,
          data: { todos: newTodos },
        });
      },
    });
  };

  const { data, loading, error } = useQuery(QUERY_ALL_TASKS);

  if (data) {
    console.log(data);
  }

  if (loading) {
    return <h1>loading</h1>;
  }

  const todos = data.todos;
  console.log(todos);

  let filteredTodos = todos;
  if (state.filter === "active") {
    filteredTodos = todos.filter((todo) => todo.is_completed !== true);
  } else if (state.filter === "completed") {
    filteredTodos = todos.filter((todo) => todo.is_completed === true);
  }
  return (
    <>
      <div className="flex justify-start items-center bg-white max-h-screen  max-w-xl w-full shadow-xl border-b border-sky-500 overflow-y-auto scroll-smooth">
        <ul className="w-full h-full">
          {filteredTodos.map((todo, index) => {
            return (
              <li
                key={index}
                className="h-20  flex items-center border-b border-sky-500"
              >
                <div className="flex items-center  w-full">
                  <input
                    checked={todo.is_completed}
                    type="checkbox"
                    id={todo.id}
                    className="basis-1/12 w-5 h-5  "
                    onChange={() => toggleTodo(todo)}
                  />
                  <label
                    htmlFor={todo.id}
                    className={
                      "basis-11/12 text-3xl" +
                      (todo.is_completed ? " line-through opacity-25" : "")
                    }
                  >
                    {todo.title}
                  </label>
                </div>
                <button
                  className="p-5 text-red-500"
                  onClick={(e) => removeTodo(e, todo)}
                >
                  X
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <TodosFooter
        filterResultsFn={filterResults}
        todos={filteredTodos}
        currentFilter={state.filter}
        clearCompletedFn={clearCompleted}
      />
    </>
  );
}

export default Todos;

export { QUERY_ALL_TASKS };
