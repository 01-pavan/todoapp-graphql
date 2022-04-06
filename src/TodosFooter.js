import { useState } from "react";

const TodosFooter = ({
  filterResultsFn,
  todos,
  currentFilter,
  clearCompletedFn,
}) => {
  const handleClick = (filter) => {
    filterResultsFn(filter);
  };

  const activeTodos = todos.filter((todo) => todo.is_completed !== true);

  let itemCount = todos.length;
  if (currentFilter === "active") {
    itemCount = activeTodos.length;
  } else if (currentFilter === "completed") {
    itemCount = todos.length - activeTodos.length;
  }

  return (
    <div className="grid grid-cols-12 gap-2 place-content-center bg-white h-14  max-w-xl w-full shadow-xl ">
      <p className="col-span-3 px-4">{itemCount} items</p>
      <div className="col-span-6 grid grid-cols-3 gap-2">
        <button
          className={`${
            currentFilter === "all"
              ? "border rounded-md border-red-500"
              : "hover:border rounded-md border-red-500"
          }  `}
          type="button"
          onClick={() => {
            handleClick("all");
          }}
        >
          All
        </button>
        <button
          className={`${
            currentFilter === "active"
              ? "border rounded-md border-red-500"
              : "hover:border rounded-md border-red-500"
          }  `}
          type="button"
          onClick={() => {
            handleClick("active");
          }}
        >
          Active
        </button>
        <button
          className={`${
            currentFilter === "completed"
              ? "border rounded-md border-red-500"
              : "hover:border rounded-md border-red-500"
          }  `}
          type="button"
          onClick={() => {
            handleClick("completed");
          }}
        >
          Completed
        </button>
      </div>
      <button
        className="col-span-3 hover:underline underline-offset-8 decoration-red-400"
        type="button"
        onClick={() => {
          clearCompletedFn();
        }}
      >
        Clear completed
      </button>
    </div>
  );
};
export default TodosFooter;
