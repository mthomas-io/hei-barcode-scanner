import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { NotFoundException as BarcodeNotFoundException } from '@zxing/library';
import { BrowserMultiFormatReader } from '@zxing/library/esm5/browser/BrowserMultiFormatReader';

interface IScanResultEvent {
  success: boolean;
  text: string;
}

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

  @Prop() height = '800px';
  @Prop() width = '300px';

  @Event() scanned: EventEmitter;

  constructor() {
    this.codeReader = new BrowserMultiFormatReader();
  }

  scannedHandler(result: IScanResultEvent) {
    this.scanned.emit(result);
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
    this.codeReader.decodeFromInputVideoDevice(this.selectedDeviceId, this.videoElement)
      .then(result => {
        if (result) {
          console.log(result);
          // this.resultElement.textContent = result.getText();
          this.scannedHandler({
            success: true,
            text: result.getText(),
          });
        }
      })
      .catch(err => {
        console.log('Error starting continuous decoding..', err);
        if (err && !(err instanceof BarcodeNotFoundException)) {
          console.error(err);
          this.scannedHandler({
            success: false,
            text: err.message,
          });
          // this.resultElement.textContent = JSON.stringify(err);
        }
      });

  }

  disconnectedCallback() {
    this.codeReader.reset();
    // this.resultElement.textContent = '';
    console.log('Reset.');
  }

  render() {

    const cssVideo = {
      width: this.width > this.height ? 'initial' : '100%',
      height: this.width > this.height ? '100%' : 'initial',
      // position: 'absolute',
      // left: '50%',
      // transform: 'translateX(-50%)',
    };

    return <video class="scanner__video" ref={el => this.videoElement = el} style={cssVideo}></video>;
  }
}
