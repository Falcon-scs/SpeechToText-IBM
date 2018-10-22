var filePath;
var fileType;
var fileName = '';
var fileData;

var token = "";
var wsURI = "";

function onClose(evt) {
  console.log(evt.data);
}

function onMessage(evt) {
  console.log(evt.data);
}

function onError(evt) {
  console.log(evt.data);
}

function readUrl(input) {

  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = (e) => {
      fileData = input.files[0];
      fileName = input.files[0].name;
      $("#file_input_div").html(fileName);
      fileType = input.files[0].type;
      fileType = fileType.replace('x-flac', 'flac');
      fileType = fileType.replace('mpeg', 'mp3');
      let extensions = ['audio/flac', 'audio/basic', 'audio/l16', 'audio/mp3', 'audio/mulaw', 'audio/ogg', 'audio/wav'];
      if (extensions.indexOf(fileType) > -1) {
        $("#upload_recognize1").prop('disabled', false);
      }
      input.setAttribute("data-title", fileName);
      $("#file_format").val(fileType);
    }
    reader.readAsDataURL(input.files[0]);
  }

}

$(function () {
  //get authentication token
  $.ajax({
    url: 'token.php',
    method: 'GET',
    "crossDomain": true,
    success: function (res) {
      token = res;
    }
  })

  function _(el) {
    return document.getElementById(el);
  }

  $("#upload_recognize").click(function () {
    if (fileName == '') return;
    $("#upload_recognize1").prop('disabled', true);
    $("#myModal").modal('hide');
    var file = _("inputFile").files[0];

    wsURI = "wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=" + token + "&model=" + $("#language").val();
    var websocket = new WebSocket(wsURI);
    websocket.onopen = function (evt) {
      onOpen(evt)
    };
    websocket.onclose = function (evt) {
      onClose(evt)
    };
    websocket.onmessage = function (evt) {
      let data = JSON.parse(evt.data);
      if (data.results) {
        $("#loader").removeClass("loading");
        let res = '';
        let speakers = data.speaker_labels;
        let count = 0;
        data.results.forEach(element => {
          res = res +'Speaker ' + speakers[count].speaker+' : '+ element.alternatives[0].transcript+'<br>';
          count = count + element.alternatives[0].timestamps.length;
        });

        $("#text_result").html(res);
      }
      $("#upload_recognize1").prop('disabled', false);
      onMessage(evt)
    };
    websocket.onerror = function (evt) {
      onError(evt)
    };

    function onOpen(evt) {
      var message = {
        action: 'start',
        'content-type': fileType,
        'speaker_labels': true
      };
      websocket.send(JSON.stringify(message));

      // Prepare and send the audio file.
      $("#text_result").html('');
      $("#loader").addClass("loading");
      websocket.send(file);

      websocket.send(JSON.stringify({
        action: 'stop'
      }));
    }


  });


});