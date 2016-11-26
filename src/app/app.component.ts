import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {
  Camera,
  OrthographicCamera,
  Scene,
  BufferGeometry,
  BufferAttribute,
  WebGLRenderer,
  Points,
  PointsMaterial,
  ShaderMaterial,
  RawShaderMaterial
} from 'three';

import { ControlService } from './control/control.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  // audio
  public audioElement: HTMLAudioElement;
  public leftAnalyser: AnalyserNode;
  public leftData: Float32Array;
  public rightAnalyser: AnalyserNode;
  public rightData: Float32Array;

  // shaders
  public osciFrag: string;
  public osciGeom: string;
  public osciVert: string;

  // GL
  public camera: Camera;
  public scene: Scene;
  public points: Points;
  public renderer: WebGLRenderer;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _http: Http,
    private _control: ControlService
  ) {}

  private _initAudio() {

    // setup element
    this.audioElement = this._document.createElement('audio');
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.autoplay = true;
    this.audioElement.src = 'http://fillyradio.com:8012/128k_mp3';
    //audioElement.src = 'assets/konichiwa.wav';

    // setup nodes
    let audioContext = new AudioContext();
    let audioSource = audioContext.createMediaElementSource(this.audioElement);
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

  private _loadShaders(next) {
    let getOsciFrag = this._http.get('shaders/osci.frag');
    let getOsciGeom = this._http.get('shaders/osci.geom');
    let getOsciVert = this._http.get('shaders/osci.vert');
    Observable.merge(getOsciFrag, getOsciGeom, getOsciVert)
      .subscribe(
        (response: Response) => {
          let path = response.url.split('/');
          let fileName = path[path.length - 1];
          switch (fileName) {
            case 'osci.frag':
              this.osciFrag = response.text();
              break;
            case 'osci.geom':
              this.osciGeom = response.text();
              break;
            case 'osci.vert':
              this.osciVert = response.text();
              break;
          }
        },
        err => { throw err },
        () => next()
      );
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
      color: 0x00aa00,
      size: 5
    });
    // let material = new RawShaderMaterial({
    // let material = new ShaderMaterial({
    //   fragmentShader: this.osciFrag,
    //   vertexShader: this.osciVert
    // });
    this.points = new Points(geometry, material);
    this.scene.add(this.points);

    // renderer
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearAlpha(1);

    this._animate();
  }

  private _initControl() {
    this._control.controls.togglePlay.subscribe(play => {
      if (play) {
        this.audioElement.play();
      } else {
        this.audioElement.pause();
      }
    });
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
    this._initControl();
    this._animate();
  }

}
