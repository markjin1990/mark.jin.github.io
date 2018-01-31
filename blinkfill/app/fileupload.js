document.getElementById('fileSelect').onchange = function uploadFile() {
    var file = document.getElementById('fileSelect');
    var data1 = null;
    var reader = new FileReader();
    reader.readAsText(file.files[0]);
    reader.onload = function (event) {
        var csvData = event.target.result;
        data1 = $.csv.toArrays(csvData);
        if (data1 && data1.length > 0) {
            hot.loadData(data1);
        } else {
            alert('No data to import!');
        }
    };

    reader.onerror = function () {
        alert('Unable to read ' + file.fileName);
    };



}