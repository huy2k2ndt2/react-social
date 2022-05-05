import React, { createContext, useContext, useState } from "react";

const Context = createContext();

const Provider = ({ store, children }) => {
  return <Context.Provider value={store}>{children}</Context.Provider>;
};

export default Provider;

export const useSelector = (callback) => {
  const store = useContext(Context);

  const [state, setState] = useState(() => callback(store.getState()));

  useEffect(() => {
    const unSubscribe = store.subscribe(() => {
      setState(() => callback(store.getState()));
    });

    return () => unSubscribe;
  }, [store, callback]);

  return state;
};

export const useDispatch = () => {
  const { dispatch } = useContext(Context);
  return dispatch;
};
