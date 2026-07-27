function scrollToCenter(btn) {
    if (!btn) return;
    btn.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
    });
}

function resetCategoryToAll() {
    currentCategory = 'all';
    const allBtn = document.querySelector(".category-tab-wrap .tab-btn[onclick*='all']");

    document.querySelectorAll('.category-tab-wrap .tab-btn').forEach(b => b.classList.remove('active'));

    if (allBtn) {
        allBtn.classList.add('active');
        scrollToCenter(allBtn);
    }
}

function setCategory(cat, btn) {
    currentCategory = cat;

    document.querySelectorAll('.category-tab-wrap .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    scrollToCenter(btn);
    applyFilter();
}

function searchSubmit() {
    resetCategoryToAll();
    applyFilter();
}

function toggleTag(tag, btn) {
    const isSelected = (currentTag === tag);

    document.querySelectorAll('.kw-tag').forEach(b => b.classList.remove('active'));

    if (isSelected) {
        currentTag = '';
    } else {
        currentTag = tag;
        btn.classList.add('active');
    }

    applyFilter();
}

function resetFilters() {
    currentTag = '';
    document.getElementById('searchKeyword').value = '';

    resetCategoryToAll();
    applyFilter();
}

function applyFilter() {
    const searchInput = document.getElementById("searchKeyword").value.toLowerCase().trim();
    const cards = document.querySelectorAll(".item-card");
    const tagLower = currentTag.toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
        const cardCat = card.getAttribute("data-category");
        const cardKeywords = (card.getAttribute("data-keywords") || "").toLowerCase();
        const cardText = card.innerText.toLowerCase();

        const matchCategory = (currentCategory === 'all' || cardCat === currentCategory);
        const matchTag = (!currentTag || cardText.includes(tagLower) || cardKeywords.includes(tagLower));
        const matchSearch = (!searchInput || cardText.includes(searchInput) || cardKeywords.includes(searchInput));

        const isVisible = matchCategory && matchTag && matchSearch;
        card.style.display = isVisible ? "block" : "none";

        if (isVisible) visibleCount++;
    });

    const noResultDiv = document.getElementById("noResult");
    if (noResultDiv) {
        noResultDiv.style.display = (visibleCount === 0) ? "block" : "none";
    }
}

function checkTabScroll() {
    const wrap = document.getElementById('categoryTabWrap');
    if (!wrap) return;

    const scrollLeft = wrap.scrollLeft;
    const maxScrollLeft = wrap.scrollWidth - wrap.clientWidth;

    const $leftArrow = $('.tab-scroll-arrow.arrow-left');
    const $rightArrow = $('.tab-scroll-arrow.arrow-right');

    if (maxScrollLeft <= 2) {
        $leftArrow.hide();
        $rightArrow.hide();
        return;
    }

    scrollLeft > 5 ? $leftArrow.fadeIn(150) : $leftArrow.fadeOut(150);
    scrollLeft < maxScrollLeft - 5 ? $rightArrow.fadeIn(150) : $rightArrow.fadeOut(150);
}

$(function () {
    checkTabScroll();
    $('#categoryTabWrap').on('scroll', checkTabScroll);
    $(window).on('resize', checkTabScroll);
});
</script >