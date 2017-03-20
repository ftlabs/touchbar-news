const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const TouchBar = electron.TouchBar;

const {TouchBarLabel, TouchBarButton, TouchBarSpacer} = TouchBar;

let window;

function createAlert(text, destination){

	const iconButton = new TouchBarButton({
		icon : './ft_icon.png'
	});

	const headline = new TouchBarLabel({
		label : 'M&S pulls advertising from YouTube over extremist videos'
	});

	const readButton = new TouchBarButton({
		label : 'Read Now',
		backgroundColor : '#26747a',
		textColor : '#FFFFFF',
		click : () => {
			console.log(`Reading ${destination}`);
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
		// iconButton,
		headline,
		readButton,
		myFTButton
	]);
	
	window.loadURL('about:blank');
	window.setTouchBar(ftBar);

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
	
	createAlert();

});
