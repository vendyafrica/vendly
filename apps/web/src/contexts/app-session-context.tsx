"use client";

import * as React from "react";

type AppSession = any;

const AppSessionContext = React.createContext<{ session: AppSession | null } | undefined>(undefined);

export function AppSessionProvider({
    session,
    children,
}: {
    session: AppSession | null;
    children: React.ReactNode;
}) {
    return (
        <AppSessionContext.Provider value={{ session }}>
            {children}
        </AppSessionContext.Provider>
    );
}

export function useAppSession() {
    const ctx = React.useContext(AppSessionContext);
    if (!ctx) {
        throw new Error("useAppSession must be used within AppSessionProvider");
    }
    return ctx;
}
