import "./App.css";
import Todos from "./Todos";
import SearchBar from "./TodoInput";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";

function App() {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: "https://close-weasel-19.hasura.app/v1/graphql",
      options: {
        reconnect: true,
        timeout: 30000,
      },
      headers: {
        "x-hasura-admin-secret": process.env.REACT_APP_SECRET_KEY,
      },
    }),
    cache: new InMemoryCache(),
  });

  // const [createTask] = useMutation(CREATE_TASK_MUTATION);

  return (
    <ApolloProvider client={client}>
      <div className="flex flex-col items-center max-h-screen bg-slate-50 relative">
        <div className="flex flex-col  items-center w-10/12 max-h-fit mt-6 ">
          <h1 className="text-8xl text-red-500 opacity-40 py-6">todos</h1>
          <SearchBar />
          <Todos />
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
