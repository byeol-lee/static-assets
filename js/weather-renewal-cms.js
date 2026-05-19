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

/* =========================
current weather
========================= */

async function getWeather() {

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
        '&nx=' + NX +
        '&ny=' + NY;

    const fcstUrl =
        'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst' +
        '?serviceKey=' + encodeURIComponent(serviceKey) +
        '&pageNo=1' +
        '&numOfRows=1000' +
        '&dataType=JSON' +
        '&base_date=' + baseDate +
        '&base_time=' + baseHour + '30' +
        '&nx=' + NX +
        '&ny=' + NY;

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
            getFcstValue('PTY')
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
                    <span>
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

function weatherText(sky, pty) {

    switch (String(pty)) {

        case '1':
            return '☔ 비';

        case '2':
            return '☔/❄️ 비/눈';

        case '3':
            return '❄️ 눈';

        case '5':
            return '☔ 빗방울';

        case '6':
            return '❄️ 진눈깨비';

        case '7':
            return '❄️ 눈날림';
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
        return '🌨️';
    }

    if (pty === '3') {
        return '❄️';
    }

    if (pty === '4') {
        return '🌦️';
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

    $('#weatherRegionName').text(
        REGION_NAME
    );

    $('#weatherTemp').text(
        data.temp + '°'
    );

    $('#weatherSky').text(
        data.sky
    );

    $('#weatherDesc').text(
        '현재 ' +
        REGION_NAME +
        '의 기온은 ' +
        data.temp +
        '℃ 입니다.'
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
}

function setUpdateTime(dateString) {

    const date = new Date(dateString);

    const hours =
        String(date.getHours()).padStart(2, '0');

    const minutes =
        String(date.getMinutes()).padStart(2, '0');

    $('#weatherUpdate').text(
        'Weather data by KMA ㅣ LAST UPDATED ' +
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

        setWeather(weather);

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

        if (
            weekly.length > 0 &&
            !weekly[0].min
        ) {
            weekly[0].min =
                weather.temp;
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