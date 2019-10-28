window.addEventListener('load', () => {
	// search option
	const options = {
		shouldSort: true,
		threshold: 0.6,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		keys: [
			"DeviceName",
			"technology",
			"announced",
			"dimensions",
			"weight",
			"sim",
			"type",
			"size",
			"card_slot",
			"wlan",
			"bluetooth",
			"gps",
			"usb",
			"battery_c",
			"colors",
			"cpu",
			"internal",
			"os",
			"video",
			"chipset",
			"features",
			"gpu",
			"build",
			"price",
			"single"
		]
	};
	let db;

	(async function() {
		const dbResponse = await fetch('phones/phones.json');
		if ( dbResponse.ok ) {
			db = await dbResponse.json();
			console.log(db);
		} else {
			console.log('DB error:', dbResponse.status);
		}
	})();

	// var fuse = new Fuse(list, options); // "list" is the item array
	// var result = fuse.search("");
});