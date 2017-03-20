const electron = require('electron');
const ioHook = require('iohook');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const TouchBar = electron.TouchBar;
const Tray = electron.Tray;
const Menu = electron.Menu;


const shell = electron.shell;

const {TouchBarLabel, TouchBarButton, TouchBarSpacer} = TouchBar;

let window;
let timeSinceLastSystemInteraction = Date.now() * 1;
const timeIdleBeforeNotificationCanBeShown = 10000;

function prepareHeadline(text){
	return `FT.com: ${text.slice(0,45)}...`;
}

function createAlert(text, destination){

	console.log('alert');

	if( (Date.now() * 1) - timeSinceLastSystemInteraction < timeIdleBeforeNotificationCanBeShown){
		return false;
	}

	const headline = new TouchBarLabel({
		label : prepareHeadline(text)
	});

	const readButton = new TouchBarButton({
		label : 'Read Now',
		backgroundColor : '#26747a',
		textColor : '#FFFFFF',
		click : () => {
			console.log(`Reading ${destination}`);
			window.setTouchBar(null);
			shell.openExternal(destination);
			timeSinceLastSystemInteraction = Date.now() * 1;
		}
	});

	const myFTButton = new TouchBarButton({
		label : 'Save to MyFT',
		backgroundColor : '#9e2f50',
		textColor : '#FFFFFF',
		click : () => {
			console.log(`Saving ${destination} to MyFT`);
			window.setTouchBar(null);
			timeSinceLastSystemInteraction = Date.now() * 1;
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

function updateInteraction(event){
	// console.log('Interaction:', event);
	timeSinceLastSystemInteraction = Date.now() * 1;
}

app.once('ready', () => {
	console.log('App ready');

	ioHook.on("mousemove", updateInteraction);

	ioHook.on("keypress", updateInteraction);
	
	//Register and start hook 
	ioHook.start();

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

	/*tray = new Tray('./ft_icon.png');
	const contextMenu = Menu.buildFromTemplate([
		{label: 'Item1', type: 'radio'},
		{label: 'Item2', type: 'radio'},
		{label: 'Item3', type: 'radio', checked: true},
		{label: 'Item4', type: 'radio'}
	]);
	tray.setToolTip('Configure FT Touch Bar notifications');
	tray.setContextMenu(contextMenu);*/

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
