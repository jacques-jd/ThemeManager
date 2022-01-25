window.onload = event =>
{

    let themes = data;
    let sets = settings;

    selector.style.display = "flex";
    selector.style.gap = "1em";

    for (let theme of themes)
    {
        console.log("theme", theme);
        let button = document.createElement("div");

        for (let color in theme)
        {
            if (color === "default") continue;
            console.log(theme[color]);
            let colorsquare = document.createElement("div");
            colorsquare.style.width = colorsquare.style.height = sets.width;
            colorsquare.style.backgroundColor = theme[color];
            button.appendChild(colorsquare);
        }

        button.style.display = "grid";
        button.style.gridTemplateColumns = "1fr 1fr";
        button.style.width = "fit-content";
        button.style.cursor = "pointer";
        button.style.boxShadow = "0px 1px 1px 2px #00000044";
        button.style.borderRadius = "5px";
        button.style.overflow = "hidden";

        button.onclick = () =>
        {
            setCSSVariables(theme);
        }
        if (theme.default)
        {
            button.click();
        }
        selector.appendChild(button);
    }
}

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

function getRGB(color)
{
    let r = Number(`0x${color[0] + color[1]}`),
        g = Number(`0x${color[2] + color[3]}`),
        b = Number(`0x${color[4] + color[5]}`);

    return { r: r, g: g, b: b };
}

function setCSSVariables(theme)
{
    for (let color in theme)
    {
        document.documentElement.style.setProperty(`--${color}`, theme[color]);
    }
    document.documentElement.style.setProperty(`--link`, `#${darkenColor(theme.bg, 60)}`);

}

$ = query =>
{
    if (query.startsWith("#")) return document.querySelector(query);
    else return document.querySelectorAll(query);
}

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
