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

    document.getElementById('activityDateData').innerHTML = currentActivity.date || 'Daily';
    document.getElementById('activityDateDuration').innerHTML = currentActivity.duration || '';
    document.getElementById('priceGeneral').innerHTML = currentActivity.priceGeneral || 'KRW 0';
    document.getElementById('priceGuest').innerHTML = currentActivity.priceGuest || 'KRW 0';

    document.getElementById('activityInquiries').innerHTML = `
    <p>Activities <a href="http://talk.naver.com/WBZZIZQ" target="_blank">Naver TalkTalk(http://talk.naver.com/WBZZIZQ)</a></p>
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
                <li>Your reservation may be confirmed or canceled depending on program availability after your booking request is received.</li>
                <li>After your reservation is confirmed, the program can be used once the participation fee has been paid in advance.</li>
                <li>This program is conducted in Korean only.</li><br />
                <div class="common-txt">
                    <p class="strong">[Cancellation & Refund Policy]</p>
                    <ul class="dot-bu-list">
                        <li>Cancellation 3 days before the activity: 100% refund</li>
                        <li>Cancellation 2 days before the activity: 50% refund</li>
                        <li>Cancellation from 1 day before the activity to the same day: No refund</li>
                    </ul>
                </div>
            `;
        }
    }

    const mobileStickyPrice = document.getElementById('mobileStickyPrice');
    if (mobileStickyPrice) {
        mobileStickyPrice.textContent = currentActivity.priceGuest || 'KRW 0';
    }

} else {
    alert('This activity does not exist');
    window.location.href = '/en/static/playcecamp/activities';
}
