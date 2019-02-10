module.exports = {
    store: {
        storage: {},
        get(key) {
            return this.storage[key];
        },
        set(key, session) {
            this.storage[key] = session;
        },
        destroy(key) {
            delete this.storage[key];
        }
    },
    mySessionStore:{}
};
