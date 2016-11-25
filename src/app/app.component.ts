import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  Camera,
  OrthographicCamera,
  Scene,
  BufferGeometry,
  BufferAttribute,
  WebGLRenderer,
  Points,
  PointsMaterial
} from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  // audio
  public leftAnalyser: AnalyserNode;
  public leftData: Float32Array;
  public rightAnalyser: AnalyserNode;
  public rightData: Float32Array;

  // GL
  public camera: Camera;
  public scene: Scene;
  public points: Points;
  public renderer: WebGLRenderer;

  private _initAudio() {

    // setup element
    let audioElement = document.createElement('audio');
    audioElement.crossOrigin = 'anonymous';
    audioElement.autoplay = true;
    //audioElement.src = 'http://fillyradio.com:8012/128k_mp3';
    audioElement.src = 'assets/konichiwa.wav';

    // setup nodes
    let audioContext = new AudioContext();
    let audioSource = audioContext.createMediaElementSource(audioElement);
    let splitter = audioContext.createChannelSplitter(2);
    this.leftAnalyser = audioContext.createAnalyser();
    //leftAnalyser.fftSize = 256;
    this.rightAnalyser = audioContext.createAnalyser();
    //rightAnalyser.fftSize = 256;
    let audioDestination = audioContext.destination;

    // wire up nodes
    audioSource.connect(splitter);
    splitter.connect(this.leftAnalyser, 0);
    splitter.connect(this.rightAnalyser, 1);
    audioSource.connect(audioDestination);

    this.leftData = new Float32Array(this.leftAnalyser.frequencyBinCount);
    this.rightData = new Float32Array(this.rightAnalyser.frequencyBinCount);

  }

  private _initGL() {

    // camera
    let aspect = window.innerWidth / window.innerHeight;
    let viewSize = 400;
    this.camera = new OrthographicCamera(viewSize * aspect / - 2, viewSize * aspect / 2, viewSize / 2, viewSize / - 2, 1, 10000);
    this.camera.position.z = 1000;

    // scene
    this.scene = new Scene();

    // points
    let geometry = new BufferGeometry();
    geometry.addAttribute('position', new BufferAttribute(new Float32Array(this.leftAnalyser.frequencyBinCount * 3), 3));
    let material = new PointsMaterial({
      sizeAttenuation: false,
      color: 0x0000ff
    });
    this.points = new Points(geometry, material);
    this.scene.add(this.points);

    // renderer
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

  }

  private _animate() {

      requestAnimationFrame(() => this._animate());

      // read audio data
      this.leftAnalyser.getFloatTimeDomainData(this.leftData);
      this.rightAnalyser.getFloatTimeDomainData(this.rightData);

      // generate vertices
      let vertices = (<any>this.points.geometry).attributes.position.array;
      for (let i = 0; i < this.leftAnalyser.frequencyBinCount; i++) {
        let left = this.leftData[i] * 200;
        let right = this.rightData[i] * 200;
        vertices[i*3] = left;
        vertices[i*3+1] = right;
        vertices[i*3+2] = 0;
      }

      // draw
      (<any>this.points.geometry).setDrawRange( 0, this.leftAnalyser.frequencyBinCount );
      (<any>this.points.geometry).attributes.position.needsUpdate = true;
      this.renderer.render(this.scene, this.camera);

  }

  public ngOnInit() {
    this._initAudio();
    this._initGL();
  }

  public ngAfterViewInit() {
    this._animate();
  }

}
