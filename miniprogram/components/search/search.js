Component({
    methods: {
        emitSearch(e) {
            this.triggerEvent('search', e);
        }
    }
})