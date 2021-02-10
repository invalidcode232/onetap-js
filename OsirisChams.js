Cheat.PrintColor([242, 252, 5, 255], "\n=========================================================\n")
Cheat.PrintColor([2, 252, 17, 255], "                       OsirisChams.js                    \n");
Cheat.PrintColor([2, 252, 17, 255], "               Created by: invalidcode#1337              \n");
Cheat.PrintColor([2, 252, 17, 255], "                 Credits: danielkrupinski                \n");
Cheat.PrintColor([242, 252, 5, 255], "=========================================================\n\n");

Material.Create("Glass");
Material.Create("Metallic");
Material.Create("Platinum");
Material.Create("Crystal");
Material.Create("Silver");

function glass() {
    var matIndex = Material.Get("Glass");

    if (matIndex <= 0)
        return;
    
    Material.SetKeyValue(matIndex, "$baseTexture", "detail/dt_metal1");
    Material.SetKeyValue(matIndex, "$additive", "1");
    Material.SetKeyValue(matIndex, "$envmap", "editor/cube_vertigo");
    Material.SetKeyValue(matIndex, "$color", "[.05 .05 .05]");
    Material.SetKeyValue(matIndex, "$alpha", "0.2");

    Material.Refresh(matIndex);
}

function platinum() {
    var matIndex = Material.Get("Platinum");

    if (matIndex <= 0)
        return;
    
    Material.SetKeyValue(matIndex, "$baseTexture", "models/player/ct_fbi/ct_fbi_glass");
    Material.SetKeyValue(matIndex, "$envmap", "env_cubemap");
    Material.SetKeyValue(matIndex, "$envmaptint", "[.4 .6 .7]");

    Material.Refresh(matIndex);
}

function metallic() {
    var matIndex = Material.Get("Metallic");

    if (matIndex <= 0)
        return;
    
    Material.SetKeyValue(matIndex, "$baseTexture", "white");
    Material.SetKeyValue(matIndex, "$ignorez", "0");
    Material.SetKeyValue(matIndex, "$envmap", "env_cubemap");
    Material.SetKeyValue(matIndex, "$normalmapalphaenvmapmask", "1");
    Material.SetKeyValue(matIndex, "$envmapcontrast", "1");
    Material.SetKeyValue(matIndex, "$nofog", "1");
    Material.SetKeyValue(matIndex, "$model", "1");
    Material.SetKeyValue(matIndex, "$nocull", "0");
    Material.SetKeyValue(matIndex, "$selfillum", "1");
    Material.SetKeyValue(matIndex, "$halfambert", "1");
    Material.SetKeyValue(matIndex, "$znearer", "1");
    Material.SetKeyValue(matIndex, "$flat", "1");

    Material.Refresh(matIndex);
}

function crystal() {
    var matIndex = Material.Get("Crystal");

    if (matIndex <= 0)
        return;

    Material.SetKeyValue(matIndex, "$baseTexture", "black");
    Material.SetKeyValue(matIndex, "$bumpmap", "effects/flat_normal");
    Material.SetKeyValue(matIndex, "$translucent", "1");
    Material.SetKeyValue(matIndex, "$envmap", "models/effects/crystal_cube_vertigo_hdr");
    Material.SetKeyValue(matIndex, "$envmapfresnel", "0");
    Material.SetKeyValue(matIndex, "$phong", "1");
    Material.SetKeyValue(matIndex, "$phongexponent", "16");
    Material.SetKeyValue(matIndex, "$phongboost", "2");
    Material.SetKeyValue(matIndex, "$phongtint", "[.2 .35 .6]");

    Material.Refresh(matIndex);
}

function silver() {
    var matIndex = Material.Get("Silver");

    if (matIndex <= 0)
        return;

    Material.SetKeyValue(matIndex, "$baseTexture", "white");
    Material.SetKeyValue(matIndex, "$bumpmap", "effects/flat_normal");
    Material.SetKeyValue(matIndex, "$envmap", "editor/cube_vertigo");
    Material.SetKeyValue(matIndex, "$envmapfresnel", ".6");
    Material.SetKeyValue(matIndex, "$phong", "1");
    Material.SetKeyValue(matIndex, "$phongboost", "2");
    Material.SetKeyValue(matIndex, "$phongexponent", "8");
    Material.SetKeyValue(matIndex, "$color2", "[.05 .05 .05]");
    Material.SetKeyValue(matIndex, "$envmaptint", "[.2 .2 .2]");
    Material.SetKeyValue(matIndex, "$phongfresnelranges", "[.7 .8 1]");
    Material.SetKeyValue(matIndex, "$phongtint", "[.8 .9 1]");

    Material.Refresh(matIndex);
}

function unload() {
    Material.Destroy("Glass");
    Material.Destroy("Platinum");
    Material.Destroy("Metallic");
    Material.Destroy("Crystal");
    Material.Destroy("Silver");
}

function material() {
    glass();
    platinum();
    metallic();
    crystal();
    silver();
}

Cheat.RegisterCallback("Unload", "unload");
Cheat.RegisterCallback("Material", "material");