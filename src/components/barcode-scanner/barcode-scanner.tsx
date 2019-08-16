import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { NotFoundException as BarcodeNotFoundException } from '@zxing/library';
import { BrowserMultiFormatReader } from '@zxing/library/esm5/browser/BrowserMultiFormatReader';

@Component({
  tag: 'hei-barcode-scanner',
  styleUrl: 'barcode-scanner.css',
  shadow: true,
})
export class BarcodeScanner {

  private codeReader: BrowserMultiFormatReader;
  private selectedDeviceId: string;
  // private resultElement: HTMLElement;
  private videoElement: HTMLVideoElement;

  @Prop() height = 'auto';
  @Prop() width = 'auto';

  @Event() scanned: EventEmitter;
  @Event() error: EventEmitter;

  constructor() {
    this.codeReader = new BrowserMultiFormatReader();
  }

  scannedHandler(barcode: string) {
    this.scanned.emit(barcode);
  }

  errorHandler(msg: string) {
    this.error.emit(msg);
  }

  componentWillLoad() {
    this.codeReader.listVideoInputDevices()
      .then((devices: MediaDeviceInfo[]) => {
        // const sourceSelect = document.getElementById('sourceSelect')
        // for now select fist device by default
        console.log(`hardware camera device: ${devices[0]}`);
        this.selectedDeviceId = devices[0].deviceId;
        // if (videoInputDevices.length >= 1) {
        //   videoInputDevices.forEach((element) => {
        //     const sourceOption = document.createElement('option')
        //     sourceOption.text = element.label
        //     sourceOption.value = element.deviceId
        //     sourceSelect.appendChild(sourceOption)
        //   })
        //   sourceSelect.onchange = () => {
        //     selectedDeviceId = sourceSelect.value;
        //   };
        //   const sourceSelectPanel = document.getElementById('sourceSelectPanel')
        //   sourceSelectPanel.style.display = 'block'
        // }
      })
      .catch(err => {
        console.error(err);
      });
  }

  componentDidRender() {
    // document.getElementById('startButton').addEventListener('click', () => {
    this.codeReader.decodeFromVideoDevice(this.selectedDeviceId, this.videoElement, (result, err) => {
      if (result) {
        console.log(result);
        // this.resultElement.textContent = result.getText();
        this.scannedHandler(result.getText());
      } else {
        console.log('Error starting continuous decoding..', err);
        if (err && !(err instanceof BarcodeNotFoundException)) {
          console.error(err);
          this.errorHandler(err.message);
          // this.resultElement.textContent = JSON.stringify(err);
        }
      }
    })
      .then(result => {
        console.log('done, result:', result);
      })
      .catch(result => {
        console.log('something went wrong:', result);
      });

  }

  disconnectedCallback() {
    this.codeReader.reset();
    // this.resultElement.textContent = '';
    console.log('Reset.');
  }

  render() {

    const cssVideo = {
      width: this.width, //> this.height ? 'initial' : '100%',
      height: /*this.width >*/ this.height, // ? '100%' : 'initial',
      // position: 'absolute',
      // left: '50%',
      // transform: 'translateX(-50%)',
    };

    return <video class="scanner__video" ref={el => this.videoElement = el} style={cssVideo}></video>;
  }
}
