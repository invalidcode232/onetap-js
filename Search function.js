//#region Menu
UI.AddSubTab(["Config", "SUBTAB_MGR"], "Search function");

const path = ["Config", "Search function", "Search function"];

const searchBar = UI.AddTextbox(path, "Search");

const alpha = UI.AddCheckbox(path, "Alpha");
const beta = UI.AddSliderInt(path, "Beta", 0, 100);
const charlie = UI.AddSliderFloat(path, "Charlie", 0, 20);
const delta = UI.AddMultiDropdown(path, "Delta", ["Value 1", "Value 2"]);
const echo = UI.AddDropdown(path, "Echo", ["Value 1", "Value 2", "Value 3"], 0);
//#endregion

//#region Search function
const arrIndex = [["Alpha", alpha], ["Beta", beta], ["Charlie", charlie], ["Delta", delta], ["Echo", echo]];

function search() {
    // Hide all elements
    UI.SetEnabled(alpha, 0);
    UI.SetEnabled(beta, 0);
    UI.SetEnabled(charlie, 0);
    UI.SetEnabled(delta, 0);
    UI.SetEnabled(echo, 0);

    // Search
    const query = UI.GetString(searchBar);
    for (var k = 0; k < arrIndex.length; k++) { // Loop through all elements in array
        if ((arrIndex[k][0]).toString().includes(query)) {
            UI.SetEnabled(arrIndex[k][1], 1); // Unhides element if name matches the query
        }
    }
}
//#endregion

//#region Callbacks
Cheat.RegisterCallback("Draw", "search");
//#endregion