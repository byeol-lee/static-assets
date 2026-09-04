document.addEventListener('DOMContentLoaded', () => {
    const rows = ['비수기', '성수기', '극성수기', '연휴'];
    const months = ['9월', '10월', '11월', '12월', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월'];

    // 통합 일정 데이터
    const scheduleData = {
        park: [
            {
                row: '성수기',
                year: 2026,
                month: '9월',
                text: ['9월 24일(목)<br />~ 26일(토)'],
                align: ['right'],
                arrow: ['bottom'],
                bg: [true],
                bgStart: ['72%'],
                bgWidth: ['15%'],
                offsetX: ['0px', '-0px']
            },
            {
                row: '성수기',
                year: 2026,
                month: '10월',
                text: ['10월 3일(토) ~ 4일(일),<br />10월 9일(금) ~ 10일(토)'],
                align: ['center'],
                arrow: ['top'],
                bg: [true],
                bgStart: ['1%'],
                bgWidth: ['30%'],
                offsetX: ['-101px', '-0px']
            },
            {
                row: '성수기',
                year: 2026,
                month: '12월',
                text: ['12월 11일(금) ~ 12일(토)'],
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
                row: '비수기',
                year: 2026,
                month: '10월',
                text: ['10월 8일(목)'],
                align: ['left'],
                arrow: ['top'],
                bg: [false],
                bgStart: ['0%'],
                bgWidth: ['15%'],
                offsetX: ['0px', '-0px']
            },
            {
                row: '비수기',
                year: 2026,
                month: '12월',
                text: ['12월 25일(금)'],
                align: ['right'],
                arrow: ['top'],
                bg: [false],
                bgStart: ['0%'],
                bgWidth: ['15%'],
                offsetX: ['0px', '-0px']
            },
            {
                row: '비수기',
                year: 2027,
                month: '1월',
                text: ['1월 1일(금)'],
                align: ['left'],
                arrow: ['top'],
                bg: [false],
                bgStart: ['0%'],
                bgWidth: ['15%'],
                offsetX: ['0px', '-0px']
            },
            {
                row: '비수기',
                year: 2027,
                month: '2월',
                text: ['2월 8일(월)','2월 28일(일)'],
                align: ['left','left'],
                arrow: ['top'],
                bg: [false],
                bgStart: ['0%'],
                bgWidth: ['15%'],
                offsetX: ['-12px', '65px']
            },
            {
                row: '성수기',
                year: 2026,
                month: '9월',
                text: ['9월 24일(목)<br />~ 26일(토)'],
                align: ['right'],
                arrow: ['bottom'],
                bg: [true],
                bgStart: ['72%'],
                bgWidth: ['15%'],
                offsetX: ['0px', '-0px']
            },
            {
                row: '성수기',
                year: 2026,
                month: '10월',
                text: ['10월 2일(금), 10월 3일(토) ~ 4일(일),<br />10월 9일(금) ~ 10일(토)'],
                align: ['center'],
                arrow: ['top'],
                bg: [true],
                bgStart: ['1%'],
                bgWidth: ['55%'],
                offsetX: ['0px', '-0px']
            },
            {
                row: '성수기',
                year: 2026,
                month: '12월',
                text: ['12월 31일(목)'],
                align: ['right'],
                arrow: ['top'],
                bg: [false],
                bgStart: ['0%'],
                bgWidth: ['15%'],
                offsetX: ['0px', '-0px']
            },
            {
                row: '성수기',
                year: 2027,
                month: '2월',
                text: ['2월 6일(토) ~ 7일(일)','2월 26일(금) ~ 27일(토)'],
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

    /* ---------------- 1. PC 테이블 렌더링 ---------------- */
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

    /* ---------------- 2. 모바일 타임라인 렌더링 ---------------- */
    function renderMobileTimeline() {
        const container = document.getElementById('m-timeline-container');
        if (!container) return;

        container.innerHTML = '';

        const years = [...new Set(currentData.map(d => d.year))].sort((a, b) => a - b);

        years.forEach(year => {
            const yearHeader = document.createElement('div');
            yearHeader.className = 'm-year-header';
            yearHeader.innerHTML = `${year}년`;
            container.appendChild(yearHeader);

            const yearItems = currentData.filter(d => d.year === year);
            const seasonsInYear = rows.filter(s => yearItems.some(item => item.row === s));

            seasonsInYear.forEach(seasonName => {
                const seasonItems = yearItems
                    .filter(item => item.row === seasonName)
                    .sort((a, b) => parseInt(a.month) - parseInt(b.month));

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
});