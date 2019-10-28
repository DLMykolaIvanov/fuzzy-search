window.addEventListener('load', () => {
	const preload = document.getElementById('preload');
	const resultBox = document.getElementById('result_box');
	const select = document.getElementById('select');
	const phoneImageBox = document.querySelector('.image_box');

	HTMLElement.prototype.hide = function(text) {
		this.querySelector('.text').innerHTML = text;
		setTimeout(() => {
			this.classList.add('hiding');
			setTimeout(() => {
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

	function elementHTML(element, index) {
		return `<div class="item item-${index}">
							<h3>${element.DeviceName}</h3>
							<div class="info">
								<p>Announced: ${element.announced}</p>
								<p>Screen: ${element.type}</p>
								<p>Size: ${element.size}</p>
								<p>Battery: ${element.battery_c}</p>
								<p>Colors: ${element.colors}</p>
								<p>Price: ${element.price}</p>
								<button class="show_more">Show More</button>
								<button class="get_image">Get Image</button>
							</div>
							<div class="additional_information">
								<p>Card: ${element.card_slot}</p>
								<p>Weight: ${element.weight}</p>
								<p>SIM: ${element.sim}</p>
								<p>Resolution: ${element.resolution}</p>
								<p>Card slot: ${element.card_slot}</p>
								<p>CPU: ${element.cpu}</p>
								<p>Chipset: ${element.chipset}</p>
								<p>GPU: ${element.gpu}</p>
								<p>Internal: ${element.internal}</p>
								<p>OS: ${element.os}</p>
								<p>Video: ${element.video}</p>
								<p>Build: ${element.build}</p>
								<p>2G: ${element._2g_bands}</p>
								<p>3G: ${element._3g_bands}</p>
								<p>4G: ${element._4g_bands}</p>
							</div>
						</div>`;
	}

	function renderResult(result) {
		if ( result.length ) {
			let renderHTML = '';
			if ( result.length > 100 ) renderHTML += '<p>Result too many (>100) show only first 100 elements.</p>';
			result.forEach((item, index) => {
				if ( index > 100 ) return false;
				renderHTML += elementHTML(item, index);
			});
			resultBox.innerHTML = renderHTML;
		} else {
			resultBox.innerHTML = '<p>Results not found!</p>'
		}
	}

	document.getElementById('search').addEventListener('keyup', function() {
		const value = this.value,
					element = this;
		setTimeout(function () {
			if ( value === element.value ) {
				const fuse = new Fuse(db, options);
				const result = fuse.search(value);
				renderResult(result);
			}
		}, 500);
	});

	function showMoreToggle(target) {
		const parentNode = target.parentNode.parentNode;
		if ( parentNode.classList.contains('open') ) {
			target.innerText = 'Show More';
		} else {
			target.innerText = 'Hide More';
		}
		parentNode.classList.toggle('open');
	}

	async function getImagePhone(target) {
		preload.show('Search phome image');
		const modelName = target.parentNode.parentNode.querySelector('h3').innerText;
		const modelNameSearch = await fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyB7G_yY3BhStZwQpo3Mlp-gR49863RxkcY&cx=017597289859248119791:cvewz9ndadp&q=${modelName}&searchType=image&imgSize=large`);
		if ( modelNameSearch.ok ) {
			const modelNameSearchResult = await modelNameSearch.json();
			if ( modelNameSearchResult.queries.request[0].totalResults > 0 ) {
				preload.show('Load phone image');
				let imageURL = '';
				imageURL = modelNameSearchResult.items[0].link;
				phoneImageBox.querySelector('img').src = imageURL;
				phoneImageBox.classList.add('show');
			} else {
				preload.hide('Phone image now found');
			}

		} else {
			console.log('image load error:', modelImage.status);
			preload.hide('Load phone image error!');
		}
	}

	document.addEventListener('click', (e) => {
		if ( e.target.classList.contains('show_more') ) {
			showMoreToggle(e.target);
		} else if ( e.target.classList.contains('get_image') ) {
			getImagePhone(e.target);
		}
	});

	document.getElementById('close_image_box').addEventListener('click', () => {
		phoneImageBox.classList.remove('show');
		phoneImageBox.querySelector('img').src = '';
	});

	phoneImageBox.querySelector('img').addEventListener('load', () => {
		preload.hide('Phone image loaded');
	});
});