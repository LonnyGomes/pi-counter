const path = require('path');
const fs = require('fs-extra');
const { DateTime } = require('luxon');

const TEST_BASE_PATH = path.resolve(__dirname, 'fixtures');
const TEST_CONFIG_PATH = path.resolve(TEST_BASE_PATH, 'test-config.json');
const TEST_SOCKET_PATH = path.resolve(TEST_BASE_PATH, 'countpipe');
const Count = require('../count');
let count = null;

describe('count', () => {
    afterEach(() => {
        fs.removeSync(TEST_CONFIG_PATH);
        count = null;
    });

    describe('loadConfig', () => {
        it('should load a JSON file with config data', async () => {
            const dt = DateTime.fromMillis(Date.now());
            const startDate = dt.toISODate();
            const inputConfig = {
                startDate,
            };
            fs.writeJSONSync(TEST_CONFIG_PATH, inputConfig);

            count = new Count(TEST_CONFIG_PATH);

            const result = await count.loadConfig();
            expect(result).toEqual(inputConfig);
        });
    });

    describe('update', () => {
        it('should retrieve config and update display', async () => {
            const dt = DateTime.fromMillis(Date.now());
            const startDate = dt.toISODate();
            const inputConfig = {
                startDate,
            };
            const expectedResult = {
                startDate,
                total: 2,
            };

            fs.writeJSONSync(TEST_CONFIG_PATH, inputConfig);

            const loadConfigMock = jest.fn();
            const updateDisplayMock = jest.fn();
            const calcDayDiffMock = jest.fn();

            loadConfigMock.mockReturnValueOnce(Promise.resolve(inputConfig));
            calcDayDiffMock.mockReturnValueOnce(2);

            count = new Count(TEST_CONFIG_PATH);
            count.loadConfig = loadConfigMock;
            count.updateDisplay = updateDisplayMock;
            count.calcDayDiff = calcDayDiffMock;

            const result = await count.update();

            expect(loadConfigMock.mock.calls.length).toBe(1);

            expect(updateDisplayMock.mock.calls.length).toBe(1);
            expect(updateDisplayMock.mock.calls[0][0]).toBe(2);

            expect(calcDayDiffMock.mock.calls.length).toBe(1);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('resetDate', () => {
        it('should update config startDate with currentDate', async () => {
            const dt = DateTime.fromMillis(Date.now());
            const startDate = dt.toISODate();
            const inputConfig = {
                startDate: '1981-07-28',
            };
            const expectedResult = {
                startDate,
            };

            fs.writeJSONSync(TEST_CONFIG_PATH, inputConfig);
            count = new Count(TEST_CONFIG_PATH);

            const result = await count.resetDate();
            expect(result).toEqual(expectedResult);

            const newConfig = fs.readJSONSync(TEST_CONFIG_PATH);
            expect(newConfig).toEqual(expectedResult);
        });
    });

    describe('updateDisplay', () => {
        afterEach(() => {
            fs.removeSync(TEST_SOCKET_PATH);
        });

        it('should write count value to a write stream', async () => {
            const inputCount = 3;
            const expectedCount = '3';
            count = new Count(TEST_CONFIG_PATH);
            await count.updateDisplay(inputCount, TEST_SOCKET_PATH);

            const result = fs.readFileSync(TEST_SOCKET_PATH);

            expect(result.toString()).toEqual(expectedCount);
        });
    });

    describe('calcDayDiff', () => {
        it('should return zero if there is no difference', () => {
            count = new Count(TEST_CONFIG_PATH);
            const dt = DateTime.fromMillis(Date.now());
            const startDate = dt.toISODate();

            const result = count.calcDayDiff(startDate);
            expect(result).toEqual(0);
        });

        it('should return day difference', () => {
            count = new Count(TEST_CONFIG_PATH);
            const dt = DateTime.fromMillis(Date.now()).minus({ days: 2 });
            const startDate = dt.toISODate();

            const result = count.calcDayDiff(startDate);
            expect(result).toEqual(2);
        });

        it('should only return positive numbers', () => {
            count = new Count(TEST_CONFIG_PATH);
            const dt = DateTime.fromMillis(Date.now()).plus({ days: 2 });
            const startDate = dt.toISODate();

            const result = count.calcDayDiff(startDate);
            expect(result).toEqual(2);
        });
    });
});
