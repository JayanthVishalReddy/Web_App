import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { MovieContext } from "../Context/MoviesProvider";
import { NotificationContext } from "../Context/NotificationProvider";
import { SearchContext } from "../Context/SearchProvider";
import { ThemeConext } from "../Context/ThemeProvider";

export const useTheme=()=>useContext(ThemeConext);
export const useNotification=()=>useContext(NotificationContext);
export const useAuth=()=>useContext(AuthContext);
export const useSearch = () => useContext(SearchContext);
export const useMovies = () => useContext(MovieContext);
