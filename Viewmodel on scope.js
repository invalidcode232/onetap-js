//#region Menu
UI.AddSubTab(["Config", "SUBTAB_MGR"], "Custom scope");
UI.AddCheckbox(["Config", "Custom scope", "Custom scope"], "Custom scope lines");
UI.AddColorPicker(["Config", "Custom scope", "Custom scope"], "Scope lines color");
UI.AddCheckbox(["Config", "Custom scope", "Custom scope"], "Override FOV while scoped");
UI.AddSliderInt(["Config", "Custom scope", "Custom scope"], "Scope lines width", 0, 500);
UI.AddSliderInt(["Config", "Custom scope", "Custom scope"], "Scope lines offset", 0, 500);
//#endregion

//#region draw
function draw()
{
    const local = Entity.GetLocalPlayer();

    if (!Entity.IsAlive(local) || !World.GetServerString()) {
        Convar.SetFloat("r_drawvgui", 1);
        Convar.SetInt("fov_cs_debug", 0);
        return;
    }

    const fov = UI.GetValue(["Misc.", "View", "General", "Field of view"]);
    const fovDifference = 90 - fov;
    const fovScope = 90 + fovDifference;
    const thirdperson = UI.GetValue(["Misc.", "Keys", "General", "Thirdperson"]);
    const offset = UI.GetValue(["Config", "Custom scope", "Custom scope", "Scope lines offset"]);
    const leng = UI.GetValue(["Config", "Custom scope", "Custom scope", "Scope lines width"]);
    const accent = UI.GetColor(["Config", "Custom scope", "Custom scope", "Scope lines color"]);
    const scoped = Entity.GetProp(local, "CCSPlayer", "m_bIsScoped");
    const screen_size = Render.GetScreenSize();

    if (!UI.GetValue(["Config", "Custom scope", "Custom scope", "Custom scope lines"]))
        return;
    
    if (scoped) {
        Convar.SetFloat("r_drawvgui", 0);
        if (!thirdperson) {
            Convar.SetInt("fov_cs_debug", fovScope);
            UI.SetValue(["Misc.", "View", "General", "Override FOV while scoped"], 0);
        }
        else {
            UI.SetValue(["Misc.", "View", "General", "Override FOV while scoped"], UI.GetValue(["Config", "Custom scope", "Custom scope", "Override FOV while scoped"]) ? 1 : 0);
            
            Convar.SetInt("fov_cs_debug", 0);
        }
        UI.SetValue(["Visuals", "Extra", "Removals", "Removals"], 59);
        Render.GradientRect(screen_size[0] / 2 + offset, screen_size[1] / 2, leng, 1, 1, [accent[0], accent[1], accent[2], accent[3]], [accent[0], accent[1], accent[2], 0]);
        Render.GradientRect(screen_size[0] / 2 - leng - offset, screen_size[1] / 2, leng, 1, 1, [accent[0], accent[1], accent[2], 0], [accent[0], accent[1], accent[2], accent[3]]);
        Render.GradientRect(screen_size[0] / 2, screen_size[1] / 2 + offset, 1, leng, 0, [accent[0], accent[1], accent[2], accent[3]], [accent[0], accent[1], accent[2], 0]);
        Render.GradientRect(screen_size[0] / 2, screen_size[1] / 2 - leng - offset, 1, leng, 0, [accent[0], accent[1], accent[2], 0], [accent[0], accent[1], accent[2], accent[3]]);
    } else {
        Convar.SetFloat("r_drawvgui", 1);
        Convar.SetInt("fov_cs_debug", 0);
        UI.SetValue(["Visuals", "Extra", "Removals", "Removals"], 63);
    }
}

Cheat.RegisterCallback("Draw", "draw");
//#endregion