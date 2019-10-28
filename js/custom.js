window.addEventListener('load', () => {
	const preload = document.getElementById('preload');
	const resultBox = document.getElementById('result_box');
	const select = document.getElementById('select');

	HTMLElement.prototype.hide = function(text) {
		this.querySelector('.text').innerHTML = text;
		setTimeout(() => {
			if ( this.className === 'show' ) {
				this.className = '';
				return;
			}
			this.classList.add('hiding');
			setTimeout(() => {
				if ( this.className === 'show' ) {
					this.className = '';
					return;
				}
				this.classList.add('hide');
			}, 500);
		}, 500);
	};

	HTMLElement.prototype.show = function(text) {
		this.querySelector('.text').innerHTML = text;
		if (this.classList.contains('hiding')) this.className = 'show';

	};

	function renderSelect(phoneDB) {
		const uniquePhones = [];
		let selectHtml = '<option value="">All</option>';
		phoneDB.forEach((item) => {
			if ( !uniquePhones.includes( item.Brand ) ) {
				uniquePhones.push( item.Brand );
				selectHtml += '<option value="' + item.Brand + '">' + item.Brand + '</option>';
			}
		});
		select.innerHTML = selectHtml;
	}

	// search option
	const options = {
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
		preload.show('Load phone DB');
		const dbResponse = await fetch('phones/phones.json');
		if ( dbResponse.ok ) {
			db = await dbResponse.json();
			preload.hide('Load done');
			renderSelect(db);
		} else {
			console.log('DB error:', dbResponse.status);
			preload.show('Load phone DB error!');
		}
	})();

	function renderResult(result) {
		if ( result.length ) {
			let renderHTML = '';
			if ( result.length > 100 ) renderHTML += '<p>Result too many (>100) shwo only first 100 elements.</p>'
		} else {
			resultBox.innerHTML = '<p>Results not found!</p>'
		}
	}

	document.getElementById('search').addEventListener('keyup', function() {
		const fuse = new Fuse(db, options);
		const result = fuse.search(this.value);
		renderResult(result);
	});
});