import { Component, Event, EventEmitter, Method, Prop, h } from '@stencil/core';
import { BarcodeFormat, DecodeHintType, NotFoundException as BarcodeNotFoundException } from '@zxing/library';
import { BrowserMultiFormatReader } from '@zxing/library/esm5/browser/BrowserMultiFormatReader';

@Component({
  tag: 'hei-barcode-scanner',
  styleUrl: 'barcode-scanner.css',
  shadow: true,
})
export class BarcodeScanner {

  private canEmit = true;
  private codeReader: BrowserMultiFormatReader;
  private devices: MediaDeviceInfo[];
  private selectedDeviceIndex = 0;
  private selectedDeviceId: string;
  private videoElement: HTMLVideoElement;

  @Prop() height = 'auto';
  @Prop() width = 'auto';
  // Debounce time after a scan
  @Prop() debounce = 0;

  @Event() scanned: EventEmitter;
  @Event() error: EventEmitter;
  @Event() retrievedVideoDevices: EventEmitter;

  constructor() {
    const hints = new Map();
    // Only support these barcode formats
    const formats = [BarcodeFormat.CODE_128, BarcodeFormat.EAN_13, BarcodeFormat.UPC_E];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    this.codeReader = new BrowserMultiFormatReader(hints);
  }

  scannedHandler(barcode: string, format: string) {
    if (this.canEmit) {
      this.canEmit = false;

      this.scanned.emit({ barcode, format });

      // We only want to emit after debounce time is over
      setTimeout(() => {
        this.canEmit = true;
      }, this.debounce);
    }
  }

  errorHandler(msg: string) {
    this.error.emit(msg);
  }

  retrievedVideoDevicesHandler(devices: MediaDeviceInfo[]) {
    this.retrievedVideoDevices.emit(devices);
  }

  @Method()
  async toggleDevice() {
    this.selectedDeviceIndex = this.selectedDeviceIndex + 1 === this.devices.length ?
      0 :
      this.selectedDeviceIndex + 1;

    this.selectedDeviceId = this.devices[this.selectedDeviceIndex].deviceId;

    this.codeReader.reset();
    this.startDecoding();
  }

  startDecoding() {
    // document.getElementById('startButton').addEventListener('click', () => {
    this.codeReader.decodeFromVideoDevice(this.selectedDeviceId, this.videoElement, (result, err) => {
      if (result && !err) {
        // this.resultElement.textContent = result.getText();
        this.scannedHandler(result.getText(), BarcodeFormat[result.getBarcodeFormat()]);
      }
      if (err && !(err instanceof BarcodeNotFoundException)) {
        console.error(err);
      }
    })
      .then(result => {
        console.log('done, result:', result);
      })
      .catch(result => {
        console.log('something went wrong:', result);
      });
  }

  componentWillLoad() {
    this.codeReader.listVideoInputDevices()
      .then((devices: MediaDeviceInfo[]) => {
        console.log(`hardware camera devices: ${ JSON.stringify(devices, null, 2)}`);
        this.devices = devices;
        this.retrievedVideoDevicesHandler(this.devices);
        // Select fist device by default
        this.selectedDeviceId = devices[this.selectedDeviceIndex].deviceId;
      })
      .catch(err => {
        console.error(err);
      });
  }

  componentDidRender() {
    this.startDecoding();
  }

  disconnectedCallback() {
    this.codeReader.reset();
    console.log('Reset.');
  }

  render() {
    const cssVideo = {
      width: this.width,
      height: this.height,
      position: 'absolute',
      objectFit: 'cover',
      left: '50%',
      transform: 'translateX(-50%)',
    };

    return <video class="scanner__video" ref={el => this.videoElement = el} style={cssVideo}></video>;
  }
}
