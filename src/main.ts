const recordButton = document.getElementById(
	"start-recording"
) as HTMLButtonElement;

const stopButton = document.getElementById(
	"stop-recording"
) as HTMLButtonElement;

const previewVideo = document.getElementById(
	"preview-video"
) as HTMLVideoElement;

const downloadableVideo = document.getElementById(
	"downloadable-video"
) as HTMLVideoElement;

const recordAudio = document.getElementById("record-audio") as HTMLInputElement;

recordButton.onclick = async () => {
	const stream = await navigator.mediaDevices.getDisplayMedia({
		// having both here only seems to work on Chrome, so we'll need some
		// hack to work around this
		audio: recordAudio.checked,
		video: true,
	});
	previewVideo.src = "";
	previewVideo.srcObject = stream;
	previewVideo.controls = false;
	previewVideo.setAttribute("data-recording", String(true));

	recordButton.disabled = true;
	stopButton.disabled = false;

	const data: Blob[] = [];
	const recorder = new MediaRecorder(stream);
	console.log(stream);
	recorder.start();

	recorder.ondataavailable = (e) => data.push(e.data);
	recorder.onstop = () => {
		for (const track of stream.getTracks()) {
			track.stop();
		}
		previewVideo.srcObject = null;
		previewVideo.setAttribute("data-recording", String(false));

		// type hack alert!
		const blob = new Blob(data, { type: data[0].type });
		const url = URL.createObjectURL(blob);
		downloadableVideo.src = url;

		recordButton.disabled = false;
		stopButton.disabled = true;
	};

	stopButton.onclick = () => {
		recorder.stop();
	};
};
