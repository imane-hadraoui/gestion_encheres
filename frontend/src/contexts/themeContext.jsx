import {createContext, useState} from "react";


export const ThemeContext = createContext({})

export const ThemeContextProvider = ({children}) => {
    const [theme, setTheme] = useState('white')
    const toggleTheme = () => {
        setTheme(theme === 'white' ? 'dark' : 'white')
    }
    return <ThemeContext value={{theme,toggleTheme}}>
        {children}
    </ThemeContext>
}