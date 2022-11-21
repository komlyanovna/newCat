//Переменные 
const $cards = document.querySelector('[data-cards]');
const $close = document.querySelector('#closed');


//Функция создания разметки котов
const generateCards = (post) => {
    return `
    <div class="card" data-card_id=${post.id}>
    <img src=${post.img_link} class='card__img' alt=${post.name}></img>
    <i class="fas fa-trash-alt" data-action='delete'></i>
    <h2 class="card__title">${post.name}</h2>
    <a href='' class='cards__btn'></a>
    <div class="like">
        <i class="far fa-heart"></i>
        <i class="far fa-heart"></i>
        <i class="far fa-heart"></i>
        <i class="far fa-heart"></i>
        <i class="far fa-heart"></i>
        <i class="far fa-heart"></i>
        
    </div>
</div>
`
}

const generatePopup = (popup) => {
    return `
    <i class="fas fa-times"></i>
    <form id="form__cats" name="popup__cats">
        <img src='${popup.img_link}' alt='Котик' class="popup__img" name="img_link" value="">
        <label class="name-label">Имя:</label>
        <input class='cats-name' name="name" value="${popup.name}">
        <label class="popup__description-label">Информация:</label>
        <input class='popup__description' name="description" value="${popup.description}">
        <label class="popup__age-label">Возраст:</label>
        <input class='popup__age' name="age" value="${popup.age}">
        <label class="popup__rate-label">Рейтинг:</label>
        <input class="popup__rate" name="rate" value="${popup.rate}">
    </form>
    <i class="far fa-edit"></i>`
}


// http://sb-cats.herokuapp.com/api/2/komlyanovna/show - baseURL

// генерировать карточку с котиком
class CatsApi {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    async getAddACat() {
        const response = await fetch(`${this.baseURL}/show`);
        return response.json();
    }

    async deleteCardCat(catId) {
        const response = await fetch(`${this.baseURL}/delete/${catId}`, {
            method: "DELETE",
        })
        return response.json();
    }

    async addCat(data) {
        const response = await fetch(`${this.baseURL}/add`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data),
        })
    }

    async infoCat(idCat) {
        const response = await fetch(`${this.baseURL}/show/${idCat}`);
        return response.json();
    }

    async editCat(idCat, data) {
        const response = await fetch(`${this.baseURL}/update/${idCat}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                'Content-type': "application/json",
            },
        })
    }
}

const api = new CatsApi('https://sb-cats.herokuapp.com/api/2/komlyanovna');
api.getAddACat().then((response) => {
    response.data.forEach((post) =>
        $cards.insertAdjacentHTML('beforeend', generateCards(post))
    )
});

// удалить котика

$cards.addEventListener('click', (e) => {
    switch (e.target.dataset.action) {
        case 'delete':
            const $cardWr = e.target.closest('[data-card_id]');
            const catId = $cardWr.dataset.card_id;
            api.deleteCardCat(catId).then(() => {
                $cardWr.remove();
            }).catch(alert)
    }
})

//Добавить котика
document.forms.add_cat.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target).entries());
    formData.id = +formData.id;
    formData.rate = +formData.rate;
    formData.favorite = formData.favorite === 'on';
    formData.age = +formData.age;

    api.addCat(formData).then(() => {
        $cards.insertAdjacentHTML('beforeend', generateCards(formData));
        event.target.reset();
    }).catch(alert)
})

//закрыть попап

function clousedPopup(popup) {
    popup.classList.remove('popup__opened')
};
$close.addEventListener('click', () => {
    clousedPopup(document.querySelector('.popup__form'));
})

//открыть попап
function openPopup(popup) {
    popup.classList.add('popup__opened')
};

document.querySelector('.header__button').addEventListener('click', () => {
    openPopup(document.querySelector('.popup__form'))
});

//Функция генерации попапа с котами
document.querySelector('#cards').addEventListener('click', (e) => {
    e.preventDefault();
    const $cardWr = e.target.closest('[data-card_id]');
    const catId = $cardWr.dataset.card_id;
    
    openPopup(document.querySelector('.popup__card'));

    api.infoCat(catId).then((response) => {
        const catInfo = response.data;
        const popupCard = document.querySelector('.popup__card');
        popupCard.innerHTML = generatePopup(catInfo);

        const popupClose = document.querySelector('.fa-times');
        popupClose.addEventListener('click', () => {
            clousedPopup(document.querySelector('.popup__card'))
        })

        const editCat = document.querySelector('.fa-edit');

        editCat.addEventListener('click', (e) => {
            e.preventDefault();
            

            openPopup(document.querySelector('#popup__edit'))
            const cardForm = document.querySelector('#form__cat')

            console.log(cardForm)

            cardForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = Object.fromEntries(new FormData(cardForm).entries())
                formData.rate = +formData.rate;
                formData.age = +formData.age;

                api.editCat(catId, formData).then(() => {
                    clousedPopup(document.querySelector('#popup__edit'))
                });
                
            })
        })

    })
});

//Сохранение формы добавления котиков в localStorege

const $formAddCat = document.forms.add_cat;
const rawFormData = localStorage.getItem('add_cat');
const formDataLocalStorage = rawFormData ? JSON.parse(rawFormData) : undefined;

if(formDataLocalStorage) {
    Object.keys(formDataLocalStorage).forEach(key => {
        $formAddCat[key].value = formDataLocalStorage[key];
    })
}

$formAddCat.addEventListener('input', (e) => {
const newFormData = Object.fromEntries(new FormData($formAddCat).entries());
console.log(newFormData)
localStorage.setItem('add_cat', JSON.stringify(newFormData))
});

