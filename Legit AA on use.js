/**
 * 
 * Legit AA on use
 * Author: invalidcode#7427
 * 
 * All credits go to evwee on forums for posting desync method
 * Original thread: https://www.onetap.com/threads/desync.36481/
 * 
 */

function desync() {
    const view_angles = Local.GetViewAngles();
    photosynthesis = parseInt(Globals.Curtime() * 1000);
    switch (photosynthesis % 25)  {
        case 0 : UserCMD.Choke(); UserCMD.SetViewAngles([view_angles[0] + 89, view_angles[1] + 180, 0], true); break;
        case 1 : UserCMD.Choke(); UserCMD.SetViewAngles([view_angles[0] + 89, view_angles[1] - 75, 0], true); break;
        case 2 : UserCMD.Choke(); UserCMD.SetViewAngles([view_angles[0] + 89, view_angles[1] + 60, 0], true); break;
        case 3 : UserCMD.SetViewAngles([view_angles[0], view_angles[1], 0], true); UserCMD.Send(); break;
    }
}

function legit_aa_on_use() {
    const buttons = UserCMD.GetButtons();

    if (buttons & (1 << 5)) {
        desync();
    }
}

Cheat.RegisterCallback("CreateMove", "legit_aa_on_use");