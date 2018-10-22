var filePath;
var fileType;
var fileName = '';
var fileData;



function readUrl(input) {

  if (input.files && input.files[0]) {
    $("#progressBar").value = 0;
    $("#progressBar")[0].style.visibility = 'hidden';
    let reader = new FileReader();
    reader.onload = (e) => {
      fileData = input.files[0];
      fileName = input.files[0].name;
      $("#file_input_div").html(fileName);
      fileType = input.files[0].type;
      fileType = fileType.replace('x-flac', 'flac');
      fileType = fileType.replace('mpeg', 'mp3');
      let extensions = ['audio/flac', 'audio/basic', 'audio/l16', 'audio/mp3', 'audio/mulaw', 'audio/ogg', 'audio/wav'];
      if(extensions.indexOf(fileType) > -1) {
        $("#upload_recognize1").prop('disabled', false);
      }
      input.setAttribute("data-title", fileName);
      $("#file_format").val(fileType);
    }
    reader.readAsDataURL(input.files[0]);
  }

}

function getTextResult(path) {
  var formdata = new FormData();
  formdata.append("file_format", $("#file_format").val());
  formdata.append("language", $("#language").val());
  formdata.append("path", path);
  $("#loader").addClass("loading");
  $("#text_result").html('');
  $.ajax({
    url: 'server.php',
    method: 'POST',
    processData: false,
    contentType: false,
    data: formdata,
    success: function (res) {
      $("#loader").removeClass("loading");
      $("#text_result").html(res);
      $("#upload_recognize1").prop('disabled', false);
    }
  })

}

$(function () {

  function _(el) {
    return document.getElementById(el);
  }

  $("#upload_recognize").click(function () {
    if (fileName == '') return;
    $("#upload_recognize1").prop('disabled', true);
    $("#myModal").modal('hide');
    _("progressBar").style.visibility = 'visible';
    var file = _("inputFile").files[0];
    var formdata = new FormData();
    formdata.append("file", file);
    var ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    ajax.addEventListener("error", errorHandler, false);
    ajax.addEventListener("abort", abortHandler, false);
    ajax.open("POST", "upload.php");
    ajax.onreadystatechange = function () {
      $("#progressBar")[0].style.visibility = 'hidden';
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        if (data.success == true) {
          //get text
          getTextResult(data.url);
        }
      }
    };
    ajax.send(formdata);
  });

  function progressHandler(event) {
    var percent = (event.loaded / event.total) * 100;
    _("progressBar").value = Math.round(percent);
  }

  function completeHandler(event) {
    _("progressBar").value = 0; //wil clear progress bar after successful upload
  }

  function errorHandler(event) {}

  function abortHandler(event) {}


});