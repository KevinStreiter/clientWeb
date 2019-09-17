"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bubble_1 = require("./bubble");
var d3 = require("./modules/d3.js");
window.onload = function () {
    document.getElementById("tableValues").addEventListener("mouseover", onMouseOver, false);
    document.getElementById("tableValues").addEventListener("mouseout", onMouseOut, false);
    d3.select('#graph').on("click", function () {
        return createBubble(d3.mouse(this));
    });
};
var maxRadius = 40, plainBlueColor = "#7b9eb4", highlightedBlueColor = "#323c4b";
var rowCounter = 1;
var bubbleList = [];
function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}
function findBubble(id) {
    var bubble = undefined;
    bubbleList.forEach(function (element) {
        if (element.id == id) {
            bubble = element;
        }
    });
    return bubble;
}
function onMouseOver() {
    var target = getEventTarget(event);
    if (target && target.tagName == "TD") {
        var row = target.parentElement;
        highlightRow(undefined, row);
        var bubble = findBubble(Number(row.cells[0].innerHTML));
        highlightBubble(bubble);
    }
}
function onMouseOut() {
    resetRowColor();
    resetBubbles();
}
function createBubble(event) {
    var bubble = new bubble_1.Bubble(rowCounter, event[0], event[1], maxRadius);
    var collision = false;
    d3.select('#graph').selectAll("circle")
        .each(function () {
        var cx = this.cx.baseVal.value;
        var cy = this.cy.baseVal.value;
        var r = this.r.baseVal.value;
        var distance = Math.sqrt(((bubble.x - cx) * (bubble.x - cx)) + ((bubble.y - cy) * (bubble.y - cy)));
        if (distance <= (bubble.radius + r)) {
            collision = true;
        }
    });
    if (!collision) {
        bubbleList.push(bubble);
        insertRow(bubble);
        insertBubble(bubble);
        rowCounter++;
    }
}
function insertBubble(bubble) {
    var boundaries = document.getElementById("graph").getBoundingClientRect();
    var svg = d3.select('#graph');
    var bubbleObject = svg.append("circle")
        .attr("cx", bubble.x)
        .attr("cy", bubble.y)
        .attr("r", bubble.radius)
        .attr("id", bubble.id)
        .attr("fill", plainBlueColor)
        .on('mouseover', function () {
        d3.select(this)
            .style("fill", highlightedBlueColor)
            .attr("r", bubble.radius + 5);
        highlightRow(bubble);
    })
        .on("mouseout", function () {
        d3.select(this)
            .style("fill", plainBlueColor)
            .attr("r", bubble.radius);
        highlightRow();
    })
        .on("dblclick", function () {
        d3.select(this)
            .remove();
        removeRow(this);
        highlightRow();
    });
    var diffX = bubble.vx;
    var diffY = bubble.vy;
    function moveX() {
        var posX = Number(d3.select(this).attr("cx"));
        var nextX = posX + diffX;
        if (nextX < bubble.radius || nextX > boundaries.width - bubble.radius || isCollision(nextX, undefined, this)) {
            diffX = -1 * diffX;
        }
        return nextX;
    }
    function moveY() {
        var posY = Number(d3.select(this).attr("cy"));
        var nextY = posY + diffY;
        if (nextY < bubble.radius || nextY > boundaries.height - bubble.radius || isCollision(undefined, nextY, this)) {
            diffY = -1 * diffY;
        }
        return nextY;
    }
    setInterval(function () {
        bubbleObject.attr("cx", moveX).attr("cy", moveY);
        updateTableEntries(bubble, bubbleObject);
    }, 25);
}
function isCollision(x, y, element) {
    var collision = false;
    var radius = element.r.baseVal.value;
    if (x == undefined) {
        x = element.cx.baseVal.value;
    }
    else if (y == undefined) {
        y = element.cy.baseVal.value;
    }
    d3.select('#graph').selectAll("circle")
        .each(function () {
        if (Number(element.id) != Number(this.id)) {
            var cx = this.cx.baseVal.value;
            var cy = this.cy.baseVal.value;
            var r = this.r.baseVal.value;
            var distance = Math.sqrt(((x - cx) * (x - cx)) + ((y - cy) * (y - cy)));
            if (distance <= (radius + r)) {
                collision = true;
            }
        }
    });
    return collision;
}
function insertRow(bubble) {
    var table = document.getElementById("tableValues"), row = table.insertRow(-1), cell1 = row.insertCell(0), cell2 = row.insertCell(1), cell3 = row.insertCell(2);
    row.setAttribute("id", bubble.id.toString());
    cell1.innerHTML = bubble.id.toString();
    cell2.innerHTML = bubble.x.toString();
    cell3.innerHTML = bubble.y.toString();
    cell1.setAttribute("id", "id");
    cell2.setAttribute("id", "xValue");
    cell3.setAttribute("id", "yValue");
}
function removeRow(element) {
    var table = document.getElementById("tableValues");
    var row = table.rows.namedItem(element.id);
    table.deleteRow(row.rowIndex);
}
function resetRowColor() {
    var table = document.getElementById("tableValues");
    for (var r = 0, n = table.rows.length; r < n; r++) {
        table.rows[r].style.backgroundColor = plainBlueColor; // reset
    }
}
function highlightRow(bubble, row) {
    if (row != undefined) {
        row.style.backgroundColor = highlightedBlueColor;
    }
    else {
        var table = document.getElementById("tableValues");
        for (var r = 0, n = table.rows.length; r < n; r++) {
            table.rows[r].style.backgroundColor = plainBlueColor; // reset
            for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
                if (bubble != undefined) {
                    if (Number(table.rows[r].cells[c].innerHTML) == bubble.id) {
                        table.rows[r].style.backgroundColor = highlightedBlueColor;
                        break;
                    }
                }
            }
        }
    }
}
function resetBubbles() {
    d3.select('#graph').selectAll("circle")
        .each(function () {
        var _this = this;
        bubbleList.forEach(function (element) {
            if (Number(_this.id) == element.id) {
                d3.select(_this)
                    .style("fill", plainBlueColor)
                    .attr("r", element.radius);
            }
        });
    });
}
function highlightBubble(bubble) {
    resetBubbles();
    d3.select('#graph').selectAll("circle")
        .each(function () {
        if (Number(this.id) == bubble.id) {
            d3.select(this)
                .style("fill", highlightedBlueColor)
                .attr("r", bubble.radius + 5);
        }
    });
}
function updateTableEntries(bubble, element) {
    var table = document.getElementById("tableValues");
    var row = table.rows.namedItem(bubble.id.toString());
    if (row != null) {
        row.cells.namedItem("xValue").innerHTML = Math.round(Number(element.attr("cx"))).toString();
        row.cells.namedItem("yValue").innerHTML = Math.round(Number(element.attr("cy"))).toString();
    }
}
