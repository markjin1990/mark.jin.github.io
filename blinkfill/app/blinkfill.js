function getInputList(data, ncols, nrows) {
    inputList = [];
    for (var r = 0; r < nrows; r++) {
        inputList[r] = [];
        for (var c = 0; c < ncols - 1; c++) {
            inputList[r][c] = data[r][c];
        }
    }
    return inputList;
}

function getInputOutputExampleList(data, ncols, nrows) {
    inputOutputExampleList = [];
    for (var r = 0; r < nrows; r++) {
        if (data[r][ncols - 1] != "" && data[r][ncols - 1] != null) {
            inputRow = [];
            inputOutputExample = [];
            for (var c = 0; c < ncols - 1; c++) {
                inputRow.push(data[r][c]);
            }  
            inputOutputExample.push(inputRow);
            inputOutputExample.push(data[r][ncols - 1]);
            inputOutputExampleList.push(inputOutputExample);
        }
        
    }
    return inputOutputExampleList;
}

function callBlinkFillAPI() {

    var TableData = hot.getData();
    var totalCols = TableData[0].length;
    var totalRows = TableData.length;
    var ncols = totalCols, nrows=totalRows;

    // Check number of cols
    for (var c = 0; c < totalCols; c++) {
        for (var r = 0; r < totalRows; r++) {
            if (TableData[r][c] != null && TableData[r][c] != "") {
                ncols = c + 1;
                break;
            }  
        }   
    }

    // Check number of rows
    for (var r = 0; r < totalRows; r++) {
        for (var c = 0; c < totalCols; c++) {
            if (TableData[r][c] != null && TableData[r][c] != "") {
                nrows = r + 1;
                break;
            }
        }
    }

    var outCol = ncols - 1;

    var inputList = getInputList(TableData, ncols, nrows);

    var inputOutputExampleList = getInputOutputExampleList(TableData, ncols, nrows);
    
    var inputRowStrings = [];
    for(var i=0; i<inputList.length; i++){
        inputRowStrings.push(inputList[i].join("<->"));
    }

    var inputListString = inputRowStrings.join("<|>");

    inputOutputExampleRowStrings = []
    for (var i = 0; i < inputOutputExampleList.length; i++) {
        inputOutputExampleRowStrings.push(inputOutputExampleList[i][0].join("<->") + "-->" + inputOutputExampleList[i][1]);
    }

    var inputOutputExampleListString = inputOutputExampleRowStrings.join("<|>");
    console.log("inputListString: ", inputListString);
    console.log("inputOutputExampleListString: ", inputOutputExampleListString);

    callAPI = function () {
        var learningData = {
            'vals': inputListString,
            'examples': inputOutputExampleListString
        };

        $('#loadingmessage').show();
        $.ajax({
            type: "POST",
            cache: false,
            url: "https://conditionalblinkfillapi.azurewebsites.net/api/CondBlinkFill",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                inputRowStrings: inputListString,
                inputOutputExamples: inputOutputExampleListString
            }),
            success: function (data) {
                // alert("Success!" + data);

                for (var i = 0; i < data.length; i++) {
                    hot.setDataAtCell(i, outCol, data[i]); 
                }
                hot.render();

                document.getElementById("result").innerHTML = "Success!";
                $('#loadingmessage').hide();
            },
            error: function (err) {
                document.getElementById("result").innerHTML = "Sorry, BlinkFill can't learn this transformation yet.";
                console.log("Sorry, BlinkFill can't learn this transformation yet.");
                $('#loadingmessage').hide();
            }
        });
    };

    callAPI();
}