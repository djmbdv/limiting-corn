import { MouseEventHandler, useCallback, useReducer, useState } from "react";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";

const API_URL = import.meta.env.VITE_API_URL || "//localhost:3000";

interface CounterState {
  sucess: number;
  failed: number;
}

type CounterAction = { type: "success" } | { type: "failed" };

const initialState: CounterState = {
  sucess: 0,
  failed: 0,
};

const reducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case "success":
      return { ...state, sucess: state.sucess + 1 };
    case "failed":
      return { ...state, failed: state.failed + 1 };
    default:
      return state;
  }
};

function App() {
  const [{ sucess, failed }, counterDispatch] = useReducer(
    reducer,
    initialState
  );

  const [lastMessage, setLastMessage] = useState("");

  const handleGetCornButton = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(async () => {
    try {
      const res = await fetch(API_URL, { method: "POST" });
      counterDispatch({ type: "success" });
      setLastMessage(await res.text());
    } catch (e) {
      counterDispatch({ type: "failed" });
      setLastMessage("error");
    }
  }, []);

  return (
    <div className="grid justify-items-center h-screen">
      <div className="p-4">
        <div className="p-2 space-y-1">
          <h1 className="text-lg font-medium leading-none">Bob Farmer</h1>
          <Button onClick={handleGetCornButton}>GET 🌽!</Button>
        </div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center space-x-4 text-sm">
          <div>Succes {sucess}</div>
          <Separator orientation="vertical" />
          <div>Failed {failed} </div>
          <Separator orientation="vertical" />
          <div>Total {failed + sucess} </div>
        </div>
        {lastMessage.length > 0 && (
          <div className="ease-in-out duration-300">
            Last Message : {lastMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
