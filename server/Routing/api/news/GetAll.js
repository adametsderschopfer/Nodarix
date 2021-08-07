class NewsGetAll extends Core.Route {
    constructor(arg) {
        super(arg);
    }

    async result() {
        const task = CAgent.schedule('* * * * *', () =>  {
            console.log(new Date())
            task.stop();
        });

        this.render("/header.ejs");
    }
}

module.exports = NewsGetAll;
