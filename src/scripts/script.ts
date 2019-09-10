import { Bubble } from "./bubble"
import * as d3 from "./modules/d3.js"

window.onload = () => {
    document.getElementById ("button").addEventListener ("click", getRandomBubble, false);
    document.getElementById("tableValues").addEventListener("mouseover", onMouseOver, false);
    document.getElementById("tableValues").addEventListener("mouseout", onMouseOut, false);
};

const radius = 20;
const plainBlueColor = "#7b9eb4";
const highlightedBlueColor = "#323c4b";
var rowCounter:number = 1;
var coordinates:Bubble[] = [];

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

function findBubble (id:number) :Bubble {
    let bubble:Bubble = undefined;
    coordinates.forEach((element) => {
        if(element.id == id) {
            bubble = element;
        }
    });
    return bubble;
}

function onMouseOver() :void {
    let target = getEventTarget(event);
    if (target && target.tagName == "TD") {
        let row = target.parentElement;
        highlightRow(undefined, row);
        let bubble:Bubble = findBubble(Number(row.cells[0].innerHTML));
        highlightBubble (bubble);
    }
}

function onMouseOut() :void {
    resetRowColor();
    resetBubbleColor();
}

function getRandomBubble() :void {
    let boundaries = document.getElementById("graph").getBoundingClientRect();
    let bubble: Bubble = new Bubble(rowCounter, boundaries.width, boundaries.height, radius);
    coordinates.push(bubble);
    insertRow(bubble);
    appendBubbles();
    rowCounter++;
}

function insertRow(bubble:Bubble) :void {
    let table: HTMLTableElement = <HTMLTableElement> document.getElementById("tableValues");
    let row = table.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = rowCounter.toString();
    cell2.innerHTML = bubble.XValue.toString();
    cell3.innerHTML = bubble.YValue.toString();
}

function resetRowColor() :void {
    let table: HTMLTableElement = <HTMLTableElement> document.getElementById("tableValues");
    for (var r = 0, n = table.rows.length; r < n; r++) {
        table.rows[r].style.backgroundColor = plainBlueColor; // reset
    }
}

function highlightRow (bubble?:Bubble, row?:any) :void {
    if (row != undefined) {
        row.style.backgroundColor = highlightedBlueColor;
    }
    else {
        let table: HTMLTableElement = <HTMLTableElement>document.getElementById("tableValues");
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

function resetBubbleColor() :void {
    d3.select('#graph').selectAll("circle")
        .style("fill", plainBlueColor)
        .attr("r", radius);
}

function highlightBubble (bubble:Bubble) :void {
    resetBubbleColor();
    d3.select('#graph').selectAll("circle")
        .filter (function (element) {
            if (Number(element.id) == bubble.id) {
                return element;
            }
        })
        .style("fill", highlightedBlueColor)
        .attr("r", radius+5);
}


function appendBubbles() :void {
    let boundaries = document.getElementById("graph").getBoundingClientRect();
    d3.select('#graph').selectAll("circle")
        .data(coordinates)
        .enter().append("circle")
        .attr("cx", function(d) {
                return d.XValue;
        })
        .attr("cy", function(d) {
                return d.YValue;
        })
        .attr("r", radius)
        .attr("id",function(d) {
            return d.id;
        })
        .style("fill", plainBlueColor)
        .on('mouseover', function(d){
            d3.select(this)
                .style("fill", highlightedBlueColor)
                .attr("r", radius+5);
            highlightRow(d);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("fill", plainBlueColor)
                .attr("r", radius);
            highlightRow();
        });
    defineBubbleMovement();
}

function defineBubbleMovement() {
    let bubbles = d3.select('#graph').selectAll("circle");
    generateNewPositions();
    repeat();
    function repeat() {
        bubbles
            .data(coordinates)
            .transition()
            .attr("cx", function(d) {
                return d.XValue;
            })
            .attr("cy", function(d) {
                return d.YValue;
            })
            .delay(0)
            .duration(5000)
            .on("end",function () {
                generateNewPositions();
                repeat();
            });
    }
}

function generateNewPositions() {
    let boundaries = document.getElementById("graph").getBoundingClientRect();
    coordinates.forEach((element) => {
        element.XValue = element.generateRandomNumber(boundaries.width, radius);
        element.YValue = element.generateRandomNumber(boundaries.height, radius);
    });
}
