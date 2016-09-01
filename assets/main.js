const settings = {
    trello_url: 'https://api.trello.com',
    trello_key: 'bb6807f13b020310a0543a81ebf10765',
    trello_token: 'd89724c1f1285f66151e76c547600c779272f3df7cb7124dabe1f421324bd42c',
    todo_list_id: '57b2d4a2afe55af0fbe5f2c6',
    done_list_id: '57b6d8877bc2ff705a1b58ce',
    board_id: '57b2d499a88d75c2a259f666'
};

class ReTrello {
    constructor() {

    }

    init() {
        this.getCards();
    }

    cardsUrl() {
        return `${settings.trello_url}/1/lists/${settings.todo_list_id}/cards?key=${settings.trello_key}&token=${settings.trello_token}`
    }

    generateUrl(request) {
        return `${settings.trello_url}/1/${request}?&key=${settings.trello_key}&token=${settings.trello_token}`;
    }

    ajaxGet(url, index) {
        $.ajax({
            url: url,
            type: 'GET'
        }).done(this.getCardsInformation.bind(this));
    }

    getItem(cardId, items) {
        return items.map(item => {
            let url = this.generateUrl(item);

            return $.ajax(url);
        });
    }

    getCardInformation(cardId, cardItems, url) {
        let items = cardItems.map(id => {
            return `${url}/${id}`;
        });

        if (items.length === 0) {
            return;
        }

        return Promise.all(this.getItem(cardId, items));
    }

    getCardsInformation(cards) {
        cards.forEach(card => {
            let items = [
                {
                    cardItems: card.idChecklists,
                    url: 'checklists'
                },
                {
                    cardItems: card.idLabels,
                    url: 'labels'
                }
            ];

            let requests = items.map(item => {
                return this.getCardInformation(card.id, item.cardItems, item.url);
            });

            Promise.all(requests)
                .then(cardRequests => {
                    this.returnCard(card, cardRequests);
                })
        });
    }

    returnCard(card, cardRequests) {
        Promise.all(cardRequests)
            .then(item => {

                let cardData = {
                    card_id: card.id,
                    name: card.name,
                    checklist: this.getCardChecklist(item[0]),
                    label: this.getCardLabel(item[1])
                }

                this.render(cardData);
            });
    }

    getCardChecklist(item){
        if (item) {
            return {
                id: item[0].id,
                list: item[0].checkItems
            }
        }
    }

    getCardLabel(item) {
        if (item) {
            return {
                id: item[0].id,
                label: item[0].name
            }
        }
    }

    getCards() {
        let cards_url = this.cardsUrl();
        let start_index = 0;
        this.ajaxGet(cards_url, start_index);
    }

    render(card) {
        // card - opional state (label)
        let card_head = card.label ? `<li id=${card.card_id} class="card active">` : `<li id=${card.card_id} class="card">`;
        // title
        let card_name = `<span class="card__name">${card.name}</span>`;
        // checklist - optional
        let card_checklist = '';
        if (card.checklist) {
            let list = '';
            for (var item of card.checklist.list) {
                if (item.state === 'complete') {
                    list += `
                        <li class="card__checklist-item" id="${item.id}">
                            <a class="card__checklist-link done" href="#">
                                ${item.name}
                            </a>
                        </li>`
                } else {
                    list += `
                        <li class="card__checklist-item" id="${item.id}">
                            <a class="card__checklist-link" href="#">
                                ${item.name}
                            </a>
                        </li>`
                }
            }

            card_checklist = `<ul class="card__checklist" id="${card.checklist.id}">${list}</ul>`
        } else {
            card_checklist = `<ul class="card__checklist"></ul>`
        }

        $('#todo').append(`
            ${card_head}
                <a class="card__close" href="#">&#10005;</a>
                ${card_name}
                ${card_checklist}
                <input type="text" class="card__add-to-checklist" placeholder="+"/>
            </li>`
        )
    }
}

let retrello = new ReTrello();
retrello.init();
