$(document).ready(function () {

    let mainImgSrc = "https://phoenixhnr.co.kr/api/attach/view/event/120000046598/thumbs_p/";

    let cardsData = [
        {
            imgSrcs: [""],
            title: "",
            sub: "",
            notice: "",
            link: ""
        },
        // {
        //     imgSrcs: ["https://phoenixhnr.co.kr/api/attach/view/event/110000047318/thumbs_p/"],
        //     title: "",
        //     sub: "",
        //     notice: "",
        //     link: ""
        // }
    ];

    let stayGroupsData = [
        {
            stayCategory: "",
            rooms: [
                {
                    period: "0000.00.00 - 0000.00.00",
                    room: "",
                    weekdayPrice: "9,999,999",
                    weekdayLink: "",
                    weekendPrice: "",
                    weekendLink: "",
                    holidayPrice: "",
                    holidayLink: "",
                    commonPrice: "",
                    commonLink: ""
                }
            ],
            priceNotice: ""
        }
    ];

    function formatNumber(val) {
        if (!val) return '';
        const numbers = val.toString().replace(/[^0-9]/g, '');
        if (!numbers) return '';
        return Number(numbers).toLocaleString();
    }

    const roomOptionsByProperty = {
        'PHOENIX PARK': [
            '스카이 스탠다드', '스카이 스위트', '스카이 로얄', '스카이 로얄 스위트',
            '스카이 스탠다드 패밀리', '스카이 스위트 패밀리', '스카이 스위트 벙커',
            '카카오프렌즈 스카이 스탠다드', '카카오프렌즈 스카이 스위트',
            '스탠다드', '스위트', '로얄', '로얄 스위트',
            '수페리어', '수페리어 발코니', '가누다 힐링 스위트'
        ],
        'PHOENIX ISLAND': ['로얄', '로얄 스위트', '힐리우스'],
        'PLAYCE CAMP by PHOENIX': ['스탠다드', '스탠다드 +', '디럭스', '로프트', '듀플렉스 I', '듀플렉스 II', '듀플렉스 +', '펜트하우스']
    };

    function getRoomOptions(property, selected) {
        const options = roomOptionsByProperty[property] || [];
        let html = '<option value="">객실 선택</option>';
        options.forEach(option => {
            const value = String(option);
            html += `<option value="${value}" ${value === selected ? 'selected' : ''}>${value}</option>`;
        });
        return html;
    }

    function resolveReservationHref(value) {
        const input = String(value || '').trim();
        if (/^https?:\/\//i.test(input)) {
            try {
                const parsed = new URL(input);
                if ((parsed.protocol === 'https:' || parsed.protocol === 'http:') && parsed.hostname.includes('.') && !/\s/.test(input)) return input;
            } catch (error) { /* 유효하지 않은 URL */ }
        }
        const digits = input.replace(/\D/g, '');
        if (/^\+?[0-9()\-\s]+$/.test(input) && digits.length >= 8 && digits.length <= 15) {
            return 'tel:' + (input.trim().startsWith('+') ? '+' : '') + digits;
        }
        return '';
    }

    function sanitizeReservationInput(value) {
        return String(value || '').replace(/[^a-zA-Z0-9:/?&=#._%+~@!$'()*,-]/g, '').slice(0, 500);
    }

    function dateToDisplay(value) {
        return value ? value.replace(/-/g, '.') : '';
    }

    function displayToDate(value) {
        const match = String(value || '').match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
        return match ? `${match[1]}-${match[2]}-${match[3]}` : '';
    }

    function dateRangeToDisplay(start, end) {
        if (!start || !end) return '';
        const startText = dateToDisplay(start);
        const endText = dateToDisplay(end);
        return `${startText} - ${endText}`;
    }

    function rangeEndToDate(startText, endText) {
        const fullEnd = displayToDate(endText);
        if (fullEnd) return fullEnd;
        const startYear = String(startText || '').slice(0, 4);
        return startYear && /^\d{2}\.\d{2}$/.test(String(endText || ''))
            ? displayToDate(`${startYear}.${endText}`)
            : '';
    }

    function syncDateRangeControl($range, value) {
        const parts = String(value || '').split(' - ');
        const start = displayToDate(parts[0]);
        const end = parts.length > 1
            ? rangeEndToDate(parts[0], parts[1])
            : '';

        $range.find('.date-range-start').val(start);

        $range.find('.date-range-end')
            .val(end)
            .attr('min', start || '');
    }

    function dateRangeMarkup(displayId, value, extraClass = '') {
        const parts = String(value || '').split(' - ');
        const start = displayToDate(parts[0]);
        const end = parts.length > 1
            ? rangeEndToDate(parts[0], parts[1])
            : '';

        return `
            <div class="date-range-control ${extraClass}">
                <input
                    type="hidden"
                    id="${displayId}"
                    class="date-range-display"
                    value="${start && end
                        ? dateRangeToDisplay(start, end)
                        : (value || '')}"
                >

                <div class="date-range-pickers">
                    <div
                        class="date-picker-field"
                        role="button"
                        tabindex="0"
                        aria-haspopup="dialog"
                        aria-label="시작일 달력 열기"
                    >
                        <span class="date-picker-caption">시작일</span>
                        <input
                            type="date"
                            class="date-range-start"
                            value="${start}"
                            aria-label="시작일 선택"
                        >
                    </div>

                    <span class="date-range-separator">-</span>

                    <div
                        class="date-picker-field"
                        role="button"
                        tabindex="0"
                        aria-haspopup="dialog"
                        aria-label="종료일 달력 열기"
                    >
                        <span class="date-picker-caption">종료일</span>
                        <input
                            type="date"
                            class="date-range-end"
                            value="${end}"
                            min="${start}"
                            aria-label="종료일 선택"
                        >
                    </div>
                </div>
            </div>
        `;
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
            <span class="card-item-title">상품 구성 상세 #${index + 1}</span>
            ${cardsData.length > 1 ? `<button type="button" class="btn-del-card" onclick="deleteCard(${index})">삭제</button>` : ''}
          </div>
          <div class="form-group card-images-form">
            <label>이미지(960×540)</label>
            ${imgSrcs.map((src, imageIndex) => `
              <div class="card-image-slot" style="display:flex;align-items:center;gap:8px;margin:8px 0;">
                <span style="min-width:58px;font-size:12px;">이미지 ${imageIndex + 1}</span>
                <label for="in-card-img-${index}-${imageIndex}" class="custom-file-btn">파일 선택</label>
                <input type="file" id="in-card-img-${index}-${imageIndex}" class="in-card-img" data-index="${index}" data-image-index="${imageIndex}" accept="image/*" style="display:none;">
                <span class="file-name-display" style="font-size:11px;color:#333;margin-left:4px;display:inline-block;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${src && src.startsWith('data:') ? '업로드된 파일' : (src ? '기본 이미지' : '')}</span>
                ${imgSrcs.length > 1 ? `<button type="button" class="btn-del-card-image" data-index="${index}" data-image-index="${imageIndex}" style="flex-shrink:0;">삭제</button>` : ''}
              </div>`).join('')}
            ${(imgSrcs.length < 4) ? `<button type="button" class="btn-add-card-image custom-file-btn" data-index="${index}">+ 이미지 추가</button>` : '<p style="font-size:12px;color:#666;margin:8px 0;">※ 최대 4개 등록 가능</p>'}
          </div>
          <div class="form-group">
            <label>상품 구성명</label>
            <input type="text" class="in-card-title" data-index="${index}" value="${card.title}" placeholder="상품 구성명">
          </div>
          <div class="form-group">
            <label>상품 구성 상세</label>
            <textarea class="in-card-sub" data-index="${index}" placeholder="상품 구성 상세">${card.sub}</textarea>
          </div>
          <div class="form-group">
            <label>추가 안내(※ 기호 자동)</label>
            <textarea class="in-card-notice" data-index="${index}" placeholder="성수기 이용 불가&#10;주말 이용 시 추가 비용 발생">${card.notice || ''}</textarea>
          </div>
          <div class="form-group">
            <label>자세히 보기 URL</label>
            <input type="text" class="in-card-link" data-index="${index}" value="${card.link || ''}" placeholder="https://... 또는 02-1234-5678" inputmode="url">
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
              ${stayGroup.rooms.length > 1 ? `<button type="button" class="btn-del-room" onclick="deleteRoom(${sIdx},${rIdx})">객실 삭제</button>` : ''}
            </div>
            <div class="form-group">
              <label>기간</label>
              ${dateRangeMarkup('', room.period || '', 'room-date-range').replace('date-range-display', `date-range-display in-price-period" data-sidx="${sIdx}" data-ridx="${rIdx}`).replace('id="" ', '')}
            </div>
            <div class="form-group">
              <label>객실</label>
              <select class="in-price-room" data-sidx="${sIdx}" data-ridx="${rIdx}">
                ${getRoomOptions($('#in-property').val(), room.room || '')}
              </select>
            </div>
            
            <!-- 주중 / 주말 / 연휴 / 공통 -->
            <div style="display:flex; gap:8px;">
              <div class="form-group" style="flex:1;">
                <label>주중</label>
                <input type="text" class="in-price-weekday" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${formatNumber(room.weekdayPrice)}" placeholder="예: 340,000">
              </div>
              <div class="form-group" style="flex:1;">
                <label>주중 예약 URL/유선</label>
                <input type="text" class="in-link-weekday reservation-input" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${room.weekdayLink || ''}" placeholder="https://... 또는 02-1234-5678" inputmode="url">
              </div>
            </div>

            <div style="display:flex; gap:8px;">
              <div class="form-group" style="flex:1;">
                <label>주말</label>
                <input type="text" class="in-price-weekend" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${formatNumber(room.weekendPrice)}" placeholder="예: 420,000">
              </div>
              <div class="form-group" style="flex:1;">
                <label>주말 예약 URL/유선</label>
                <input type="text" class="in-link-weekend reservation-input" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${room.weekendLink || ''}" placeholder="https://... 또는 02-1234-5678" inputmode="url">
              </div>
            </div>

            <div style="display:flex; gap:8px;">
              <div class="form-group" style="flex:1;">
                <label>연휴</label>
                <input type="text" class="in-price-holiday" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${formatNumber(room.holidayPrice)}" placeholder="예: 500,000">
              </div>
              <div class="form-group" style="flex:1;">
                <label>연휴 예약 URL/유선</label>
                <input type="text" class="in-link-holiday reservation-input" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${room.holidayLink || ''}" placeholder="https://... 또는 02-1234-5678" inputmode="url">
              </div>
            </div>

            <div style="display:flex; gap:8px;">
              <div class="form-group" style="flex:1;">
                <label>공통</label>
                <input type="text" class="in-price-common" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${formatNumber(room.commonPrice)}" placeholder="예: 300,000">
              </div>
              <div class="form-group" style="flex:1;">
                <label>공통 예약 URL/유선</label>
                <input type="text" class="in-link-common reservation-input" data-sidx="${sIdx}" data-ridx="${rIdx}" value="${room.commonLink || ''}" placeholder="https://...">
              </div>
            </div>

          </div>
        `;
            });

            const stayHtml = `
        <div class="stay-group-form" data-sidx="${sIdx}">
          <div class="stay-group-header">
            <span class="stay-group-title">이용 요금 #${sIdx + 1}</span>
            ${stayGroupsData.length > 1 ? `<button type="button" class="btn-del-stay" onclick="deleteStay(${sIdx})">항목 삭제</button>` : ''}
          </div>
          <div class="form-group">
            <label>박수(미입력 시 미노출)</label>
            <input type="text" class="in-price-stay" data-sidx="${sIdx}" value="${stayGroup.stayCategory}" placeholder="예: 1박">
          </div>
          <div class="room-container">
            ${roomsHtml}
          </div>
          <button type="button" class="btn-add-room" onclick="addRoom(${sIdx})">+ 객실 추가</button>
          
          <div class="form-group" style="margin-top: 15px;">
            <label>요금 안내(※ 기호 자동)</label>
            <textarea class="in-price-notice" data-sidx="${sIdx}" style="height: 60px;" placeholder="요금 안내 설명">${stayGroup.priceNotice || ''}</textarea>
          </div>
        </div>
      `;
            $container.append(stayHtml);
        });
    }

    $('#btn-add-card').on('click', function () {
        if (cardsData.length < 10) {
            cardsData.push({ imgSrcs: [""], title: "", sub: "", notice: "", link: "" });
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

    $(document).on('input propertychange change', '#in-property, .in-card-title, .in-card-sub, .in-card-notice, .in-card-link', function () {
        if ($(this).is('#in-property')) {
            const allowedRooms = (roomOptionsByProperty[$(this).val()] || []).filter(option => typeof option === 'string');
            stayGroupsData.forEach(group => (group.rooms || []).forEach(room => {
                if (room.room && !allowedRooms.includes(room.room)) room.room = '';
            }));
            renderStayForms();
            renderTemplate();
            return;
        }
        const idx = $(this).data('index');
        const $parent = $(this).closest('.card-item-form');
        cardsData[idx].title = $parent.find('.in-card-title').val();
        cardsData[idx].sub = $parent.find('.in-card-sub').val();
        cardsData[idx].notice = $parent.find('.in-card-notice').val();
        cardsData[idx].link = $parent.find('.in-card-link').val();
        renderTemplate();
    });

    // 날짜 입력칸 전체를 클릭하면 네이티브 달력 선택기를 연다.
    // 투명한 date input은 포인터 입력을 받지 않고, 부모 영역이 클릭을 처리한다.
    function openDatePicker(field) {
        const input = field && field.querySelector('input[type="date"]');
        if (!input || input.disabled) return;
        try {
            if (typeof input.showPicker === 'function') {
                input.showPicker();
            } else {
                input.focus();
                input.click();
            }
        } catch (error) {
            // showPicker 미지원 또는 브라우저 제한 시 기본 클릭 동작으로 대체
            input.focus();
            input.click();
        }
    }

    $(document).on('click', '.date-picker-field', function () {
        openDatePicker(this);
    });

    $(document).on('keydown', '.date-picker-field', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDatePicker(this);
        }
    });

    $(document).on('change', '.date-range-start, .date-range-end', function () {
        const $range = $(this).closest('.date-range-control');

        const start = $range.find('.date-range-start').val();
        const endInput = $range.find('.date-range-end');

        endInput.attr('min', start || '');

        if (start && endInput.val() && endInput.val() < start) {
            endInput.val(start);
        }

        const end = endInput.val();
        const formatted = dateRangeToDisplay(start, end);

        const $display = $range.find('.date-range-display');

        $display.val(formatted).trigger('input');
    });

    $(document).on('input', '.reservation-input', function () {
        const cleaned = sanitizeReservationInput(this.value);
        if (this.value !== cleaned) this.value = cleaned;
        const href = resolveReservationHref(cleaned);
        $(this).toggleClass('is-invalid-reservation', !!cleaned && !href);
    });

    $(document).on('blur', '.reservation-input', function () {
        const value = String(this.value || '').trim();
        if (value && !resolveReservationHref(value)) {
            this.value = '';
            $(this).removeClass('is-invalid-reservation');
            $(this).trigger('input');
        }
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

    // 카드 이미지: 서버 업로드 후 URL 반영 (최대 4장)
    $(document).on('change', '.in-card-img', async function (e) {
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

        $nameSpan.text('업로드 중...');

        try {
            if (!window.phoenixUploader || typeof window.phoenixUploader.uploadImage !== 'function') {
                throw new Error('이미지 업로드 기능을 찾을 수 없습니다.');
            }

            const result = await window.phoenixUploader.uploadImage(file);

            if (!result || !result.url) {
                throw new Error('서버 이미지 URL을 반환받지 못했습니다.');
            }

            if (!Array.isArray(cardsData[idx].imgSrcs)) {
                cardsData[idx].imgSrcs = [];
            }

            cardsData[idx].imgSrcs[imageIdx] = result.url;

            $nameSpan.text(file.name);
            renderTemplate();
            markDirty();

        } catch (error) {
            $nameSpan.text('업로드 실패');
            alert(error.message || '카드 이미지 업로드에 실패했습니다.');
            console.error('[카드 이미지 업로드 오류]', error);
        }
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

    // 메인 이미지: 서버 업로드 후 URL 반영
    $('#in-main-img').on('change', async function (e) {
        const file = e.target.files[0];

        if (!file || !file.type.startsWith('image/')) return;

        const $input = $(this);
        let $nameSpan = $input.siblings('.file-name-display');

        if ($nameSpan.length === 0) {
            $nameSpan = $('<span class="file-name-display" style="font-size:11px;color:#333;margin-left:6px;display:inline-block;"></span>');
            $input.after($nameSpan);
        }

        $nameSpan.text('업로드 중...');

        try {
            if (!window.phoenixUploader || typeof window.phoenixUploader.uploadImage !== 'function') {
                throw new Error('이미지 업로드 기능을 찾을 수 없습니다.');
            }

            const result = await window.phoenixUploader.uploadImage(file);

            if (!result || !result.url) {
                throw new Error('서버 이미지 URL을 반환받지 못했습니다.');
            }

            mainImgSrc = result.url;

            $nameSpan.text(file.name);
            renderTemplate();
            markDirty();

        } catch (error) {
            $nameSpan.text('업로드 실패');
            alert(error.message || '메인 이미지 업로드에 실패했습니다.');
            console.error('[메인 이미지 업로드 오류]', error);
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

    function goToSlide($slider, nextIndex, withTransition = true) {
        const $track = $slider.find('.tpl-card-track');
        const $dots = $slider.find('.tpl-slider-dot');
        const totalRealSlides = $dots.length; // 실제 슬라이드 개수

        if (!withTransition) {
            $track.css('transition', 'none');
        } else {
            $track.css('transition', 'transform 0.4s ease-in-out');
        }

        $slider.data('current-slide', nextIndex);
        $track.css('transform', 'translateX(-' + (nextIndex * 100) + '%)');

        // 인디케이터 매핑 (복제된 마지막 슬라이드인 경우 첫 번째 인디케이터 활성화)
        let dotIndex = nextIndex;
        if (nextIndex >= totalRealSlides) {
            dotIndex = 0;
        }
        $dots.removeClass('is-active').eq(dotIndex).addClass('is-active');
    }

    function initSliders($scope) {
        $scope.find('.tpl-card-slider').each(function () {
            const $slider = $(this);
            if ($slider.data('auto-init')) return;
            $slider.data('auto-init', true);
            $slider.data('current-slide', 0);

            const $track = $slider.find('.tpl-card-track');
            const $slides = $track.find('.tpl-card-slide');

            if ($slides.length > 1) {
                // 무한 루프를 위해 첫 번째 슬라이드를 복제해서 트랙 끝에 추가
                const $firstClone = $slides.first().clone().removeAttr('data-slide').attr('data-clone', 'true');
                $track.append($firstClone);

                const timer = setInterval(function () {
                    if (!document.body.contains($slider[0])) {
                        clearInterval(timer);
                        return;
                    }
                    let current = $slider.data('current-slide') || 0;
                    current++;
                    const totalSlidesWithClone = $track.find('.tpl-card-slide').length;

                    if (current >= totalSlidesWithClone - 1) {
                        // 복제된 마지막 슬라이드에 도달했을 때
                        goToSlide($slider, current, true);
                        // 트랙 이동이 끝난 후, 애니메이션 없이 즉시 첫 번째 위치로 순간 이동
                        setTimeout(function () {
                            goToSlide($slider, 0, false);
                        }, 400); // transition 시간과 일치
                    } else {
                        goToSlide($slider, current, true);
                    }
                }, 4000);

                let startX = 0;
                $slider.off('touchstart touchend').on('touchstart', function (e) {
                    startX = e.originalEvent.touches[0].clientX;
                });
                $slider.on('touchend', function (e) {
                    const endX = e.originalEvent.changedTouches[0].clientX;
                    const diff = startX - endX;
                    if (Math.abs(diff) > 50) {
                        let current = $slider.data('current-slide') || 0;
                        const totalRealSlides = $slider.find('.tpl-slider-dot').length;
                        if (diff > 0) {
                            current++;
                            if (current >= totalRealSlides) {
                                goToSlide($slider, current, true);
                                setTimeout(() => goToSlide($slider, 0, false), 400);
                                return;
                            }
                        } else {
                            current--;
                            if (current < 0) current = totalRealSlides - 1;
                        }
                        goToSlide($slider, current, true);
                    }
                });
            }
        });
    }

    function renderTemplate() {
        const selectedPropertyVal = $('#in-property').val() || '';
        const subTitle = selectedPropertyVal;

        let badgeBgColor = '#167a47';
        if (selectedPropertyVal === 'PHOENIX PARK') {
            badgeBgColor = '#167a47';
        } else if (selectedPropertyVal === 'PHOENIX ISLAND') {
            badgeBgColor = '#0079c3';
        } else if (selectedPropertyVal === 'PLAYCE CAMP by PHOENIX') {
            badgeBgColor = '#e6007e';
        }

        const mainTitle = ($('#in-main-title').val() || '').trim();
        const mainBadge = ($('#in-main-badge').val() || '').trim();
        const mainDesc = ($('#in-main-desc').val() || '').trim().replace(/\n/g, '<br>');
        const infoReservePeriod = ($('#in-info-reserve-period').val() || '').trim();
        const infoStayPeriod = ($('#in-info-stay-period').val() || '').trim();
        const ctaTitle = ($('#in-cta-title').val() || '').trim();
        const ctaDesc = ($('#in-cta-desc').val() || '').trim().replace(/\n/g, '<br>');

        let cardsHtml = '';
        cardsData.forEach((card, idx) => {
            const title = (card.title || '').trim();
            const rawSub = (card.sub || '').trim();

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
            // if (!cardImages.length) cardImages.push("https://phoenixhnr.co.kr/api/attach/view/event/140000046772/thumbs_p/");

            const slideImagesHtml = cardImages.map((src, imageIdx) => `<img src="${src}" class="tpl-card-img tpl-card-slide" data-slide="${imageIdx}" alt="Card Image ${idx + 1}-${imageIdx + 1}">`).join('');
            const sliderTrackHtml = `<div class="tpl-card-track" style="transform: translateX(0%);">${slideImagesHtml}</div>`;

            const sliderControls = cardImages.length > 1 ? `<div class="tpl-slider-dots">${cardImages.map((_, dotIdx) => `<button type="button" class="tpl-slider-dot ${dotIdx === 0 ? 'is-active' : ''}" data-slide-to="${dotIdx}" aria-label="${dotIdx + 1}번째 이미지"></button>`).join('')}</div>` : '';

            cardsHtml += `
      <div class="tpl-card-item">
        <div class="tpl-card-slider" data-card-index="${idx}">${sliderTrackHtml}${sliderControls}</div>
        <div class="tpl-card-copy">
        ${title ? `<div class="tpl-card-title">${title}</div>` : ''}
        ${rawSub ? `<div class="tpl-card-sub">${rawSub.replace(/\n/g, '<br>')}</div>` : ''}
        ${noticeHtml}
        ${btnHtml}
        </div>
      </div>`;
        });

        const rawBullets = ($('#in-bullets').val() || '').trim();
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
                const periodKey = (r.period || '').trim();
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
            ${period ? `<span>${period}</span>` : ''}
            <span class="acc-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
              </svg>
            </span>
          </div>
          <div class="tpl-price-body">`;

                periodMap[period].forEach(item => {
                    const roomName = (item.room || '').trim();

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
                                link: resolveReservationHref(t.link)
                            });
                        }
                    });

                    if (!activeEntries.length) return;

                    const uniqueLinks = [...new Set(activeEntries.map(e => e.link))];
                    const isMerged = activeEntries.length > 1 && uniqueLinks.length === 1;

                    if (isMerged) {
                        sheetContentHtml += `
            <div class="tpl-room-card merged-card">
              ${roomName ? `<div class="tpl-room-title">${roomName}</div>` : ''}
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
                ${uniqueLinks[0] ? `<a href="${uniqueLinks[0]}" class="tpl-btn-reserve-sm" ${uniqueLinks[0].startsWith('tel:') ? '' : 'target="_blank"'}>예약하기</a>` : '<span class="tpl-btn-reserve-sm is-disabled" aria-disabled="true">예약하기</span>'}
              </div>
            </div>`;
                    } else {
                        sheetContentHtml += `
            <div class="tpl-room-card">
              ${roomName ? `<div class="tpl-room-title">${roomName}</div>` : ''}
              <div class="tpl-room-prices-container">`;

                        activeEntries.forEach(entry => {
                            sheetContentHtml += `
                <div class="tpl-price-sub-row">
                  <span class="tpl-room-sub-label">${entry.label}</span>
                  <span class="tpl-room-val">${entry.val}</span>
                  ${entry.link ? `<a href="${entry.link}" class="tpl-btn-reserve-sm" ${entry.link.startsWith('tel:') ? '' : 'target="_blank"'}>예약하기</a>` : '<span class="tpl-btn-reserve-sm is-disabled" aria-disabled="true">예약하기</span>'}
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
    ${subTitle ? `<div class="tpl-sub-title">${subTitle}</div>` : ''}
    ${mainTitle ? `<div class="tpl-title">${mainTitle}</div>` : ''}
    ${mainDesc ? `<div class="tpl-desc">${mainDesc}</div>` : ''}
    ${(infoReservePeriod || infoStayPeriod) ? `<div class="tpl-info-list">
      ${infoReservePeriod ? `<div class="tpl-info-item"><div class="tpl-info-label">예약 기간</div><div class="tpl-info-val">${infoReservePeriod}</div></div>` : ''}
      ${infoStayPeriod ? `<div class="tpl-info-item"><div class="tpl-info-label">투숙 기간</div><div class="tpl-info-val">${infoStayPeriod}</div></div>` : ''}
    </div>` : ''}

    ${(ctaTitle || ctaDesc) ? `<div class="tpl-cta-box">
      <div class="tpl-sub-title">BENEFITS</div>
      ${ctaTitle ? `<div class="tpl-cta-title">${ctaTitle}</div>` : ''}
      ${ctaDesc ? `<div class="tpl-cta-desc">${ctaDesc}</div>` : ''}
    </div>` : ''}

    <!-- Content Cards -->
    <div class="tpl-card-list">
      ${cardsHtml}
    </div>

    <!-- Bullet Info -->
    ${bulletHtml ? `<div class="tpl-bullet-title">이용 안내</div><ul class="tpl-bullet-list">${bulletHtml}</ul>` : ''}

    <!-- 공통 고정 영역: 취소/변경 수수료 안내 -->
    <div class="tpl-bullet-title">취소/변경 수수료 안내</div>
    <ul class="tpl-bullet-list">
      <li>비수기: 이용일 기준 2일 전까지 수수료 없이 취소/변경 가능<br />(1일 전: 50%, 이용일/No-Show: 100% 수수료 발생)</li>
      <li>성수기: 이용일 기준 7일 전까지 수수료 없이 취소/변경 가능<br />(6 ~ 4일 전: 10%, 3 ~ 2일 전: 20%, 1일 전: 50%, 이용일/No-Show: 100% 수수료 발생)</li>
      <li>객실 패키지 세부 구성 부분 환불 불가</li>
    </ul>
  </div>

  <!-- 스티키 하단 예약 바 -->
  ${minPriceNum !== Infinity ? `<div class="tpl-sticky-bar">
    <div class="tpl-sticky-price"><span class="tpl-sticky-val" style="color:${badgeBgColor};">${minPriceDisplay}</span></div>
    <button type="button" class="tpl-sticky-btn" id="btn-open-sheet">자세히 보기</button>
  </div>
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
  </div>` : ''}
</div>
`.trim();

        // Render inside an iframe so responsive media queries use the preview
        // viewport width instead of the Electron application's window width.
        const previewFrame = document.getElementById('preview-frame');
        if (previewFrame) {
            const cmsScriptUrl = document.currentScript && document.currentScript.src
                ? document.currentScript.src
                : document.baseURI;
            const usesGithubAssetFolders = /\/phoenix-html-generator\/js\/package-renewal-cms\.js(?:[?#]|$)/i.test(cmsScriptUrl);
            const cssHref = usesGithubAssetFolders
                ? new URL('../css/package-renewal-cms.css', cmsScriptUrl).href
                : new URL('package-renewal-cms.css', document.baseURI).href;
            const templateScriptHref = usesGithubAssetFolders
                ? new URL('package-renewal-html.js', cmsScriptUrl).href
                : new URL('package-renewal-html.js', document.baseURI).href;
            previewFrame.srcdoc = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <link rel="stylesheet" href="${cssHref}">
  <style>html,body{margin:0;padding:0;width:100%;min-height:100%;}body{overflow-x:hidden;}</style>
</head>
<body>
${generatedHTML}
<script src="${templateScriptHref}"><\/script>
</body>
</html>`;
        }

        const fullSourceCode = `
<link rel="stylesheet" href="package-renewal-cms.css" />
${generatedHTML}
<script src="package-renewal-html.js"></script>
    `.trim();

        $('#code-text').text(fullSourceCode);
    }

    // Preview interactions are initialized inside the preview iframe by
    // package-renewal-html.js, keeping them isolated from the editor UI.

    // Workspace tabs: keep each template's editable data independent.
    const workspace = { tabs: [], activeId: null, nextId: 2, changingTab: false };
    let workspaceDefaults = null;
    const workspaceFields = ['#in-main-badge', '#in-main-title', '#in-main-desc', '#in-info-reserve-period', '#in-info-stay-period', '#in-cta-title', '#in-cta-desc', '#in-bullets'];

    function cloneData(value) { return JSON.parse(JSON.stringify(value)); }
    function getMainTitle(tab) {
        const data = tab && tab.data ? tab.data : snapshotWorkspace();
        const title = data && data.fields ? data.fields['#in-main-title'] : '';
        return String(title || '').trim() || 'Phoenix HNR Template';
    }
    function safeFileName(value) {
        return String(value || 'Phoenix HNR Template').trim().replace(/[\\/:*?"<>|]/g, '_').replace(/[. ]+$/g, '') || 'Phoenix HNR Template';
    }
    function snapshotWorkspace() {
        const fields = {};
        workspaceFields.forEach(sel => fields[sel] = $(sel).val() || '');
        return {
            fields,
            property: $('#in-property').val() || '',
            mainImgSrc,
            cardsData: cloneData(cardsData),
            stayGroupsData: cloneData(stayGroupsData)
        };
    }
    function restoreWorkspace(data) {
        if (!data) return;
        workspace.changingTab = true;
        workspaceFields.forEach(sel => $(sel).val(data.fields && data.fields[sel] != null ? data.fields[sel] : ''));
        syncDateRangeControl($('#in-info-reserve-period').closest('.date-range-control'), $('#in-info-reserve-period').val());
        syncDateRangeControl($('#in-info-stay-period').closest('.date-range-control'), $('#in-info-stay-period').val());
        $('#in-property').val(data.property || '');
        mainImgSrc = data.mainImgSrc || mainImgSrc;
        cardsData = cloneData(data.cardsData || cardsData);
        stayGroupsData = cloneData(data.stayGroupsData || stayGroupsData);
        renderCardForms();
        renderStayForms();
        renderTemplate();
        workspace.changingTab = false;
    }
    function activeTab() { return workspace.tabs.find(t => t.id === workspace.activeId); }
    function saveActiveSnapshot() {
        const tab = activeTab();
        if (tab && tab.type === 'template') tab.data = snapshotWorkspace();
    }
    function markDirty() {
        if (workspace.changingTab) return;
        const tab = activeTab();
        if (tab) { tab.dirty = true; saveActiveSnapshot(); drawTabs(); }
    }
    function drawTabs() {
        const $tabs = $('#phoenix-workspace-tabs').empty();
        workspace.tabs.forEach(tab => {
            const isActive = tab.id === workspace.activeId;
            const $item = $('<div>').addClass('phoenix-workspace-tab').attr({ 'data-tab-id': tab.id, 'aria-selected': isActive ? 'true' : 'false' }).css({ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', boxShadow: 'inset 0 0 0 2px ' + (isActive ? '#222' : '#ddd'), backgroundColor: isActive ? '#ffffff' : '#ddd', whiteSpace: 'nowrap', height: '32px' });
            const $name = $('<button type="button">').text((tab.dirty ? '● ' : '') + tab.name).css({ border: 0, background: 'transparent', color: '#20242a', fontWeight: isActive ? '700' : '400', cursor: 'pointer' }).on('click', () => switchTab(tab.id));
            if (workspace.tabs.length > 1) {
                const $close = $('<button type="button">×</button>').attr('aria-label', '탭 닫기').css({ border: 0, background: 'transparent', color: '#222', cursor: 'pointer', fontSize: '16px' }).on('click', () => closeTab(tab.id));
                $item.append($name, $close);
            } else {
                $item.append($name);
            }
            $tabs.append($item);
        });
        const $new = $('<button type="button" class="phoenix-new-workspace">+ NEW</button>').css({ padding: '8px 16px', cursor: 'pointer', border: 'none', background: '#222', color: '#fff', fontWeight: '600' }).on('click', newTab);
        $tabs.append($new);
    }
    function switchTab(id) {
        if (id === workspace.activeId || workspace.changingTab) return;
        saveActiveSnapshot();
        const tab = workspace.tabs.find(t => t.id === id);
        if (!tab) return;
        workspace.activeId = id;
        restoreWorkspace(tab.data);
        drawTabs();
    }
    function newTab() {
        saveActiveSnapshot();
        const number = workspace.nextId++;
        const id = 'workspace-' + number;
        const data = workspaceDefaults ? cloneData(workspaceDefaults) : snapshotWorkspace();
        workspace.tabs.push({ id, name: 'Untitled-' + number, type: 'template', data, dirty: false, projectPath: '' });
        workspace.activeId = id;
        restoreWorkspace(data);
        drawTabs();
    }
    function closeTab(id) {
        if (workspace.tabs.length <= 1) return;
        const tab = workspace.tabs.find(t => t.id === id);
        if (!tab) return;
        if (tab.dirty && !confirm('저장하지 않은 작업 내용이 있습니다. 이 탭을 닫을까요?')) return;
        const wasActive = workspace.activeId === id;
        workspace.tabs = workspace.tabs.filter(t => t.id !== id);
        if (!workspace.tabs.length) {
            const data = workspaceDefaults ? cloneData(workspaceDefaults) : snapshotWorkspace();
            const nextId = 'workspace-' + workspace.nextId++;
            workspace.tabs.push({ id: nextId, name: 'Untitled-' + (workspace.nextId - 1), type: 'template', data, dirty: false, projectPath: '' });
        }
        if (wasActive) {
            const next = workspace.tabs[workspace.tabs.length - 1];
            workspace.activeId = next.id;
            restoreWorkspace(next.data);
        }
        drawTabs();
    }
    function getCurrentHtml() {
        renderTemplate();
        return $('#code-text').text();
    }
    function validateRequiredFields() {
        const missing = [];
        if (!$('#in-property').val()) missing.push('메인 섹션 > 구분');
        if (!($('#in-main-title').val() || '').trim()) missing.push('메인 섹션 > 객실 패키지명');
        if (!($('#in-info-reserve-period').val() || '').trim()) missing.push('메인 섹션 > 예약 기간');
        if (!($('#in-info-stay-period').val() || '').trim()) missing.push('메인 섹션 > 투숙 기간');

        cardsData.forEach((card, index) => {
            const cardNo = index + 1;
            const firstImage = card.imgSrcs && card.imgSrcs[0];
            if (!firstImage || !String(firstImage).trim()) missing.push(`상품 구성 상세 > 상세 #${cardNo} > 이미지 1`);
            if (!String(card.title || '').trim()) missing.push(`상품 구성 상세 > 상세 #${cardNo} > 상품 구성명`);
        });

        const priceTypes = [
            { price: 'weekdayPrice', link: 'weekdayLink', label: '주중' },
            { price: 'weekendPrice', link: 'weekendLink', label: '주말' },
            { price: 'holidayPrice', link: 'holidayLink', label: '연휴' },
            { price: 'commonPrice', link: 'commonLink', label: '공통' }
        ];
        stayGroupsData.forEach((group, sIdx) => {
            (group.rooms || []).forEach((room, rIdx) => {
                if (!String(room.period || '').trim()) {
                    missing.push(`이용 요금 > 이용 요금 #${sIdx + 1} > 객실 항목 #${rIdx + 1} > 기간`);
                }

                priceTypes.forEach(type => {
                    const price = String(room[type.price] || '').trim();
                    const url = String(room[type.link] || '').trim();
                    // 예약 URL/유선은 선택 입력이며, 미입력 시 미리보기 버튼을 비활성화합니다.
                });
            });
        });

        if (missing.length) {
            alert('필수 항목을 입력하거나 등록해 주세요.\n\n' + missing.map(item => '• ' + item).join('\n'));
            return false;
        }
        return true;
    }

    async function saveCurrentHtml(saveAs) {
        if (!validateRequiredFields()) return;
        const tab = activeTab();
        if (!tab) return;
        saveActiveSnapshot();
        const content = getCurrentHtml();
        try {
            const result = await window.phoenixUploader.saveHtml({ content, filePath: tab.htmlPath || '', defaultName: safeFileName(getMainTitle(tab)) + '.html', saveAs: !!saveAs });
            if (result && result.saved) {
                tab.htmlPath = result.filePath || tab.htmlPath || '';
                // HTML output and editable project data are separate: do not clear tab.dirty here.
                alert('HTML 저장이 완료됐습니다.');
            }
        } catch (error) { alert('HTML 저장에 실패했습니다.\n' + (error.message || error)); }
    }
    async function saveProject(saveAs) {
        if (!validateRequiredFields()) return;
        const tab = activeTab();
        if (!tab) return;
        saveActiveSnapshot();
        const projectTitle = getMainTitle(tab);
        const project = { format: 'phoenix-hnr-template-project', version: 1, name: projectTitle, data: tab.data };
        try {
            const result = await window.phoenixUploader.saveProject({ project, filePath: tab.projectPath || '', defaultName: safeFileName(projectTitle) + '.phxwork', saveAs: !!saveAs });
            if (result && result.saved) {
                tab.projectPath = result.filePath || tab.projectPath || '';
                tab.name = result.fileName || projectTitle;
                tab.dirty = false;
                drawTabs();
                alert('작업 파일 저장이 완료됐습니다.');
            }
        } catch (error) { alert('작업 파일 저장에 실패했습니다.\n' + (error.message || error)); }
    }
    async function openProjectTab() {
        try {
            const result = await window.phoenixUploader.openProject();
            if (!result || !result.project) return;
            const project = result.project;
            if (project.format !== 'phoenix-hnr-template-project' || !project.data) {
                alert('지원하지 않는 작업 파일입니다.');
                return;
            }
            saveActiveSnapshot();
            const number = workspace.nextId++;
            const id = 'workspace-' + number;
            const name = result.fileName || project.name || ('불러온 작업 ' + number);
            const data = cloneData(project.data);
            workspace.tabs.push({ id, name, type: 'template', data, dirty: false, projectPath: result.filePath || '', htmlPath: '' });
            workspace.activeId = id;
            restoreWorkspace(data);
            drawTabs();
        } catch (error) { alert('작업 파일을 열지 못했습니다.\n' + (error.message || error)); }
    }
    function hasUnsavedWork() {
        saveActiveSnapshot();
        return workspace.tabs.some(tab => tab.dirty);
    }
    function requestExit() {
        if (!hasUnsavedWork() || confirm('저장하지 않은 작업 영역이 있습니다. 저장하지 않고 종료할까요?')) window.phoenixUploader.confirmClose(true);
    }
    function requestRefresh() {
        if (!hasUnsavedWork() || confirm('저장하지 않은 작업 영역이 있습니다. 저장하지 않고 새로고침할까요?')) window.phoenixUploader.reloadGenerator();
    }

    workspace.tabs.push({ id: 'workspace-1', name: 'Untitled-1', type: 'template', data: null, dirty: false, projectPath: '', htmlPath: '' });
    workspace.activeId = 'workspace-1';
    $(document).on('input change', '.admin-panel input, .admin-panel textarea, .admin-panel select', markDirty);
    $(document).on('click', '#btn-add-card,#btn-add-stay,.btn-del-card,.btn-del-stay,.btn-del-room,.btn-add-room,.btn-add-card-image,.btn-del-card-image', function () { setTimeout(markDirty, 0); });
    $('#btn-save-html').on('click', () => saveCurrentHtml(false));
    if (window.phoenixUploader && window.phoenixUploader.onMenuAction && !window.__phoenixWorkspaceMenuBound) {
        window.__phoenixWorkspaceMenuBound = true;
        window.phoenixUploader.onMenuAction(action => {
            if (action === 'new') newTab();
            if (action === 'open-project') openProjectTab();
            if (action === 'save-project') saveProject(false);
            if (action === 'save-project-as') saveProject(true);
            if (action === 'save-html') saveCurrentHtml(false);
            if (action === 'save-html-as') saveCurrentHtml(true);
            if (action === 'refresh') requestRefresh();
            if (action === 'exit') requestExit();
        });
    }
    window.__phoenixWorkspaceManager = true;
    window.__phoenixProjectManager = true;
    window.__phoenixRefreshGuard = true;
    drawTabs();
    renderCardForms();
    renderStayForms();
    renderTemplate();
    workspace.tabs[0].data = snapshotWorkspace();
    workspaceDefaults = JSON.parse(JSON.stringify(workspace.tabs[0].data));

    $('#btn-toggle-code').on('click', function () {
        // 소스 보기를 열 때 필수값과 예약 URL을 먼저 검증합니다.
        if (!$('#code-output').is(':visible') && !validateRequiredFields()) return;
        $('#code-output').slideToggle();
    });

    $('#btn-copy').on('click', function () {
        // 소스 복사도 HTML 저장과 동일한 필수값 검증을 거칩니다.
        if (!validateRequiredFields()) return;
        const code = getCurrentHtml();
        navigator.clipboard.writeText(code).then(function () {
            alert('전체 HTML 소스가 복사되었습니다.');
        }).catch(function (error) {
            alert('HTML 소스 복사에 실패했습니다.\n' + (error.message || error));
        });
    });

});

function setPreviewWidth(width) {
    const value = Math.max(
        320,
        Math.min(1920, Number(width) || 320)
    );

    $('#mobile-frame-container').css({
        width: value + 'px',
        maxWidth: '1920px'
    });
}
$(document).on('click', '.btn-device-size', function () {
    setPreviewWidth($(this).attr('data-width'));
});
$(document).on('input change', '#preview-width-slider', function () {
    setPreviewWidth(this.value);
});
$(function () {
    setPreviewWidth(320);
});