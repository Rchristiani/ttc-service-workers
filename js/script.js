const ttc = {};

ttc.getData = function() {
	const options = {
		method: 'GET',
		mode: 'cors'
	};
	const url = new URLSearchParams();
	url.set('reqUrl','https://myttc.ca/union_station.json');
	return fetch(`https://proxy.hackeryou.com?${url}`,options)
		.then(res => res.json());
}

ttc.displayData = function(data) {
	const stopsWithRoutes = data.stops.filter(stop => stop.routes.length > 0);
	const stopTemplate = templater`
		<article class="stop">
			<h2 class="stop__title">${'name'}</h2>
			<ul class="stop__list">
				${data => data.routes.map(route => {
					return route.stop_times.map(stop => `
						<li class="stop__time">
							<h3>${stop.shape}</h3>
							<p>${stop.departure_time}</p>
						</li>
					`);
				})}
			</ul>
		</article>
	`;
	const stops = stopsWithRoutes.map(stop => stopTemplate(stop));
	document.querySelector('.times').innerHTML = stops.toString();
}

ttc.init = function() {
	ttc.getData()
		.then(ttc.displayData)
}

window.onload = ttc.init;