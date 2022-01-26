window.addEventListener("load", event =>
{
    //load theme colours and global settings from themes.js
    let themes = data;
    let sets = settings;

    //sets style attributes for the container holding the themes
    selector.style.display = "flex";
    selector.style.flexWrap = "wrap";
    selector.style.gap = sets.gap;

    //begin looping through all the themes from themes.js
    for (let theme of themes)
    {
        //create a div that will hold the theme's 4 colors
        let button = document.createElement("div");

        //begin looping through each color of the theme
        for (let color in theme)
        {
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

        button.onclick = () =>
        {
            //when clicking a theme, set the theme by changing css root variables
            setCSSVariables(theme);
        }
        if (theme.default)
        {
            //apply the default theme
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
function validateHex(color)
{
    if (color.startsWith("#"))
    {
        color = color.slice(1);
    }
    if (color.length === 3)
    {
        color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    if (color.length !== 6 || color.match(/[g-z]/))
    {
        throw new Error("Invalid hex");
    }

    return color;
}

//this extracts the rgb values from a hex color and returns an object {R,G,B}
function getRGB(color)
{
    let r = Number(`0x${color[0] + color[1]}`),
        g = Number(`0x${color[2] + color[3]}`),
        b = Number(`0x${color[4] + color[5]}`);

    return { r: r, g: g, b: b };
}

//this sets the :root variables in CSS
function setCSSVariables(theme)
{
    for (let color in theme)
    {
        document.documentElement.style.setProperty(`--${color}`, theme[color]);
    }
    
    //creates link colors automatically from fg and bg colors.
    document.documentElement.style.setProperty(`--bglink`, `#${darkenColor(theme.bg, 40)}`);
    document.documentElement.style.setProperty(`--fglink`, `#${darkenColor(theme.fg, 40)}`);

}

//darkens an RGB color by a percentage (i use this to create link colors)
//color: RGB Object {R,G,B}
//percent: a percentage (either 0.00 - 1.00 or 0 - 100)
function darkenColor(color, percent)
{
    if (percent > 1) percent = percent / 100;

    color = validateHex(color);
    let rgb = getRGB(color);

    let r = Math.floor(rgb.r * (1 - percent)),
        g = Math.floor(rgb.g * (1 - percent)),
        b = Math.floor(rgb.b * (1 - percent));
    color = r.toString(16) + g.toString(16) + b.toString(16);

    return color;
}
