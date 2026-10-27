$(document).ready(function () {

  let mainImgSrc = "https://phoenixhnr.co.kr/api/attach/view/event/120000046598/thumbs_p/";

  let cardsData = [
    {
      imgSrcs: [
        "https://phoenixhnr.co.kr/api/attach/view/event/140000046772/thumbs_p/",
        "https://phoenixhnr.co.kr/api/attach/view/event/110000047318/thumbs_p/",
        "https://phoenixhnr.co.kr/api/attach/view/event/140000046772/thumbs_p/",
        "https://phoenixhnr.co.kr/api/attach/view/event/110000047318/thumbs_p/"
      ],
      title: "",
      sub: "",
      notice: "",
      link: ""
    },
    {
      imgSrcs: ["https://phoenixhnr.co.kr/api/attach/view/event/110000047318/thumbs_p/"],
      title: "",
      sub: "",
      notice: "",
      link: ""
    }
  ];

  // 주중, 주말, 연휴, 공통 순서
  let stayGroupsData = [
    {
      stayCategory: "2박",
      priceNotice: "주중: 일~목 체크인, 주말: 금~토 체크인 입니다.",
      rooms: [
        {
          period: "08.01 ~ 08.31",
          room: "로얄",
          weekdayPrice: "340,000",
          weekdayLink: "#",
          weekendPrice: "420,000",
          weekendLink: "#",
          holidayPrice: "",
          holidayLink: "",
          commonPrice: "",
          commonLink: ""
        },
        {
          period: "08.01 ~ 08.31",
          room: "스카이 스탠다드 패밀리",
          weekdayPrice: "490,000",
          weekdayLink: "#link1",
          weekendPrice: "9,999,999",
          weekendLink: "#link2",
          holidayPrice: "",
          holidayLink: "",
          commonPrice: "",
          commonLink: ""
        }
      ]
    }
  ];

  // 숫자에 3자리마다 콤마를 찍어주는 헬퍼 함수
  function formatNumber(val) {
    if (!val) return '';
    const numbers = val.toString().replace(/[^0-9]/g, '');
    if (!numbers) return '';
    return Number(numbers).toLocaleString();
  }

  function renderCardForms() {
    const $container = $('#card-form-container');
    $container.empty();

    cardsData.forEach((card, index) => {
      const imgSrcs = (card.imgSrcs && card.imgSrcs.length > 0) ? card.imgSrcs : [""];
      card.imgSrcs = imgSrcs;

      const cardHtml = `
        <div class="card-item-form" data-index="${index}">
          <div class="card-item-header">
            <span class="card-item-title">카드 #${index + 1}</span>
            ${cardsData.length > 1 ? `<button type="button" class="btn-del-card" onclick="deleteCard(${index})">삭제</button>` : ''}
          </div>
          <div class="form-group card-images-form">
            <label>카드 이미지 (최대 4개, 1920×1080 권장)</label>
            ${imgSrcs.map((src, imageIndex) => `
              <div class="card-image-slot" style="display:flex;align-items:center;gap:8px;margin:8px 0;">
                <span style="min-width:58px;font-size:12px;">이미지 ${imageIndex + 1}</span>
                <input type="file" class="in-card-img" data-index="${index}" data-image-index="${imageIndex}" accept="image/*" style="min-width:0;flex:1;">
                <span class="file-name-display" style="font-size:11px;color:#333;margin-left:4px;display:inline-block;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${src && src.startsWith('data:') ? '업로드된 파일' : (src ? '기본 이미지' : '')}</span>
                ${imgSrcs.length > 1 ? `<button type="button" class="btn-del-card-image" data-index="${index}" data-image-index="${imageIndex}" style="flex-shrink:0;">삭제</button>` : ''}
              </div>`).join('')}
            ${(imgSrcs.length < 4) ? `<button type="button" class="btn-add-card-image" data-index="${index}">+ 이미지 추가</button>` : '<p style="font-size:12px;color:#888;margin:6px 0;">이미지는 최대 4개까지 등록할 수 있습니다.</p>'}
          </div>
          <div class="form-group">
            <label>컨텐츠 타이틀</label>
            <input type="text" class="in-card-title" data-index="${index}" value="${card.title}" placeholder="사계절 온수풀">
          </div>
          <div class="form-group">
            <label>서브 카피 (설명)</label>
            <textarea class="in-card-sub" data-index="${index}" placeholder="사계절 따뜻한 온수풀에서 제주 바다의 일몰을 감상하며 여유로운 휴식을 경험하세요.">${card.sub}</textarea>
          </div>
          <div class="form-group">
            <label>추가 안내 문구 (※ 기호 자동 붙음)</label>
            <textarea class="in-card-notice" data-index="${index}" placeholder="성수기 이용 불가&#10;주말 이용 시 추가 비용 발생">${card.notice || ''}</textarea>
          </div>
          <div class="form-group">
            <label>자세히 보기 버튼 링크 URL</label>
            <input type="text" class="in-card-link" data-index="${index}" value="${card.link || ''}" placeholder="https://...">
          </div>
        </div>
      `;
      $container.append(cardHtml);
    });

    if (cardsData.length >= 10) $('#btn-add-card').hide();
    else $('#btn-add-card').show();
  }

  function renderStayForms() {
    const $container = $('#stay-form-container');
    $container.empty();

    stayGroupsData.forEach((stayGroup, sIdx) => {
      let roomsHtml = '';
      stayGroup.rooms.forEach((room, rIdx) => {
        roomsHtml += `
          <div class="room-item-form" data-sidx="${sIdx}" data-ridx="${rIdx}">
            <div class="room-item-header">
              <span class="room-item-title">객실 항목 #${rIdx + 1}</span>
              ${stayGroup.rooms.length > 1 ? `<button type="button" class="btn-del-room" onclick="deleteRoom(${sIdx},${rIdx})">삭제</button>` : ''}
            </div>
            <div class="form-group">
              <label>기간</label>
              <input type="text" class="in-price-period" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${room.period || ''}" placeholder="예: 00.00 ~ 00.00">
            </div>
            <div class="form-group">
              <label>객실</label>
              <input type="text" class="in-price-room" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${room.room || ''}" placeholder="예: 로얄">
            </div>
            
            <!-- 주중 / 주말 / 연휴 / 공통 -->
            <div style="display:flex; gap:10px; margin-bottom: 8px;">
              <div class="form-group" style="flex:1;">
                <label>주중 요금</label>
                <input type="text" class="in-price-weekday" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${formatNumber(room.weekdayPrice)}" placeholder="예: 340,000">
              </div>
              <div class="form-group" style="flex:1;">
                <label>주중 예약 URL</label>
                <input type="text" class="in-link-weekday" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${room.weekdayLink || ''}" placeholder="https://...">
              </div>
            </div>

            <div style="display:flex; gap:10px; margin-bottom: 8px;">
              <div class="form-group" style="flex:1;">
                <label>주말 요금</label>
                <input type="text" class="in-price-weekend" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${formatNumber(room.weekendPrice)}" placeholder="예: 420,000">
              </div>
              <div class="form-group" style="flex:1;">
                <label>주말 예약 URL</label>
                <input type="text" class="in-link-weekend" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${room.weekendLink || ''}" placeholder="https://...">
              </div>
            </div>

            <div style="display:flex; gap:10px; margin-bottom: 8px;">
              <div class="form-group" style="flex:1;">
                <label>연휴 요금</label>
                <input type="text" class="in-price-holiday" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${formatNumber(room.holidayPrice)}" placeholder="예: 500,000">
              </div>
              <div class="form-group" style="flex:1;">
                <label>연휴 예약 URL</label>
                <input type="text" class="in-link-holiday" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${room.holidayLink || ''}" placeholder="https://...">
              </div>
            </div>

            <div style="display:flex; gap:10px;">
              <div class="form-group" style="flex:1;">
                <label>공통 요금</label>
                <input type="text" class="in-price-common" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${formatNumber(room.commonPrice)}" placeholder="예: 300,000">
              </div>
              <div class="form-group" style="flex:1;">
                <label>공통 예약 URL</label>
                <input type="text" class="in-link-common" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${room.commonLink || ''}" placeholder="https://...">
              </div>
            </div>

          </div>
        `;
      });

      const stayHtml = `
        <div class="stay-group-form" data-sidx="${sIdx}">
          <div class="stay-group-header">
            <span class="stay-group-title">요금 항목 #${sIdx + 1}</span>
            ${stayGroupsData.length > 1 ? `<button type="button" class="btn-del-stay" onclick="deleteStay(${sIdx})">박수 그룹 삭제</button>` : ''}
          </div>
          <div class="form-group">
            <label>박수 (선택 - 미입력 시 뱃지 미노출)</label>
            <input type="text" class="in-price-stay" data-sidx="${sIdx}" value="${stayGroup.stayCategory}" placeholder="예: 1박">
          </div>
          <div class="room-container">
            ${roomsHtml}
          </div>
          <button type="button" class="btn-add-room" onclick="addRoom(${sIdx})">+ 객실 추가</button>
          
          <div class="form-group" style="margin-top: 15px;">
            <label>요금표 안내 문구 (※ 기호 자동 붙음)</label>
            <textarea class="in-price-notice" data-sidx="${sIdx}" style="height: 60px;" placeholder="주중: 일~목 체크인, 주말: 금~토 체크인 입니다.">${stayGroup.priceNotice || ''}</textarea>
          </div>
        </div>
      `;
      $container.append(stayHtml);
    });
  }

  $('#btn-add-card').on('click', function () {
    if (cardsData.length < 10) {
      cardsData.push({ imgSrcs: ["https://phoenixhnr.co.kr/api/attach/view/event/140000046772/thumbs_p/"], title: "", sub: "", notice: "", link: "" });
      renderCardForms();
      renderTemplate();
    }
  });

  window.deleteCard = function (index) {
    if (cardsData.length > 1) {
      cardsData.splice(index, 1);
      renderCardForms();
      renderTemplate();
    }
  };

  $('#btn-add-stay').on('click', function () {
    stayGroupsData.push({
      stayCategory: "",
      priceNotice: "",
      rooms: [
        { period: "", room: "", weekdayPrice: "", weekdayLink: "", weekendPrice: "", weekendLink: "", holidayPrice: "", holidayLink: "", commonPrice: "", commonLink: "" }
      ]
    });
    renderStayForms();
    renderTemplate();
  });

  window.deleteStay = function (sIdx) {
    if (stayGroupsData.length > 1) {
      stayGroupsData.splice(sIdx, 1);
      renderStayForms();
      renderTemplate();
    }
  };

  window.addRoom = function (sIdx) {
    stayGroupsData[sIdx].rooms.push({ period: "", room: "", weekdayPrice: "", weekdayLink: "", weekendPrice: "", weekendLink: "", holidayPrice: "", holidayLink: "", commonPrice: "", commonLink: "" });
    renderStayForms();
    renderTemplate();
  };

  window.deleteRoom = function (sIdx, rIdx) {
    if (stayGroupsData[sIdx].rooms.length > 1) {
      stayGroupsData[sIdx].rooms.splice(rIdx, 1);
      renderStayForms();
      renderTemplate();
    }
  };

  $(document).on('input propertychange change', '.in-card-title, .in-card-sub, .in-card-notice, .in-card-link', function () {
    const idx = $(this).data('index');
    const $parent = $(this).closest('.card-item-form');
    cardsData[idx].title = $parent.find('.in-card-title').val();
    cardsData[idx].sub = $parent.find('.in-card-sub').val();
    cardsData[idx].notice = $parent.find('.in-card-notice').val();
    cardsData[idx].link = $parent.find('.in-card-link').val();
    renderTemplate();
  });

  $(document).on('input propertychange change', '.in-price-stay, .in-price-notice', function () {
    const sIdx = $(this).data('sidx');
    const $parent = $(this).closest('.stay-group-form');
    stayGroupsData[sIdx].stayCategory = $parent.find('.in-price-stay').val();
    stayGroupsData[sIdx].priceNotice = $parent.find('.in-price-notice').val();
    renderTemplate();
  });

  // 요금 입력 시 실시간으로 콤마 포맷팅 적용
  $(document).on('input', '.in-price-weekday, .in-price-weekend, .in-price-holiday, .in-price-common', function () {
    const $this = $(this);
    const originalVal = $this.val();
    const formatted = formatNumber(originalVal);

    if (originalVal !== formatted) {
      $this.val(formatted);
    }

    const sIdx = $this.data('sidx');
    const rIdx = $this.data('ridx');
    const $parent = $this.closest('.room-item-form');

    stayGroupsData[sIdx].rooms[rIdx].weekdayPrice = $parent.find('.in-price-weekday').val();
    stayGroupsData[sIdx].rooms[rIdx].weekendPrice = $parent.find('.in-price-weekend').val();
    stayGroupsData[sIdx].rooms[rIdx].holidayPrice = $parent.find('.in-price-holiday').val();
    stayGroupsData[sIdx].rooms[rIdx].commonPrice = $parent.find('.in-price-common').val();

    renderTemplate();
  });

  $(document).on('input propertychange change', '.in-price-period, .in-price-room, .in-link-weekday, .in-link-weekend, .in-link-holiday, .in-link-common', function () {
    const sIdx = $(this).data('sidx');
    const rIdx = $(this).data('ridx');
    const $parent = $(this).closest('.room-item-form');

    stayGroupsData[sIdx].rooms[rIdx].period = $parent.find('.in-price-period').val();
    stayGroupsData[sIdx].rooms[rIdx].room = $parent.find('.in-price-room').val();

    stayGroupsData[sIdx].rooms[rIdx].weekdayLink = $parent.find('.in-link-weekday').val();
    stayGroupsData[sIdx].rooms[rIdx].weekendLink = $parent.find('.in-link-weekend').val();
    stayGroupsData[sIdx].rooms[rIdx].holidayLink = $parent.find('.in-link-holiday').val();
    stayGroupsData[sIdx].rooms[rIdx].commonLink = $parent.find('.in-link-common').val();

    renderTemplate();
  });

  // 카드 이미지: 슬롯별로 한 장씩 등록/교체 (최대 4장)
  $(document).on('change', '.in-card-img', function (e) {
    const idx = Number($(this).data('index'));
    const imageIdx = Number($(this).data('image-index'));
    const file = (e.target.files || [])[0];
    if (!file || !file.type.startsWith('image/')) return;

    const $input = $(this);
    let $nameSpan = $input.siblings('.file-name-display');
    if ($nameSpan.length === 0) {
      $nameSpan = $('<span class="file-name-display" style="font-size:11px;color:#333;margin-left:4px;display:inline-block;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span>');
      $input.after($nameSpan);
    }
    $nameSpan.text(file.name);

    const reader = new FileReader();
    reader.onload = function (evt) {
      if (!Array.isArray(cardsData[idx].imgSrcs)) cardsData[idx].imgSrcs = [];
      cardsData[idx].imgSrcs[imageIdx] = evt.target.result;
      renderTemplate();
    };
    reader.readAsDataURL(file);
  });

  $(document).on('click', '.btn-add-card-image', function () {
    const idx = Number($(this).data('index'));
    if (!Array.isArray(cardsData[idx].imgSrcs)) cardsData[idx].imgSrcs = [];
    if (cardsData[idx].imgSrcs.length >= 4) return;
    cardsData[idx].imgSrcs.push('');
    renderCardForms();
    renderTemplate();
  });

  $(document).on('click', '.btn-del-card-image', function () {
    const idx = Number($(this).data('index'));
    const imageIdx = Number($(this).data('image-index'));
    if (!Array.isArray(cardsData[idx].imgSrcs) || cardsData[idx].imgSrcs.length <= 1) return;
    cardsData[idx].imgSrcs.splice(imageIdx, 1);
    renderCardForms();
    renderTemplate();
  });

  $('#in-main-img').on('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const $input = $(this);
      let $nameSpan = $input.siblings('.file-name-display');
      if ($nameSpan.length === 0) {
        $nameSpan = $('<span class="file-name-display" style="font-size:11px;color:#333;margin-left:6px;display:inline-block;"></span>');
        $input.after($nameSpan);
      }
      $nameSpan.text(file.name);

      const reader = new FileReader();
      reader.onload = function (evt) {
        mainImgSrc = evt.target.result;
        renderTemplate();
      };
      reader.readAsDataURL(file);
    }
  });

  $('input:not(.in-card-title, .in-card-link, .in-price-stay, .in-price-notice, .in-price-period, .in-price-room, .in-price-weekday, .in-link-weekday, .in-price-weekend, .in-link-weekend, .in-price-holiday, .in-link-holiday, .in-price-common, .in-link-common), textarea:not(.in-card-sub, .in-card-notice, .in-price-notice)').on('input propertychange change', function () {
    renderTemplate();
  });

  function getValOrPlaceholder(selector) {
    const $el = $(selector);
    const val = $el.val();
    return (val && val.trim() !== '') ? val : ($el.attr('placeholder') || '');
  }

  function goToSlide($slider, nextIndex) {
    const $track = $slider.find('.tpl-card-track');
    const $dots = $slider.find('.tpl-slider-dot');
    const totalSlides = $track.find('.tpl-card-slide').length;
    
    if (nextIndex < 0) nextIndex = totalSlides - 1;
    if (nextIndex >= totalSlides) nextIndex = 0;

    $slider.data('current-slide', nextIndex);
    $track.css('transform', 'translateX(-' + (nextIndex * 100) + '%)');
    $dots.removeClass('is-active').eq(nextIndex).addClass('is-active');
  }

  function initSliders($scope) {
    $scope.find('.tpl-card-slider').each(function () {
      const $slider = $(this);
      if ($slider.data('auto-init')) return;
      $slider.data('auto-init', true);
      $slider.data('current-slide', 0);

      const $slides = $slider.find('.tpl-card-slide');
      if ($slides.length > 1) {
        const timer = setInterval(function () {
          if (!document.body.contains($slider[0])) {
            clearInterval(timer);
            return;
          }
          const current = $slider.data('current-slide') || 0;
          goToSlide($slider, current + 1);
        }, 4000);

        let startX = 0;
        $slider.off('touchstart touchend').on('touchstart', function (e) {
          startX = e.originalEvent.touches[0].clientX;
        });
        $slider.on('touchend', function (e) {
          const endX = e.originalEvent.changedTouches[0].clientX;
          const diff = startX - endX;
          if (Math.abs(diff) > 50) {
            const current = $slider.data('current-slide') || 0;
            goToSlide($slider, diff > 0 ? current + 1 : current - 1);
          }
        });
      }
    });
  }

  function renderTemplate() {
    const selectedPropertyVal = $('input[name="in-property"]:checked').val() || 'PHOENIX HOTELS & RESORT';
    const subTitle = selectedPropertyVal;

    let badgeBgColor = '#f7441b';
    if (selectedPropertyVal === 'PHOENIX PARK') {
      badgeBgColor = '#167a47';
    } else if (selectedPropertyVal === 'PHOENIX ISLAND') {
      badgeBgColor = '#0079c3';
    } else if (selectedPropertyVal === 'PLAYCE CAMP by PHOENIX') {
      badgeBgColor = '#e6007e';
    }

    const mainTitle = getValOrPlaceholder('#in-main-title');
    const mainBadge = ($('#in-main-badge').val() || '').trim();
    const mainDesc = getValOrPlaceholder('#in-main-desc').replace(/\n/g, '<br>');
    const infoReservePeriod = getValOrPlaceholder('#in-info-reserve-period');
    const infoStayPeriod = getValOrPlaceholder('#in-info-stay-period');
    const ctaTitle = getValOrPlaceholder('#in-cta-title');
    const ctaDesc = getValOrPlaceholder('#in-cta-desc').replace(/\n/g, '<br>');

    let cardsHtml = '';
    cardsData.forEach((card, idx) => {
      const title = card.title.trim() !== '' ? card.title : '사계절 온수풀';
      const rawSub = card.sub.trim() !== '' ? card.sub : '사계절 따뜻한 온수풀에서 제주 바다의 일몰을 감상하며 여유로운 휴식을 경험하세요.';

      let noticeHtml = '';
      if (card.notice && card.notice.trim() !== '') {
        const lines = card.notice.trim().split('\n');
        const noticeLines = lines.map(line => {
          const cleanLine = line.trim().replace(/^※\s*/, '');
          return cleanLine ? `<p class="tpl-card-notice-line">${cleanLine}</p>` : '';
        }).join('');
        noticeHtml = `<div class="tpl-card-notice">${noticeLines}</div>`;
      }

      let btnHtml = '';
      if (card.link && card.link.trim() !== '') {
        btnHtml = `
        <div class="tpl-card-btn-wrap">
          <a href="${card.link.trim()}" class="tpl-card-btn" target="_blank">자세히 보기</a>
        </div>`;
      }

      const cardImages = (card.imgSrcs || []).filter(src => typeof src === 'string' && src.trim() !== '');
      if (!cardImages.length) cardImages.push("https://phoenixhnr.co.kr/api/attach/view/event/140000046772/thumbs_p/");
      
      const slideImagesHtml = cardImages.map((src, imageIdx) => `<img src="${src}" class="tpl-card-img tpl-card-slide" data-slide="${imageIdx}" alt="Card Image ${idx + 1}-${imageIdx + 1}">`).join('');
      const sliderTrackHtml = `<div class="tpl-card-track" style="transform: translateX(0%);">${slideImagesHtml}</div>`;

      const sliderControls = cardImages.length > 1 ? `<div class="tpl-slider-dots">${cardImages.map((_, dotIdx) => `<button type="button" class="tpl-slider-dot ${dotIdx === 0 ? 'is-active' : ''}" data-slide-to="${dotIdx}" aria-label="${dotIdx + 1}번째 이미지"></button>`).join('')}</div>` : '';

      cardsHtml += `
      <div class="tpl-card-item">
        <div class="tpl-card-slider" data-card-index="${idx}">${sliderTrackHtml}${sliderControls}</div>
        <div class="tpl-card-copy">
        <div class="tpl-card-title">${title}</div>
        <div class="tpl-card-sub">${rawSub.replace(/\n/g, '<br>')}</div>
        ${noticeHtml}
        ${btnHtml}
        </div>
      </div>`;
    });

    const rawBullets = getValOrPlaceholder('#in-bullets');
    let bulletHtml = '';
    rawBullets.split('\n').forEach(line => {
      if (line.trim() !== '') bulletHtml += `<li>${line}</li>`;
    });

    let minPriceNum = Infinity;
    let sheetContentHtml = '';
    let globalAccCount = 0;

    stayGroupsData.forEach(group => {
      const stayBadgeText = group.stayCategory.trim();
      const rawPriceNotice = (group.priceNotice !== undefined && group.priceNotice.trim() !== '') ? group.priceNotice : '';

      sheetContentHtml += `<div class="tpl-stay-group">`;

      if (stayBadgeText !== "") {
        sheetContentHtml += `<div class="tpl-stay-badge">${stayBadgeText}</div>`;
      }

      let priceNoticeHtml = '';
      if (rawPriceNotice !== '') {
        const lines = rawPriceNotice.trim().split('\n');
        const noticeLines = lines.map(line => {
          const cleanLine = line.trim().replace(/^※\s*/, '');
          return cleanLine ? `<p class="tpl-sheet-notice-line">※ ${cleanLine}</p>` : '';
        }).join('');
        priceNoticeHtml = `<div class="tpl-sheet-notice">${noticeLines}</div>`;
      }

      const periodMap = {};
      group.rooms.forEach(r => {
        const periodKey = r.period.trim() || '전 일정';
        if (!periodMap[periodKey]) periodMap[periodKey] = [];
        periodMap[periodKey].push(r);

        ['weekdayPrice', 'weekendPrice', 'holidayPrice', 'commonPrice'].forEach(pKey => {
          if (r[pKey] && r[pKey].trim() !== '') {
            const num = parseInt(r[pKey].replace(/[^0-9]/g, '')) || Infinity;
            if (num < minPriceNum) minPriceNum = num;
          }
        });
      });

      Object.keys(periodMap).forEach(period => {
        const isActive = globalAccCount === 0 ? 'active' : '';
        sheetContentHtml += `
        <div class="tpl-price-group ${isActive}">
          <div class="tpl-price-period-acc">
            <span>${period}</span>
            <span class="acc-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
              </svg>
            </span>
          </div>
          <div class="tpl-price-body">`;

        periodMap[period].forEach(item => {
          const roomName = item.room.trim() || '기본 객실';

          const activeEntries = [];
          const rawTypes = [
            { label: '주중', price: item.weekdayPrice, link: item.weekdayLink },
            { label: '주말', price: item.weekendPrice, link: item.weekendLink },
            { label: '연휴', price: item.holidayPrice, link: item.holidayLink },
            { label: '공통', price: item.commonPrice, link: item.commonLink }
          ];

          rawTypes.forEach(t => {
            if (t.price && t.price.trim() !== '') {
              const valStr = t.price.trim();
              activeEntries.push({
                label: t.label,
                val: valStr + (valStr.includes('원') ? '' : '원'),
                link: (t.link && t.link.trim() !== '') ? t.link.trim() : '#'
              });
            }
          });

          const uniqueLinks = [...new Set(activeEntries.map(e => e.link))];
          const isMerged = activeEntries.length > 1 && uniqueLinks.length === 1;

          if (isMerged) {
            sheetContentHtml += `
            <div class="tpl-room-card merged-card">
              <div class="tpl-room-title">${roomName}</div>
              <div class="tpl-room-prices-container">
                <div class="tpl-price-sub-rows">`;

            activeEntries.forEach(entry => {
              sheetContentHtml += `
                  <div class="tpl-price-sub-row">
                    <span class="tpl-room-sub-label">${entry.label}</span>
                    <span class="tpl-room-val">${entry.val}</span>
                  </div>`;
            });

            sheetContentHtml += `
                </div>
                <a href="${uniqueLinks[0]}" class="tpl-btn-reserve-sm" target="_blank">예약하기</a>
              </div>
            </div>`;
          } else {
            sheetContentHtml += `
            <div class="tpl-room-card">
              <div class="tpl-room-title">${roomName}</div>
              <div class="tpl-room-prices-container">`;

            activeEntries.forEach(entry => {
              sheetContentHtml += `
                <div class="tpl-price-sub-row">
                  <span class="tpl-room-sub-label">${entry.label}</span>
                  <span class="tpl-room-val">${entry.val}</span>
                  <a href="${entry.link}" class="tpl-btn-reserve-sm" target="_blank">예약하기</a>
                </div>`;
            });

            sheetContentHtml += `
              </div>
            </div>`;
          }
        });

        sheetContentHtml += `
          </div>
        </div>`;
        globalAccCount++;
      });

      sheetContentHtml += `${priceNoticeHtml}</div>`;
    });

    const minPriceDisplay = (minPriceNum !== Infinity) ? minPriceNum.toLocaleString() + '원 ~' : '0원 ~';

    const generatedHTML = `
<div class="tpl-wrap">
  <div class="tpl-hero">
    <img src="${mainImgSrc}" class="tpl-img" alt="Main Image">
    ${mainBadge ? `<span class="tpl-main-badge" style="background:${badgeBgColor};">${mainBadge.replace(/\n/g, '<br>')}</span>` : ''}
  </div>
  
  <div class="tpl-content">
    <div class="tpl-sub-title">${subTitle}</div>
    <div class="tpl-title">${mainTitle}</div>
    <div class="tpl-desc">${mainDesc}</div>
    
    <div class="tpl-info-list">
      <div class="tpl-info-item">
        <div class="tpl-info-label">예약 기간</div>
        <div class="tpl-info-val">${infoReservePeriod}</div>
      </div>
      <div class="tpl-info-item">
        <div class="tpl-info-label">투숙 기간</div>
        <div class="tpl-info-val">${infoStayPeriod}</div>
      </div>
    </div>

    <!-- CTA BOX -->
    <div class="tpl-cta-box">
      <div class="tpl-sub-title">BENEFITS</div>
      <div class="tpl-cta-title">${ctaTitle}</div>
      <div class="tpl-cta-desc">${ctaDesc}</div>
    </div>

    <!-- Content Cards -->
    <div class="tpl-card-list">
      ${cardsHtml}
    </div>

    <!-- Bullet Info -->
    <div class="tpl-bullet-title">이용 안내</div>
    <ul class="tpl-bullet-list">
      ${bulletHtml}
    </ul>

    <!-- 공통 고정 영역: 취소/변경 수수료 안내 -->
    <div class="tpl-bullet-title">취소/변경 수수료 안내</div>
    <ul class="tpl-bullet-list">
      <li>비수기: 이용일 기준 2일 전까지 수수료 없이 취소/변경 가능<br />(1일 전: 50%, 이용일/No-Show: 100% 수수료 발생)</li>
      <li>성수기: 이용일 기준 7일 전까지 수수료 없이 취소/변경 가능<br />(6 ~ 4일 전: 10%, 3 ~ 2일 전: 20%, 1일 전: 50%, 이용일/No-Show: 100% 수수료 발생)</li>
      <li>객실 패키지 세부 구성 부분 환불 불가</li>
    </ul>
  </div>

  <!-- 스티키 하단 예약 바 -->
  <div class="tpl-sticky-bar">
    <div class="tpl-sticky-price">
      <span class="tpl-sticky-val">${minPriceDisplay}</span>
    </div>
    <button type="button" class="tpl-sticky-btn" id="btn-open-sheet">자세히 보기</button>
  </div>

  <!-- 박수 그룹화 & 아코디언 바텀 시트 팝업 -->
  <div class="tpl-bottom-sheet-bg" id="sheet-bg"></div>
  <div class="tpl-bottom-sheet" id="bottom-sheet">
    <div class="tpl-sheet-handle"></div>
    <div class="tpl-sheet-header">
      <div class="tpl-sheet-title">이용 요금</div>
      <button type="button" class="tpl-sheet-close" id="btn-close-sheet" aria-label="닫기">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
        </svg>
      </button>
    </div>
    <div class="tpl-sheet-body">
      ${sheetContentHtml}
    </div>
  </div>
</div>
`.trim();

    const $renderArea = $('#preview-render');
    $renderArea.html(generatedHTML);
    initSliders($renderArea);

    const fullSourceCode = `
<link rel="stylesheet" href="package-renewal-cms.css" />
${generatedHTML}
<script src="package-renewal-template.js"></script>
    `.trim();

    $('#code-text').text(fullSourceCode);
  }

  // 미리보기 화면 동작 인터랙션
  $(document).on('click', '#btn-open-sheet', function () {
    $('#sheet-bg').addClass('active');
    $('#bottom-sheet').addClass('active');
  });

  $(document).on('click', '#btn-close-sheet, #sheet-bg', function () {
    $('#sheet-bg').removeClass('active');
    $('#bottom-sheet').removeClass('active');
  });

  $(document).on('click', '.tpl-price-period-acc', function () {
    $(this).closest('.tpl-price-group').toggleClass('active');
  });

  $(document).on('click', '.tpl-slider-dot', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const $slider = $(this).closest('.tpl-card-slider');
    const next = Number($(this).attr('data-slide-to'));
    goToSlide($slider, next);
  });

  renderCardForms();
  renderStayForms();
  renderTemplate();

  $('#btn-toggle-code').on('click', function () {
    $('#code-output').slideToggle();
  });

  $('#btn-copy').on('click', function () {
    const code = $('#code-text').text();
    navigator.clipboard.writeText(code).then(function () {
      alert('전체 HTML 소스가 복사되었습니다.');
    });
  });

});

$(document).on('click', '.btn-device-size', function () {
  const targetWidth = $(this).attr('data-width');
  $('#mobile-frame-container').css('width', targetWidth);
});