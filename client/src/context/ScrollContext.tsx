import React, { createContext, useContext, useRef, RefObject } from 'react';

interface ScrollContextType {
    scrollRef: RefObject<HTMLDivElement>;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const scrollRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>; // ✅ Ensure correct type

    return (
        <ScrollContext.Provider value={{ scrollRef }}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScroll = () => {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error("useScroll must be used within a ScrollProvider");
    }
    return context;
};
