const handleModal = Array.from(document.querySelectorAll('.js-handleModal'));
const resetCounter = Array.from(document.querySelectorAll('.js-resetCounter'));


const clickedData = getClickedData();
sessionStorage.setItem('clicked', JSON.stringify(clickedData));
loadSessionData(clickedData);

handleModal.forEach(el => {
    el.addEventListener('click', item => {
        item = item.target;
        const action = item.getAttribute('data-action');

        switch (action) {
            case 'open':
                openModal(item);
                break;
            case 'close':
                closeModal(item);
                break;
        }
    });
});

resetCounter.forEach(el => {
    el.addEventListener('click', item => {
        item = item.target;
        const modal = item.closest('.js-modal');
        const target = modal.getAttribute('data-modal');
        const currentIndex = clickedData.findIndex(el => el.target == target);
        const counterItem = modal.querySelector('.js-clicked');
        counterItem.textContent = 0;
        clickedData[currentIndex].counter = 0;
        sessionStorage.setItem('clicked', JSON.stringify(clickedData));
        item.classList.remove('active');
    });
});


function handleClicker(modal) {
    const target = modal.getAttribute('data-modal');
    const currentIndex = clickedData.findIndex(el => el.target == target);
    const clickCounter = clickedData[currentIndex].counter + 1;

    if (clickCounter > 5) {
        modal.querySelector('.js-resetCounter').classList.add('active');
    }

    clickedData[currentIndex].counter = clickCounter;
    sessionStorage.setItem('clicked', JSON.stringify(clickedData));
    modal.querySelector('.js-clicked').textContent = clickCounter;

}

function openModal(item) {

    const target = item.getAttribute('data-target');
    const modal = document.querySelector(`.js-modal[data-modal="${target}"]`);
    modal.classList.add('active');
    handleClicker(modal);
}

function closeModal(item) {
    item.closest('.js-modal').classList.remove('active');
}

function getClickedData() {
    const modals = Array.from(document.querySelectorAll('.js-modal'));
    const sessionData = JSON.parse(sessionStorage.getItem('clicked'));
    let clicked = [];
    if (sessionData == null) {

        modals.forEach(el => {
            clicked.push({
                target: el.getAttribute('data-modal'),
                counter: 0,
            });
        });

        return clicked;
    } else {

        if (modals.length > sessionData.length) {
            modals.forEach((el, index) => {
                if (index < sessionData.length) {
                    clicked.push({
                        target: sessionData[index].target,
                        counter: sessionData[index].counter,
                    });
                } else {
                    clicked.push({
                        target: el.getAttribute('data-modal'),
                        counter: 0,
                    });
                }
            });
            return clicked;
        } else if (modals.length < sessionData.length) {
            modals.forEach(el => {
                const target = el.getAttribute('data-modal');
                sessionData.forEach(item => {
                    if (target == item.target) {
                        clicked.push({
                            target: item.target,
                            counter: item.counter,
                        })
                    }
                });

            });
            return clicked;
        } else {
            return sessionData;
        }
    }
}

function loadSessionData(data) {
    data.forEach(el => {
        const modal = document.querySelector(`.js-modal[data-modal="${el.target}"]`);
        modal.querySelector('.js-clicked').textContent = el.counter;
    });
}
