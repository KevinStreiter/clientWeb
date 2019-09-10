"use strict";
exports.__esModule = true;
var vector_1 = require("./vector");
var d3 = require("./modules/d3.js");
window.onload = function () {
    document.getElementById("button").addEventListener("click", getRandomVector, false);
    document.getElementById("tableValues").addEventListener("mouseover", onMouseOver, false);
    document.getElementById("tableValues").addEventListener("mouseout", onMouseOut, false);
};
var radius = 20;
var plainBlueColor = "#7b9eb4";
var highlightedBlueColor = "#323c4b";
var rowCounter = 1;
var coordinates = [];
function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}
function findVector(id) {
    var vector = undefined;
    coordinates.forEach(function (element) {
        if (element.id == id) {
            vector = element;
        }
    });
    return vector;
}
function onMouseOver() {
    var target = getEventTarget(event);
    if (target && target.tagName == "TD") {
        var row = target.parentElement;
        highlightRow(undefined, row);
        var vector = findVector(Number(row.cells[0].innerHTML));
        highlightCircle(vector);
    }
}
function onMouseOut() {
    resetRowColor();
    resetCircleColor();
}
function getRandomVector() {
    var boundaries = document.getElementById("graph").getBoundingClientRect();
    var vector = new vector_1.Vector(rowCounter, boundaries.width, boundaries.height, radius);
    coordinates.push(vector);
    insertRow(vector);
    appendCircles();
    rowCounter++;
}
function insertRow(vector) {
    var table = document.getElementById("tableValues");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = rowCounter.toString();
    cell2.innerHTML = vector.x.toString();
    cell3.innerHTML = vector.y.toString();
}
function resetRowColor() {
    var table = document.getElementById("tableValues");
    for (var r = 0, n = table.rows.length; r < n; r++) {
        table.rows[r].style.backgroundColor = plainBlueColor; // reset
    }
}
function highlightRow(vector, row) {
    if (row != undefined) {
        row.style.backgroundColor = highlightedBlueColor;
    }
    else {
        var table = document.getElementById("tableValues");
        for (var r = 0, n = table.rows.length; r < n; r++) {
            table.rows[r].style.backgroundColor = plainBlueColor; // reset
            for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
                if (vector != undefined) {
                    if (Number(table.rows[r].cells[c].innerHTML) == vector.id) {
                        table.rows[r].style.backgroundColor = highlightedBlueColor;
                        break;
                    }
                }
            }
        }
    }
}
function resetCircleColor() {
    d3.select('#graph').selectAll("circle")
        .style("fill", plainBlueColor)
        .attr("r", radius);
}
function highlightCircle(vector) {
    resetCircleColor();
    d3.select('#graph').selectAll("circle")
        .filter(function (element) {
        if (Number(element.id) == vector.id) {
            return element;
        }
    })
        .style("fill", highlightedBlueColor)
        .attr("r", radius + 5);
}
function appendCircles() {
    d3.select('#graph').selectAll("circle")
        .data(coordinates)
        .enter().append("circle")
        .attr("cx", function (d) {
        return d.x;
    })
        .attr("cy", function (d) {
        return d.y;
    })
        .attr("r", radius)
        .attr("id", function (d) {
        return d.id;
    })
        .style("fill", plainBlueColor)
        .on('mouseover', function (d) {
        d3.select(this)
            .style("fill", highlightedBlueColor)
            .attr("r", radius + 5);
        highlightRow(d);
    })
        .on("mouseout", function (d) {
        d3.select(this)
            .style("fill", plainBlueColor)
            .attr("r", radius);
        highlightRow();
    });
}
