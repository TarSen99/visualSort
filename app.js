'use strict'

class Field {
    constructor(items) {
        let {field, btnSort, btnStop, btnGen, inputSizeField,
            fieldSize, minValue = 5, maxValue = 100} = items;
        this._isSortingStopped = false;
        this._field = field;
        this._sortBtn = btnSort;
        this._stopBtn = btnStop;
        this._genBtn = btnGen;
        this._inputSizeField = inputSizeField;
        this._fieldSize = fieldSize;
        this._minValue = minValue;
        this._maxValue = maxValue;
        this._startPositionX = 0;
        this._itemWidth = 20;
        this._distanceBtwItems = 2;
        this._swappingTimerId = null;
        this._delayBtwChecking = 300;
        this._delayBtwSortCalls = this._delayBtwChecking / 10;
        this._sortTimerId = null;
        this._waitingForPrevMoveFinishedTimedId = null;
        this._lastCheckingItems = [];

        this._generateField = this._generateField.bind(this);
        this._startSort = this._startSort.bind(this);
        this._sortItems = this._sortItems.bind(this);
        this._clearSort = this._clearSort.bind(this);
        this._generateField();

        this._sortBtn.addEventListener('click', this._startSort);
        this._stopBtn.addEventListener('click', this._clearSort);
        this._genBtn.addEventListener('click', this._generateField);
    }

    _startSort() {
        this._clearSort();

        this._sortTimerId = null;
        this._waitingForPrevMoveFinishedTimedId = null;
        this._isSortingStopped = false;
        this._sortItems();
    }

    _clearSort() {
        this._isSortingStopped = true;
        clearTimeout(this._sortTimerId);
        clearTimeout(this._waitingForPrevMoveFinishedTimedId);
        this._sortTimerId = -1;
    }

    _generateField() {
        this._clearSort();
        let inputValue = +this._inputSizeField.value;

        if(inputValue) {
            this._fieldSize = +this._inputSizeField.value;
        }

        this._field.innerHTML = '';
        for (let i = 0; i < this._fieldSize; i++) {
            let itemHeight = Math.floor(Math.random() * (this._maxValue - this._minValue) +
                this._minValue);

            this._field.insertAdjacentHTML('beforeend', `
                <div class="item" data-height=${itemHeight}></div>
            `);

            let currItem = this._field.lastElementChild;
            currItem.style.width = `${this._itemWidth}px`;
            currItem.style.height = `${itemHeight}px`;

            this._setItemsPositions();
        }
    }

    _sortItems() {
        let sortQueue = this._getQueueOfActions();
        let currentQueueFuncToCall = 0;
        let nextTryToCallDelay = this._delayBtwChecking / 2;

        sort = sort.bind(this);

        function sort() {
            if(this._swappingTimerId !== null) {
                this._waitingForPrevMoveFinishedTimedId = setTimeout(sort, nextTryToCallDelay);
                return;
            }

            if(this._sortTimerId === -1) {
                this._clearItemsStyle()
                return;
            }

             this._sortTimerId = setTimeout( () => {
                 this._clearItemsStyle();

                 sortQueue[currentQueueFuncToCall]();
                 currentQueueFuncToCall++;

                if (currentQueueFuncToCall < sortQueue.length) {
                    sort();
                } else {
                    this._clearItemsStyle();
                }

            }, this._delayBtwSortCalls);
        }

        sort();
    }

    _getQueueOfActions() {
       // let itemsToSort = [...this._field.children];
        let queue = [];

        for (let i = 0; i < this._field.children.length; i++) {
            for (let j = (this._field.children.length - 1); j > i; j--) {
                queue.push(
                    this._checkTwoItems
                        .bind(this, j)
                );
            }
        }

        return queue;
    }

    _checkTwoItems(j) {
        let itemsToSort = [...this._field.children];

        let itemA = itemsToSort[j];
        let itemB = itemsToSort[j - 1];

        this._lastCheckingItems = [itemA, itemB];

        itemA.classList.add('item-active');
        itemB.classList.add('item-active');

        if (+itemB.dataset.height > +itemA.dataset.height) {
            let saveItem = itemsToSort[j];
            itemsToSort[j] = itemB;

            let save = itemA.style.left;
            itemA.style.left = itemB.style.left;

            itemsToSort[j - 1] = saveItem;
            itemB.style.left = save;
        }

        this._swappingTimerId = setTimeout( () => {
            if(!this._isSortingStopped) {
                this._field.prepend(...itemsToSort);
            }
            this._swappingTimerId = null;
        }, this._delayBtwChecking);
    }

    _clearItemsStyle() {
        for(let item of this._lastCheckingItems) {
            item.classList.remove('item-active');
        }
    }

    _setItemsPositions() {
        let items = [...this._field.children];

        for (let i = 0; i < items.length; i++) {
            items[i].style.left = `${this._startPositionX + i *
            (this._itemWidth + this._distanceBtwItems)}px`;
        }
    }
}

let buttonSort = document.querySelector('#sort');
let buttonStop = document.querySelector('#stop');
let buttonGenerate = document.querySelector('#generate');
let inputSize = document.querySelector('#value-input');


let field = new Field({field: document.querySelector('.container'),
    btnSort: buttonSort,
    btnStop: buttonStop,
    btnGen: buttonGenerate,
    inputSizeField: inputSize,
    fieldSize: 40});
