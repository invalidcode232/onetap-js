/**
 * 
 * Trashtalker
 * Author: invalidcode#7427
 * 
 */

//#region Common functions
function getDropdownValue(value, index) {
    var mask = 1 << index;
    return value & mask ? true : false;
}

function setDropdownValue(value, index, enable) {
    var mask = 1 << index;
    
    return enable ? ( value | mask ) : ( value & ~mask );
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(callback, milliseconds) {
    const registeredSymbol = Symbol.for("isDelayRegistered?")
    const delayCallbacksSymbol = Symbol.for("delayCallbacks")

    if(typeof callback == "function" && typeof milliseconds == "number") {
        const delaySymbol = Symbol()

        if(!this[delayCallbacksSymbol])
            this[delayCallbacksSymbol] = {}

        this[delayCallbacksSymbol][delaySymbol] = { callback: callback, milliseconds: milliseconds, start: Date.now() }

        if(this[registeredSymbol] !== true) {
            this[registeredSymbol] = true

            Cheat.RegisterCallback("Draw", "delay")
        }

        return delaySymbol
    } else {
        const symbols = Object.getOwnPropertySymbols(this[delayCallbacksSymbol])

        for(var i = 0; i < symbols.length; i++) {
            const delayObject = this[delayCallbacksSymbol][symbols[i]]
            const difference = Date.now() - delayObject.start

            if(difference >= delayObject.milliseconds) {    
                delayObject.callback()

                delete this[delayCallbacksSymbol][symbols[i]]
            }
        }
    }
}
//#endregion

//#region Replies
const prefix = ["yo buddy", "yo pal", "listen here,", "basically", "hahaha", "yeah well", "yeah ok however", "k", "lol", "dude", "ok but", "ok", "lmaooo ok", "lol ok", "funny uh", "uh ok", "tahts funny", "that is funny", "that's funny", "uh welp ok", "ok but like", "k but", "kk", ":)"];
const middle = ["ask i did not", "name one person who asked", "didnt ask", "dont recall asking", "i didnt ask", "i really dont remember asking", "xd who ask", "did not ask", "times i asked = 0", "when i asked = never", "me asking didnt happen", "never asked ", "i never asked", "did i ask"];
const suffix = ["so yeah", "do you understand", "so shut up", " bro", " nn", " nn boi", " dude", " lmao", " lol", " lmfao", " haha", " tho", " though lol", " tho lmao", " jajajja", "xaxaxa", "xddd", ", lol", "lmao", "XDD", "ezzzzz", "mi amigo", "xd jajaja", "hahaha", ":/", "so plz be quiet", "so stfu", "so shush"];

const insults = ["stfu nn", "umad dog?", "5v5?", "weak rat dont talk", "dude stop barking go kys", "2v2?", "woof woof shit dog", "dont talk pls nn", "dude you're talking too much", "can you stfu please?", "dont disturb ppl with your bs pls", "dude dont talk if you're skeetless", "no skeet no talk nn", "stfu unknown dog", "noone knows you stop talking", "kys doggy dont talk", "hdf du hurensohn", "we all know you're shit stop bitching", "ffs pls shut up", "dont talk with your shit kd pls", "jesus christ just shut up already", "noone can hear skeetless nns barking sorry", "go rq instead of bitching here", "dude noone cares about your opinion"];

const killsays = ["1", "just go rq ur trash", "why r u so shit", "1 nn down", "kys ur so bad", "menu -> quit game pls", "skeetless nn raped", "raped dog", "1", "weak rat", "bow down to me nn", "rekt", "mad got killed? hhh", "sit down nn", "owNNed", "dude look at that kd", "1", "owned LOL!", "shithead raped", "nn deported back to hell", "1 1 1 1 1", "teach me how to hvh pls!!111", "get 1'd", "h$", "EZ BOTS", "why so ez bro?", "raped", "that's a 1", "1 on my screen", "kys"];
//#endregion

//#region Menu
const path = ["Misc.", "Trashtalker", "Trashtalker"];

UI.AddSubTab(["Misc.", "SUBTAB_MGR"], "Trashtalker");
const players_dropdown = UI.AddMultiDropdown(path, "Players to target", []);
const trashtalk_switch = UI.AddCheckbox(path, "Enable trashtalk");
const trashtalk_dropdown = UI.AddDropdown(path, "Trashtalk mode", ["Didn't ask", "Chat spammer", "Common HvH insults", "Custom"], 0);
const trashtalk_custom_text = UI.AddTextbox(path, "Custom trashtalk");
const killsay_switch = UI.AddCheckbox(path, "Enable killsay");
const killsay_dropdown = UI.AddDropdown(path, "Killsay mode", ["Insults", "Custom"], 0)
const killsay_custom_text = UI.AddTextbox(path, "Custom killsay");
const delay_slider = UI.AddSliderInt(path, "Delay (seconds)", 0, 10);
//#endregion

//#region Variables
const players = [];
const selected_players = [];

const should_trashtalk = false;
const should_killsay = false;
const trashtalk_time = null;
const killsay_time = null;
//#endregion

//#region functions
function handle_visibility() {
    UI.SetEnabled(trashtalk_custom_text, UI.GetValue(trashtalk_dropdown) == 3 ? 1 : 0);
    UI.SetEnabled(killsay_custom_text, UI.GetValue(killsay_dropdown) == 1 ? 1 : 0);
}

function get_players() {
    players = Entity.GetPlayers().filter(function (ply) { return ply !== Entity.GetLocalPlayer() });
}

function update_players_dropdown() {
    const player_names = [];

    for (var i = 0; i < players.length; i++){
        player_names[i] = Entity.GetName(players[i]);
    }

    UI.UpdateList(players_dropdown, player_names);
}

function get_selected_players() {
    const selection = UI.GetValue(players_dropdown);
    const selected_players = [];
    for (var i = 0; i < players.length; i++){
        if (getDropdownValue(selection, i)) {
            selected_players.push(Entity.GetName(players[i]));
        }
    }

    return selected_players;
}

function get_trashtalk() {
    const reply = "";
    const trashtalk = UI.GetValue(trashtalk_dropdown);

    if (trashtalk == 0) {
        reply = middle[Math.floor(Math.random() * middle.length)];

        if (Math.random() > 0.5)
            reply = prefix[Math.floor(Math.random() * prefix.length)] + " " + reply;

        if (Math.random() > 0.8)
            reply += suffix[Math.floor(Math.random() * suffix.length)]
    }
    else if (trashtalk == 1) {
        reply = "﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽ ﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽ ﷽﷽ ﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽ ﷽﷽ ﷽﷽﷽ ﷽﷽";
    }
    else if (trashtalk == 2) {
        reply = insults[getRandomInt(0, insults.length - 1)]
    }
    else if (trashtalk == 3) {
        reply = UI.GetString(trashtalk_custom_text);
    }
    
    return reply;
}

function get_killsay() {
    const reply = "";
    const killsay = UI.GetValue(killsay_dropdown);

    if (killsay == 0) {
        reply = killsays[getRandomInt(0, killsays.length - 1)];
    }
    else if (killsay == 1) {
        reply = UI.GetString(killsay_custom_text);
    }

    return reply;
}

function handle_messages() {
    if (should_trashtalk && Globals.Curtime() > trashtalk_time + UI.GetValue(delay_slider)) {
        Cheat.ExecuteCommand("say " + get_trashtalk()); 
        should_trashtalk = false;
    }
    if (should_killsay && Globals.Curtime() > killsay_time + UI.GetValue(delay_slider)) {
        Cheat.ExecuteCommand("say " + get_killsay());
        should_killsay = false;
    }
}

function onPlayerSay() {
    if (!UI.GetValue(trashtalk_switch))
        return;

    const user = Entity.GetEntityFromUserID(Event.GetInt("userid"));
    if (get_selected_players().indexOf(Entity.GetName(user)) != -1) {
        should_trashtalk = true;
        trashtalk_time = Globals.Curtime();
    }
}

function onPlayerDeath() {
    if (!UI.GetValue(killsay_switch))
        return;
    
    const user = Entity.GetEntityFromUserID(Event.GetInt("userid"));
    const attacker = Entity.GetEntityFromUserID(Event.GetInt("attacker"));
    const local = Entity.GetLocalPlayer();

    if (user != local && attacker == local) {
        if (get_selected_players().indexOf(Entity.GetName(user)) != -1 && user != Entity.GetLocalPlayer()) {
            should_killsay = true;
            killsay_time = Globals.Curtime();
        }
    }
}

function onDraw() {
    handle_visibility();

    get_players();
    update_players_dropdown();
    handle_messages();
}
//#endregion

//#region Callbacks
Cheat.RegisterCallback("Draw", "onDraw");
Cheat.RegisterCallback("player_say", "onPlayerSay");
Cheat.RegisterCallback("player_death", "onPlayerDeath");
//#endregion