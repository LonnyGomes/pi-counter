(() => {
    const btn = document.getElementById('reset-btn');

    btn.addEventListener('click', () => {
        fetch('/reset', { method: 'POST' })
            .then((resp) => resp.json())
            .then((data) => alert(`Counter reset to ${data.startDate} `));
    });
})();
