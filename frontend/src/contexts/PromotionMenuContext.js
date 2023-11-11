import { useContext, createContext, useState } from 'react';

const PromotionMenuContext = createContext();

function PromotionMenuProvider({ children }) {
    const [promotionMenu, setPromotionMenu] = useState({ show: false });

    return (
        <PromotionMenuContext.Provider value={{ promotionMenu, setPromotionMenu }}>
            {children}
        </PromotionMenuContext.Provider>
    );
}

function usePromotionMenu() {
    const context = useContext(PromotionMenuContext);

    return context;
}

export { PromotionMenuProvider, usePromotionMenu };
