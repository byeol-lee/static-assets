/* =========================
	region config
	========================= */

const weatherRegion = (() => {

	const wrap = document.querySelector('.weather-wrap');

	if (!wrap) {

		return {
			storageKey: 'pyeongchangWeatherCache',
			weeklyStorageKey: 'pyeongchangWeeklyWeatherCache',
			nx: 84,
			ny: 123,
			regionName: '평창'
		};
	}

	if (wrap.classList.contains('island')) {

		return {
			storageKey: 'jejuWeatherCache',
			weeklyStorageKey: 'jejuWeeklyWeatherCache',
			nx: 52,
			ny: 33,
			regionName: '제주'
		};
	}

	if (wrap.classList.contains('camp')) {

		return {
			storageKey: 'jejuWeatherCache',
			weeklyStorageKey: 'jejuWeeklyWeatherCache',
			nx: 52,
			ny: 33,
			regionName: '제주'
		};
	}

	return {
		storageKey: 'pyeongchangWeatherCache',
		weeklyStorageKey: 'pyeongchangWeeklyWeatherCache',
		nx: 84,
		ny: 123,
		regionName: '평창'
	};

})();

const SEOUL_STORAGE_KEY =
	'seoulWeatherCache';

const STORAGE_KEY =
	weatherRegion.storageKey;

const WEEKLY_STORAGE_KEY =
	weatherRegion.weeklyStorageKey;

const serviceKey =
	'd283dee6bd88829ee65f062117a812d1d752156c6f6f4ea536e1d7765e8e1cc2';

const NX =
	weatherRegion.nx;

const NY =
	weatherRegion.ny;

const REGION_NAME =
	weatherRegion.regionName;

const SEOUL_NX = 61;
const SEOUL_NY = 126;

const IS_PARK =
	document.querySelector('.weather-wrap.park');

/* =========================
current weather
========================= */

async function getWeather(nx = NX, ny = NY) {

	const now = new Date();

	if (now.getMinutes() < 45) {
		now.setHours(now.getHours() - 1);
	}

	const baseDate = formatDate(now);

	const baseHour =
		String(now.getHours()).padStart(2, '0');

	const ncstUrl =
		'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst' +
		'?serviceKey=' + encodeURIComponent(serviceKey) +
		'&pageNo=1' +
		'&numOfRows=1000' +
		'&dataType=JSON' +
		'&base_date=' + baseDate +
		'&base_time=' + baseHour + '00' +
		'&nx=' + nx +
		'&ny=' + ny;

	const fcstUrl =
		'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst' +
		'?serviceKey=' + encodeURIComponent(serviceKey) +
		'&pageNo=1' +
		'&numOfRows=1000' +
		'&dataType=JSON' +
		'&base_date=' + baseDate +
		'&base_time=' + baseHour + '30' +
		'&nx=' + nx +
		'&ny=' + ny;

	const [ncstRes, fcstRes] = await Promise.all([
		fetch(ncstUrl),
		fetch(fcstUrl)
	]);

	const ncstData = await ncstRes.json();
	const fcstData = await fcstRes.json();

	const ncstItems =
		ncstData.response.body.items.item;

	const fcstItems =
		fcstData.response.body.items.item;

	const getNcstValue = category => {

		const item = ncstItems.find(
			v => v.category === category
		);

		return item ? item.obsrValue : '-';
	};

	const getFcstValue = category => {

		const item = fcstItems.find(
			v => v.category === category
		);

		return item ? item.fcstValue : '-';
	};

	return {

		temp: getNcstValue('T1H'),
		humidity: getNcstValue('REH'),
		wind: getNcstValue('WSD'),
		rain: getNcstValue('RN1'),

		sky: weatherText(
			getFcstValue('SKY'),
			getFcstValue('PTY'),
			getNcstValue('RN1')
		)
	};
}

/* =========================
weekly weather
========================= */

async function getWeeklyWeather() {

	const now = new Date();

	const url =
		'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst' +
		'?serviceKey=' + encodeURIComponent(serviceKey) +
		'&pageNo=1' +
		'&numOfRows=3000' +
		'&dataType=JSON' +
		'&base_date=' + formatDate(now) +
		'&base_time=0500' +
		'&nx=' + NX +
		'&ny=' + NY;

	const response = await fetch(url);
	const data = await response.json();

	const items =
		data.response.body.items.item;

	const grouped = {};

	items.forEach(item => {

		const date = item.fcstDate;
		const time = item.fcstTime;

		if (time === '0000') {
			return;
		}

		if (!grouped[date]) {

			grouped[date] = {
				skyCodes: [],
				ptyCodes: []
			};
		}

		if (item.category === 'TMN') {
			grouped[date].min = item.fcstValue;
		}

		if (item.category === 'TMX') {
			grouped[date].max = item.fcstValue;
		}

		if (item.category === 'SKY') {
			grouped[date].skyCodes.push(item.fcstValue);
		}

		if (item.category === 'PTY') {
			grouped[date].ptyCodes.push(item.fcstValue);
		}

	});

	Object.keys(grouped).forEach(date => {

		const skyCodes =
			grouped[date].skyCodes || [];

		const ptyCodes =
			grouped[date].ptyCodes || [];

		let pty = '0';

		if (ptyCodes.includes('1')) {
			pty = '1';
		} else if (ptyCodes.includes('2')) {
			pty = '2';
		} else if (ptyCodes.includes('3')) {
			pty = '3';
		} else if (ptyCodes.includes('4')) {
			pty = '4';
		}

		let sky = '1';

		if (skyCodes.includes('4')) {
			sky = '4';
		} else if (skyCodes.includes('3')) {
			sky = '3';
		}

		grouped[date].sky =
			getWeeklySky(sky, pty);

	});

	return Object.entries(grouped)

		.filter(([date, value]) => {

			return (
				value.min ||
				value.max ||
				value.sky
			);

		})

		.sort((a, b) => Number(a[0]) - Number(b[0]))

		.slice(0, 4)

		.map(([date, value]) => ({
			date,
			...value
		}));

}

/* =========================
weekly render
========================= */

function renderWeeklyWeather(list) {

	let html = '';

	list.forEach(item => {

		const month =
			item.date.substr(4, 2);

		const day =
			item.date.substr(6, 2);

		html += `
            <div class="weekly-item">

                <div class="weekly-day">
                    ${month}.${day}
                </div>

                <div class="weekly-icon">
                    ${item.sky || '☀️'}
                </div>

                <div class="weekly-temp">
                    ${item.max || '-'}°
                    <span >
                        ${item.min || '-'}°
                    </span>
                </div>

            </div>
        `;

	});

	$('#weeklyWeather').html(html);
}

/* =========================
weather text
========================= */

function weatherText(sky, pty, rain) {

	rain = parseFloat(rain);

	if (!isNaN(rain) && rain > 0) {
		return '☔ 비가 와요.';
	}

	switch (String(pty)) {

		case '1':
			return '☔ 비가 와요.';

		case '2':
			return '☔/❄️ 비/눈이 와요.';

		case '3':
			return '❄️ 눈이 와요.';

		case '4':
			return '🌦️ 소나기가 와요.';

		case '5':
			return '☔ 빗방울이 떨어져요.';

		case '6':
			return '❄️ 진눈깨비가 와요.';

		case '7':
			return '❄️ 눈이 날려요.';
	}

	switch (String(sky)) {

		case '1':
			return '☀️ 맑아요.';

		case '3':
			return '⛅ 구름 많아요.';

		case '4':
			return '☁️ 흐려요.';

		default:
			return '☀️ 맑아요.';

	}
}

function getWeeklySky(sky, pty) {

	sky = String(sky || '1').trim();
	pty = String(pty || '0').trim();

	if (pty === '1') {
		return '☔';
	}

	if (pty === '2') {
		return '☔/❄️';
	}

	if (pty === '3') {
		return '❄️';
	}

	if (pty === '4') {
		return '?️';
	}

	if (sky === '1') {
		return '☀️';
	}

	if (sky === '3') {
		return '⛅';
	}

	if (sky === '4') {
		return '☁️';
	}

	return '☀️';
}

/* =========================
common functions
========================= */

function formatDate(date) {

	const year = date.getFullYear();

	const month =
		String(date.getMonth() + 1)
			.padStart(2, '0');

	const day =
		String(date.getDate())
			.padStart(2, '0');

	return year + month + day;
}

function calcFeelTemp(temp, wind) {

	temp = parseFloat(temp);
	wind = parseFloat(wind);

	if (isNaN(temp) || isNaN(wind)) {
		return '-';
	}

	return (
		13.12 +
		(0.6215 * temp) -
		(11.37 * Math.pow(wind, 0.16)) +
		(0.3965 * temp * Math.pow(wind, 0.16))
	).toFixed(1) + '°';
}

/* =========================
render ui
========================= */

function setWeather(data) {

	let desc = '';

	$('#weatherRegionName').text(
		REGION_NAME
	);

	$('#weatherRegionNameText').text(
		REGION_NAME
	);

	$('#weatherTemp').text(
		parseFloat(data.temp).toFixed(1) +
		'°'
	);

	$('#weatherTempText').html(
		parseFloat(data.temp).toFixed(1) +
		'°' +
		'<span class="weatherFeelTemp">' +
		'/' +
		calcFeelTemp(data.temp, data.wind) +
		'</span>'

	);

	$('#weatherSky').text(
		data.sky
	);

	$('#weatherDesc').html(
		'현재 ' +
		REGION_NAME +
		'의 기온은 ' +
		'<u >' +
		parseFloat(data.temp).toFixed(1) +
		'°' +
		'</u>' +
		' 입니다.'
	);

	$('#weatherFeel').text(
		calcFeelTemp(data.temp, data.wind)
	);

	$('#weatherHumidity').text(
		data.humidity + '%'
	);

	$('#weatherWind').text(
		data.wind + 'm/s'
	);

	$('#weatherRain').text(
		data.rain + 'mm'
	);

	if (
		window.seoulTempValue &&
		window.seoulWindValue &&
		IS_PARK
	) {

		const gap =
			parseFloat(window.seoulTempValue) -
			parseFloat(data.temp);

		const seoulFeelTemp =
			parseFloat(
				calcFeelTemp(
					window.seoulTempValue,
					window.seoulWindValue
				)
			);

		const currentFeelTemp =
			parseFloat(
				calcFeelTemp(
					data.temp,
					data.wind
				)
			);

		const feelGap =
			seoulFeelTemp -
			currentFeelTemp;

		if (gap >= 0) {

			$('#seoulWeatherWrap').show();

			desc =
				'서울보다 ' +
				'<u >' +
				gap.toFixed(1) +
				'°' +
				'</u>' +
				', 체감 온도 ' +
				'<u >' +
				feelGap.toFixed(1) +
				'°' +
				'</u> ' +
				' 더 시원한 ' +
				REGION_NAME +
				'의 날씨를 느껴 보세요.';

		} else {
			$('#seoulWeatherWrap').hide();
		}

	} else {
		$('#seoulWeatherWrap').hide();
	}

	$('#gapTemp').html(desc || '');
}

function setSeoulWeather(data) {

	$('#seoulWeatherTemp').html(
		parseFloat(data.temp).toFixed(1) +
		'°' +
		'<span class="weatherFeelTemp">' +
		'/' +
		calcFeelTemp(data.temp, data.wind) +
		'</span>'
	);

	$('#seoulWeatherFeel').text(
		calcFeelTemp(data.temp, data.wind)
	);

	$('#seoulWeatherHumidity').text(
		data.humidity + '%'
	);

	$('#seoulWeatherWind').text(
		data.wind + 'm/s'
	);

	$('#seoulWeatherRain').text(
		data.rain + 'mm'
	);
}

function setTempGap(pyeongchangTemp, seoulTemp) {

	const gap =
		parseFloat(seoulTemp) -
		parseFloat(pyeongchangTemp);

	if (isNaN(gap)) {
		return;
	}

	$('#tempGap').text(
		gap.toFixed(1)
	);
}

function setUpdateTime(dateString) {

	const date = new Date(dateString);

	const hours =
		String(date.getHours()).padStart(2, '0');

	const minutes =
		String(date.getMinutes()).padStart(2, '0');

	$('#weatherUpdate').text(
		'주간 예보: 최고/최저 기온 ㅣ Weather data by KMA ㅣ LAST UPDATED ' +
		hours +
		':' +
		minutes
	);
}

/* =========================
load data
========================= */

async function loadWeather() {

	const cached =
		localStorage.getItem(STORAGE_KEY);

	if (cached) {

		try {

			const parsed = JSON.parse(cached);

			setWeather(parsed.weather);

			if (parsed.updatedAt) {
				setUpdateTime(parsed.updatedAt);
			}

		} catch (e) {
			console.log(e);
		}
	}

	const seoulCached =
		localStorage.getItem(
			SEOUL_STORAGE_KEY
		);

	if (seoulCached) {

		try {

			const parsedSeoul =
				JSON.parse(seoulCached);

			window.seoulTempValue =
				parsedSeoul.weather.temp;

			window.seoulWindValue =
				parsedSeoul.weather.wind;

			setSeoulWeather(
				parsedSeoul.weather
			);

			const currentCached =
				localStorage.getItem(STORAGE_KEY);

			if (currentCached) {

				try {

					const parsedCurrent =
						JSON.parse(currentCached);

					setWeather(parsedCurrent.weather);

				} catch (e) {
					console.log(e);
				}
			}

		} catch (e) {
			console.log(e);
		}
	}

	const weeklyCached =
		localStorage.getItem(
			WEEKLY_STORAGE_KEY
		);

	if (weeklyCached) {

		try {

			const parsedWeekly =
				JSON.parse(weeklyCached);

			renderWeeklyWeather(
				parsedWeekly.weekly
			);

		} catch (e) {
			console.log(e);
		}
	}

	try {

		const weather =
			await getWeather();

		const seoulWeather =
			await getWeather(
				SEOUL_NX,
				SEOUL_NY
			);

		window.seoulTempValue =
			seoulWeather.temp;

		console.log('평창', weather);
		console.log('서울', seoulWeather);

		setWeather(weather);

		setSeoulWeather(seoulWeather);

		localStorage.setItem(
			SEOUL_STORAGE_KEY,
			JSON.stringify({
				weather: seoulWeather
			})
		);

		setTempGap(
			weather.temp,
			seoulWeather.temp
		);

		const updatedAt =
			new Date().toISOString();

		setUpdateTime(updatedAt);

		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				weather,
				updatedAt
			})
		);

		const weekly =
			await getWeeklyWeather();

		// if (
		//     weekly.length > 0 &&
		//     !weekly[0].min
		// ) {
		//     weekly[0].min =
		//         weather.temp;
		// }

		if (weekly.length > 0) {

			const todayDate =
				weekly[0].date;

			const prevWeeklyCached =
				localStorage.getItem(
					WEEKLY_STORAGE_KEY
				);

			if (
				(
					!weekly[0].min ||
					weekly[0].min === '-'
				) &&
				prevWeeklyCached
			) {

				try {

					const prevWeeklyData =
						JSON.parse(prevWeeklyCached).weekly;

					const matchedPrev =
						prevWeeklyData.find(
							item => item.date === todayDate
						);

					if (
						matchedPrev &&
						matchedPrev.min &&
						matchedPrev.min !== '-'
					) {

						weekly[0].min =
							matchedPrev.min;

					}

				} catch (e) {

					console.log(e);

				}
			}
		}

		renderWeeklyWeather(weekly);

		localStorage.setItem(
			WEEKLY_STORAGE_KEY,
			JSON.stringify({ weekly })
		);

	} catch (e) {

		console.log(e);

	}
}

loadWeather();

setInterval(loadWeather, 300000);

/* =========================
inject styles
========================= */

$(function () {

	$('.common-page-location,.content-main-title,.btn-top').hide();

	$('.content-main-title,.common-page-title .title').text('날씨 안내');

	$('.detail-content.no-margin,.event-detail .detail-content').css(
		'border-bottom',
		'none'
	);

	$('.common-content').css(
		'width',
		'100%'
	);
});
