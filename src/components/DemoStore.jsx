import { useMemo, useReducer } from "react";
import { StoreContext, initialState, reducer } from "../lib/store.js";

// Holds the test-mode state (src/lib/store.js) for the whole site. In memory only: a reload starts fresh.
export default function DemoStore({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
