//Snack of the Week

var enabled = true;
var i = 100;
var delay_distance = 100;

function go() {
    if (enabled) {
        document.getElementById("scroll").style.marginLeft = i + "px";
        i = i - 3;
        if (i < -document.getElementById("scroll").offsetWidth - delay_distance) {
            i = 2 * document.getElementById("scroll").offsetWidth;
        }
    }
}

window.setInterval("go()", 30);
