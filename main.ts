/**
 * KSR037 V0.010
 */
//% weight=10 color=#00A6F0 icon="\uf1b9" block="miniQ Car"
namespace KSR037 {


    export enum MotorNum {
        //% blockId="M1A" block="Right"
        M1A = 0,
        //% blockId="M1B" block="Left"
        M1B = 1,

    }
    export enum LedNum {
        //% blockId="Left_LED" block="Left"
        L_LED = 0,
        //% blockId="Right_LED" block="Right"
        R_LED = 1,

    }
    export enum Track {
        //% blockId="TrackLeft" block="Left"
        Left = 0,
        //% blockId="TrackRight" block="Right"
        Right = 1,
    }

    export enum RunState {
        //% blockId="Go_Forward" block="Forward"
        Forward = 0,
        //% blockId="Car_Back" block="Backward"
        Back = 1,
        //% blockId="Go_Left" block="Left"
        Left = 2,
        //% blockId="GO_Right" block="Right"
        Right = 3,
        //% blockId="Go_Stop" block="Stop"
        Stop = 4,

    }
    let initialized = false;
    let neoStrip: neopixel.Strip;



    function init(): void {
        pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
        pins.setPull(DigitalPin.P15, PinPullMode.PullUp);


        initialized = true;
    }



    //% blockId=KSR037_Ultrasonic 
    //% block="Ultrasonic(cm)"
    //% weight=98
    export function Ultrasonic(): number {

        let maxCmDistance = 500
        // send pulse
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone);
        pins.digitalWritePin(DigitalPin.P13, 0);
        control.waitMicros(2);
        pins.digitalWritePin(DigitalPin.P13, 1);
        control.waitMicros(10);
        pins.digitalWritePin(DigitalPin.P13, 0);

        const d = pins.pulseIn(DigitalPin.P13, PulseValue.High, maxCmDistance * 58);
        // read pulse

        return Math.idiv(d, 58);
    }


    //% blockId="KSR037_RGBR" 
    //% block="RGBLED_R"
    //% weight=96
    export function RGBLED_R(): neopixel.Strip {
        if (!neoStrip) {
            neoStrip = neopixel.create(DigitalPin.P16, 2, NeoPixelMode.RGB)

        }

        return neoStrip.range(0, 1);
    }

    //% blockId="KSR037_RGBL" 
    //% block="RGBLED_L"
    //% weight=96
    export function RGBLED_L(): neopixel.Strip {
        if (!neoStrip) {
            neoStrip = neopixel.create(DigitalPin.P16, 2, NeoPixelMode.RGB)

        }

        return neoStrip.range(1, 1);
    }

    //% blockId=KSR037_Track
    //% block="Track Sensor %sensor"
    //% weight=97
    export function Read_Track(sensor: Track): number {
        if (!initialized) {
            init()
        }
        if (sensor == Track.Left) {
            return pins.digitalReadPin(DigitalPin.P15)
        } else if (sensor == Track.Right) {
            return pins.digitalReadPin(DigitalPin.P14)
        } else {
            return -1
        }
    }



    //% blockId=KSR037_Motor 
    //% block="Motor channel %channel|speed %speed"
    //% weight=85
    //% speed.min=-255 speed.max=255
    export function Motor(channel: MotorNum, speed: number): void {
        if (!initialized) {
            init()
        }
        //M1A=Right , M1B=Left
        //P8 P1 =Left ,  P12 P2 =Right

        switch (channel) {
            case MotorNum.M1A:
                if (speed >= 0) {
                    pins.digitalWritePin(DigitalPin.P12, 1)
                    pins.analogWritePin(AnalogPin.P2, 1023-(speed*4))
                    
                } else {
                    pins.digitalWritePin(DigitalPin.P12, 0)
                    pins.analogWritePin(AnalogPin.P2, -(speed*4))
                }
                break;
            case MotorNum.M1B:
                if (speed >= 0) {
                    pins.digitalWritePin(DigitalPin.P8, 0)
                    pins.analogWritePin(AnalogPin.P1, (speed*4))
                    
                } else {
                    pins.digitalWritePin(DigitalPin.P8, 1)
                    pins.analogWritePin(AnalogPin.P1, 1023-(-speed*4))

                }
                break;

        }


    }


    //% blockId=KSR037_Motor_Car
    //% block="Motor_Car %index|L_speed %lspeed|R_speed %rspeed"
    //% weight=87
    //% lspeed.min=-255 lspeed.max=255 rspeed.min=-255 rspeed.max=255
    export function Motor_Car(index: RunState, lspeed: number, rspeed: number): void {
        switch (index) {
            case RunState.Forward:
                Motor(MotorNum.M1B, lspeed);
                Motor(MotorNum.M1A, rspeed);
                break;
            case RunState.Back:
                Motor(MotorNum.M1B, -lspeed);
                Motor(MotorNum.M1A, -rspeed);
                break;
            case RunState.Left:
                Motor(MotorNum.M1B, lspeed);
                Motor(MotorNum.M1A, rspeed);
                break;
            case RunState.Right:
                Motor(MotorNum.M1B, lspeed);
                Motor(MotorNum.M1A, rspeed);
                break;
            case RunState.Stop:
                Motor(MotorNum.M1B, 0);
                Motor(MotorNum.M1A, 0);
                break;

        }
    }





}
