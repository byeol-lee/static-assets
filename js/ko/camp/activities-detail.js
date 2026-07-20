const params = new URLSearchParams(window.location.search);
const program = params.get('program');

const currentActivity = activities.find(item => item.program === program);

if (currentActivity) {
    if (document.getElementById('breadcrumbTitle')) document.getElementById('breadcrumbTitle').textContent = currentActivity.title;
    if (document.getElementById('pageTitle')) document.getElementById('pageTitle').textContent = currentActivity.title;

    document.getElementById('activityTitle').textContent = currentActivity.title;
    document.getElementById('activitySubtitle').textContent = currentActivity.subtitle || '';

    const reserveBtn = document.getElementById('activityReserveBtn');
    if (reserveBtn) {
        reserveBtn.href = currentActivity.reservation || '';
    }

    const sliderList = document.getElementById('activitySliderList');
    if (sliderList) {
        let imagesHtml = '';
        if (Array.isArray(currentActivity.heroImage)) {
            currentActivity.heroImage.forEach(imgUrl => {
                imagesHtml += `<li class="slider-item" style="background-image: url('${imgUrl}');"></li>`;
            });
        } else if (currentActivity.heroImage) {
            imagesHtml = `<li class="slider-item" style="background-image: url('${currentActivity.heroImage}');"></li>`;
        }
        sliderList.innerHTML = imagesHtml;

        if (window.innerWidth <= 767) {
            const sliderContainer = sliderList.closest('.common-photo-slider');

            if (sliderContainer) {
                sliderContainer.classList.add('js-photo-slider');

                if (!sliderContainer.querySelector('.pagination')) {
                    const paginationDiv = document.createElement('div');
                    paginationDiv.className = 'pagination';

                    sliderContainer.appendChild(paginationDiv);
                }
            }
        }
        // =========================================================
    }

    document.getElementById('activityDescription').innerHTML = currentActivity.description;

    document.getElementById('activityDateData').textContent = currentActivity.date || '매일';
    document.getElementById('activityDateDuration').textContent = currentActivity.duration || '';
    document.getElementById('priceGeneral').innerHTML = currentActivity.priceGeneral || '0원';
    document.getElementById('priceGuest').innerHTML = currentActivity.priceGuest || '0원';

    document.getElementById('activityInquiries').innerHTML = `
    <p>액티비티 <a href="http://talk.naver.com/WBZZIZQ" target="_blank">네이버 톡톡(http://talk.naver.com/WBZZIZQ)</a></p>
    `;

    const locationEl = document.getElementById('activityInformation');
    if (locationEl) {
        locationEl.innerHTML = currentActivity.information || '';
    }

    const noticeListEl = document.getElementById('activityNotice');
    if (noticeListEl) {
        if (currentActivity.notice) {
            noticeListEl.innerHTML = currentActivity.notice;
        } else {
            noticeListEl.innerHTML = `
                <li>예약 접수 이후 프로그램 이용 가능 여부에 따라 예약 확정 또는 취소 처리될 수 있습니다.</li>
                <li>예약 확정 이후 사전 이용 요금 납부 시 프로그램 이용 가능합니다.</li>
                <li>본 프로그램은 한국어로만 진행됩니다.</li><br />
                <div class="common-txt">
                    <p class="strong">[취소/환불 규정]</p>
                    <ul class="dot-bu-list">
                        <li>이용 3일 전 취소: 100% 환불</li>
                        <li>이용 2일 전 취소: 50% 환불</li>
                        <li>이용 1일 전 ~ 당일 취소: 환불 불가</li>
                    </ul>
                </div>
            `;
        }
    }

    const mobileStickyPrice = document.getElementById('mobileStickyPrice');
    if (mobileStickyPrice) {
        mobileStickyPrice.textContent = currentActivity.priceGuest || '0원';
    }

} else {
    alert('존재하지 않는 액티비티입니다.');
    window.location.href = '/static/playcecamp/activities';
}
