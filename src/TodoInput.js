import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { QUERY_ALL_TASKS } from "./Todos";

const CREATE_TODO_MUTATION = gql`
  mutation ($todo: String!) {
    insert_todos(objects: { title: $todo }) {
      affected_rows
      returning {
        id
        title
        created_at
        is_completed
      }
    }
  }
`;

function TodoInput() {
  const [input, setInput] = useState("");

  const updateCache = (cache, { data }) => {
    //fetching todos from the cache
    const existingTodos = cache.readQuery({
      query: QUERY_ALL_TASKS,
    });

    //ADD THE NEW TODO TO THE CACHE
    const newTodo = data.insert_todos.returning[0];
    // console.log(newTodo);
    cache.writeQuery({
      query: QUERY_ALL_TASKS,
      data: { todos: [newTodo, ...existingTodos.todos] },
    });
    // console.log(cache);
  };

  const [createTask] = useMutation(CREATE_TODO_MUTATION, {
    update: updateCache,
  });

  const handleClick = (e) => {
    e.target.value = "";

    createTask({
      variables: { todo: input },
    });
  };

  return (
    <div className="flex justify-center items-center bg-white h-20  max-w-xl w-full shadow-xl border-b border-sky-500">
      <input
        className="m-auto h-5/6 w-5/6 text-4xl outline-none italic"
        type="text"
        placeholder="What needs to be done?"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) handleClick(e);
        }}
      ></input>
    </div>
  );
}
export default TodoInput;
