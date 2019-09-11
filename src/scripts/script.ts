import { Bubble } from "./bubble"
import * as d3 from "./modules/d3.js"

window.onload = () => {
    document.getElementById ("button").addEventListener ("click", getRandomBubble, false);
    document.getElementById("tableValues").addEventListener("mouseover", onMouseOver, false);
    document.getElementById("tableValues").addEventListener("mouseout", onMouseOut, false);
};

const maxRadius = 40;
const plainBlueColor = "#7b9eb4";
const highlightedBlueColor = "#323c4b";
var rowCounter:number = 1;
var bubbleList:Bubble[] = [];

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

function findBubble (id:number) :Bubble {
    let bubble:Bubble = undefined;
    bubbleList.forEach((element) => {
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
    let bubble: Bubble = new Bubble(rowCounter, boundaries.width, boundaries.height, maxRadius);
    bubbleList.push(bubble);
    insertRow(bubble);
    appendBubbles();
    defineBubbleMovement();
    rowCounter++;
}

function insertRow(bubble:Bubble) :void {
    let table: HTMLTableElement = <HTMLTableElement> document.getElementById("tableValues");
    let row = table.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = rowCounter.toString();
    cell2.innerHTML = bubble.x.toString();
    cell3.innerHTML = bubble.y.toString();
    cell1.setAttribute("id", "id");
    cell2.setAttribute("id", "xValue");
    cell3.setAttribute("id", "yValue");
}

function resetRowColor() :void {
    let table: HTMLTableElement = <HTMLTableElement> document.getElementById("tableValues");
    for (let r = 0, n = table.rows.length; r < n; r++) {
        table.rows[r].style.backgroundColor = plainBlueColor; // reset
    }
}

function highlightRow (bubble?:Bubble, row?:any) :void {
    if (row != undefined) {
        row.style.backgroundColor = highlightedBlueColor;
    }
    else {
        let table: HTMLTableElement = <HTMLTableElement>document.getElementById("tableValues");
        for (let r = 0, n = table.rows.length; r < n; r++) {
            table.rows[r].style.backgroundColor = plainBlueColor; // reset
            for (let c = 0, m = table.rows[r].cells.length; c < m; c++) {
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
        .attr("r", function(d) {
            return d.radius;
        });
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
        .attr("r", function(d) {
            return d.radius + 5;
        });
}


function appendBubbles() :void {
    d3.select('#graph').selectAll("circle")
        .data(bubbleList)
        .enter().append("circle")
        .attr("cx", function(d) {
                return d.x;
        })
        .attr("cy", function(d) {
                return d.y;
        })
        .attr("r", function(d) {
            return d.radius;
        })
        .attr("id",function(d) {
            return d.id;
        })
        .style("fill", plainBlueColor)
        .on('mouseover', function(d){
            d3.select(this)
                .style("fill", highlightedBlueColor)
                .attr("r", function(d) {
                    return d.radius + 5;
                });
            highlightRow(d);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("fill", plainBlueColor)
                .attr("r", function(d) {
                    return d.radius;
                });
            highlightRow();
        });
}

function defineBubbleMovement() {
    let bubbles = d3.select('#graph').selectAll("circle");
    generateNewPositions();
    updateTableEntries();
    repeat();
    function repeat() {
        bubbles
            .data(bubbleList)
            .transition()
            .ease(d3.easeLinear)
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            })
            .duration(2000)
            .on("end",function () {
                generateNewPositions();
                updateTableEntries();
                repeat();
            });
    }
}

function generateNewPositions() {
    let boundaries = document.getElementById("graph").getBoundingClientRect();
    bubbleList.forEach((element) => {
        element.x = element.generateRandomNumber(boundaries.width);
        element.y = element.generateRandomNumber(boundaries.height);
    });
}

function updateTableEntries () {
    let table: HTMLTableElement = <HTMLTableElement> document.getElementById("tableValues");
    bubbleList.forEach((element) => {
        for (let r = 0, n = table.rows.length; r < n; r++) {
                if (Number(table.rows[r].cells[0].innerHTML) == element.id) {
                    for (let c = 1, m = table.rows[r].cells.length; c < m; c++) {
                        switch (table.rows[r].cells[c].id) {
                            case "xValue": {
                                table.rows[r].cells[c].innerHTML = element.x.toString();
                                break;
                            }
                            case "yValue": {
                                table.rows[r].cells[c].innerHTML = element.y.toString();
                                break;
                            }
                            default: {
                                // do nothing
                                break;
                            }
                        }
                    }
                }
        }
    });
}


