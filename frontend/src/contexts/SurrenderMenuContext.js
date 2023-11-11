import { useContext, createContext, useState } from 'react';

const SurrenderMenuContext = createContext();

function SurrenderMenuProvider({ children }) {
    const [surrenderMenu, setSurrenderMenu] = useState(false);

    return (
        <SurrenderMenuContext.Provider value={{ surrenderMenu, setSurrenderMenu }}>
            {children}
        </SurrenderMenuContext.Provider>
    );
}

function useSurrenderMenu() {
    const context = useContext(SurrenderMenuContext);

    return context;
}

export { SurrenderMenuProvider, useSurrenderMenu };
