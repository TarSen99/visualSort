class Field {
    constructor(field, sortBtn, fieldSize, minValue = 5, maxValue = 100) {
        this._field = field;
        this._sortBtn = sortBtn;
        this._fieldSize = fieldSize;
        this._minValue = minValue;
        this._maxValue = maxValue;
        this._startPositionX = 0;
        this._itemWidth = 20;
        this._distanceBtwItems = 2;

        this._sortItems = this._sortItems.bind(this);

        this._sortBtn.addEventListener('click', this._sortItems);
        this._generateField();
    }

    _generateField() {
        for(let i = 0; i < this._fieldSize; i++) {
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
        let itemsToSort = [...this._field.children];
        let sortedItems = itemsToSort.sort(this._compareValues);

       // this._field.innerHTML = '';
        this._field.append(...sortedItems);

        setTimeout(this._setItemsPositions.bind(this), 100);
    }

    _compareValues(itemA, itemB) {
        let itemAValue = Number(itemA.dataset.height);
        let itemBValue = Number(itemB.dataset.height);

        return itemAValue - itemBValue;
    }

    _setItemsPositions() {
        let items = [...this._field.children];

        for(let i = 0; i < items.length; i++) {
            items[i].style.left = `${this._startPositionX + i *
            (this._itemWidth + this._distanceBtwItems)}px`;
        }
    }
}

let button = document.querySelector('.sort');
let field = new Field(document.querySelector('.container'), button, 50);
console.log('hello');