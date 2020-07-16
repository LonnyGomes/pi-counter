const path = require('path');
const fs = require('fs-extra');
const filename = path.resolve(__dirname, 'count.json');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = class Count {
    async init() {
        const curCount = await this.loadCount();
        this.updateDisplay(curCount.total);

        return Promise.resolve(curCount);
    }

    loadCount() {
        return fs.readJSONSync(filename);
    }

    async saveCount(newVal) {
        await fs.writeJSONSync(filename, { total: newVal });

        return this.loadCount();
    }

    async incrementCount() {
        const curCount = await this.loadCount();
        curCount.total += 1;

        // update the hardware display
        this.updateDisplay(curCount.total);

        return await this.saveCount(curCount.total);
    }

    updateDisplay(countVal) {
        const socket = fs.createWriteStream('/tmp/countpipe');
        socket.write(`${countVal}`);
        socket.close();
    }
};
