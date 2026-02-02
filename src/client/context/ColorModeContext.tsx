"use client";

import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

type ColorMode = "light" | "dark";

type ColorModeContextType = {
	colorMode: ColorMode;
	toggleColorMode(): void;
	setColorMode(mode: ColorMode): void;
};

const ColorModeContext = createContext<ColorModeContextType | null>(null);

const STORAGE_KEY = "color-mode";

export const ColorModeProvider = ({ children }: PropsWithChildren) => {
	const [colorMode, setColorModeState] = useState<ColorMode>("light");
	const [isInitialized, setIsInitialized] = useState(false);

	// Initialize from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY) as ColorMode | null;
		if (stored === "light" || stored === "dark") {
			setColorModeState(stored);
		} else {
			// Check system preference
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches;
			setColorModeState(prefersDark ? "dark" : "light");
		}
		setIsInitialized(true);
	}, []);

	// Apply color mode to document
	useEffect(() => {
		if (isInitialized) {
			document.documentElement.setAttribute("data-bs-theme", colorMode);
		}
	}, [colorMode, isInitialized]);

	const setColorMode = useCallback((mode: ColorMode) => {
		setColorModeState(mode);
		localStorage.setItem(STORAGE_KEY, mode);
	}, []);

	const toggleColorMode = useCallback(() => {
		setColorMode(colorMode === "light" ? "dark" : "light");
	}, [colorMode, setColorMode]);

	return (
		<ColorModeContext.Provider
			value={{ colorMode, toggleColorMode, setColorMode }}
		>
			{children}
		</ColorModeContext.Provider>
	);
};

export const useColorMode = () => {
	const context = useContext(ColorModeContext);
	if (!context) {
		throw new Error("useColorMode must be used within a ColorModeProvider");
	}
	return context;
};
