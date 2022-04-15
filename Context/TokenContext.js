import { createContext, useContext} from "react";

export const Token = createContext({});

export const TokenHook = () => {
    return useContext(Token)
}