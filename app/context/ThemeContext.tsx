"use client"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light";


type ThemeContextProviderProps = {
    children: React.ReactNode;
}

type ThemeContext = {
    theme: Theme;
    setTheme: (newTheme: Theme) => Theme;
    loaded: boolean;
}

export const ThemeContext = createContext<ThemeContext | null>(null);

export default function ThemeContextProvider({ children }: ThemeContextProviderProps)
{
    const [theme, setTheme, loaded] = usePaeruxTheme("dark");
    return (
        <ThemeContext.Provider value={{ theme, setTheme, loaded }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext()
{
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useThemeContext must be used within a ThemeContextProvider");
    return context;
}

function usePaeruxTheme(defaultValue: Theme): [Theme, (newTheme: Theme) => Theme, boolean]
{
    const [theme, setTheme] = useState<Theme>(defaultValue);
    const [loaded, setLoaded] = useState(false);
    useEffect(() =>
    {
        const storedTheme = window.localStorage.getItem("paeruxTheme");
        if (storedTheme)
        {
            console.log("restored theme:" + storedTheme);
            setTheme(storedTheme as Theme);
        }
        setLoaded(true);
    }, []); // Run once when component mounts to restore theme from local storage

    const setThemeAndStore = useCallback(
        (newTheme: Theme) =>
        {
            setTheme(newTheme);
            return persistTheme("paeruxTheme", newTheme);
        }, [setTheme]
    );
    return [theme, setThemeAndStore, loaded];
}

function persistTheme(key: string, value: string)
{
    window.localStorage.setItem(key, value)
    return value as Theme;
}