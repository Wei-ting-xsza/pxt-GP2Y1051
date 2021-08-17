//% weight=0 color=#59c631 icon="\uf0ad" block="PM2.5"
namespace GP2Y1051 {
    //% blockId="getData" block="Set %pin the data of PM2.5(ug/m3)"
    //% weight=90 blockGap=20 blockInlineInputs=true   
    export function getData(pin: SerialPin): number {
        let value = 0
        let head = 0
        let incomeByte: number[] = [0, 0, 0, 0, 0, 0]
        let temp: Buffer
        serial.redirect(
            SerialPin.USB_TX,
            pin,
            BaudRate.BaudRate2400
        )        
        head = serial.readBuffer(1).getNumber(NumberFormat.UInt8BE, 0)
        while (value == 0) {
            while (head != 170) {
                head = serial.readBuffer(1).getNumber(NumberFormat.UInt8BE, 0)
            }
            temp = serial.readBuffer(6)
            for (let i = 0; i < 6; i++) {
                incomeByte[i] = temp.getNumber(NumberFormat.UInt8BE, i)
            }
            if (incomeByte[5] == 255 && (incomeByte[0] + incomeByte[1] + incomeByte[2] + incomeByte[3]) == incomeByte[4]) {
                let vo = (incomeByte[0] * 256 + incomeByte[1]) / 1024 * 5
                value = vo*700
            }else {
                incomeByte = [0, 0, 0, 0, 0, 0]
            }
        }
        return Math.round(value)
    }
}