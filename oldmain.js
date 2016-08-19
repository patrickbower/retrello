const settings = {
    url: 'https://api.trello.com',
    key: 'bb6807f13b020310a0543a81ebf10765',
    token: 'd89724c1f1285f66151e76c547600c779272f3df7cb7124dabe1f421324bd42c',
    listID: '57b2d4a2afe55af0fbe5f2c6',
    boardID: '57b2d499a88d75c2a259f666'
}

class ReTrello {
    constructor() {

    }

    init() {
        // this.getTrelloData(
        //     this.buildCardUrl(),
        //     this.buildCardName.bind(this)
        // );

        // this.getTrelloData(
        //     this.buildCardUrl()
        // );

        this.buildTiles();
    }

    // getTrelloData (urlType, callBack) {
    //     $.ajax(urlType)
    //     .done(callBack);
    // }

    getTrelloData(urlType) {

        $.ajax({
            url: urlType,
            success: function(data) {
                return data;
            }
        });
    }

    buildCardUrl() {
        return `${settings.url}/1/lists/${settings.listID}/cards?key=${settings.key}&token=${settings.token}`;
    }

    buildCheckListUrl(checkListID) {
        return `${settings.url}/1/checklists/${checkListID}/checkItems?key=${settings.key}&token=${settings.token}`
    }

    buildTiles() {
        console.log(this.getTrelloData(this.buildCardUrl()));
    }

    // buildCardName(data) {
    //     let instance = this;
    //     this.tiles = {};
    //
    //     $.each(data, function(index, card) {
    //
    //         // 1. Create tile object and get and add card name
    //         instance.tiles[index] = {
    //             name: card.name
    //         }
    //
    //         // 2. each card get checklist
    //         let checkListID = card.idChecklists[0];
    //
    //         instance.getTrelloData(
    //             instance.buildCheckListUrl(checkListID),
    //             instance.buildCardChecklist.bind(instance)
    //         )
    //
    //     });
    // }
    //
    // buildCardChecklist(data) {
    //     console.log(this, data);
    // }

    // addTrelloDataToPage (data) {
    //
    //     $.each(data, function(index, card) {
    //
    //         console.log(card);
    //
    //         let checkList = '';
    //         let cardName = card.name;
    //
    //         $.each(card.checkItems, function(index, checkItem) {
    //
    //             let listItem = `<li>${checkItem.name}</li>`
    //             checkList += listItem;
    //         });
    //
    //         $('body').append(`<h1>${cardName}</h1><ul class="card">${checkList}</ul>`);
    //
    //     });
    // }
}
