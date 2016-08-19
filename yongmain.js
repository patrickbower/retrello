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
        this.getCards();
    }

    /*
     * Utils
     *
     */
    fetch(urlString, callBack) {
        $.ajax(urlString).done(callBack);
    }

    buildCardUrl() {
        return `${settings.url}/1/lists/${settings.listID}/cards?key=${settings.key}&token=${settings.token}`;
    }

    buildCheckListUrl(checkListID) {
        return `${settings.url}/1/checklists/${checkListID}/checkItems?key=${settings.key}&token=${settings.token}`
    }

    test(){
        return 'test';
    }

    /*
     * Application
     *
     */
    getCards() {
        this.fetch(
            this.buildCardUrl(),
            this.createTile.bind(this)
        );
    }

    createTile(cardsData) {
        let instance = this;

        $.each(cardsData, function(index, card) {

            instance.tile = {
                name: card.name,
                checklist_id: card.idChecklists[0]
            }

            instance.getChecklists.bind(this);
        });
    }

    getChecklists(){
        this.fetch(
            this.buildCheckListUrl(this.tile.checklist_id),
            this.createChecklist.bind(this)
        );
    }

    createChecklist(listData){
        console.log(this, listData);
    }
}
