const grid = document.getElementById('activitiesGrid');
const searchInput = document.getElementById('activitySearchInput');
const searchBtn = document.getElementById('activitySearchBtn');

let currentCategory = 'ALL';
let searchKeyword = '';

function filterAndRender() {
    let filtered = activities;


    if (currentCategory !== 'ALL') {
        filtered = filtered.filter(item => item.category === currentCategory);
    }


    if (searchKeyword.trim() !== '') {
        const keyword = searchKeyword.toLowerCase().trim();
        filtered = filtered.filter(item => {
            return item.title.toLowerCase().includes(keyword) ||
                item.subtitle.toLowerCase().includes(keyword) ||
                item.description.toLowerCase().includes(keyword);
        });
    }

    renderActivities(filtered);
}

function renderActivities(items) {
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = `<div class="no-result">검색 결과와 일치하는 액티비티가 없습니다.</div>`;
        return;
    }

    items.forEach(item => {
        if (!item.display) return;

        const tags = item.tags.map(tag => `
            <span class="activity-tag">#${tag}</span>
        `).join('');

        grid.innerHTML += `
            <a class="activity-card" href="https://phoenixhnr.co.kr/static/jeju/activities/program?program=${item.program}">
                <div class="activity-card__thumb">
                    <img src="${item.thumbnail}" alt="${item.title}">
                </div>
                <div class="activity-card__content">
                    <!-- <div class="activity-card__top">
                        <span class="activity-category">${item.category}</span>
                    </div> -->
                    <h3>${item.title}</h3>
                    <p>${item.subtitle}</p>
                    <!-- <div class="activity-tags">
                        ${tags}
                    </div> -->
                </div>
            </a>
        `;
    });
}

const filterButtons = document.querySelectorAll('[data-filter]');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('is-active'));
        button.classList.add('is-active');

        currentCategory = button.dataset.filter;
        filterAndRender();
    });
});

searchBtn.addEventListener('click', () => {
    searchKeyword = searchInput.value;
    filterAndRender();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchKeyword = searchInput.value;
        filterAndRender();
    }
});

filterAndRender();
