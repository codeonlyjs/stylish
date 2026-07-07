import { Style } from "@codeonlyjs/core";

const D = 'dark';
const A = 'auto';
const L = 'light';


class Stylish extends EventTarget
{
    constructor()
    {
        super();

        // Listen for preferred theme changes
        if (typeof(window) !== 'undefined')
        {
            this.#prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            this.#prefersDark.addEventListener('change', event => {
                this.selectedTheme = A;
            });
        }
        else
        {
            // Probably running ssr/ssg
            this.#prefersDark = { matches: false };
        }
    }

    #prefersDark;

    // Set the current theme
    set selectedTheme(name)
    {
        // Detect change
        let wasDarkMode = this.darkMode;

        // Update classes
        let cl = document.documentElement.classList;
        cl.remove(D, L);
        if (name != A)
            cl.add(name);

        // Update all theme switches
        document.querySelectorAll("input[type=checkbox].theme-switch").forEach(x => {
            x.checked = this.darkMode
        });

        // Changed?
        if (wasDarkMode != this.darkMode)
        {
            // Fire change
            let ev = new Event("darkModeChanged");
            ev.darkMode = this.darkMode;
            this.dispatchEvent(ev);
        }

        // Store it
        // NB: this is read back by small script snippet that should be added to the 
        //     head block of your index.html
        /*
        <script>
        const theme = window.localStorage.getItem("stylish-theme");
        if (theme) document.documentElement.classList.add(theme);
        </script>
        */
        if (name == A)
            window.localStorage.removeItem("stylish-theme")
        else
            window.localStorage.setItem("stylish-theme", name);

    }

    // Get the current theme
    get selectedTheme()
    {
        if (typeof(document) !== 'undefined')
        {
            let cl = document.documentElement.classList;
            if (cl.contains(D))
                return D;
            if (cl.contains(L))
                return L;
        }
        return A;
    }

    // Get if current theme resolves to dark
    get darkMode()
    {
        switch (this.selectedTheme)
        {
            case D:
                return true;

            case A:
                return this.#prefersDark.matches;
        }
        return false;
    }

    // Toggle selected theme
    toggleTheme()
    {
        if (this.selectedTheme == A)
            this.selectedTheme = this.#prefersDark.matches ? L : D;
        else
            this.selectedTheme = A;
    }

}

export let stylish = new Stylish();;
