import { Vector } from "./vector"
import * as d3 from "./modules/d3.js"

window.onload = () => {
    document.getElementById ("button").addEventListener ("click", getRandomVector, false);
    document.getElementById("tableValues").addEventListener("mouseover", onMouseOver, false);
    document.getElementById("tableValues").addEventListener("mouseout", onMouseOut, false);
};

const radius = 20;
const plainBlueColor = "#7b9eb4";
const highlightedBlueColor = "#323c4b";
var rowCounter:number = 1;
var coordinates:Vector[] = [];

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

function findVector (id:number) :Vector {
    let vector:Vector = undefined;
    coordinates.forEach((element) => {
        if(element.id == id) {
            vector = element;
        }
    });
    return vector;
}

function onMouseOver() :void {
    let target = getEventTarget(event);
    if (target && target.tagName == "TD") {
        let row = target.parentElement;
        highlightRow(undefined, row);
        let vector:Vector = findVector(Number(row.cells[0].innerHTML));
        highlightCircle (vector);
    }
}

function onMouseOut() :void {
    resetRowColor();
    resetCircleColor();
}

function getRandomVector() :void {
    let boundaries = document.getElementById("graph").getBoundingClientRect();
    let vector: Vector = new Vector(rowCounter, boundaries.width, boundaries.height, radius);
    coordinates.push(vector);
    insertRow(vector);
    appendCircles();
    rowCounter++;
}

function insertRow(vector:Vector) :void {
    let table: HTMLTableElement = <HTMLTableElement> document.getElementById("tableValues");
    let row = table.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = rowCounter.toString();
    cell2.innerHTML = vector.x.toString();
    cell3.innerHTML = vector.y.toString();
}

function resetRowColor() :void {
    let table: HTMLTableElement = <HTMLTableElement> document.getElementById("tableValues");
    for (var r = 0, n = table.rows.length; r < n; r++) {
        table.rows[r].style.backgroundColor = plainBlueColor; // reset
    }
}

function highlightRow (vector?:Vector, row?:any) :void {
    if (row != undefined) {
        row.style.backgroundColor = highlightedBlueColor;
    }
    else {
        let table: HTMLTableElement = <HTMLTableElement>document.getElementById("tableValues");
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

function resetCircleColor() :void {
    d3.select('#graph').selectAll("circle")
        .style("fill", plainBlueColor)
        .attr("r", radius);
}

function highlightCircle (vector:Vector) :void {
    resetCircleColor();
    d3.select('#graph').selectAll("circle")
        .filter (function (element) {
            if (Number(element.id) == vector.id) {
                return element;
            }
        })
        .style("fill", highlightedBlueColor)
        .attr("r", radius+5);
}


function appendCircles() :void {
    d3.select('#graph').selectAll("circle")
        .data(coordinates)
        .enter().append("circle")
        .attr("cx", function(d) {
                return d.x;
        })
        .attr("cy", function(d) {
                return d.y;
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
}