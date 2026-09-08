document.addEventListener('DOMContentLoaded', () => {
    // 1. 언어 판별 (HTML lang 속성, 페이지 URL의 ?lang=en, 또는 호출된 script src의 ?lang=en 감지)
    const currentScript = document.currentScript || Array.from(document.querySelectorAll('script')).pop();
    const scriptParams = new URLSearchParams(currentScript ? new URL(currentScript.src, window.location.href).search : '');
    const urlParams = new URLSearchParams(window.location.search);

    // URL 경로에 '/en/'이 포함되어 있는지 확인하는 조건 추가
    const isEnglish = document.documentElement.lang === 'en' || 
                    window.location.pathname.includes('/en/') || 
                    urlParams.get('lang') === 'en' || 
                    scriptParams.get('lang') === 'en';

    // 2. 행 및 월 라벨 설정
    const rows = isEnglish 
        ? ['Low season', 'High season', 'Peak season', 'Holidays']
        : ['비수기', '성수기', '극성수기', '연휴'];

    const months = isEnglish 
        ? ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
        : ['9월', '10월', '11월', '12월', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월'];

    // 3. 통합 일정 데이터 (한/영 분기)
    const scheduleData = {
        park: [
            {
                row: isEnglish ? 'High season' : '성수기',
                year: 2026,
                month: isEnglish ? 'Sep' : '9월',
                text: [isEnglish ? 'Sep 24(Thu)<br />~ 26(Sat)' : '9월 24일(목)<br />~ 26일(토)'],
                align: ['right'],
                arrow: ['bottom'],
                bg: [true],
                bgStart: ['72%'],
                bgWidth: ['15%'],
                offsetX: ['0px', '-0px']
            },
            {
                row: isEnglish ? 'High season' : '성수기',
                year: 2026,
                month: isEnglish ? 'Oct' : '10월',
                text: [isEnglish ? 'Oct 3(Sat) ~ 4(Sun),<br />Oct 9(Fri) ~ 10(Sat)' : '10월 3일(토) ~ 4일(일),<br />10월 9일(금) ~ 10일(토)'],
                align: ['center'],
                arrow: ['top'],
                bg: [true],
                bgStart: ['1%'],
                bgWidth: ['30%'],
                offsetX: ['-101px', '-0px']
            },
            {
                row: isEnglish ? 'High season' : '성수기',
                year: 2026,
                month: isEnglish ? 'Dec' : '12월',
                text: [isEnglish ? 'Dec 11(Fri) ~ 12(Sat)' : '12월 11일(금) ~ 12일(토)'],
                align: ['center'],
                arrow: ['top'],
                bg: [true],
                bgStart: ['42%'],
                bgWidth: ['15%'],
                offsetX: ['0px', '-0px']
            }
        ],
        island: [
            {
                row: isEnglish ? 'Low season' : '비수기',
                year: 2026,
                month: isEnglish ? 'Oct' : '10월',
                text: [isEnglish ? 'Oct 8(Thu)' : '10월 8일(목)'],
                align: ['left'],
                arrow: ['top'],
                bg: [false],
                bgStart: ['0%'],
                bgWidth: ['15%'],
                offsetX: ['0px', '-0px']
            },
            {
                row: isEnglish ? 'Low season' : '비수기',
                year: 2026,
                month: isEnglish ? 'Dec' : '12월',
                text: [isEnglish ? 'Dec 25(Fri)' : '12월 25일(금)'],
                align: ['right'],
                arrow: ['top'],
                bg: [false],
                bgStart: ['0%'],
                bgWidth: ['15%'],
                offsetX: ['0px', '-0px']
            },
            {
                row: isEnglish ? 'Low season' : '비수기',
                year: 2027,
                month: isEnglish ? 'Jan' : '1월',
                text: [isEnglish ? 'Jan 1(Fri)' : '1월 1일(금)'],
                align: ['left'],
                arrow: ['top'],
                bg: [false],
                bgStart: ['0%'],
                bgWidth: ['15%'],
                offsetX: ['0px', '-0px']
            },
            {
                row: isEnglish ? 'Low season' : '비수기',
                year: 2027,
                month: isEnglish ? 'Feb' : '2월',
                text: [isEnglish ? 'Feb 8(Mon)' : '2월 8일(월)', isEnglish ? 'Feb 28(Sun)' : '2월 28일(일)'],
                align: ['left','left'],
                arrow: ['top'],
                bg: [false],
                bgStart: ['0%'],
                bgWidth: ['15%'],
                offsetX: ['-12px', '65px']
            },
            {
                row: isEnglish ? 'High season' : '성수기',
                year: 2026,
                month: isEnglish ? 'Sep' : '9월',
                text: [isEnglish ? 'Sep 24(Thu)<br />~ 26(Sat)' : '9월 24일(목)<br />~ 26일(토)'],
                align: ['right'],
                arrow: ['bottom'],
                bg: [true],
                bgStart: ['72%'],
                bgWidth: ['15%'],
                offsetX: ['0px', '-0px']
            },
            {
                row: isEnglish ? 'High season' : '성수기',
                year: 2026,
                month: isEnglish ? 'Oct' : '10월',
                text: [isEnglish ? 'Oct 2(Fri), Oct 3(Sat) ~ 4(Sun),<br />Oct 9(Fri) ~ 10(Sat)' : '10월 2일(금), 10월 3일(토) ~ 4일(일),<br />10월 9일(금) ~ 10일(토)'],
                align: ['center'],
                arrow: ['top'],
                bg: [true],
                bgStart: ['1%'],
                bgWidth: ['55%'],
                offsetX: ['0px', '-0px']
            },
            {
                row: isEnglish ? 'High season' : '성수기',
                year: 2026,
                month: isEnglish ? 'Dec' : '12월',
                text: [isEnglish ? 'Dec 31(Thu)' : '12월 31일(목)'],
                align: ['right'],
                arrow: ['top'],
                bg: [false],
                bgStart: ['0%'],
                bgWidth: ['15%'],
                offsetX: ['0px', '-0px']
            },
            {
                row: isEnglish ? 'High season' : '성수기',
                year: 2027,
                month: isEnglish ? 'Feb' : '2월',
                text: [isEnglish ? 'Feb 6(Sat) ~ 7(Sun)' : '2월 6일(토) ~ 7일(일)', isEnglish ? 'Feb 26(Fri) ~ 27(Sat)' : '2월 26일(금) ~ 27일(토)'],
                align: ['right', 'left'],
                arrow: ['bottom', 'top'],
                bg: [true, true],
                bgStart: ['2%', '81%'],
                bgWidth: ['15%', '15%'],
                offsetX: ['-64px', '63px']
            }
        ]
    };

    function getCurrentSiteType() {
        return document.querySelector('.site-jeju') ? 'island' : 'park';
    }

    const currentSite = getCurrentSiteType();
    const currentData = scheduleData[currentSite] || [];

    function getValue(val, index, defaultValue) {
        if (Array.isArray(val)) {
            return val[index] !== undefined ? val[index] : defaultValue;
        }
        return val !== undefined ? val : defaultValue;
    }

    const tbody = document.getElementById('table-body');
    if (tbody) {
        rows.forEach(rowName => {
            const tr = document.createElement('tr');
            const th = document.createElement('td');
            th.className = 'row-header';
            th.textContent = rowName;
            tr.appendChild(th);

            months.forEach(monthName => {
                const td = document.createElement('td');
                const items = currentData.filter(item => item.row === rowName && item.month === monthName);

                items.forEach(item => {
                    const textList = Array.isArray(item.text) ? item.text : [item.text];

                    textList.forEach((textStr, index) => {
                        const curAlign = getValue(item.align, index, 'center');
                        const curArrow = getValue(item.arrow, index, 'top');
                        const curBg = getValue(item.bg, index, false);
                        const curBgStart = getValue(item.bgStart, index, '0%');
                        const curBgWidth = getValue(item.bgWidth, index, '100%');
                        const curOffsetX = getValue(item.offsetX, index, '0px');

                        if (curBg) {
                            const bgBar = document.createElement('div');
                            bgBar.className = 'cell-highlight-bar';
                            bgBar.style.left = curBgStart;
                            bgBar.style.width = curBgWidth;
                            td.appendChild(bgBar);
                        }

                        const tooltip = document.createElement('div');
                        tooltip.className = `tooltip-container align-${curAlign} arrow-${curArrow}`;
                        if (curOffsetX !== '0px') {
                            tooltip.style.transform = `translateX(${curOffsetX})`;
                        }

                        tooltip.innerHTML = `
                            <div class="tooltip-dot"></div>
                            <div class="tooltip-box">${textStr}</div>
                        `;
                        td.appendChild(tooltip);
                    });
                });
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }

    function renderMobileTimeline() {
        const container = document.getElementById('m-timeline-container');
        if (!container) return;

        container.innerHTML = '';

        const years = [...new Set(currentData.map(d => d.year))].sort((a, b) => a - b);

        years.forEach(year => {
            const yearHeader = document.createElement('div');
            yearHeader.className = 'm-year-header';
            // 영문일 때는 '년' 표기 제외
            yearHeader.innerHTML = isEnglish ? `${year}` : `${year}년`;
            container.appendChild(yearHeader);

            const yearItems = currentData.filter(d => d.year === year);
            const seasonsInYear = rows.filter(s => yearItems.some(item => item.row === s));

            seasonsInYear.forEach(seasonName => {
                const seasonItems = yearItems
                    .filter(item => item.row === seasonName)
                    .sort((a, b) => {
                        return months.indexOf(a.month) - months.indexOf(b.month);
                    });

                if (seasonItems.length === 0) return;

                const groupCard = document.createElement('div');
                groupCard.className = 'm-season-group-card';

                const monthItemsHTML = seasonItems.map(item => {
                    const rawTextList = Array.isArray(item.text) ? item.text : [item.text];
                    const cleanText = rawTextList.map(t => t.replace(/<br\s*\/?>/gi, ' ')).join(', ');

                    return `
                        <div class="m-month-item">
                            <span class="m-month-label">${item.month}</span>
                            <div class="m-date-detail-text">${cleanText}</div>
                        </div>
                    `;
                }).join('');

                groupCard.innerHTML = `
                    <div class="m-season-badge-box">
                        <div class="m-season-title">${seasonName}</div>
                    </div>
                    <div class="m-month-list">
                        ${monthItemsHTML}
                    </div>
                `;

                container.appendChild(groupCard);
            });
        });
    }

    renderMobileTimeline();

    function setResortType() {
        var siteType = getCurrentSiteType(); 
        var targetType = (siteType === 'island') ? 'island' : 'park';

        if (urlParams.get('type')) {
            targetType = urlParams.get('type');
        }

        if (typeof $ !== 'undefined') {
            $('.room-info').hide();
            $('.room-info.' + targetType).show();
        } else {
            document.querySelectorAll('.resort-info').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.resort-info.' + targetType).forEach(el => el.style.display = '');
        }
    }

    setResortType();
});