const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          createDownloadLink(audioBlob)
          const play = () => audio.play();
          sendAudioFile(audioBlob);
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const handleAction = async () => {
    console.log("hiiii");
  const recorder = await recordAudio();
//   const actionButton = document.getElementById('action');
//   actionButton.disabled = true;
  recorder.start();
  await sleep(10000);
  const audio = await recorder.stop();
  audio.play();
  await sleep(3000);
  actionButton.disabled = false;
}

function createDownloadLink(blob) {
 
  var url = URL.createObjectURL(blob);
  var au = document.createElement('audio');
  var li = document.createElement('li');
  var link = document.createElement('a');

  //add controls to the <audio> element
  au.controls = true;
  au.src = url;

  //link the a element to the blob
  link.href = url;
  link.download = new Date().toISOString() + '.wav';
  link.innerHTML = link.download;

  //add the new audio and a elements to the li element
  li.appendChild(au);
  li.appendChild(link);

  //add the li element to the ordered list
//   recordingsList.appendChild(li);
}

function sendAudioFile(blob){
//     var formData = new FormData();
// formData.append("music", audio);
var base64data;
var reader = new FileReader();
reader.readAsDataURL(blob); 
reader.onloadend = function() {
 base64data = reader.result;  
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:5000/goRealTime',
        crossDomain: true,
        processData: false,
        contentType: false,
        data:  base64data,
        headers: {
            'Content-Type': 'multipart/form-data',
          },
    contentType: false,
        timeout: 3000,
        success: function(responseData, textStatus, jqXHR) 
        {   
          var responsedata = JSON.parse(responseData);
          console.log(typeof(responsedata));
            for(key in responsedata){
              console.log(key)
            }
            var response = 'Your Word Count is: ' + responsedata['length'];
            $('span#response').html(response);
            console.log(responseData);
    
        },
        error: function (responseData, textStatus, errorThrown) 
        {
            console.warn(responseData, textStatus, errorThrown);
            alert('failed - ' + textStatus);
        }
    });
}
}