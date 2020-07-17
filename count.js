const path = require('path');
const fs = require('fs-extra');
const filename = path.resolve(__dirname, 'config.json');
const { DateTime } = require('luxon');

module.exports = class Count {
    constructor(inputConfig = filename) {
        this.configFilename = inputConfig;
    }

    async loadConfig() {
        return fs.readJSON(this.configFilename);
    }

    async update() {
        const config = await this.loadConfig();
        config.total = this.calcDayDiff(config.startDate);
        this.updateDisplay(config.total);

        return Promise.resolve(config);
    }

    async resetDate() {
        const config = await this.loadConfig();
        config.startDate = DateTime.fromMillis(Date.now()).toISODate();
        this.updateDisplay(0);
        await fs.writeJSON(this.configFilename, config);

        return config;
    }

    updateDisplay(countVal, socketPath = '/tmp/countpipe') {
        return new Promise((resolve, reject) => {
            const socket = fs.createWriteStream(socketPath, {
                emitClose: true,
            });
            socket.write(`${countVal}`);
            socket.close();

            socket.on('close', resolve);
            socket.on('error', reject);
        });
    }

    calcDayDiff(startDateStr) {
        const startDt = DateTime.fromISO(startDateStr);
        const curDate = DateTime.fromMillis(Date.now());

        const { days } = curDate.diff(startDt, 'days').toObject();
        return Math.abs(Math.floor(days));
    }
};
