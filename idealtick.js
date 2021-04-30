/**
 * 
 * Ideal tick
 * Author: invalidcode#1000
 * 
 */

const tick_hk = UI.AddHotkey(["Config", "Scripts", "Keys", "JS Keybinds"], "Ideal tick", "Ideal tick");

const ref_dt = ["Rage", "Exploits", "Keys", "Key assignment", "Double tap"];

var should_change_dt = false, last_dt_state = false;

function idealtick() {
    if (!UI.GetValue(tick_hk)) {
        UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 1);
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Auto direction"], 0);

        if (should_change_dt) {
            if (!UI.GetValue(ref_dt) && last_dt_state == 1) {
                UI.ToggleHotkey(ref_dt);
            }
            else if (UI.GetValue(ref_dt) && last_dt_state == 0) {
                UI.ToggleHotkey(ref_dt);
            }

            should_change_dt = false;
        }
        else {
            last_dt_state = UI.GetValue(ref_dt);
        }

        return;
    }

    UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 0);
    UI.SetValue(["Rage", "Anti Aim", "Directions", "Auto direction"], 1);
    if (!UI.GetValue(ref_dt)) {
        UI.ToggleHotkey(ref_dt);
    }

    const tick = Globals.Tickcount();
    if (tick % 1) {
        UserCMD.Choke();
    }

    should_change_dt = true;
}

Cheat.RegisterCallback("CreateMove", "idealtick");