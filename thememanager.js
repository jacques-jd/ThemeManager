window.addEventListener("load", (event) => {
    //load theme colours and global settings from themes.js
    let themes = data;
    let sets = settings;

    //sets style attributes for the container holding the themes
    selector.style.display = "flex";
    selector.style.width = "fit-content";
    selector.style.flexWrap = "wrap";
    selector.style.gap = sets.gap;

    let rawcookies, cookies;

    if(sets.cookies){
         //gets cookies
        rawcookies = document.cookie.split(";");
        cookies = [];
        for(let rawcookie of rawcookies) {
        
            let cooki = rawcookie.split("=");
            cookies.push({name:cooki[0], value:cooki[1]});
        }
    }
   
    //begin looping through all the themes from themes.js
    for (let theme of themes) {
        //create a div that will hold the theme's 4 colors
        let button = document.createElement("div");

        //begin looping through each color of the theme
        for (let color in theme) {
            //skip over the default attribute, since it is not a colour but a flag to indicate which theme will be applied automatically
            if (color === "default") continue;

            //this is one color square (there are 4 in each buttons)
            //set width and height to the global setting in themes.js, and then set its bgcolor
            let colorsquare = document.createElement("div");
            colorsquare.style.width = colorsquare.style.height = sets.width;
            colorsquare.style.backgroundColor = theme[color];

            //add it to the button
            button.appendChild(colorsquare);
        }

        //once each color is added, set up the themes style and layout
        button.style.display = "grid";
        button.style.gridTemplateColumns = "1fr 1fr";
        button.style.width = "fit-content";
        button.style.cursor = "pointer";
        button.style.boxShadow = "0px 1px 1px 2px #00000044";
        button.style.borderRadius = "5px";
        button.style.overflow = "hidden";

        button.addEventListener("click", () => {
            //when clicking a theme, set the theme by changing css root variables
            setCSSVariables(theme);

            if(sets.cookies) {
                 //set cookie
                document.cookie = `themeid=${themes.indexOf(
                    theme
                )};path=/;domain=.${sets.domain};secure`;
            }
           
        });

        if (document.cookie !== "" && sets.cookies) {
            if(cookies[0].value == themes.indexOf(theme))
                button.click();
        } else if (theme.default) {
            //apply the default theme if no cookie present
            button.click();
        }
        //add the button to the container of themes div
        selector.appendChild(button);
    }
});

//this function parses a hex color into a standardised format
// "#AABBCC" => "AABBCC"
// "#ABC" => "AABBCC"
// "ABC" => "AABBCC"
function validateHex(color) {
    if (color.startsWith("#")) {
        color = color.slice(1);
    }
    if (color.length === 3) {
        color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    if (color.length !== 6 || color.match(/[g-z]/)) {
        throw new Error("Invalid hex");
    }

    return color;
}

//this extracts the rgb values from a hex color and returns an object {R,G,B}
function getRGB(color) {
    let r = Number(`0x${color[0] + color[1]}`),
        g = Number(`0x${color[2] + color[3]}`),
        b = Number(`0x${color[4] + color[5]}`);

    return { r: r, g: g, b: b };
}

function getHex(rgb) {
    if (
        rgb.r < 0 ||
        rgb.g < 0 ||
        rgb.b < 0 ||
        rgb.r > 255 ||
        rgb.g > 255 ||
        rgb.b > 255
    )
        throw new Error("RGB Numbers out of bound.");

    let hexr =
            (rgb.r.toString(16).length === 1 ? "0" : "") + rgb.r.toString(16),
        hexg =
            (rgb.g.toString(16).length === 1 ? "0" : "") + rgb.g.toString(16),
        hexb =
            (rgb.b.toString(16).length === 1 ? "0" : "") + rgb.b.toString(16);

    return validateHex(hexr + hexg + hexb);
}

//this sets the :root variables in CSS
function setCSSVariables(theme) {
    for (let color in theme) {
        document.documentElement.style.setProperty(`--${color}`, theme[color]);
    }

    //creates link and accent colors automatically from fg and bg colors.
    //Ideal uses:
    //bg/fglink: For text you need to be readable over BG or FG colors.
    //bg/fgaccent: For style accent such as borders
    document.documentElement.style.setProperty(
        `--bglink`,
        "#" + darkenColor(theme.bg, 40)
    );
    document.documentElement.style.setProperty(
        `--fglink`,
        "#" + darkenColor(theme.fg, 40)
    );
    document.documentElement.style.setProperty(
        `--bgaccent`,
        "#" + darkenColor(theme.bg, 10)
    );
    document.documentElement.style.setProperty(
        `--fgaccent`,
        "#" + darkenColor(theme.fg, 10)
    );
}

//darkens an RGB color by a percentage (i use this to create link colors)
//color: RGB Object {R,G,B}
//percent: a percentage (either 0.00 - 1.00 or 0 - 100)
function darkenColor(color, percent) {
    if (percent > 1) percent = percent / 100;

    color = validateHex(color);
    let rgb = getRGB(color);

    let r = Math.max(Math.floor(rgb.r - 255 * percent), 0),
        g = Math.max(Math.floor(rgb.g - 255 * percent), 0),
        b = Math.max(Math.floor(rgb.b - 255 * percent), 0);
    color = getHex({ r: r.toString(16), g: g.toString(16), b: b.toString(16) });

    return color;
}
