const electron = require('electron');
const ioHook = require('iohook');
const fetch = require('node-fetch');

const CAPI_KEY = require('fs').readFileSync(`${__dirname}/capi_key.txt`, {encoding : 'utf8'});

console.log(CAPI_KEY);

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

	console.log('ALERT:', text, destination);

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

}

function updateInteraction(event){
	// console.log('Interaction:', event);
	timeSinceLastSystemInteraction = Date.now() * 1;
}

app.on('browser-window-blur', () => {
	console.log('app lost focus');
	if(window !== undefined){
		window.setTouchBar(null);
	}
});

function bindIOHookEvents(eventsList){

	eventsList.forEach(event => {
		ioHook.on(event, updateInteraction);
	});

}

function generateDatestamp(currentTime){
	const timeInPast = currentTime - (120 * 1000);
	return JSON.parse( JSON.stringify( { d : new Date(timeInPast)} ) ).d;
}

const displayedStories = [];

function checkForNewStories(){

	if( (Date.now() * 1) - timeSinceLastSystemInteraction < timeIdleBeforeNotificationCanBeShown){
		return false;
	}

	console.log(displayedStories);

	const now = new Date() * 1;
	const dateStamp = generateDatestamp(now);

	console.log(dateStamp);

	const URL_ENDPOINT = `https://api.ft.com/content/notifications?since=${dateStamp}&apiKey=${CAPI_KEY}`

	console.log(URL_ENDPOINT);

	fetch(URL_ENDPOINT)
		.then(res => {
			if(res.ok){
				return res;
			} else {
				throw res;
			}
		})
		.then(res => res.json())
		.then(data => {
			// console.log(data);
			
			if(data.notifications.length > 0){
				if( displayedStories.indexOf(data.notifications[0].id) < 0){
					createAlert(data.notifications[0].id, data.notifications[0].id.replace('thing', 'content'));
					displayedStories.push(data.notifications[0].id);
				}
			}

		})
		.catch(err => {
			console.log(err);
		})
	;

}

app.once('ready', () => {
	console.log('App ready');

	bindIOHookEvents( [
		'keypress',
		'keyup',
		'keydown',
		'mousemove',
		'mousewheel',
		'mousedrag',
	]);

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

	checkForNewStories();

	setInterval(checkForNewStories, 10000);	

});
