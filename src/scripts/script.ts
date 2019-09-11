import { Bubble } from "./bubble"
import * as d3 from "./modules/d3.js"

window.onload = () => {
    document.getElementById ("button").addEventListener ("click", getRandomBubble, false);
    document.getElementById("tableValues").addEventListener("mouseover", onMouseOver, false);
    document.getElementById("tableValues").addEventListener("mouseout", onMouseOut, false);
};

const maxRadius = 40,
    plainBlueColor = "#7b9eb4",
    highlightedBlueColor = "#323c4b";
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
    resetBubbles();
}

function getRandomBubble() :void {
    let boundaries = document.getElementById("graph").getBoundingClientRect();
    let bubble: Bubble = new Bubble(rowCounter, boundaries.width, boundaries.height, maxRadius);
    bubbleList.push(bubble);
    insertRow(bubble);
    insertBubble(bubble);
    rowCounter++;
}

function insertBubble(bubble:Bubble) {
    let boundaries = document.getElementById("graph").getBoundingClientRect();
    let svg = d3.select('#graph');

    let bubbleObject = svg.append("circle")
        .attr("cx", bubble.x)
        .attr("cy", bubble.y)
        .attr("r", bubble.radius)
        .attr("id", bubble.id)
        .attr("fill", plainBlueColor)
        .on('mouseover', function(d){
            d3.select(this)
                .style("fill", highlightedBlueColor)
                .attr("r", bubble.radius +5);
            highlightRow(bubble);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("fill", plainBlueColor)
                .attr("r", bubble.radius);
            highlightRow();
        });

    let diffX = bubble.vx;
    let diffY = bubble.vy;

    function moveX() {
        let posX = Number(d3.select(this).attr("cx"));
        let nextX = posX + diffX;
        if (nextX < bubble.radius || nextX > boundaries.width - bubble.radius || isCollision(posX)) {
            diffX = -1 * diffX;
        }
        return nextX;
    }

    function moveY() {
        let posY = Number(d3.select(this).attr("cy"));
        let nextY = posY + diffY;
        if (nextY < bubble.radius || nextY > boundaries.height - bubble.radius || isCollision(posY)) {
            diffY = -1 * diffY;
        }
        return nextY;
    }

    setInterval(function () {
        bubbleObject.attr("cx", moveX).attr("cy", moveY);
        updateTableEntries(bubble, bubbleObject);
    }, 1);

    function isCollision(value:number) :boolean {
        d3.select('#graph').selectAll("circle")
            .each(function () {
                if (Math.round((Number(this.cx))) ==  Math.round(value)) {
                    return true;
                }
            });
        return false;
    }

}
function insertRow(bubble:Bubble) :void {
    let table: HTMLTableElement = <HTMLTableElement> document.getElementById("tableValues"),
        row = table.insertRow(-1),
        cell1 = row.insertCell(0),
        cell2 = row.insertCell(1),
        cell3 = row.insertCell(2);
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

function resetBubbles() :void {
    d3.select('#graph').selectAll("circle")
        .each(function () {
            bubbleList.forEach((element) => {
                if (Number(this.id) == element.id) {
                    d3.select(this)
                        .style("fill", plainBlueColor)
                        .attr("r", element.radius);
                }
            });
        })
}

function highlightBubble (bubble:Bubble) :void {
    resetBubbles();
    d3.select('#graph').selectAll("circle")
        .each(function () {
            if (Number(this.id) == bubble.id) {
                d3.select(this)
                    .style("fill", highlightedBlueColor)
                    .attr("r", bubble.radius + 5);
            }
        })
}

function updateTableEntries (bubble:Bubble, element:any) {
    let table: HTMLTableElement = <HTMLTableElement> document.getElementById("tableValues");
        for (let r = 0, n = table.rows.length; r < n; r++) {
                if (Number(table.rows[r].cells[0].innerHTML) == bubble.id) {
                    for (let c = 1, m = table.rows[r].cells.length; c < m; c++) {
                        switch (table.rows[r].cells[c].id) {
                            case "xValue": {
                                table.rows[r].cells[c].innerHTML = Math.round(Number(element.attr("cx"))).toString();
                                break;
                            }
                            case "yValue": {
                                table.rows[r].cells[c].innerHTML = Math.round(Number(element.attr("cy"))).toString();
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
}


