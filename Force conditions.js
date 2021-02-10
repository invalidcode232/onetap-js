//#region Menu
UI.AddSubTab(["Config", "SUBTAB_MGR"], "Force conditions");

const path = ["Config", "Force conditions", "Force conditions"];

const headConditionsDropdown = UI.AddMultiDropdown(path, "Force head", ["On shot", "High velocity", "In air", "Flashed"]);
const bodyConditionsDropdown = UI.AddMultiDropdown(path, "Force baim", ["Lethal", "Standing", "Slow walking", "Knife out", "Crouch"]);
//#endregion

//#region Common functions
function getDropdownValue(value, index) {
    var mask = 1 << index;
    return value & mask ? true : false;
}

function setDropdownValue(value, index, enable) {
    var mask = 1 << index;
    
    return enable ? ( value | mask ) : ( value & ~mask );
}

function calcDist(local, target) {
    var lx = local[0];
    var ly = local[1];
    var lz = local[2];
    var tx = target[0];
    var ty = target[1];
    var tz = target[2];
    var dx = lx - tx;
    var dy = ly - ty;
    var dz = lz - tz;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function closestTarget() {
    var local = Entity.GetLocalPlayer();
    var enemies = Entity.GetEnemies();
    var dists = [];
    for(e in enemies) {
        if(!Entity.IsAlive(enemies[e]) || Entity.IsDormant(enemies[e]) || !Entity.IsValid(enemies[e])) continue;
        dists.push([enemies[e], calcDist(Entity.GetHitboxPosition(local, 0), Entity.GetHitboxPosition(enemies[e], 0))]);
    }
    dists.sort(function(a, b)
    {
        return a[1] - b[1];
    });
    if(dists.length == 0 || dists == []) return target = -1;
    return dists[0][0];
}

function Length2D(vec) {
  return Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2))
}

function UpdateFlags(ent) {
    const local = Entity.GetLocalPlayer();
    const eyeAngles = Entity.GetProp(ent, "CCSPlayer", "m_angEyeAngles[0]")[0];
    const damage = Trace.Bullet(local, ent, Entity.GetEyePosition(local), Entity.GetHitboxPosition(ent, 3))[1];
    const health = Entity.GetProp(ent, "CBasePlayer", "m_iHealth");
    const velocity = Entity.GetProp(ent, "CBasePlayer", "m_vecVelocity[0]");
    const speed = Length2D(velocity);
    const flags = Entity.GetProp(ent, "CBasePlayer", "m_fFlags");
    const flashDuration = Entity.GetProp(ent, "CCSPlayer", "m_flFlashDuration");
    const weapon = Entity.GetClassName(Entity.GetWeapon(ent));

    const onShot = false, lethal = false, highVel = false, inAir = false, standing = false, slowWalking = false, flashed = false, crouching = false, knifeOut = false;
    const headConditions = UI.GetValue(headConditionsDropdown);
    const bodyConditions = UI.GetValue(bodyConditionsDropdown);
    const shouldBaim = false;
    
    // Body conditions
    if (damage > health && getDropdownValue(bodyConditions, 0)) {
        lethal = true;
        shouldBaim = true;
    }
    if (speed < 5 && getDropdownValue(bodyConditions, 1)) {
        standing = true;
        shouldBaim = true;
    }
    if ((speed > 5 && speed < 140) && getDropdownValue(bodyConditions, 2)) {
        slowWalking = true;
        shouldBaim = true;
    }
    if (getDropdownValue(bodyConditions, 4)) {
        if (flags & (1 << 1)) {
            crouching = true;
            shouldBaim = true;
        }
    }
    if (weapon == "CKnife" && getDropdownValue(bodyConditions, 3)) {
        knifeOut = true;
        shouldBaim = true;
    }

    // Head conditions
    if (eyeAngles < 20 && getDropdownValue(headConditions, 0) && !shouldBaim) {
        onShot = true;
    }
    if (speed > 140 && getDropdownValue(headConditions, 1) && !shouldBaim) {
        highVel = true;
    }
    if (velocity[2] > 0 && getDropdownValue(headConditions, 2) && !shouldBaim) {
        inAir = true;
    }
    if (flashDuration > 0 && getDropdownValue(headConditions, 3) && !shouldBaim) {
        flashed = true;
    }


    return {
        "onShot": onShot,
        "lethal": lethal,
        "standing": standing,
        "highVel": highVel,
        "inAir": inAir,
        "slowWalking": slowWalking,
        "knifeOut": knifeOut,
        "flashed": flashed,
        "crouching": crouching,
    }
}
//#endregion

//#region Rage
function headCondition() {
    const enemies = Entity.GetEnemies();
    const local = Entity.GetLocalPlayer();
    const target = closestTarget();

    if (target == -1)
        return;

    for (var i = 0; i < enemies.length; i++) {
        if (!Entity.IsAlive(enemies[i]) || Entity.IsDormant(enemies[i]) || !Entity.IsValid(enemies[i])) continue;
        const flags = UpdateFlags(enemies[i]);

        if (flags.onShot || flags.highVel || flags.inAir || flags.flashed) {
            const damage = Trace.Bullet(local, enemies[i], Entity.GetEyePosition(local), Entity.GetHitboxPosition(enemies[i], 0))[1];
            Ragebot.ForceTargetMinimumDamage(enemies[i], damage);
            Entity.DrawFlag(enemies[i], "HEAD", [255, 145, 0, 255]);
        }
    }
}

function bodyCondition() {
    const enemies = Entity.GetEnemies();
    const target = closestTarget();
    const shouldBaim = false;
    const refBaim = ["Rage", "General", "General", "Key assignment", "Force body aim"];

    if (target == -1)
        return;
    
    for (var i = 0; i < enemies.length; i++) {
        if (!Entity.IsAlive(enemies[i]) || Entity.IsDormant(enemies[i]) || !Entity.IsValid(enemies[i])) continue;
        const flags = UpdateFlags(enemies[i]);

        if (flags.lethal || flags.standing || flags.slowWalking || flags.crouching) {
            Entity.DrawFlag(enemies[i], "BAIM", [0, 195, 255, 255]);

            if (enemies[i] == target) {
                shouldBaim = true;
            }
        }
    }

    if (shouldBaim && !UI.GetValue(refBaim)) {
        UI.ToggleHotkey(refBaim);
    }
    else if (!shouldBaim && UI.GetValue(refBaim)) {
        UI.ToggleHotkey(refBaim);
    }
}
//#endregion

//#region Callbacks
function onCreateMove() {
    headCondition();
    bodyCondition();
}

Cheat.RegisterCallback("CreateMove", "onCreateMove");
//#endregion