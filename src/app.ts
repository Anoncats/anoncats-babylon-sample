import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { 
  Engine, 
  Scene, 
  ArcRotateCamera, 
  Vector3, 
  HemisphericLight, 
  Mesh, 
  MeshBuilder,
} from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { ethers } from "ethers";
import {connectToInjectedProvider} from "./utils";

/*
 * Setup Canvas
 */
const canvas = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.id = "renderCanvas";
document.body.appendChild(canvas);

const engine = new Engine(canvas, true);

/*
 * State variables
 */
var isConnected = false;
var provider;
var signer;
var account;

/*
 * Setup Scene
 */
const createScene = () : Scene => {
  const scene = new Scene(engine);

  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

  const ground = MeshBuilder.CreateGround("ground", {width: 20, height: 20});

  var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
    "baseUI"
  );

  var accountText = new GUI.TextBlock("accountText");
  accountText.color = "white";
  accountText.outlineColor = "black";
  accountText.outlineWidth = 4;
  accountText.fontSize = 16;
  accountText.textHorizontalAlignment = 1;
  accountText.textVerticalAlignment = 0;

  var connectButton = GUI.Button.CreateImageButton(
    "connectButton",
    "Connect Metamask",
    "images/metamask.png"
  );
  connectButton.width = 0.3;
  connectButton.height = "40px";
  connectButton.horizontalAlignment = 1;
  connectButton.verticalAlignment = 0;
  connectButton.color = "black";
  connectButton.background = "white";
  connectButton.onPointerUpObservable.add(() => {
    (window as any).ethereum.enable().then(res => {
      account = res[0];
      provider = new ethers.providers.Web3Provider((window as any).ethereum);
      signer = provider.getSigner;
      advancedTexture.removeControl(connectButton);
      advancedTexture.addControl(accountText);
      isConnected = true;
      accountText.text = account;
    });
  })
  advancedTexture.addControl(connectButton);

  // hide and show inspector
  window.addEventListener("keydown", (ev) => {
    // Shift+Ctrl+Alt+I
    if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.code === "KeyI") {
      if (scene.debugLayer.isVisible()) {
        scene.debugLayer.hide();
      } else {
        scene.debugLayer.show();
      }
    }
  });

  return scene;
}

const scene = createScene();

/*
 * Render Loop
 */
engine.runRenderLoop(() => {
  scene.render();
})

window.addEventListener("resize", () => {
  engine.resize();
})