const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const TouchBar = electron.TouchBar;

const shell = electron.shell;

const {TouchBarLabel, TouchBarButton, TouchBarSpacer} = TouchBar;

let window;

function prepareHeadline(text){
	return `FT.com: ${text.slice(0,45)}...`;
}

function createAlert(text, destination){

	console.log('alert');

	const headline = new TouchBarLabel({
		label : prepareHeadline(text)
	});

	const readButton = new TouchBarButton({
		label : 'Read Now',
		backgroundColor : '#26747a',
		textColor : '#FFFFFF',
		click : () => {
			console.log(`Reading ${destination}`);
			shell.openExternal(destination);
		}
	});

	const myFTButton = new TouchBarButton({
		label : 'Save to MyFT',
		backgroundColor : '#9e2f50',
		textColor : '#FFFFFF',
		click : () => {
			console.log(`Saving ${destination} to MyFT`);
		}
	});

	const ftBar = new TouchBar([
		headline,
		readButton,
		myFTButton
	]);
	
	window.show();
	window.setTouchBar(ftBar);

	setTimeout( () => {
		window.setTouchBar(null);
		window.hide();
	}, 5000 );

}


app.once('ready', () => {
	console.log('App ready');

	window = new BrowserWindow({
		frame: false,
		titleBarStyle: 'hidden-inset',
		width: 1,
		height: 1,
		frame: false,
		titleBarStyle : 'hidden',
		transparent : true
	});
	
	window.setIgnoreMouseEvents(true);

	const demoPairs = [
		['M&S pulls advertising from YouTube over extremist videos', 'https://www.ft.com/content/2fb33e91-c7c3-3a6b-a0e4-e9c706426fc9'],
		['Britain and Germany set to sign defence co-operation deal', 'https://www.ft.com/content/2deb3c7c-0ca7-11e7-b030-768954394623'],
		['Theresa May to trigger Brexit process on March 29', 'https://www.ft.com/content/36d5e3a4-0d61-11e7-b030-768954394623'],
		['Trump denies Russian collusion as Comey heads to Capitol Hill', 'https://www.ft.com/content/20778696-0d64-11e7-b030-768954394623']
	]

	setInterval(function(){
		console.log('Interval');
		const r = Math.random() * demoPairs.length | 0;

		createAlert(demoPairs[r][0], demoPairs[r][1]);

	}, 7000);

	createAlert('M&S pulls advertising from YouTube over extremist videos', 'https://www.ft.com/content/2fb33e91-c7c3-3a6b-a0e4-e9c706426fc9');
	
});
