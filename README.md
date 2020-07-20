# Pi Count up

This project uses a Raspberry Pi Zero to create a "Count Up" sign where you can track things like **"days since last accident"**.

![Demo of sign](assets/pi-counter-demo.gif)

## Configuration

There are several pieces that need to be configured to interface with the Four Letter pHAT and run your code at startup.

### Four Letter pHAT

Install the library by executing the following command in your Pi Zero's terminal:

```bash
curl https://get.pimoroni.com/fourletterphat | bash
```

### Daemon

Use pm2 to configure your node koa server as a service that runs at startup.

First, globally install pm2 and start up you koa server

```bash
npm install -g pm2
pm2 start pm2.config.js
```

After you confirm that the server is running properly use can use pm2's `startup` sub command to generate a command to add your server as a systemd startup service.

```bash
pm2 startup

# Output should look like the following (copy and paste and run the command)
# sudo env PATH=\$PATH:/usr/local/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi

pm2 save
```

## Python script

You also must run the python script at startup which interfaces with the Four Letter pHAT.

Open your `rc.local` file up as root

```bash
sudo vi /etc/rc.local
```

Copy the following to the bottom of the file (adjust your path to the python file as needed):

```bash
# start python script that will run the counter
sudo -u pi bash -c 'python /home/pi/code/pi-counter/display_count.py&'
```

## Parts

-   [Raspberry Pi Zero W](https://www.adafruit.com/product/3400)
-   [Pimoroni four letter pHAT](https://shop.pimoroni.com/products/four-letter-phat)
-   [Timeskey NFC stickers](https://www.amazon.com/gp/product/B075CFXY8V/)

## Resources

-   [KoaJS](https://koajs.com)
-   [Four letter pHAT source code](https://github.com/pimoroni/fourletter-phat)
-   [QR Code Generator](https://www.qr-code-generator.com/)
