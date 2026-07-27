    let currentCategory = 'all';
    let currentTag = '';

    function scrollToCenter(btn) {
        if (!btn) return;
        const $container = $('#categoryTabWrap');
        if (!$container.length) return;

        // 중앙 위치 계산
        const targetScroll = btn.offsetLeft - ($container.width() / 2) + ($(btn).outerWidth() / 2);

        $container.stop().animate({
            scrollLeft: targetScroll
        }, 400, 'swing');
    }

    // 1. 카테고리 탭 변경
    function setCategory(cat, btn) {
        currentCategory = cat;
        document.querySelectorAll('.category-tab-wrap .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        scrollToCenter(btn);

        applyFilter();
    }

    function searchSubmit() {
        currentCategory = 'all';

        const allBtn = document.querySelector(".category-tab-wrap .tab-btn[onclick*='all']");
        if (allBtn) {
            document.querySelectorAll('.category-tab-wrap .tab-btn').forEach(b => b.classList.remove('active'));
            allBtn.classList.add('active');

            scrollToCenter(allBtn);
        }

        applyFilter();
    }

    function toggleTag(tag, btn) {
        if (currentTag === tag) {
            currentTag = '';
            btn.classList.remove('active');
        } else {
            document.querySelectorAll('.kw-tag').forEach(b => b.classList.remove('active'));
            currentTag = tag;
            btn.classList.add('active');
        }
        applyFilter();
    }

    function resetFilters() {
        currentCategory = 'all';
        currentTag = '';
        document.getElementById('searchKeyword').value = '';

        const allBtn = document.querySelector(".category-tab-wrap .tab-btn[onclick*='all']");
        document.querySelectorAll('.category-tab-wrap .tab-btn').forEach(b => b.classList.remove('active'));
        if (allBtn) {
            allBtn.classList.add('active');
            scrollToCenter(allBtn);
        }

        document.querySelectorAll('.kw-tag').forEach(b => b.classList.remove('active'));

        applyFilter();
    }

    function applyFilter() {
        const searchInput = document.getElementById("searchKeyword").value.toLowerCase().trim();
        const cards = document.querySelectorAll(".item-card");
        let visibleCount = 0;

        cards.forEach(card => {
            const cardCat = card.getAttribute("data-category");
            const cardKeywords = (card.getAttribute("data-keywords") || "").toLowerCase();
            const cardText = card.innerText.toLowerCase();

            const matchCategory = (currentCategory === 'all' || cardCat === currentCategory);
            const matchTag = (currentTag === '' || cardText.includes(currentTag.toLowerCase()) || cardKeywords.includes(currentTag.toLowerCase()));
            const matchSearch = (searchInput === '' || cardText.includes(searchInput) || cardKeywords.includes(searchInput));

            if (matchCategory && matchTag && matchSearch) {
                card.style.display = "block";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        const noResultDiv = document.getElementById("noResult");
        noResultDiv.style.display = (visibleCount === 0) ? "block" : "none";
    }

    function checkTabScroll() {
        const $wrap = $('#categoryTabWrap');
        if (!$wrap.length) return;

        const el = $wrap[0];
        const scrollLeft = el.scrollLeft;
        const maxScrollLeft = el.scrollWidth - el.clientWidth;

        const $leftArrow = $('.tab-scroll-arrow.arrow-left');
        const $rightArrow = $('.tab-scroll-arrow.arrow-right');

        if (maxScrollLeft <= 2) {
            $leftArrow.hide();
            $rightArrow.hide();
            return;
        }

        if (scrollLeft > 5) {
            $leftArrow.fadeIn(150);
        } else {
            $leftArrow.fadeOut(150);
        }

        if (scrollLeft < maxScrollLeft - 5) {
            $rightArrow.fadeIn(150);
        } else {
            $rightArrow.fadeOut(150);
        }
    }

    // Dynamic Style Injection
    $(function () {

        checkTabScroll();

        $('#categoryTabWrap').on('scroll', checkTabScroll);
        $(window).on('resize', checkTabScroll);
    });