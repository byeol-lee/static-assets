window.addEventListener('load', () => {
    document
        .querySelector('.event-hero__inner')
        .classList.add('is-active');

    const path = location.pathname;

    const listUrl = path.replace(/\/board\/event.*$/, '/board/event');

    document
        .getElementById('eventListBtn')
        .addEventListener('click', () => {
            location.href = listUrl;
        });
});