// JavaScript source code
function Point(x, y) {
    this.x = x;
    this.y = y;
}

function randIntBetween(from, to) {
    return from + ~~(Math.random() * (to - from));
}

function createBombsPoints(amount, matrixWidth, matrixHeight) {
    if (arguments.length == 0) {
        amount = 10;
        matrixWidth = 10;
        matrixHeight = 10;
    } else if (arguments.length == 1 && amount != undefined) {
        matrixWidth = 10;
        matrixHeight = 10;
    } else if (arguments.length == 2 && amount != undefined && matrixWidth != undefined) {
        matrixHeight = matrixWidth;
    } else {
        amount = amount ? amount : 10;
        matrixWidth = matrixWidth ? matrixWidth : 10;
        matrixHeight = matrixHeight ? matrixHeight : 10;
    }

    var objPoints = {};

    while (Object.keys(objPoints).length < amount) {
        var randX = randIntBetween(0, matrixWidth);
        var randY = randIntBetween(0, matrixHeight);
        objPoints['x' + randX + 'y' + randY] = new Point(randX, randY);
    }

    var arrBombs = [];

    for (var key in objPoints) {
        arrBombs.push(objPoints[key]);
    }

    return arrBombs;
}

function checkDifference(arr) { // auxiliary function
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr.length; j++) {
            if (i != j && arr[i].x == arr[j].x && arr[i].y == arr[j].y) return 'checkDifference result: ' + i;
        }
    }
    return 'checkDifference result: ' + 'allright';
}

function createArrMatrix(width, height, bombsPoints) {

    function checkAround(arr, point) {
        var sum = 0;

        for (var i = point.y - 1; i < point.y + 2; i++) {
            var k = 1;
            if (i == point.y) k = 2;
            for (var j = point.x - 1; j < point.x + 2; j += k) {
                if (arr[i] && arr[i][j] == 'x') sum++;
            }
        }

        return sum;
    }

    function checkAroundBomb(arr, bombPoint) {
        for (var i = bombPoint.y - 1; i < bombPoint.y + 2; i++) {

            var k = 1;
            if (i == bombPoint.y) k = 2;

            for (var j = bombPoint.x - 1; j < bombPoint.x + 2; j += k) {
                numberNeighboringBombs = checkAround(arr, new Point(j, i));
                if (arr[i] && !arr[i][j]) arr[i][j] = numberNeighboringBombs;
            }
        }
    }

    // create empty array
    var arr = new Array(height);

    for (var i = 0; i < height; i++) {
        arr[i] = new Array(width);
    }

    // push bombs to array
    for (var i = 0; i < bombsPoints.length; i++) {
        arr[bombsPoints[i].y][bombsPoints[i].x] = 'x';
    }

    for (var i = 0; i < bombsPoints.length; i++) {
        checkAroundBomb(arr, bombsPoints[i]);
    }

    return arr;
}

function createDomTable(width, height, HTMLColor) {

    function checkAroundEmpty(point, table) {
        for (var i = point.y - 1; i < point.y + 2; i++) {

            var k = 1;
            if (i == point.y) k = 2;

            for (var j = point.x - 1; j < point.x + 2; j += k) {
                if (i >= 0 && j >= 0 && i < height && j < width) {

                    if (arrMatrix[i][j] == 1)
                        table.rows[i].cells[j].style.color = 'rgb(0, 160, 0)';
                    if (arrMatrix[i][j] == 2)
                        table.rows[i].cells[j].style.color = 'rgb(30, 130, 130)';
                    if (arrMatrix[i][j] == 3)
                        table.rows[i].cells[j].style.color = 'rgb(70, 60, 180)';
                    if (arrMatrix[i][j] == 4)
                        table.rows[i].cells[j].style.color = 'rgb(90, 100, 170)';

                    if (arrMatrix[i][j] == undefined) {
                        arrMatrix[i][j] = '_';
                        setTimeout((function (i, j) {
                            return function () {
                                checkAroundEmpty(new Point(j, i), table);
                            }
                        })(i, j), 20);
                        table.rows[i].cells[j].style.background = emptyCellColor_Clicked;
                        table.rows[i].cells[j].dataset.backcolor = table.rows[i].cells[j].style.background;
                    }

                    if (typeof arrMatrix[i][j] == 'number') {
                        table.rows[i].cells[j].textContent = arrMatrix[i][j];
                    }
                    table.rows[i].cells[j].dataset.backcolor = table.rows[i].cells[j].style.background;
                }
            }
        }
    }

    function openAllBombs(table) {
        var i = 0;
        var temp;
        var intervalOpenBombs = setInterval(function () {
            try {
                if (i > 0) {
                    table.rows[arrBombs[i - 1].y].cells[arrBombs[i - 1].x].textContent = 'x';
                    table.rows[arrBombs[i - 1].y].cells[arrBombs[i - 1].x].style.background = table.rows[arrBombs[i - 1].y].cells[arrBombs[i - 1].x].dataset.backcolor;
                    table.rows[arrBombs[i - 1].y].cells[arrBombs[i - 1].x].style.width = table.rows[arrBombs[i].y].cells[arrBombs[i].x].style.width;
                    table.rows[arrBombs[i - 1].y].cells[arrBombs[i - 1].x].style.height = table.rows[arrBombs[i].y].cells[arrBombs[i].x].style.height;
                }
                table.rows[arrBombs[i].y].cells[arrBombs[i].x].textContent = 'X';
                table.rows[arrBombs[i].y].cells[arrBombs[i].x].style.background = 'rgba(200, 0, 0, 0.4)';
                table.rows[arrBombs[i].y].cells[arrBombs[i].x].style.color = 'red';
                table.rows[arrBombs[i].y].cells[arrBombs[i].x].style.width = '30px';
                table.rows[arrBombs[i].y].cells[arrBombs[i].x].style.height = '30px';
                if (i == arrBombs.length - 1) {
                    table.rows[arrBombs[i].y].cells[arrBombs[i].x].textContent = 'x';
                    table.rows[arrBombs[i].y].cells[arrBombs[i].x].style.background = table.rows[arrBombs[i].y].cells[arrBombs[i].x].dataset.backcolor;

                    table.rows[arrBombs[i].y].cells[arrBombs[i].x].style.width = cellWidth;
                    table.rows[arrBombs[i].y].cells[arrBombs[i].x].style.height = cellWidth;

                    clearInterval(intervalOpenBombs);
                }
                i++;
            } catch (e) { alert(e + '    ' + i) };
        }, 40);
    }

    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);

    table.style.borderCollapse = 'collapse';
    table.style.backgroundColor = HTMLColor;

    var emptyCellColor_Clicked = 'rgb(230, 230, 230)';

    for (var i = 0; i < height; i++) {
        var tr = document.createElement('tr');

        for (var j = 0; j < width; j++) {
            var td = document.createElement('td');

            td.style.cssText = 'padding: 0px;';

            td.style.borderLeftWidth = '2px';
            td.style.borderLeftStyle = 'solid';
            td.style.borderLeftColor = 'rgb(180, 180, 180)';

            td.style.borderTopWidth = '2px';
            td.style.borderTopStyle = 'solid';
            td.style.borderTopColor = 'rgb(140, 140, 140)';

            td.style.fontFamily = 'Comic Sans MS';
            td.style.textAlign = 'center';
            td.style.width = 25 + 'px';
            td.style.height = 25 + 'px';
            td.dataset.backcolor = td.style.background;

            td.X = j;
            td.Y = i;

            td.onclick = function () {
                if (arrMatrix[this.Y][this.X] == undefined) {
                    this.style.background = emptyCellColor_Clicked;
                    this.dataset.backcolor = this.style.background;
                    arrMatrix[this.Y][this.X] = '_';
                    checkAroundEmpty(new Point(this.X, this.Y), table);
                } else {
                    if (arrMatrix[this.Y][this.X] == 'x') {
                        table.rows[this.Y].cells[this.X].style.fontWeight = 'bold';
                        table.rows[this.Y].cells[this.X].style.fontSize = '17px';
                        table.rows[this.Y].cells[this.X].style.color = 'red';

                        //this.style.background = emptyCellColor_Clicked;
                        this.dataset.backcolor = HTMLColor;//this.style.background;

                        openAllBombs(table);
                    }

                    if (arrMatrix[this.Y][this.X] == 1)
                        table.rows[this.Y].cells[this.X].style.color = 'rgb(0, 160, 0)';
                    if (arrMatrix[this.Y][this.X] == 2)
                        table.rows[this.Y].cells[this.X].style.color = 'rgb(30, 130, 130)';
                    if (arrMatrix[this.Y][this.X] == 3)
                        table.rows[this.Y].cells[this.X].style.color = 'rgb(70, 60, 180)';
                    if (arrMatrix[this.Y][this.X] == 4)
                        table.rows[this.Y].cells[this.X].style.color = 'rgb(90, 100, 170)';

                    if (arrMatrix[this.Y][this.X] == '_') return;

                    this.textContent = arrMatrix[this.Y][this.X];
                    this.dataset.backcolor = this.style.background;
                }
            };

            td.oncontextmenu = function () {
                if (!table.rows[this.Y].cells[this.X].textContent) {
                    table.rows[this.Y].cells[this.X].style.fontFamily = 'Comic Sans MS';
                    table.rows[this.Y].cells[this.X].style.size = '30';
                    table.rows[this.Y].cells[this.X].style.fontWeight = 'bold';
                    table.rows[this.Y].cells[this.X].style.color = 'rgb(180, 70, 70)';
                    table.rows[this.Y].cells[this.X].textContent = '!';
                } else {
                    table.rows[this.Y].cells[this.X].textContent = '';
                }

                return false;
            }

            td.onmouseover = function () {
                table.rows[this.Y].cells[this.X].style.background = 'rgb(160, 160, 160)';
            }

            td.onmouseleave = function () {
                /*if (table.rows[this.Y].cells[this.X].style.background == table.rows[this.Y].cells[this.X].dataset.backcolor)
                    table.rows[this.Y].cells[this.X].style.background = 'rgb(210, 210, 210)';
                else {*/
                table.rows[this.Y].cells[this.X].style.background = table.rows[this.Y].cells[this.X].dataset.backcolor;
                //}
            }
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    return table;
}

//==============================
//==============================

var matrixWidth = 36;
var matrixHeight = 22;
var numberOfBombs = 60;

var cellWidth = '25px';

var arrBombs = createBombsPoints(numberOfBombs, matrixWidth, matrixHeight);

var table = createDomTable(matrixWidth, matrixHeight, 'rgb(210, 210, 210)');

var arrMatrix = createArrMatrix(matrixWidth, matrixHeight, arrBombs);

table.style.border = '2px solid gray';

document.body.appendChild(table);