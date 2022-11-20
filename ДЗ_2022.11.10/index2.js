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
}

    const api = new CatsApi('http://sb-cats.herokuapp.com/api/2/komlyanovna');
api.getAddACat().then((response) => {
    response.data.forEach((post) =>
        $cards.insertAdjacentHTML('beforeend', generateCards(post))
    )
});