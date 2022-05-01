import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { CubeTexture, StandardMaterial } from "@babylonjs/core/Materials";

import { TerrainMaterial } from '@babylonjs/materials/terrain';

import { AdvancedDynamicTexture, Button, Line } from '@babylonjs/gui/2D';

import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Animations/animatable";

import { AxesViewer } from "@babylonjs/core/Debug/axesViewer";

import { Event, EventBus, Message } from "./events/external/event-bus";
import { environment as ENV } from "../../environments/environment";

export class App {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: UniversalCamera;
    private _light: HemisphericLight;
    private _AdvancedDynamicTexture: AdvancedDynamicTexture;

    constructor(canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new Engine(this._canvas, true);
        this._scene = new Scene(this._engine);
        this._camera = new UniversalCamera('UniversalCamera', new Vector3(10, 0, 250), this._scene);
        this._light = new HemisphericLight('HemisphericLight', new Vector3(1, 1, 0), this._scene);
        this._AdvancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI("myUI");
    }

    run() {
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        this.createScene();
        this.doRender();
    }

    private createScene(): void {
        this._scene.clearColor = new Color4(0.92, 0.96, 0.97);

        this._camera.setTarget(new Vector3(0, 0, 0));
        this._camera.speed = 5;
        this._camera.attachControl(this._canvas, false);

        
        //new AxesViewer(this._scene, 5,1);

        const ground = MeshBuilder.CreateGround('ground', { width: 10000, height: 10000, subdivisions: 1 }, this._scene);
        ground.position = new Vector3(0, 0, 0);
        ground.renderingGroupId = 1

        var terrainMaterial = new TerrainMaterial("terrainMaterial", this._scene);
        terrainMaterial.specularColor = new Color3(0.5, 0.5, 0.5);
        terrainMaterial.specularPower = 64;
        terrainMaterial.mixTexture = new Texture(`${ENV.assetsUrl}/assets/3d/envs/terrains/ground-grass/stencil.png`, this._scene);
        terrainMaterial.diffuseTexture1 = new Texture(`${ENV.assetsUrl}/assets/3d/envs/terrains/ground-grass/ground-grass.png`, this._scene);
        terrainMaterial.diffuseTexture2 = new Texture(`${ENV.assetsUrl}/assets/3d/envs/terrains/ground-grass/ground-grass.png`, this._scene);
        terrainMaterial.diffuseTexture3 = new Texture(`${ENV.assetsUrl}/assets/3d/envs/terrains/ground-grass/ground-grass.png`, this._scene);
        terrainMaterial.diffuseTexture1.uScale = terrainMaterial.diffuseTexture1.vScale = 500;
        terrainMaterial.diffuseTexture2.uScale = terrainMaterial.diffuseTexture2.vScale = 500;
        terrainMaterial.diffuseTexture3.uScale = terrainMaterial.diffuseTexture3.vScale = 500;

        ground.material = terrainMaterial;

        SceneLoader.ImportMeshAsync('', `${ENV.publicAssetsUrl}/assets/3d/models/low-poly/character/basic/`, 'basic-animated.glb').then((character) => {
            character.meshes.forEach((mesh) => mesh.renderingGroupId = 1);
             this.addButton(0,'Say Hello !', character.meshes[0]);
        });

        var skybox = Mesh.CreateBox("skyBox", 100, this._scene);
        skybox.position = new Vector3(0, 49, 0);
        var skyboxMaterial = new StandardMaterial("skyBox", this._scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        skyboxMaterial.reflectionTexture = new CubeTexture(`${ENV.assetsUrl}/assets/3d/envs/skyboxes/sunrise/`, this._scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skybox.renderingGroupId = 0;
    }

    private doRender(): void {
        this._engine.runRenderLoop(() => {
            this._scene.render();

            if (this._camera.position.y < 10) this._camera.position.y = 10;
            if (this._camera.position.y > 100) this._camera.position.y = 100;
            if (this._camera.position.x > 550) this._camera.position.x = 550;
            if (this._camera.position.x < -550) this._camera.position.x = -550;
            if (this._camera.position.z > 550) this._camera.position.z = 550;
            if (this._camera.position.z < -550) this._camera.position.z = -550;

        });

        window.addEventListener('resize', () => {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
            this._engine.resize();
        });
    }

    private addButton(positionLeft: any, text: string, meshToAttach: any) {
        const btn = Button.CreateSimpleButton(text, text);
        btn.widthInPixels = 70
        btn.heightInPixels = 25
        btn.color = '#fff'
        btn.alpha = 0.5
        btn.fontWeight = '250'
        btn.fontSizeInPixels = 12
        btn.background = '#000'
        btn.cornerRadius = 4
        btn.thickness = 0
        btn.linkOffsetYInPixels = -100
        this._AdvancedDynamicTexture.addControl(btn)
        btn.linkWithMesh(meshToAttach)
        btn.onPointerUpObservable.add(() => {
            EventBus.getInstance().dispatch<Message>(Event.on3dModelLabelButtonClick, new Message(text));
        });
        const line = new Line();
        line.name = `line_aaa`
        line.lineWidth = 2;
        line.dash = [3, 3];
        line.color = '#444'
        line.connectedControl = btn
        this._AdvancedDynamicTexture.addControl(line)
        line.linkWithMesh(meshToAttach)
    }
}