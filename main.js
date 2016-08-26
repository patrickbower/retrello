const settings = {
    url: 'https://api.trello.com',
    key: 'bb6807f13b020310a0543a81ebf10765',
    token: 'd89724c1f1285f66151e76c547600c779272f3df7cb7124dabe1f421324bd42c',
    toDoListID: '57b2d4a2afe55af0fbe5f2c6',
    doneListID: '57b6d8877bc2ff705a1b58ce',
    boardID: '57b2d499a88d75c2a259f666',
    timer: 20
}

class ReTrello {
    constructor() {

    }

    init() {
        this.getCards();
        this.inputBindEvents();
    }

    /*
    * Utils
    *
    */
    fetch(urlString, callBack) {
        $.ajax(urlString).done(callBack);
    }

    buildCardsUrl(id) {
        return `${settings.url}/1/lists/${id}/cards?key=${settings.key}&token=${settings.token}`
    }

    buildListsUrl(id) {
        return `${settings.url}/1/cards/${id}/idList?key=${settings.key}&token=${settings.token}&value=${settings.doneListID}`
    }

    addNewCardUrl() {
        return `${settings.url}/1/cards?key=${settings.key}&token=${settings.token}`
    }

    /*
    * Cards
    *
    */
    getCards() {
        this.fetch(
            this.buildCardsUrl(settings.toDoListID),
            this.createTile.bind(this)
        );
    }

    createTile(cardsData) {
        let instance = this;
        let list = $('.list');

        $.each(cardsData, function(index, card) {
            list.append(`
                <li class="tile" id="${card.id}">
                ${card.name}
                <a href="#" class="close">
                &#10005;
                <a>
                </li>`
            )
        });

        this.bindEvents();
    }

    bindEvents() {
        let instance = this;

        $('.list').on('click', '.close', function(event){
            let id = $(this).parent().attr('id');
            instance.moveCard(id);
            instance.removeCard(id);
        });

        $('.list').on('click', '.tile', function(event){
            console.log('active', $(this));
            $(this).toggleClass('active');
        });

    }

    moveCard(id) {

        $.ajax({
            url: this.buildListsUrl(id),
            type: 'PUT',
            success: function(result) {
                console.log('removed');
            }
        })
    }

    removeCard(id) {
        $('#' + id)
            .fadeOut(900)
            .delay(900)
            .remove();
    }

    /*
    * Input
    *
    */
    inputBindEvents() {
        let instance = this;

        $('.input').keypress(function(event) {
            if (event.which === 13 && $(this).val().length > 2) {

                let inputValue = $(this).val();
                instance.createTrelloCard(inputValue);
            }
        });
    }

    createTrelloCard(inputValue){

        let newCard = {
            name: inputValue,
            desc: 'test',
            idList: settings.toDoListID,
            pos: 'top'
        };

        let name = inputValue;
        let desc = 'test';
        let listID = settings.toDoListID;

        $.ajax({
            url: this.addNewCardUrl(),
            type: 'POST',
            data: newCard,
            success: function(result) {
                location.reload();
            }
        })
    }
}

let retrello = new ReTrello();
retrello.init();


class Timer {
    constructor() {

    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        let instance = this;

        $('.toggle-timer').on('click', function(){
            event.preventDefault();
            instance.toggleTimer();
        });

        $('.start-timer').on('click', function(event){
            event.preventDefault();
            instance.countdown(settings.timer);
        });
    }

    toggleTimer() {
        console.log('toggle');
        $('.timer').toggle();
    }

    countdown(minutes) {
        let instance = this;
        let seconds = 60;
        let mins = minutes

        function tick() {

            let counter = $('.timer-clock');
            let current_minutes = mins-1;
            seconds--;

            counter.text(current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds));

            if (seconds > 0) {

                setTimeout(tick, 1000);

            } else {
                if (mins > 1){
                    instance.countdown(mins-1);
                } else {
                    $('.alarm')[0].play();
                }
            }
        }
        tick();
    }
}

let timer = new Timer();
timer.init();
